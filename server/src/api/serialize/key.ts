export function serialiseKey(key: InternalKeyObject): ApiKeyObject {
  const dates = {
    createdAt: +key.createdAt || null,
    updatedAt: +key.updatedAt || null,
    deletedAt: +key.deletedAt || null,
    lastUsed: +key.lastUsed || null
  };

  const { id, name, status, type, publicKey } = key;

  return Object.assign({ id, name, status, type, pubKey: publicKey }, dates);
}
