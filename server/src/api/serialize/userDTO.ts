import { serializeIdentity } from './identity';

export function serializeUserDTO(user: InternalUserObject): ApiUserDTOObject {
  return {
    email: user.email,
    username: user.username,
    role: user.role,
    identity: serializeIdentity(user, true)
  };
}
