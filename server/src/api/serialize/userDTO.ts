import { serializeIdentity } from './identity';

export function serialiseUserDTO(user: InternalUserObject): ApiUserDTOObject {
  return {
    email: user.email,
    username: user.username,
    role: user.role,
    identity: serializeIdentity(user, true)
  };
}
