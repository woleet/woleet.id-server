import { CHAR, DATE, DOUBLE, ENUM, Op, STRING, UniqueConstraintError, UUID, UUIDV4 } from 'sequelize';
import { DuplicatedUserError } from '../../errors';
import { AbstractInstanceAccess } from './abstract';

const UserModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  role: { type: ENUM(['user', 'admin']), defaultValue: 'user' },
  status: { type: ENUM(['active', 'blocked']), defaultValue: 'active' },
  mode: { type: ENUM(['seal', 'e-signature']), defaultValue: 'seal'},
  email: { type: STRING, unique: true },
  tokenResetPassword: { type: STRING, unique: true, allowNull: true },
  username: { type: STRING, unique: true, allowNull: true /* allowNull: false */ }, // step 1
  countryCallingCode: { type: STRING, unique: false, allowNull: true },
  phone: { type: STRING, unique: false, allowNull: true },
  x500CommonName: { type: STRING, allowNull: false },
  x500Organization: { type: STRING, /* allowNull: false */ }, // step 1
  x500OrganizationalUnit: { type: STRING, /* allowNull: false */ }, // step 1
  x500Locality: { type: STRING, /* allowNull: false */ }, // step 1
  x500Country: { type: STRING, /* allowNull: false */ }, // step 1
  x500UserId: { type: STRING, unique: true, allowNull: true },
  passwordHash: { type: CHAR(1024), /* allowNull: false */ }, // step 1
  passwordSalt: { type: CHAR(256), /* allowNull: false */ }, // step 1
  passwordItrs: { type: DOUBLE, /* allowNull: false */ }, // step 1
  lastLogin: { type: DATE, defaultValue: null }
};

class UserAccess extends AbstractInstanceAccess<InternalUserObject, ApiFullPostUserObject> {

  constructor() {
    super();
    this.define('user', UserModel, { paranoid: false });
  }

  async getByUsername(username: string): Promise<SequelizeUserObject> {
    return this.model.findOne({ where: { username } });
  }

  async getByCustomUserId(customId: string): Promise<SequelizeUserObject> {
    return this.model.findOne({ where: { x500UserId: customId } });
  }

  async getByEmail(email: string): Promise<SequelizeUserObject> {
    return this.model.findOne({ where: { email } });
  }

  async find(search: string, opt: ListOptions = {}): Promise<SequelizeUserObject[]> {
    const query = { [Op.iLike]: '%' + search + '%' };
    return this.model.findAll({
      where: {
        [Op.or]: [
          { email: query },
          { username: query },
          { x500CommonName: query },
          { x500Organization: query },
          { x500OrganizationalUnit: query },
        ]
      },
      offset: opt.offset,
      limit: opt.limit,
      order: [['createdAt', 'DESC']],
      paranoid: !opt.full
    });
  }

  handleError(err: any) {
    if (err instanceof UniqueConstraintError) {
      const field = Object.keys(err['fields']);
      throw new DuplicatedUserError(`Duplicated field ${field}`, err);
    }
  }
}

export const User = new UserAccess();
