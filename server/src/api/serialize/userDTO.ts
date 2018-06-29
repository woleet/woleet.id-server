import { InternalUserObject, ApiUserDTOObject } from "../../typings";

export function serialiseUserDTO(user: InternalUserObject): ApiUserDTOObject {
  return {
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    type: user.type,
  };
}
