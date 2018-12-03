import { serializeIdentity } from './identity';

export function serialiseUser(user: InternalUserObject, withDates = true): ApiUserObject {
  let dates = null;
  if (withDates) {
    dates = {
      createdAt: +user.createdAt || null,
      updatedAt: +user.updatedAt || null,
      lastLogin: +user.lastLogin || null
    };
  }

  const identity = serializeIdentity(user);

  const { id, role, status, email, username, defaultKeyId } = user;

  return Object.assign({ id, role, username, status, email, defaultKeyId, identity }, dates);
}
