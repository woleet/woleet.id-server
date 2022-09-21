import { ServerConfig } from '../database';
import { serverConfig } from '../config';
import * as Debug from 'debug';
import { logger } from '../config';
import { exit } from '../exit';
import { createReadStream, createWriteStream } from 'fs';
import * as path from 'path';
import * as https from 'https';
import { getAgent } from './utils/agent';
import { cacheLock } from '../cacheLock';
import { InternalServerConfigObject, ServerConfigError, ServerConfigUpdate } from '../types';

const debug = Debug('id:ctrl:config');

const { CONFIG_ID } = serverConfig;

let inMemoryConfig: InternalServerConfigObject = null;
const TCUPath = path.join(__dirname, '../../assets/custom_TCU.pdf');
const defaultTCUPath = path.join(__dirname, '../../assets/default_TCU.pdf');

function getInMemoryConfig(): InternalServerConfigObject {
  return inMemoryConfig;
}

function setInMemoryConfig(newConfig: InternalServerConfigObject): void {
  inMemoryConfig = newConfig;
}

export async function loadServerConfig(): Promise<InternalServerConfigObject> {
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    logger.warn('No configuration found in database');
    return;
  }
  setInMemoryConfig(cfg.get().config);
  return getInMemoryConfig();
}

export async function reloadServerConfig() {
  const config = await loadServerConfig();
  await checkOIDCConfigChange(config);
  await checkOIDCPConfigChange(config);
  await checkSMTPConfigChange(config);
  await checkProofDeskConfigChange(config);
}

export function getServerConfig(): InternalServerConfigObject {
  const config = getInMemoryConfig();
  return config;
}

// Create a stream to overwrite the current TCU pdf with the new TCU pdf
export async function updateTCU(file) {
  const reader = createReadStream(file.path);
  const stream = createWriteStream(TCUPath);
  reader.pipe(stream);
  logger.info('Updating TCU file');
}

// Create a stream to overwrite the current TCU pdf with the default TCU pdf
export async function defaultTCU() {
  const reader = createReadStream(defaultTCUPath);
  const stream = createWriteStream(TCUPath);
  reader.pipe(stream);
  logger.info('Reset TCU file to default value');
}

export async function setServerConfig(up: ServerConfigUpdate): Promise<InternalServerConfigObject & ServerConfigError> {
  try {
    const config = Object.assign({}, getInMemoryConfig(), up);
    if (!config.enableSMTP) {
      delete config.blockPasswordInput;
    }
    const cfgModel = await ServerConfig.update(CONFIG_ID, { config });
    let cfg = cfgModel ? cfgModel.get() : null;
    if (!cfg) {
      debug('Create config with', up);
      cfg = await (await ServerConfig.create({ config })).get();
    } else {
      debug('Updated with', up);
    }
    const error: ServerConfigError = {};
    setInMemoryConfig(cfg.config);
    error.oidcError = await checkOIDCConfigChange(up);
    error.oidcpError = await checkOIDCPConfigChange(up);
    error.smtpError = await checkSMTPConfigChange(up);
    error.proofDeskError = await checkProofDeskConfigChange(up);
    cacheLock.publishReloadServerConfig();
    return Object.assign({}, getServerConfig(), error);
  } catch (err) {
    exit('FATAL: Cannot update the server configuration', err);
  }
}

// We have to set these functions with from a setter (and not a "import") to avoid circular dependencies
const fns: {
  updateOIDCClient: () => Promise<any>,
  stopOIDCProvider: () => Promise<any>,
  bootOIDCProvider: () => Promise<any>,
  updateOIDCProvider: () => Promise<any>,
  updateSMTP: () => Promise<any>
} = {
  updateOIDCClient: null,
  bootOIDCProvider: null,
  stopOIDCProvider: null,
  updateOIDCProvider: null,
  updateSMTP: null
};

export const registerOIDCUpdateFunction = registrationFunctionFactory('updateOIDCClient');
export const registerOIDCPStopFunction = registrationFunctionFactory('stopOIDCProvider');
export const registerOIDCPBootFunction = registrationFunctionFactory('bootOIDCProvider');
export const registerOIDCPUpdateFunction = registrationFunctionFactory('updateOIDCProvider');
export const registerSMTPUpdateFunction = registrationFunctionFactory('updateSMTP');

