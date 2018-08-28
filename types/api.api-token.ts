/* API Token */

type APITokenStatusEnum = 'active' | 'blocked';

interface APITokenObject { }

interface ApiAPITokenObject extends APITokenObject {
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

  status: APITokenStatusEnum;
}

interface ApiPostAPITokenObject extends APITokenObject {
  name: string;
  status?: APITokenStatusEnum;
}

interface ApiPutAPITokenObject extends APITokenObject {
  name?: string;
  status?: APITokenStatusEnum;
}
