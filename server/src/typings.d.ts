/* Server types */

import { Instance } from "sequelize";
import { SessionStore } from "./ctr/session";
import { StringIterator } from "lodash";

declare global {

  interface Dictionary<T> {
    [Key: string]: T;
  }

  /* User */

  type UserTypeEnum = 'user' | 'admin';
  type UserStatusEnum = 'active' | 'blocked' | 'removed';

  interface AuthResponseObject {
    token: string;
    admin: boolean;
  }

  interface UserObject {
    username: string;
    firstName: string;
    lastName: string;
  }

  interface ApiUserObject extends UserObject {
    /** UUID */
    id: string;
    /** Unix timestamp (ms) */
    createdAt: number;
    /** Unix timestamp (ms) */
    updatedAt: number;
    /** Unix timestamp (ms) */
    lastLogin: number;

    type: UserTypeEnum;
    status: UserStatusEnum;
    email: string | null;
  }

  interface ApiUserDTOObject extends UserObject {
    email: string | null;
    type: UserTypeEnum;
  }

  interface ApiPostUserObject extends UserObject {
    type?: UserTypeEnum;
    status?: UserStatusEnum;
    email?: string;
    password: string;
  }

  interface ApiPutUserObject extends UserObject {
    type?: UserTypeEnum;
    status?: UserStatusEnum;
    email?: string;
    password?: string;
  }

  /* User: server specific */

  interface SequelizeUserObject extends Instance<InternalUserObject> { }

  interface InternalUserObject extends UserObject {
    /** Key name */
    id: string,
    lastLogin: Date,
    updatedAt: Date,
    createdAt: Date,

    type: UserTypeEnum,
    status: UserStatusEnum,
    email: string | null,
    /** Hexadecimal represention password hash */
    passwordHash: string,
    /** Hexadecimal represention password salt */
    passwordSalt: string,
    passwordItrs: number
  }

  interface ApiFullPostUserObject extends UserObject {
    type?: UserTypeEnum,
    status?: UserStatusEnum,
    email?: string,
    passwordHash: string,
    passwordSalt: string,
    passwordItrs: number,
  }

  /* Key */

  type KeyTypeEnum = 'bip39';
  type KeyStatusEnum = 'active' | 'expired' | 'removed';

  interface KeyObject { }

  interface ApiKeyObject extends KeyObject {
    /** UUID */
    id: string;
    /** Key name */
    name: string;
    /** Hexadecimal represention of the public key */
    pubKey: string;
    type: KeyTypeEnum;
    /** Unix timestamp (ms) */
    createdAt: number;
    /** Unix timestamp (ms) */
    updatedAt: number;
    /** Unix timestamp (ms) */
    lastUsed: number;
    status: KeyStatusEnum;
  }

  interface ApiPostKeyObject extends KeyObject {
    name: string;
    type?: KeyTypeEnum;
    status?: KeyStatusEnum;
  }

  interface ApiPutKeyObject extends KeyObject {
    name?: string,
    status?: KeyStatusEnum
  }

  /* Key: server specific */

  interface SequelizeKeyObject extends Instance<InternalKeyObject> { }

  interface InternalKeyObject extends KeyObject {
    /** UUID */
    id: string,
    updatedAt: Date,
    createdAt: Date,
    lastUsed: Date,

    name: string,
    type: KeyTypeEnum,
    status: KeyStatusEnum,

    /** Hexadecimal represention of the private key */
    privateKey: string,
    userId: any
  }

  interface ApiFullPostKeyObject extends KeyObject {
    name: string
    type?: KeyTypeEnum,
    status?: KeyStatusEnum,
    /** Hexadecimal represention of the private key */
    privateKey: string;
    userId: string;
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
