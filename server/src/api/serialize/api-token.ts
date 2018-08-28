export function serialiseapiToken(key: InternalAPITokenObject): ApiAPITokenObject {
  const dates = {
    createdAt: +key.createdAt,
    updatedAt: +key.updatedAt,
    deletedAt: +key.deletedAt,
    lastUsed: +key.lastUsed
  };

  const { id, name, status, value } = key;

  return Object.assign({ id, name, status, value }, dates);
}
