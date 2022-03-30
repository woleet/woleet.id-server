interface SignedIdentityObject {
}

interface ApiSignedIdentityObject extends SignedIdentityObject, ApiCommonProperties {
  signedIdentity: string;
  publicKey: string;
}

interface ApiPostSignedIdentityObject extends SignedIdentityObject {
  signedIdentity: string;
  publicKey: string;
  lastUsedOn?: Date;
}
