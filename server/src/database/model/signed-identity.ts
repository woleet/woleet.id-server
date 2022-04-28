import { ForeignKeyConstraintError, STRING, UUID, UUIDV4 } from 'sequelize';
import { InvalidForeignUserError } from '../../errors';
import { AbstractInstanceAccess } from './abstract';
import { InternalSignedIdentityObject, SequelizeSignedIdentityObject } from '../../types';

const SignedIdentityModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  signedIdentity: { type: STRING, allowNull: false },
  publicKey: { type: STRING, allowNull: false }
};

class SignedIdentityAccess extends AbstractInstanceAccess<InternalSignedIdentityObject, ApiPostSignedIdentityObject> {

  constructor() {
    super();
    this.define('signedIdentity', SignedIdentityModel);
  }

  async getById(id: string): Promise<SequelizeSignedIdentityObject> {
    return this.model.findOne({ where: { id } });
  }

  /**
   * @description Returns all signed identities matching a given signed identity
   * @param signedIdentity: the requested signed identity
   */
  async getBySignedIdentity(signedIdentity: string): Promise<SequelizeSignedIdentityObject[]> {
    return this.model.findAll({ where: { signedIdentity } });
  }

  /**
   * @description Returns all signed identities matching a given public key
   * @param publicKey: the requested public key
   */
  async getByPubKey(publicKey: string): Promise<SequelizeSignedIdentityObject[]> {
    return this.model.findAll({ where: { publicKey } });
  }

  /**
   * @description Returns the signed identity matching a given public key and signed identity
   * @param publicKey: the requested public key
   * @param signedIdentity: the requested signed identity
   */
  async getByPublicKeyAndSignedIdentity(publicKey: string, signedIdentity: string)
    : Promise<SequelizeSignedIdentityObject> {
    return this.model.findOne({ where: { publicKey, signedIdentity } });
  }

  handleError(err: any) {
    if (err instanceof ForeignKeyConstraintError) {
      throw new InvalidForeignUserError();
    }
  }
}

export const SignedIdentity = new SignedIdentityAccess();
