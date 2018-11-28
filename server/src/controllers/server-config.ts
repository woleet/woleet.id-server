import { ServerConfig } from '../database';
import { serverConfig } from '../config';
import * as Debug from 'debug';
const debug = Debug('id:ctrl:config');
import * as log from 'loglevel';
import { updateOIDCClient } from './openid';
import { updateOIDCProvider, stopActiveServer } from './oidc-provider';
import { exit } from '../exit';
import { bootOIDCPServer } from '../boot.servers';

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
    console.log('UPDATE', { inMemoryConfig, up });
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

async function checkOIDCConfigChange(up: ServerConfigUpdate) {
  if (up.useOpenIDConnect !== undefined
    || up.openIDConnectURL
    || up.openIDConnectClientId
    || up.openIDConnectClientSecret
    || up.openIDConnectClientRedirectURL
  ) {
    debug('Update OIDCClient with', { up });
    try {
      await updateOIDCClient();
    } catch (err) {
      log.error('Failed to initalize OPenID Connect, it will be automatically disabled !', err);
      return setServerConfig({ useOpenIDConnect: false });
    }
  }
}

function OIDCPSafeReboot() {
  return bootOIDCPServer()
    .catch((err) => {
      log.error('Failed to reboot OPenID Connect, it will be automatically disabled !');
      setServerConfig({ enableOIDCP: false });
      exit('FATAL: This error should have been handled.', err);
    });
}

async function checkOIDCPConfigChange(up: ServerConfigUpdate) {
  if (up.OIDCPIssuerURL || up.OIDCPClients) {
    debug('Update OIDC Provider with', { up });
    try {
      await updateOIDCProvider();
      await OIDCPSafeReboot();
    } catch (err) {
      log.error('Failed to initalize OPenID Connect, it will be automatically disabled !', err);
      return setServerConfig({ useOpenIDConnect: false });
    }
  }

  if (up.enableOIDCP !== undefined) {
    debug('Update enableOIDCP with', up.enableOIDCP);
    if (up.enableOIDCP === false) {
      try {
        await stopActiveServer();
      } catch (err) {
        exit('FATAL: Failed to stop the OIDCP server.', err);
      }
    } else {
      await OIDCPSafeReboot();
    }
  }
}
