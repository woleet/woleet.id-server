import { serializeUserIdentity } from './identity';
import { InternalUserObject } from '../../types';

export function serializeUserDTO(user: InternalUserObject): ApiUserDTOObject {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    mode: user.mode,
    countryCallingCode: user.countryCallingCode,
    phone: user.phone,
    identity: serializeUserIdentity(user, true)
  };
}
