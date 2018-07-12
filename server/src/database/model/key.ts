
import { STRING, ENUM, UUID, UUIDV4, DATE, BOOLEAN, CHAR } from 'sequelize';
import { Deferrable, Sequelize } from 'sequelize';

import { ForeignKeyConstraintError } from 'sequelize';
import { InvalidUserTargetedKeyError } from '../../errors';

import { AbstractInstanceAccess } from './abstract';
import { sequelize } from '../sequelize';
import { User } from './user';

const KeyModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  customKeyId: { type: STRING, defaultValue: null, unique: true },
  type: { type: ENUM(['bip39']), defaultValue: 'bip39' },
  status: { type: ENUM(['active', 'blocked']), defaultValue: 'active' },
  default: { type: BOOLEAN, defaultValue: false },
  name: { type: STRING, allowNull: false },
  privateKey: { type: CHAR(64), unique: true, allowNull: false },
  publicKey: { type: STRING, unique: true, allowNull: false },
  lastUsed: { type: DATE, defaultValue: null },
  // userId: {
  //   type: UUID,

  //   references: {
  //     // This is a reference to another model
  //     model: User.model,
  //     // This is the column name of the referenced model
  //     key: 'id',
  //     // This declares when to check the foreign key constraint. PostgreSQL only.
  //     deferrable: Deferrable.INITIALLY_IMMEDIATE
  //   }
  // }
}

class KeyAccess extends AbstractInstanceAccess<InternalKeyObject, ApiFullPostKeyObject> {

  constructor() {
    super(sequelize)
    this.define('key', KeyModel, { paranoid: true })
  }

  async getAllKeysOfUser(userId: string): Promise<SequelizeKeyObject[]> {
    return this.model.findAll({ where: { userId } });
  }

  handleError(err: any) {
    if (err instanceof ForeignKeyConstraintError) {
      throw new InvalidUserTargetedKeyError(`Invalid user id provided`, err);
    }
  }

}

export const Key = new KeyAccess();
