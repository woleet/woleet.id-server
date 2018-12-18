import {ServerConfig} from '../database';
import {serverConfig} from '../config';
import * as Debug from 'debug';
import * as log from 'loglevel';
import {exit} from '../exit';

const debug = Debug('id:ctrl:config');

const { CONFIG_ID } = serverConfig;

let inMemoryConfig: InternalServerConfigObject = null;

export async function loadServerConfig(): Promise<InternalServerConfigObject> {
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    log.warn('No configuration found in database');
    return;
  }
  inMemoryConfig = cfg.toJSON().config;
  return getServerConfig();
}

export function getServerConfig(): InternalServerConfigObject {
  return inMemoryConfig;
}

export async function setServerConfig(up: ServerConfigUpdate): Promise<InternalServerConfigObject> {
  try {
    const config = Object.assign({}, inMemoryConfig, up);
    let cfg = await ServerConfig.update(CONFIG_ID, { config });
    if (!cfg) {
      debug('No config to update, will set', config);
      cfg = await ServerConfig.create({ config });
    }
    debug('Updated', inMemoryConfig, 'to', cfg.toJSON(), 'with', up);
    inMemoryConfig = cfg.toJSON().config;
    await checkOIDCConfigChange(up);
    await checkOIDCPConfigChange(up);
    return getServerConfig();
  } catch (err) {
    exit('FATAL: Failed update the server configuration.', err);
  }
}

// We have to set these functions with from a setter (and not a "import") to avoid circular dependencies
const fns: {
  updateOIDCClient: () => Promise<any>,
  stopOIDCProvider: () => Promise<any>,
  bootOIDCProvider: () => Promise<any>,
  updateOIDCProvider: () => Promise<any>
} = {
  updateOIDCClient: null,
  bootOIDCProvider: null,
  stopOIDCProvider: null,
  updateOIDCProvider: null
};

export const registerOIDCUpdateFunction = registrationFunctionFactory('updateOIDCClient');
export const registerOIDCPStopFunction = registrationFunctionFactory('stopOIDCProvider');
export const registerOIDCPBootFunction = registrationFunctionFactory('bootOIDCProvider');
export const registerOIDCPUpdateFunction = registrationFunctionFactory('updateOIDCProvider');

function registrationFunctionFactory(name) {
  return function (fn: () => Promise<any>) {
    if (fns[name]) {
      throw new Error(`The "${name}" function is alleady registered`);
    }
    fns[name] = fn;
  };
}

async function checkOIDCConfigChange(up: ServerConfigUpdate) {
  if (up.useOpenIDConnect !== undefined
    || up.openIDConnectURL
    || up.openIDConnectClientId
    || up.openIDConnectClientSecret
    || up.openIDConnectClientRedirectURL
  ) {
    debug('Update OIDCClient with', { up });
    try {
      await fns.updateOIDCClient();
    } catch (err) {
      log.error('Failed to initialize OpenID Connect, it will be automatically disabled!', err);
      return setServerConfig({ useOpenIDConnect: false });
    }
  }
}

function OIDCPSafeReboot() {
  debug('Reboot OIDCP');
  return fns.bootOIDCProvider()
    .catch((err) => {
      log.error('Failed to reboot OpenID Connect, it will be automatically disabled!');
      setServerConfig({ enableOIDCP: false });
      exit('FATAL: This error should have been handled.', err);
    });
}

async function checkOIDCPConfigChange(up: ServerConfigUpdate) {
  if (up.enableOIDCP === false) {
    try {
      debug('Stop OIDCP');
      await fns.stopOIDCProvider();
    } catch (err) {
      exit('FATAL: Failed to stop the OIDCP server.', err);
    }
  }

  if (up.OIDCPIssuerURL || up.OIDCPClients || up.enableOIDCP) {
    debug('Update OIDC Provider with', { up });
    try {
      await fns.updateOIDCProvider();
      await OIDCPSafeReboot();
    } catch (err) {
      log.error('Failed to initialize OpenID Connect, it will be automatically disabled!', err);
      return setServerConfig({ useOpenIDConnect: false });
    }
  }
}
