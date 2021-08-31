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

  return newKey.get();
}

/**
 * @swagger
 *  operationId: createExternalKey
 */
export async function createExternalKey(userId: string, key: ApiPostKeyObject): Promise<InternalKeyObject> {

  // Check that user exists
  const user = await User.getById(userId);
  if (!user) {
    throw new NotFoundUserError();
  }

  // Check that user is a esign user
  if (user.get('mode') === 'seal') {
    throw new Error('Cannot create an external key for a user in seal mode');
  }

  // Create and return a new external key
  const holder: KeyHolderEnum = 'user';
  const newKey = await Key.create(Object.assign({}, key, {
    publicKey: key.publicKey,
    holder,
    userId
  }));
  return newKey.get();
}

/**
 * @swagger
 *  operationId: updateKey
 */
export async function updateKey(id: string, attrs: ApiPutKeyObject) {
  const update: any = attrs;

  // Check key existence
  const keyUpdated = await Key.getById(id);
  if (!keyUpdated) {
    throw new NotFoundKeyError();
  }

  // If the key is revoked the update is not available
  if (keyUpdated && keyUpdated.get('status') === 'revoked') {
    throw new RevokedKeyError();
  }

  // Upon revocation the revocation date is added and the private key and the entropy is deleted
  // if the user is a esign user
  let user;
  if (update.status === 'revoked') {
    const userId = await keyUpdated.getDataValue('userId');
    user = await User.getById(userId);
    update.revokedAt = Date.now();
    if (user.get('mode') !== 'seal') {
      update.privateKey = null;
      update.privateKeyIV = null;
      update.mnemonicEntropy = null;
      update.mnemonicEntropyIV = null;
    }
  }

  // Update the key
  const key = await Key.update(id, update);

  // If the key is revoked and the update succeeded, send an email to the admins
  if (update.status === 'revoked') {
    sendKeyRevocationEmail(user.get(), keyUpdated.get());
  }

  // Return the key
  return key.get();
}

export async function getKeyById(id: string): Promise<InternalKeyObject> {
  const key = await Key.getById(id);
  if (!key) {
    throw new NotFoundKeyError();
  }

  return key.get();
}

export async function getOwner(id): Promise<InternalUserObject> {
  const key = await Key.getByIdAndPullUser(id);
  if (!key) {
    throw new NotFoundKeyError();
  }

  return key.getDataValue('user');
}

export async function getOwnerByPubKey(pubKey): Promise<InternalUserObject> {
  const key = await Key.getByPublicKey(pubKey, null, true);
  if (!key) {
    throw new NotFoundKeyError();
  }

  return key.getDataValue('user');
}

export async function exportKey(id: string): Promise<string> {
  const key = await Key.getById(id);
  if (!key) {
    throw new NotFoundKeyError();
  }

  // Get the entropy and its initialization vector to retrieve the mnemonic word
  const entropy = Buffer.from(key.getDataValue('mnemonicEntropy'), 'hex');
  const entropyIV = Buffer.from(key.getDataValue('mnemonicEntropyIV'), 'hex');
  return secureModule.exportPhrase(entropy, entropyIV);
}

export async function getAllKeysOfUser(userId: string): Promise<InternalKeyObject[]> {
  const user = await User.getById(userId);
  if (!user) {
    throw new NotFoundUserError();
  }

  const keys = await Key.getAllKeysOfUser(userId, full);
  return keys.map((key) => key.get());
}

export async function deleteKey(id: string): Promise<InternalKeyObject> {
  const keyDeleted = await Key.getById(id);
  if (!keyDeleted) {
    throw new NotFoundKeyError();
  }

  if (keyDeleted.get('status') === 'revoked') {
    throw new RevokedKeyError();
  }

  const key = await Key.delete(id);
  return key.get();
}

export async function isKeyHeldByServer(id: string): Promise<Boolean> {
  const key = await Key.getById(id);
  if (!key) {
    throw new NotFoundKeyError();
  }

  return key.get().holder === 'server';
}
