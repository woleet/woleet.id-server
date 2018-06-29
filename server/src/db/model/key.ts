
import { STRING, ENUM, UUID, UUIDV4, DATE } from 'sequelize';
import { Deferrable, Sequelize } from 'sequelize';

import { ForeignKeyConstraintError } from 'sequelize';
import { InvalidUserTargetedKeyError } from '../../errors';

import { AbstractInstanceAccess } from './abstract';

function keyModelFactory(userModelInstance) {
  return ({
    id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
    type: { type: ENUM(['bip39']), defaultValue: 'bip39' },
    status: { type: ENUM(['active', 'expired', 'removed']), defaultValue: 'active' },
    name: { type: STRING, allowNull: false },
    privateKey: { type: STRING, unique: true, allowNull: false },
    lastUsed: { type: DATE, defaultValue: null },
    userId: {
      type: UUID,

      references: {
        // This is a reference to another model
        model: userModelInstance,
        // This is the column name of the referenced model
        key: 'id',
        // This declares when to check the foreign key constraint. PostgreSQL only.
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    }
  })
}

class KeyAccess extends AbstractInstanceAccess<InternalKeyObject, ApiFullPostKeyObject> {

  constructor(client: Sequelize, userModelInstance) {
    super(client)
    this.init('key', keyModelFactory(userModelInstance))
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

export { KeyAccess }
