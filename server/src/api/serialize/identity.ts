export function serializeIdentity(user: InternalUserObject) {
  return {
    commonName: user.x500CommonName,
    organization: user.x500Organization,
    organizationalUnit: user.x500OrganizationalUnit,
    locality: user.x500Locality,
    country: user.x500Country,
    userId: user.x500UserId
  }
}
