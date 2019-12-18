import { ServerConfig } from '../database';
import { serverConfig } from '../config';
import * as Debug from 'debug';
import * as log from 'loglevel';
import { exit } from '../exit';
import { createReadStream, createWriteStream } from 'fs';
import * as path from 'path';
import * as https from 'https';
import { getAgent } from './utils/agent';

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
    log.warn('No configuration found in database');
    return;
  }
  setInMemoryConfig(cfg.toJSON().config);
  return getInMemoryConfig();
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
  log.info('Updating TCU file');
}

// Create a stream to overwrite the current TCU pdf with the default TCU pdf
export async function defaultTCU() {
  const reader = createReadStream(defaultTCUPath);
  const stream = createWriteStream(TCUPath);
  reader.pipe(stream);
  log.info('Reset TCU file to default value');
}

export async function setServerConfig(up: ServerConfigUpdate): Promise<InternalServerConfigObject> {
  try {
    const config = Object.assign({}, getInMemoryConfig(), up);
    if (!config.enableSMTP) {
      delete config.blockPasswordInput;
    }
    let cfg = await ServerConfig.update(CONFIG_ID, { config });
    if (!cfg) {
      debug('Create config with', up);
      cfg = await ServerConfig.create({ config });
    } else {
      debug('Updated with', up);
    }
    setInMemoryConfig(cfg.toJSON().config);
    await checkOIDCConfigChange(up);
    await checkOIDCPConfigChange(up);
    await checkSMTPConfigChange(up);
    await checkProofDeskConfigChange(up);
    return getServerConfig();
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
      log.error('Cannot initialize OpenID Connect, it will be automatically disabled!', err);
      return setServerConfig({ enableOpenIDConnect: false });
    }
  }
}

function OIDCPSafeReboot() {
  debug('Reboot OIDCP');
  return fns.bootOIDCProvider()
    .catch((err) => {
      log.error('Cannot reboot OpenID Connect, it will be automatically disabled!');
      setServerConfig({ enableOIDCP: false });
      exit('FATAL: This error should have been handled', err);
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
  if (up.OIDCPIssuerURL || up.OIDCPClients || up.enableOIDCP) {
    debug('Update OIDC Provider with', { up });
    try {
      await fns.updateOIDCProvider();
      await OIDCPSafeReboot();
    } catch (err) {
      log.error('Cannot initialize OpenID Connect, it will be automatically disabled!', err);
      return setServerConfig({ enableOpenIDConnect: false });
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
      log.error('Cannot initialize SMTP, it will be automatically disabled!', err);
      return setServerConfig({ enableSMTP: false });
    }
  }
}

// Check the ProofDesk configuration validity
async function checkProofDeskConfigChange(up: ServerConfigUpdate) {

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
              resolve();
            } else {
              log.error(json.error);
              await setServerConfig({ enableProofDesk: false });
              resolve();
            }
          } catch (err) {
            log.error('Response is not a JSON (bad URL?)');
            await setServerConfig({ enableProofDesk: false });
            resolve();
          }
        });
      }).on('error', async (err) => {
        log.error(err.message);
        await setServerConfig({ enableProofDesk: false });
        resolve();
      });
    });
  }
}
