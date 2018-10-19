import { ServerConfig } from '../database';
import { serverConfig as config } from '../config';
import * as Debug from 'debug';
const debug = Debug('id:ctrl:config');
import * as log from 'loglevel';
import { updateOIDCClient } from './openid';

const { CONFIG_ID } = config;

let inMemoryConfig = null;

export async function loadServerConfig(): Promise<InternalServerConfigObject> {
  const cfg = await ServerConfig.getById(CONFIG_ID);
  if (!cfg) {
    log.warn('No configuration found in database');
    return;
  }
  inMemoryConfig = cfg.toJSON();
  return getServerConfig();
}

export function getServerConfig(): InternalServerConfigObject {
  return inMemoryConfig;
}

export async function setServerConfig(up): Promise<InternalServerConfigObject> {
  let cfg = await ServerConfig.update(CONFIG_ID, up);
  if (!cfg) {
    debug('No config to update, will set', up);
    cfg = await ServerConfig.create(up);
  }
  debug('Updated', inMemoryConfig, 'to', cfg.toJSON(), 'with', up);
  inMemoryConfig = cfg.toJSON();
  if (up.useOpenIDConnect || up.openIDConnectClientId || up.openIDConnectClientSecret || up.openIDConnectURL) {
    debug('Update OIDCClient with', { up });
    try {
      await updateOIDCClient();
    } catch (err) {
      log.error('Failed to initalize OPenID Connect, it will be automatically disabled !', err);
      return setServerConfig({ useOpenIDConnect: false });
    }
  }
  return getServerConfig();
}
