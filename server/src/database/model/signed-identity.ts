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

  /**
   * @description Returns all signed identity/public key pair by its hashed signed identity
   * @param signedIdentity: the requested hashed signed identity
   */
  async getBySignedIdentity(signedIdentity: string): Promise<SequelizeSignedIdentityObject[]> {
    return this.model.findAll({ where: { signedIdentity } });
  }

  /**
   * @description Returns all signed identity/public key pair by its public key (bitcoin address)
   * @param publicKey: the requested public key
   */
  async getByPubKey(publicKey: string): Promise<SequelizeSignedIdentityObject[]> {
    return this.model.findAll({ where: { publicKey } });
  }

  /**
   * @description Returns a signed identity/public key pair
   * @param publicKey: the requested public key
   * @param signedIdentity: the requested hashed signed identity
   */
  async getByCombinaison(publicKey: string, signedIdentity: string): Promise<SequelizeSignedIdentityObject> {
    return this.model.findOne({ where: { publicKey, signedIdentity } });
  }

  handleError(err: any) {
    if (err instanceof ForeignKeyConstraintError) {
      throw new InvalidForeignUserError();
    }
  }
}

export const SignedIdentity = new SignedIdentityAccess();
