import { STRING, BOOLEAN } from 'sequelize';

import { AbstractInstanceAccess } from './abstract';
import { serverConfig } from '../../config';

const ServerConfigModel = {
  id: { type: STRING, defaultValue: serverConfig.CONFIG_ID, primaryKey: true },
  fallbackOnDefaultKey: { type: BOOLEAN, defaultValue: serverConfig.default.fallbackOnDefaultKey }
};

class ServerConfigAccess extends AbstractInstanceAccess<InternalServerConfigObject, ServerConfigCreate> {

  constructor() {
    super();
    this.define('ServerConfig', ServerConfigModel, { paranoid: false });
  }

  handleError(err: any) { }

}

export const ServerConfig = new ServerConfigAccess();
