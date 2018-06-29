/* Key */

type KeyTypeEnum = 'bip39';
type KeyStatusEnum = 'active' | 'expired' | 'removed';

interface KeyObject { }

interface ApiKeyObject extends KeyObject {
  /** UUID */
  id: string;
  /** Key name */
  name: string;
  /** Hexadecimal represention of the public key */
  pubKey: string;
  type: KeyTypeEnum;
  /** Unix timestamp (ms) */
  createdAt: number;
  /** Unix timestamp (ms) */
  updatedAt: number;
  /** Unix timestamp (ms) */
  lastUsed: number;
  status: KeyStatusEnum;
}

interface ApiPostKeyObject extends KeyObject {
  name: string;
  type?: KeyTypeEnum;
  status?: KeyStatusEnum;
}

interface ApiPutKeyObject extends KeyObject {
  name?: string,
  status?: KeyStatusEnum
}
