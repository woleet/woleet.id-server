import { InternalUserObject, ApiUserObject } from "../../typings";

export function serialiseUser(user: InternalUserObject): ApiUserObject {
  const dates = {
    createdAt: +user.createdAt,
    updatedAt: +user.updatedAt,
    lastLogin: +user.lastLogin
  };

  const ret = Object.assign({}, user, dates);

  delete ret.passwordHash;
  delete ret.passwordSalt;
  delete ret.passwordItrs;

  return ret;
}
