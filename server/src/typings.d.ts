/* Server types */

import { Instance } from "sequelize";
import { SessionStore } from "./controllers/session";
import '../../typings/api.user';
import '../../typings/api.key';
import '../../typings/api';

declare global {

  interface Dictionary<T> {
    [Key: string]: T;
  }

  /* User: server specific */

  interface SequelizeUserObject extends Instance<InternalUserObject> { }

  interface InternalUserObject extends UserObject, InternalIdentityObject {
    /** Key name */
    id: string;
    lastLogin: Date;
    updatedAt: Date;
    createdAt: Date;
    deletedAt: Date;

    type: UserTypeEnum;
    status: UserStatusEnum;
    email: string | null;
    /** Hexadecimal represention password hash */
    passwordHash: string;
    /** Hexadecimal represention password salt */
    passwordSalt: string;
    passwordItrs: number;
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
    type?: UserTypeEnum;
    status?: UserStatusEnum;
    email?: string;
    passwordHash: string;
    passwordSalt: string;
    passwordItrs: number;
  }

  /* Key: server specific */

  interface SequelizeKeyObject extends Instance<InternalKeyObject> { }

  interface InternalKeyObject extends KeyObject {
    /** UUID */
    id: string;
    updatedAt: Date;
    createdAt: Date;
    deletedAt: Date;
    lastUsed: Date;

    name: string;
    type: KeyTypeEnum;
    status: KeyStatusEnum;

    /** Hexadecimal represention of the private key */
    privateKey: string;
    userId: any;
  }

  interface ApiFullPostKeyObject extends KeyObject {
    name: string;
    type?: KeyTypeEnum;
    status?: KeyStatusEnum;
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
