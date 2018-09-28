/* Server types */

import { Instance } from 'sequelize';
import { SessionStore } from '../controllers/store.session';
import '../../../types/api.api-token';
import '../../../types/api.server-config';
import '../../../types/api.server-event';
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


  interface ListOptions {
    offset?: number;
    limit?: number;
    full: boolean;
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

    /** Hexadecimal represention of the mnemonic phrase */
    mnemonicEntropy: string;
    /** Hexadecimal represention of the private key */
    privateKey: string;
    /** Base 58 represention of the public key */
    publicKey: string;

    userId: string;
    user?: InternalUserObject;
  }

  interface ApiFullPostKeyObject extends KeyObject {
    name: string;
    type?: KeyTypeEnum;
    status?: KeyStatusEnum;

    /** Hexadecimal represention of the mnemonic phrase */
    mnemonicEntropy: string;
    /** Hexadecimal represention of the private key */
    privateKey: string;
    /** Base 58 represention of the public key */
    publicKey: string;
    /** Reference to the owner of the key */
    userId: string;
  }

  /* APIToken: server specific */

  interface SequelizeAPITokenObject extends Instance<InternalAPITokenObject> { }

  interface InternalAPITokenObject extends APITokenObject, CommonInternalProperties {
    lastUsed: Date;

    name: string;
    status: APITokenStatusEnum;
    value: string;
  }

  interface ApiFullPostAPITokenObject extends APITokenObject {
    name: string;
    type?: KeyTypeEnum;
    status?: KeyStatusEnum;
    value: string;
  }

  /* Authorization */

  interface Session {
    id: string;
    exp: number;
    user: SequelizeUserObject;
  }

  /* Events */

  interface InternalServerEventObject extends ServerEvent, CommonInternalProperties {
    data: Object;
    occurredAt: Date;
    authorizedUserId: string;
    authorizedTokenId: string;
    associatedTokenId: string;
    associatedUserId: string;
    associatedKeyId: string;
    authorizedUser?: InternalUserObject;
    authorizedToken?: InternalUserObject;
    associatedToken?: InternalAPITokenObject;
    associatedUser?: InternalUserObject;
    associatedkey?: InternalKeyObject;
  }

  interface ServerEventCreate {
    data?: Object;
    type: ServerEventTypeEnum;
    authorizedUserId?: string;
    authorizedTokenId?: string;
    associatedTokenId?: string;
    associatedUserId?: string;
    associatedKeyId?: string;
    occurredAt?: Date;
  }

  /* Config */

  interface InternalServerConfigObject extends ServerConfig {
    identityURL: string;
    defaultKeyId: string;
    defaultKey?: InternalKeyObject;
    fallbackOnDefaultKey: boolean;
  }

  interface ServerConfigUpdate extends ServerConfig {
    identityURL?: string;
    defaultKeyId?: string;
    fallbackOnDefaultKey?: boolean;
  }

  interface ServerConfigCreate extends ServerConfig {
    identityURL: string;
    defaultKeyId: string;
    fallbackOnDefaultKey?: boolean;
  }

}

declare module 'koa' {
  interface Context {
    sessions: SessionStore;
    session: Session | null;
    apiToken?: InternalAPITokenObject;
  }
}
