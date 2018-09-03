/* User */

type UserRoleEnum = 'user' | 'admin';
type UserStatusEnum = 'active' | 'blocked';

interface UserObject {
  username?: string // madatory for step 2
}

interface APIIdentityObject {
  commonName: string;
  organization?: string;
  organizationalUnit?: string;
  locality?: string;
  country?: string;
  userId?: string;
}

interface ApiUserObject extends UserObject {
  /** UUID */
  id: string;
  /** Unix timestamp (ms) */
  createdAt: number;
  /** Unix timestamp (ms) */
  updatedAt: number;
  /** Unix timestamp (ms) */
  deletedAt: number;
  /** Unix timestamp (ms) */
  lastLogin: number;

  role: UserRoleEnum;
  status: UserStatusEnum;
  email: string | null; // step 1: will be mandatory
  defaultKeyId: string | null;
  identity: APIIdentityObject;
}

interface ApiUserDTOObject extends UserObject {
  email: string | null;
  role: UserRoleEnum;
  identity: APIIdentityObject;
}

interface ApiPostUserObject extends UserObject {
  role?: UserRoleEnum;
  status?: UserStatusEnum;
  email?: string;
  password: string;
  identity: APIIdentityObject;
}

interface ApiPutUserObject extends UserObject {
  role?: UserRoleEnum;
  status?: UserStatusEnum;
  email?: string;
  password?: string;
  identity?: APIIdentityObject;
  defaultKeyId?: string;
}
