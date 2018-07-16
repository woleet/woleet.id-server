/* Server types */

import { Instance } from "sequelize";
import { SessionStore } from "../controllers/store.session";
import '../../../types/api.api-key';
import '../../../types/api.user';
import '../../../types/api.key';
import '../../../types/api';

declare global {

  interface Dictionary<T> {
    [Key: string]: T;
  }

  interface CommonInternalProperties {
    /** UUID */
    id: string;
    updatedAt: Date;
    createdAt: Date;
    deletedAt: Date;
  }

  /* User: server specific */

  interface SequelizeUserObject extends Instance<InternalUserObject> { }

  interface InternalUserObject extends UserObject, InternalIdentityObject, CommonInternalProperties {
    lastLogin: Date;

    role: UserRoleEnum;
    status: UserStatusEnum;
    email: string | null;
    /** Hexadecimal represention password hash */
    passwordHash: string;
    /** Hexadecimal represention password salt */
    passwordSalt: string;
    passwordItrs: number;

    defaultKeyId: string;
  }

  interface InternalIdentityObject {
    x500CommonName: string;
    x500Organization: string;
    x500OrganizationalUnit: string;
    x500Locality: string;
    x500Country: string;
    x500UserId: string | null;
  }

  interface ApiFullPostUserObject extends UserObject, InternalIdentityObject {
    role?: UserRoleEnum;
    status?: UserStatusEnum;
    email?: string;
    passwordHash: string;
    passwordSalt: string;
    passwordItrs: number;

    defaultKeyId?: string;
  }

  /* Key: server specific */

  interface SequelizeKeyObject extends Instance<InternalKeyObject> { }

  interface InternalKeyObject extends KeyObject, CommonInternalProperties {
    lastUsed: Date;

    name: string;
    type: KeyTypeEnum;
    status: KeyStatusEnum;

    /** Hexadecimal represention of the private key */
    privateKey: string;
    /** Base 58 represention of the public key */
    publicKey: string;

    userId: string;
  }

  interface ApiFullPostKeyObject extends KeyObject {
    name: string;
    type?: KeyTypeEnum;
    status?: KeyStatusEnum;
    /** Hexadecimal represention of the private key */
    privateKey: string;
    /** Base 58 represention of the public key */
    publicKey: string;
    /** Reference to the owner of the key */
    userId: string;
  }

  /* APIKey: server specific */

  interface SequelizeAPIKeyObject extends Instance<InternalAPIKeyObject> { }

  interface InternalAPIKeyObject extends APIKeyObject, CommonInternalProperties {
    lastUsed: Date;

    name: string;
    status: APIKeyStatusEnum;
    value: string;
  }

  interface ApiFullPostAPIKeyObject extends APIKeyObject {
    name: string;
    type?: KeyTypeEnum;
    status?: KeyStatusEnum;
    value: string;
  }

  /* Authorization */

  interface Session {
    id: string;
    user: SequelizeUserObject;
  }

}

declare module 'koa' {
  interface Context {
    sessions: SessionStore;
    session: Session | null;
  }
}
