/* Authorization */

interface AuthResponseObject {
  user: ApiUserDTOObject;
}

/* Shared */

interface ApiCommonProperties {

  /** UUID */
  id: string;
  /** Unix timestamp (ms) */
  createdAt: number;
  /** Unix timestamp (ms) */
  updatedAt: number;

}
