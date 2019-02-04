/* User */

type UserRoleEnum = 'user' | 'admin';
type UserStatusEnum = 'active' | 'blocked';

interface UserObject {
  username?: string // madatory for step 2
}

interface ApiIdentityObject {
  commonName: string;
  organization?: string;
  organizationalUnit?: string;
  locality?: string;
  country?: string;
  userId?: string;
}

interface ApiUserObject extends UserObject, ApiCommonProperties {

  /** Unix timestamp (ms) */
  lastLogin: number;

  role: UserRoleEnum;
  status: UserStatusEnum;
  email: string | null; // step 1: will be mandatory
  tokenResetPassword?: string | null;
  defaultKeyId: string | null;
  identity: ApiIdentityObject;
}

interface ApiUserDTOObject extends UserObject {
  email: string | null;
  role: UserRoleEnum;
  identity: ApiIdentityObject;
}

interface ApiPostUserObject extends UserObject {
  role?: UserRoleEnum;
  status?: UserStatusEnum;
  email?: string;
  password?: string;
  identity: ApiIdentityObject;
}

interface ApiPutUserObject extends UserObject {
  role?: UserRoleEnum;
  status?: UserStatusEnum;
  email?: string;
  password?: string;
  identity?: ApiIdentityObject;
  defaultKeyId?: string;
}

interface ApiResetPasswordObject {
  email: string;
  token: string;
  password: string;
}