function registrationFunctionFactory(name) {
  return function (fn: () => Promise<any>) {
    if (fns[name]) {
      throw new Error(`The "${name}" function is alleady registered`);
    }
    fns[name] = fn;
  };
}

async function checkOIDCConfigChange(up: ServerConfigUpdate) {
  if (up.enableOpenIDConnect !== undefined
    || up.openIDConnectURL
    || up.openIDConnectClientId
    || up.openIDConnectClientSecret
    || up.openIDConnectClientRedirectURL
  ) {
    debug('Update OIDCClient with', { up });
    try {
      await fns.updateOIDCClient();
    } catch (err) {
      logger.error('Cannot initialize OpenID Connect, it will be automatically disabled.', err);
      await setServerConfig({ enableOpenIDConnect: false });
      return 'Cannot initialize OpenID Connect, check your configuration.';
    }
  }
}

function OIDCPSafeReboot() {
  debug('Reboot OIDCP');
  return fns.bootOIDCProvider()
    .catch((err) => {
      logger.error('Cannot reboot OpenID Connect, it will be automatically disabled.');
      setServerConfig({ enableOIDCP: false });
      exit('FATAL: Cannot boot the OIDCP server', err);
    });
}

async function checkOIDCPConfigChange(up: ServerConfigUpdate) {
  if (up.enableOIDCP === false) {
    try {
      debug('Stop OIDCP');
      await fns.stopOIDCProvider();
    } catch (err) {
      exit('FATAL: Cannot stop the OIDCP server', err);
    }
  }
  if (up.OIDCPProviderURL || up.OIDCPClients || up.enableOIDCP) {
    debug('Update OIDC Provider with', { up });
    try {
      await fns.updateOIDCProvider();
      await OIDCPSafeReboot();
    } catch (err) {
      logger.error('Cannot initialize OpenID Connect, it will be automatically disabled.', err);
      await setServerConfig({ enableOpenIDConnect: false });
      return err ? err.message : 'Cannot initialize OpenID Connect, check your configuration.';
    }
  }
}

async function checkSMTPConfigChange(up: ServerConfigUpdate) {
  if (up.enableSMTP !== undefined
    || up.SMTPConfig
  ) {
    debug('Update SMTP with', { up });
    try {
      await fns.updateSMTP();
    } catch (err) {
      logger.error('Cannot initialize SMTP, it will be automatically disabled.', err);
      await setServerConfig({ enableSMTP: false });
      // syntaxt error have a message, configuration error doesn't
      if (err) {
        return err.message ? err.message : err;
      }
      // empty object have an undefined error
      return 'Cannot initialize SMTP, check your configuration.';
    }
  }
}

// Check the ProofDesk configuration validity
async function checkProofDeskConfigChange(up: ServerConfigUpdate): Promise<string> {

  // Check the configuration changed
  if ((up.proofDeskAPIURL || up.proofDeskAPIToken) && up.enableProofDesk) {
    debug('Update ProofDesk Config with', { up });
    const url = new URL(up.proofDeskAPIURL || getServerConfig().proofDeskAPIURL);
    const httpsOptions: any = {
      host: url.host,
      path: url.pathname + '/user/credits',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + up.proofDeskAPIToken || 'Bearer ' + getServerConfig().proofDeskAPIToken
      }
    };
    const agent = getAgent(url, '/user/credits');
    if (agent) {
      httpsOptions.agent = agent;
    }
    return new Promise((resolve) => {
      https.get(httpsOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', async () => {
          try {
            const json = JSON.parse(data);
            if (!json.error) {
              resolve(null);
            } else {
              logger.error(json.error);
              await setServerConfig({ enableProofDesk: false });
              resolve('Connection with ProofDesk blocked: ' + json.error);
            }
          } catch (err) {
            logger.error('Response is not a JSON (bad URL?)');
            await setServerConfig({ enableProofDesk: false });
            resolve('Response is not a JSON (bad URL?)');
          }
        });
      }).on('error', async (err) => {
        logger.error(err.message);
        await setServerConfig({ enableProofDesk: false });
        resolve(err.message);
      });
    });
  }
}
