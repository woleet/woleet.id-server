import { JSON, STRING } from 'sequelize';

import { AbstractInstanceAccess } from './abstract';
import { serverConfig } from '../../config';
import { InternalServerConfigObject, ServerConfigCreate } from '../../types';

const ServerConfigModel = {
  id: { type: STRING, defaultValue: serverConfig.CONFIG_ID, primaryKey: true },
  config: { type: JSON }
};

class ServerConfigAccess
  extends AbstractInstanceAccess<{ config: InternalServerConfigObject },
    { config: ServerConfigCreate, createdAt?: Date, updatedAt?: Date }> {

  constructor() {
    super();
    this.define('serverConfig', ServerConfigModel);
  }

  handleError(err: any) {
  }
}

export const ServerConfig = new ServerConfigAccess();
