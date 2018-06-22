
import { STRING, ENUM, UUID, UUIDV4, DATE, DOUBLE, CHAR } from 'sequelize';

import { SequelizeUserObject, InternalUserObject, ApiPostUserObject } from '../../typings';
import { AbstractInstanceAccess } from '../abstract';

const userModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  type: { type: ENUM(['user', 'admin']), defaultValue: 'user' },
  status: { type: ENUM(['active', 'blocked', 'removed']), defaultValue: 'active' },
  email: { type: STRING, unique: true },
  username: { type: STRING, unique: true, allowNull: false },
  firstName: { type: STRING, allowNull: false },
  lastName: { type: STRING, allowNull: false },
  password_hash: { type: CHAR(1024), allowNull: false },
  password_salt: { type: CHAR(256), allowNull: false },
  password_itrs: { type: DOUBLE, allowNull: false },
  lastLogin: { type: DATE, defaultValue: null }
};

class UserAccess extends AbstractInstanceAccess<InternalUserObject, ApiPostUserObject> {

  constructor(client) {
    super(client)
    this.init('user', userModel);
  }

  async getByUsername(username: string): Promise<SequelizeUserObject> {
    return this.model.findOne({ where: { username } });
  }

  async getByEmail(email: string): Promise<SequelizeUserObject> {
    return this.model.findOne({ where: { email } });
  }

}

export { userModel, UserAccess }
