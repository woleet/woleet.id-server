import { InternalUserObject, ApiUserObject, InternalKeyObject } from "../../typings";

export function serialiseKey(key: InternalKeyObject): ApiUserObject {
  const dates = {
    createdAt: +user.createdAt,
    updatedAt: +user.updatedAt,
    lastUsed: +user.lastUsed
  };

  const ret = Object.assign({}, user, dates);

  delete ret.password_hash;
  delete ret.password_salt;
  delete ret.password_itrs;

  return ret;
}
