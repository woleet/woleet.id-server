import { Key, User } from '../database';
import { NotFoundKeyError, NotFoundUserError } from '../errors';
import { secureModule } from '../config';

/**
 * Key
 * Request handlers for key.
 * @alias module:handlers.Key
 * @swagger
 *  tags: [authentication]
 */

/**
 * @swagger
 *  operationId: createKey
 */
export async function createKey(userId: string, key: ApiPostKeyObject): Promise<InternalKeyObject> {
  const _newKey = key.phrase ? await secureModule.importPhrase(key.phrase) : await secureModule.createKey();
  const holder: KeyHolderEnum = 'server';
  const device: KeyDeviceEnum = 'server';
  const newKey = await Key.create(Object.assign({}, key, {
    mnemonicEntropy: _newKey.entropy.toString('hex'),
    mnemonicEntropyIV: _newKey.entropyIV.toString('hex'),
    privateKey: _newKey.privateKey.toString('hex'),
    privateKeyIV: _newKey.privateKeyIV.toString('hex'),
    compressed: _newKey.compressed,
    publicKey: _newKey.publicKey,
    holder,
    device,
    userId
  }));

  return newKey.toJSON();
}

/**
 * @swagger
 *  operationId: createExternalKey
 */
export async function createExternalKey(userId: string, key: ApiPostKeyObject): Promise<InternalKeyObject> {
  const holder: KeyHolderEnum = 'user';
  const newKey = await Key.create(Object.assign({}, key, {
    publicKey: key.publicKey,
    holder,
    userId
  }));
  return newKey.toJSON();
}

/**
 * @swagger
 *  operationId: updateKey
 */
export async function updateKey(id: string, attrs: ApiPutKeyObject) {
  const key = await Key.update(id, attrs);
  if (!key) {
    throw new NotFoundKeyError();
  }

  return key.toJSON();
}

export async function getKeyById(id: string): Promise<InternalKeyObject> {
  const key = await Key.getById(id);
  if (!key) {
    throw new NotFoundKeyError();
  }

  return key.toJSON();
}

export async function getOwner(id): Promise<InternalUserObject> {
  const key = await Key.getByIdAndPullUser(id);
  if (!key) {
    throw new NotFoundKeyError();
  }

  return key.get('user').toJSON();
}

export async function getOwnerByPubKey(pubKey): Promise<InternalUserObject> {
  const key = await Key.getByPubKey(pubKey, null, true);
  if (!key) {
    throw new NotFoundKeyError();
  }

  return key.get('user').toJSON();
}

export async function exportKey(id: string): Promise<string> {
  const key = await Key.getById(id);
  if (!key) {
    throw new NotFoundKeyError();
  }

  const entropy = Buffer.from(key.get('mnemonicEntropy'), 'hex');
  const entropyIV = Buffer.from(key.get('mnemonicEntropyIV'), 'hex');

  return secureModule.exportPhrase(entropy, entropyIV);
}

export async function getAllKeysOfUser(userId: string, full = false): Promise<InternalKeyObject[]> {
  const user = await User.getById(userId);
  if (!user) {
    throw new NotFoundUserError();
  }

  const keys = await Key.getAllKeysOfUser(userId, full);
  return keys.map((key) => key.toJSON());
}

export async function deleteKey(id: string): Promise<InternalKeyObject> {

  const key = await Key.delete(id);
  if (!key) {
    throw new NotFoundKeyError();
  }

  return key.toJSON();
}

export async function isKeyHeldByServer(id: string): Promise<Boolean> {

  const key = await Key.getById(id);
  if (!key) {
    throw new NotFoundKeyError();
  }

  return key.toJSON().holder === 'server';
}
