/* Key */

type KeyTypeEnum = 'bip39';
type KeyStatusEnum = 'active' | 'blocked' | 'revoked';
type IdentityKeyStatusEnum = 'valid' | 'expired' | 'revoked';
type KeyHolderEnum = 'server' | 'user';
type KeyDeviceEnum = 'server' | 'mobile' | 'nano';

interface KeyObject { }

interface ApiKeyObject extends KeyObject, ApiCommonProperties {

  /** Key name */
  name: string;

  holder: KeyHolderEnum;
  device?: KeyDeviceEnum;

  /** Base58 encoded public key */
  pubKey: string;

  type: KeyTypeEnum;

  /** Unix timestamp (ms) */
  lastUsed: number;

  status: KeyStatusEnum;

  expiration: number;
  revokedAt?: number;
  expired: boolean;
}

interface ApiPostKeyObject extends KeyObject {
  name: string;
  device?: KeyDeviceEnum;
  type?: KeyTypeEnum;
  status?: KeyStatusEnum;
  expiration?: number;
  phrase?: string;
  publicKey?: string;
}

interface ApiPostExternalKeyObject extends KeyObject {
  name: string;
  device?: KeyDeviceEnum;
  type?: KeyTypeEnum;
  status?: KeyStatusEnum;
  expiration?: number;
  publicKey: string;
}

interface ApiPutKeyObject extends KeyObject {
  name?: string;
  device?: KeyDeviceEnum;
  status?: KeyStatusEnum;
  expiration?: number;
}

interface ApiIdentityKeyObject extends KeyObject {
  name: string;
  pubKey: string;
  expiration?: number;
  revokedAt?: number;
  status: IdentityKeyStatusEnum;
}
