
import { STRING, ENUM, UUID, UUIDV4, DATE } from 'sequelize';

import { AbstractInstanceAccess } from './abstract';

const APITokenModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  status: { type: ENUM(['active', 'blocked']), defaultValue: 'active' },
  name: { type: STRING, allowNull: false },
  value: { type: STRING, unique: true, allowNull: false },
  lastUsed: { type: DATE, defaultValue: null }
};

class APITokenAccess extends AbstractInstanceAccess<InternalAPITokenObject, ApiFullPostAPITokenObject> {

  constructor() {
    super();
    this.define('apiToken', APITokenModel, { paranoid: true });
  }

  handleError(err: any) { }

  getByValue(value: string) {
    return this.model.findOne({ where: { value } });
  }

}

export const APIToken = new APITokenAccess();
