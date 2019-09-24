import { serializeIdentity } from './identity';
import { serializeIdentity as filterIdentity } from '../../controllers/user';

export function serializeUser(user: InternalUserObject, withDates = true): ApiUserObject {
  let dates = null;
  if (withDates) {
    dates = {
      createdAt: +user.createdAt || null,
      updatedAt: +user.updatedAt || null,
      lastLogin: +user.lastLogin || null
    };
  }

  const identity = serializeIdentity(user);

  const { id, role, mode, status, countryCallingCode, phone, email, username, defaultKeyId } = user;

  return Object.assign({ id, role, mode, username, status, countryCallingCode, phone, email, defaultKeyId, identity }, dates);
}

export function serializeFilter(query): ApiFilterUsersObject {

  const identity = filterIdentity(query);
  const { mode, role, email, status, countryCallingCode, phone } = query;
  const filter = Object.assign({ mode, role, email, status, countryCallingCode, phone}, identity );
  Object.keys(filter).forEach(key => filter[key] === undefined && delete filter[key]);

  return filter;
}
