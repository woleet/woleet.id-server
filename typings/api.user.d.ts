/* User */

type UserTypeEnum = 'user' | 'admin';
type UserStatusEnum = 'active' | 'blocked';

interface UserObject {
  username?: string // madatory for step 2
}

interface APIIdentityObject {
  commonName: string;
  organization: string;
  organizationalUnit: string;
  locality: string;
  country: string;
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

  type: UserTypeEnum;
  status: UserStatusEnum;
  email: string | null;
}

interface ApiUserDTOObject extends UserObject {
  email: string | null;
  type: UserTypeEnum;
  identity: APIIdentityObject;
}

interface ApiPostUserObject extends UserObject {
  type?: UserTypeEnum;
  status?: UserStatusEnum;
  email?: string;
  password: string;
  identity: APIIdentityObject;
}

interface ApiPutUserObject extends UserObject {
  type?: UserTypeEnum;
  status?: UserStatusEnum;
  email?: string;
  password?: string;
  identity?: APIIdentityObject;
}
