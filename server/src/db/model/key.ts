
import { STRING, ENUM, UUID, UUIDV4, DATE, DOUBLE, CHAR } from 'sequelize';

import { InternalKeyObject, ApiPostKeyObjectWithValue } from '../../typings';
import { AbstractInstanceAccess } from './abstract';

const keyModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  type: { type: ENUM(['bip39']), defaultValue: 'bip39' },
  status: { type: ENUM(['active', 'expired', 'removed']), defaultValue: 'active' },
  name: { type: STRING, allowNull: false },
  private_key: { type: STRING, unique: true, allowNull: false },
  lastUsed: { type: DATE, defaultValue: null }
};

class KeyAccess extends AbstractInstanceAccess<InternalKeyObject, ApiPostKeyObjectWithValue> {

  constructor(client) {
    super(client)
    this.init('user', keyModel);
  }

}

export { keyModel, KeyAccess }
