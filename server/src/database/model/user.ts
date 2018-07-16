import { STRING, ENUM, UUID, UUIDV4, DATE, DOUBLE, CHAR } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import { DuplicatedUserError } from '../../errors';
import { AbstractInstanceAccess } from './abstract';
import { sequelize } from '../sequelize';

const UserModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  role: { type: ENUM(['user', 'admin']), defaultValue: 'user' },
  status: { type: ENUM(['active', 'blocked']), defaultValue: 'active' },
  email: { type: STRING, unique: true },
  username: { type: STRING, unique: true, allowNull: true /* allowNull: false */ }, // step 1
  x500CommonName: { type: STRING, allowNull: false },
  x500Organization: { type: STRING, /* allowNull: false */ }, // step 1
  x500OrganizationalUnit: { type: STRING, /* allowNull: false */ }, // step 1
  x500Locality: { type: STRING, /* allowNull: false */ }, // step 1
  x500Country: { type: STRING, /* allowNull: false */ }, // step 1
  x500UserId: { type: STRING },
  passwordHash: { type: CHAR(1024), /* allowNull: false */ }, // step 1
  passwordSalt: { type: CHAR(256), /* allowNull: false */ }, // step 1
  passwordItrs: { type: DOUBLE, /* allowNull: false */ }, // step 1
  lastLogin: { type: DATE, defaultValue: null }
};

class UserAccess extends AbstractInstanceAccess<InternalUserObject, ApiFullPostUserObject> {

  constructor() {
    super(sequelize);
    this.define('user', UserModel, { paranoid: true });
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
