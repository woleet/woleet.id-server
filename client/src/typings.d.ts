/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

type UserTypeEnum = 'user' | 'admin';
type UserStatusEnum = 'active' | 'blocked' | 'removed';

interface UserObject {
  username: string,
  firstName: string,
  lastName: string
}

interface ApiUserDTOObject extends UserObject {
  email: string | null,
  type: UserTypeEnum
}

interface ApiPostUserObject extends UserObject {
  type?: UserTypeEnum,
  status?: UserStatusEnum,
  email?: string,
  password: string
}

interface ApiPutUserObject extends UserObject {
  type?: UserTypeEnum,
  status?: UserStatusEnum,
  email?: string,
  password?: string
}

interface ApiUserObject extends UserObject {
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

interface BasicAuthObject {
  username: string;
  password: string;
}

interface TokenObject {
  token: string;
}
