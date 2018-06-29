export function serialiseKey(key: InternalKeyObject): ApiKeyObject {
  const dates = {
    createdAt: +key.createdAt,
    updatedAt: +key.updatedAt,
    lastUsed: +key.lastUsed
  };

  const ret = Object.assign({}, key, dates, { pubKey: 'todo' });

  delete ret.privateKey;

  return ret;
}
