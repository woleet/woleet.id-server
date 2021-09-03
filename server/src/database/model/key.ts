import { BOOLEAN, CHAR, DATE, ENUM, ForeignKeyConstraintError, STRING, UUID, UUIDV4 } from 'sequelize';
import { InvalidForeignUserError } from '../../errors';
import { AbstractInstanceAccess } from './abstract';
import { User } from '..';

const KeyModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  type: { type: ENUM('bip39'), defaultValue: 'bip39' },
  status: { type: ENUM('active', 'blocked', 'revoked'), defaultValue: 'active' },
  name: { type: STRING, allowNull: false },
  // encrypted
  mnemonicEntropy: { type: STRING, unique: true, allowNull: true },
  mnemonicEntropyIV: { type: CHAR((16) * 2), allowNull: true },
  // encrypted
  privateKey: { type: STRING, unique: true, allowNull: true },
  privateKeyIV: { type: CHAR((16) * 2), allowNull: true },
  publicKey: { type: STRING, unique: true, allowNull: false },
  compressed: { type: BOOLEAN },
  lastUsed: { type: DATE, defaultValue: null },
  expiration: { type: DATE },
  revokedAt: { type: DATE },
  userId: { type: UUID },
  holder: { type: ENUM('server', 'user'), defaultValue: 'server' },
  device: { type: ENUM('server', 'nano', 'mobile'), allowNull: true }
};

class KeyAccess extends AbstractInstanceAccess<InternalKeyObject, ApiFullPostKeyObject> {

  constructor() {
    super();
    this.define('key', KeyModel);
  }

  async getAllKeysOfUser(userId: string): Promise<SequelizeKeyObject[]> {
    return this.model.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
  }

  /**
   * @description Returns a key by its public key
   * @param publicKey: the requested public key
   * @param userId: optional parameter for extra check
   * @param loadUser true is the user model must be loaded
   */
  async getByPublicKey(publicKey: string, userId?: string, loadUser = false): Promise<SequelizeKeyObject> {
    const query = { where: { publicKey } };

    if (userId) {
      // tslint:disable-next-line:no-string-literal
      query.where['userId'] = userId;
    }

    if (loadUser) {
      // tslint:disable-next-line:no-string-literal
      query['include'] = [{ model: User.model }];
    }

    return this.model.findOne(query);
  }

  /**
   * @description Returns a key and the associated user by it's identifier
   */
  async getByIdAndPullUser(id: string): Promise<SequelizeKeyObject> {
    return this.model.findByPk(id, { include: [{ model: User.model }] });
  }

  handleError(err: any) {
    if (err instanceof ForeignKeyConstraintError) {
      throw new InvalidForeignUserError();
    }
  }
}

export const Key = new KeyAccess();
