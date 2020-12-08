export function serializeSignedIdentity(identity: InternalSignedIdentityObject): ApiSignedIdentityObject {

  const { id, signedIdentity, publicKey } = identity;

  return Object.assign({ id, signedIdentity, publicKey });
}
