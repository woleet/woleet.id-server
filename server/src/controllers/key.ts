import { Key, User } from '../database';
import { NotFoundKeyError, NotFoundUserError, RevokedKeyError } from '../errors';
import { secureModule } from '../config';
import { sendKeyRevocationEmail } from './send-email';

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
  const secureKey = key.phrase ? await secureModule.importPhrase(key.phrase) : await secureModule.createKey();
  const holder: KeyHolderEnum = 'server';
  const device: KeyDeviceEnum = 'server';
  const newKey = await Key.create(Object.assign({}, key, {
    mnemonicEntropy: secureKey.entropy.toString('hex'),
    mnemonicEntropyIV: secureKey.entropyIV.toString('hex'),
    privateKey: secureKey.privateKey.toString('hex'),
    privateKeyIV: secureKey.privateKeyIV.toString('hex'),
    compressed: secureKey.compressed,
    publicKey: secureKey.publicKey,
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
  const update: any = attrs;
  const keyUpdated = await Key.getById(id);

  if (keyUpdated && keyUpdated.get('status') === 'revoked') {
    throw new RevokedKeyError();
  }
  if (attrs.status === 'revoked') {
    const userId = await keyUpdated.get('userId');
    const user = await User.getById(userId);
    sendKeyRevocationEmail(user.toJSON(), keyUpdated.toJSON());
    update.revokedAt = Date.now();
  }
  const key = await Key.update(id, update);
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

  const keyDeleted = await Key.getById(id);
  if (keyDeleted && keyDeleted.get('status') === 'revoked') {
    throw new RevokedKeyError();
  }

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
