import { serializeUserIdentity } from './identity';
import { Op } from 'sequelize';
import { mapIdentityFromAPIToInternal } from '../../controllers/user';

export function serializeUser(user: InternalUserObject, withDates = true): ApiUserObject {
  let dates = null;
  if (withDates) {
    dates = {
      createdAt: +user.createdAt || null,
      updatedAt: +user.updatedAt || null,
      lastLogin: +user.lastLogin || null
    };
  }
  const identity = serializeUserIdentity(user);
  const { id, role, mode, status, countryCallingCode, phone, email, username, defaultKeyId } = user;
  return Object.assign({
    id,
    role,
    mode,
    username,
    status,
    countryCallingCode,
    phone,
    email,
    defaultKeyId,
    identity
  }, dates);
}

export function buildUserFilters(query): ApiFilterUsersObject {

  // If a search filter is specified, build it
  // (like match on email, username, x500CommonName, x500Organization or x500OrganizationalUnit)
  let searchFilter;
  if (query.search) {
    const like = { [Op.iLike]: '%' + query.search + '%' };
    searchFilter = {
      [Op.or]: [
        { email: like },
        { username: like },
        { x500CommonName: like },
        { x500Organization: like },
        { x500OrganizationalUnit: like },
      ]
    };
  }

  // Build filters related to identity fields
  // (exact match on x500CommonName, x500Organization, x500OrganizationalUnit, x500Locality, x500Country and x500UserId)
  const identityFilters = mapIdentityFromAPIToInternal(query);

  // Build filters related to other fields
  // (exact match on mode, role, email, username, status, countryCallingCode and phone)
  const { mode, role, email, username, status, countryCallingCode, phone } = query;
  const otherFilters = { mode, role, email, username, status, countryCallingCode, phone };

  // Concatenate exact match filters
  let filters: object = Object.assign(otherFilters, identityFilters);

  // Cleanup undefined properties
  Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

  // If a search filter is specified, combine the search filter and exact match filters
  if (searchFilter) {
    filters = { [Op.and]: [filters, searchFilter] };
  }

  return filters;
}
