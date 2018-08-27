export function serializeIdentity(user: InternalUserObject, hideUserId = false) {
  return {
    commonName: user.x500CommonName,
    organization: user.x500Organization,
    organizationalUnit: user.x500OrganizationalUnit,
    locality: user.x500Locality,
    country: user.x500Country,
    userId: hideUserId ? undefined : user.x500UserId
  };
}
