
import { STRING, ENUM, UUID, UUIDV4, DATE } from 'sequelize';

import { InternalUserObject, ApiPostUserObject } from '../../typings';
import { AbstractInstanceAccess } from '../abstract';

const userModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  type: { type: ENUM(['user', 'admin']), defaultValue: 'user' },
  status: { type: ENUM(['active', 'blocked', 'removed']), defaultValue: 'active' },
  email: { type: STRING, unique: true },
  username: { type: STRING, unique: true, allowNull: false },
  firstName: { type: STRING, allowNull: false },
  lastName: { type: STRING, allowNull: false },
  password: { type: STRING, allowNull: false },
  lastLogin: { type: DATE, defaultValue: null }
};

class UserAccess extends AbstractInstanceAccess<InternalUserObject, ApiPostUserObject> {

  constructor(client) {
    super(client)
    this.init('user', userModel);
  }

}

export { userModel, UserAccess }
