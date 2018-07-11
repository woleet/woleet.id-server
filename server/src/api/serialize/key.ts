export function serialiseKey(key: InternalKeyObject): ApiKeyObject {
  const dates = {
    createdAt: +key.createdAt,
    updatedAt: +key.updatedAt,
    deletedAt: +key.deletedAt,
    lastUsed: +key.lastUsed
  };

  const ret = Object.assign({}, key, dates, { pubKey: 'todo' });

  delete ret.privateKey;

  return ret;
}
