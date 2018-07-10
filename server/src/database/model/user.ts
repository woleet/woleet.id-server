import { STRING, ENUM, UUID, UUIDV4, DATE, DOUBLE, CHAR } from 'sequelize';

import { UniqueConstraintError } from 'sequelize';
import { DuplicatedUserError } from '../../errors';
import { AbstractInstanceAccess } from './abstract';
import { sequelize } from '../sequelize';

const UserModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  type: { type: ENUM(['user', 'admin']), defaultValue: 'user' },
  status: { type: ENUM(['active', 'blocked', 'removed']), defaultValue: 'active' },
  email: { type: STRING, unique: true },
  username: { type: STRING, unique: true, allowNull: false },
  firstName: { type: STRING, allowNull: false },
  lastName: { type: STRING, allowNull: false },
  passwordHash: { type: CHAR(1024), allowNull: false },
  passwordSalt: { type: CHAR(256), allowNull: false },
  passwordItrs: { type: DOUBLE, allowNull: false },
  lastLogin: { type: DATE, defaultValue: null }
};

class UserAccess extends AbstractInstanceAccess<InternalUserObject, ApiFullPostUserObject> {

  constructor() {
    super(sequelize);
    this.init('user', UserModel);
  }

  async getByUsername(username: string): Promise<SequelizeUserObject> {
    return this.model.findOne({ where: { username } });
  }

  async getByEmail(email: string): Promise<SequelizeUserObject> {
    return this.model.findOne({ where: { email } });
  }

  handleError(err: any) {
    if (err instanceof UniqueConstraintError) {
      const field = Object.keys(err['fields']);
      throw new DuplicatedUserError(`Duplicated field ${field}`, err);
    }
  }

}

export const User = new UserAccess();
