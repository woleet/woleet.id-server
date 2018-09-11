import { ServerConfig } from '../database';
import { serverConfig as config } from '../config';

const { CONFIG_ID } = config;

let inMemoryConfig = null;

export async function loadServerConfig(): Promise<InternalServerConfigObject> {
  const cfg = await ServerConfig.getById(CONFIG_ID);
  inMemoryConfig = cfg.toJSON();
  return getServerConfig();
}

export function getServerConfig(): InternalServerConfigObject {
  return inMemoryConfig;
}

export async function setServerConfig(up): Promise<InternalServerConfigObject> {
  let cfg = await ServerConfig.update(CONFIG_ID, up);
  if (!cfg) {
    cfg = await ServerConfig.create(up);
  }
  inMemoryConfig = cfg.toJSON();
  return getServerConfig();
}
