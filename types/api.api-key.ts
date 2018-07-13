/* Key */

type APIKeyStatusEnum = 'active' | 'blocked';

interface APIKeyObject { }

interface ApiAPIKeyObject extends APIKeyObject {
  /** UUID */
  id: string;
  /** Key name */
  name: string;
  /** Token to use to call the sign endpoint */
  value: string;
  /** Unix timestamp (ms) */
  createdAt: number;
  /** Unix timestamp (ms) */
  updatedAt: number;
  /** Unix timestamp (ms) */
  deletedAt: number;
  /** Unix timestamp (ms) */
  lastUsed: number;

  status: APIKeyStatusEnum;
}

interface ApiPostAPIKeyObject extends APIKeyObject {
  name: string;
  status?: APIKeyStatusEnum;
}

interface ApiPutAPIKeyObject extends APIKeyObject {
  name?: string;
  status?: APIKeyStatusEnum;
}
