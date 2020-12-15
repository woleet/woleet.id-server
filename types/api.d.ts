interface AuthResponseObject {
  user: ApiUserDTOObject;
}

interface ApiCommonProperties {

  /** UUID */
  id: string;

  /** Unix timestamp (ms) */
  createdAt: number;

  /** Unix timestamp (ms) */
  updatedAt: number;
}
