import { serializeIdentity } from "./identity";

export function serialiseUserDTO(user: InternalUserObject): ApiUserDTOObject {
  return {
    email: user.email,
    username: user.username,
    type: user.type,
    identity: serializeIdentity(user)
  };
}
