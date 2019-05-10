/* API Token */

type APITokenStatusEnum = 'active' | 'blocked';

interface APITokenObject { }

interface ApiAPITokenObject extends APITokenObject, ApiCommonProperties {

  /** Key name */
  name: string;
  /** Token to use to call the sign endpoint */
  value: string;

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
