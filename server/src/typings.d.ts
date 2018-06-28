import { RequestHandler, Request, Response, NextFunction } from "express";
import { Instance } from "sequelize";
import { SessionStore } from "./ctr/session";

export interface Dictionary<T> {
  [Key: string]: T;
}

export interface AsyncRequestHandler extends RequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

type UserTypeEnum = 'user' | 'admin';
type UserStatusEnum = 'active' | 'blocked' | 'removed';

export interface UserObject {
  username: string,
  firstName: string,
  lastName: string
}

export interface InternalUserObject extends UserObject {
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

export interface SequelizeUserObject extends Instance<InternalUserObject> { }

export interface ApiUserObject extends UserObject {
  /** UUID */
  id: string,
  /** Unix timestamp (ms) */
  createdAt: number,
  /** Unix timestamp (ms) */
  updatedAt: number,
  /** Unix timestamp (ms) */
  lastLogin: number,

  type: UserTypeEnum,
  status: UserStatusEnum,
  email: string | null,
}

export interface ApiUserDTOObject extends UserObject {
  email: string | null,
  type: UserTypeEnum
}

export interface ApiFullUserObject extends UserObject {
  type: UserTypeEnum,
  status: UserStatusEnum,
  email: string,
  password: string
}

export interface FullApiPostUserObject extends UserObject {
  type?: UserTypeEnum,
  status?: UserStatusEnum,
  email?: string,
  passwordHash: string,
  passwordSalt: string,
  passwordItrs: number,
}

export interface ApiPostUserObject extends UserObject {
  type?: UserTypeEnum,
  status?: UserStatusEnum,
  email?: string,
  password: string
}

export interface ApiPutUserObject extends UserObject {
  type?: UserTypeEnum,
  status?: UserStatusEnum,
  email?: string,
  password?: string
}


type KeyTypeEnum = 'bip39';
type KeyStatusEnum = 'active' | 'expired' | 'removed';

export interface KeyObject { }

export interface InternalKeyObject extends KeyObject {
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

export interface SequelizeKeyObject extends Instance<InternalKeyObject> { }

export interface ApiKeyObject extends KeyObject {
  /** UUID */
  id: string,
  /** Key name */
  name: string,
  /** Hexadecimal represention of the public key */
  pubKey: string,
  type: KeyTypeEnum,
  /** Unix timestamp (ms) */
  createdAt: number,
  /** Unix timestamp (ms) */
  updatedAt: number,
  /** Unix timestamp (ms) */
  lastUsed: number,
  status: KeyStatusEnum
}

export interface ApiPostKeyObject extends KeyObject {
  name: string
  type?: KeyTypeEnum,
  status?: KeyStatusEnum
}

export interface FullApiPostKeyObject extends KeyObject {
  name: string
  type?: KeyTypeEnum,
  status?: KeyStatusEnum,
  /** Hexadecimal represention of the private key */
  privateKey: string,
  userId: string
}

export interface ApiPutKeyObject extends KeyObject {
  name?: string,
  status?: KeyStatusEnum
}

export interface Session {
  id: string,
  user: SequelizeUserObject
}

declare module 'koa' {
  interface Context {
    sessions: SessionStore;
    session: Session | null;
  }
}
