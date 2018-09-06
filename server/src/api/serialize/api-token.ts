export function serialiseapiToken(key: InternalAPITokenObject): ApiAPITokenObject {
  const dates = {
    createdAt: +key.createdAt || null,
    updatedAt: +key.updatedAt || null,
    deletedAt: +key.deletedAt || null,
    lastUsed: +key.lastUsed || null
  };

  const { id, name, status, value } = key;

  return Object.assign({ id, name, status, value }, dates);
}
