/* Key */

type KeyTypeEnum = 'bip39';
type KeyStatusEnum = 'active' | 'blocked';

interface KeyObject { }

interface ApiKeyObject extends KeyObject, ApiCommonProperties, ApiParanoidProperties {

  /** Key name */
  name: string;

  /** Base58 encoded public key */
  pubKey: string;

  type: KeyTypeEnum;

  /** Unix timestamp (ms) */
  lastUsed: number;

  status: KeyStatusEnum;

  expiration: number;
  expired: boolean;
}

interface ApiPostKeyObject extends KeyObject {
  name: string;
  type?: KeyTypeEnum;
  status?: KeyStatusEnum;
  expiration?: number;
}

interface ApiPutKeyObject extends KeyObject {
  name?: string;
  status?: KeyStatusEnum;
}
