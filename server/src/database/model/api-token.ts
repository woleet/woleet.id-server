import { CHAR, DATE, ENUM, STRING, UUID, UUIDV4 } from 'sequelize';

import { AbstractInstanceAccess } from './abstract';

const APITokenModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  status: { type: ENUM('active', 'blocked'), defaultValue: 'active' },
  userId: { type: UUID },
  name: { type: STRING, allowNull: false },
  hash: { type: CHAR(32 * 2), unique: true, allowNull: false },
  value: { type: STRING, allowNull: false },
  valueIV: { type: CHAR(16 * 2), allowNull: false },
  lastUsed: { type: DATE, defaultValue: null }
};

class APITokenAccess extends AbstractInstanceAccess<InternalAPITokenObject, ApiFullPostAPITokenObject> {

  constructor() {
    super();
    this.define('apiToken', APITokenModel, { paranoid: false });
  }

  handleError(err: any) {
  }

  getByHash(hash: string) {
    return this.model.findOne({ where: { hash } });
  }

  getByUserId(userId: string) {
    return this.model.findAll({ where: { userId } });
  }
}

export const APIToken = new APITokenAccess();
