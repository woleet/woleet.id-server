
import { STRING, ENUM, UUID, UUIDV4, DATE } from 'sequelize';

import { AbstractInstanceAccess } from './abstract';
import { sequelize } from '../sequelize';

const APITokenModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  status: { type: ENUM(['active', 'blocked']), defaultValue: 'active' },
  name: { type: STRING, allowNull: false },
  value: { type: STRING, unique: true, allowNull: false },
  lastUsed: { type: DATE, defaultValue: null }
};

class APITokenAccess extends AbstractInstanceAccess<InternalAPITokenObject, ApiFullPostAPITokenObject> {

  constructor() {
    super(sequelize);
    this.define('apiToken', APITokenModel, { paranoid: true });
  }

  handleError(err: any) { }

}

export const APIToken = new APITokenAccess();
