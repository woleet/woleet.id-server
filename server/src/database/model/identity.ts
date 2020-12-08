import { ForeignKeyConstraintError, STRING, UUID, UUIDV4 } from 'sequelize';
import { InvalidForeignUserError } from '../../errors';
import { AbstractInstanceAccess } from './abstract';

const SignedIdentityModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  signedIdentity: { type: STRING, allowNull: false },
  publicKey: { type: STRING, allowNull: false }
};

class SignedIdentityAccess extends AbstractInstanceAccess<InternalSignedIdentityObject, ApiPostSignedIdentityObject> {

  constructor() {
    super();
    this.define('identity', SignedIdentityModel, { paranoid: false });
  }

  async getById(id: string): Promise<SequelizeSignedIdentityObject> {
    return this.model.findOne({ where: { id } });
  }

  handleError(err: any) {
    if (err instanceof ForeignKeyConstraintError) {
      throw new InvalidForeignUserError();
    }
  }
}

export const Enrollment = new SignedIdentityAccess();
