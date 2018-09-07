
import { STRING, ENUM, UUID, UUIDV4, DATE, BOOLEAN, CHAR } from 'sequelize';

import { ForeignKeyConstraintError } from 'sequelize';
import { InvalidUserTargetedKeyError } from '../../errors';

import { AbstractInstanceAccess } from './abstract';
import { User } from '..';

const KeyModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  customKeyId: { type: STRING, defaultValue: null, unique: true },
  type: { type: ENUM(['bip39']), defaultValue: 'bip39' },
  status: { type: ENUM(['active', 'blocked']), defaultValue: 'active' },
  name: { type: STRING, allowNull: false },
  mnemonicEntropy: { type: STRING, unique: true, allowNull: false },
  privateKey: { type: CHAR(64), unique: true, allowNull: false },
  publicKey: { type: STRING, unique: true, allowNull: false },
  lastUsed: { type: DATE, defaultValue: null }
};

class KeyAccess extends AbstractInstanceAccess<InternalKeyObject, ApiFullPostKeyObject> {

  constructor() {
    super();
    this.define('key', KeyModel, { paranoid: true });
  }

  async getAllKeysOfUser(userId: string, full = false): Promise<SequelizeKeyObject[]> {
    return this.model.findAll({ where: { userId }, order: [['createdAt', 'DESC']], paranoid: !full });
  }

  /**
   * @description Returns a keu by it's public key (bitcoin address)
   * @param publicKey: the requested public key
   * @param userId: optional parameter for extra check
   */
  async getByPubKey(publicKey: string, userId?: string, loadUser = false): Promise<SequelizeKeyObject> {
    const query = { where: { publicKey } };

    if (userId) {
      query.where['userId'] = userId;
    }

    if (loadUser) {
      query['include'] = [{ model: User.model }];
    }

    return this.model.findOne(query);
  }

  handleError(err: any) {
    if (err instanceof ForeignKeyConstraintError) {
      throw new InvalidUserTargetedKeyError(`Invalid user id provided`, err);
    }
  }

}

export const Key = new KeyAccess();
