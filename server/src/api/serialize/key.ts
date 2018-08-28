export function serialiseKey(key: InternalKeyObject): ApiTokenObject {
  const dates = {
    createdAt: +key.createdAt,
    updatedAt: +key.updatedAt,
    deletedAt: +key.deletedAt,
    lastUsed: +key.lastUsed
  };

  const { id, name, status, type, publicKey } = key;

  return Object.assign({ id, name, status, type, publicKey }, dates);
}
