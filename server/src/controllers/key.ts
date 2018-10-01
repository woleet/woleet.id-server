import { Key } from '../database';
import { NotFoundKeyError } from '../errors';
import { Mnemonic, HDPrivateKey, KeyRing } from 'bcoin';
import { encrypt, decrypt } from './utils/encryption';

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
 * TODO: move to secure module
 */
export async function createKey(userId: string, key: ApiPostKeyObject): Promise<InternalKeyObject> {

  // Get new phrase
  const mnemonic = new Mnemonic();

  // Create an HD private key
  const master = HDPrivateKey.fromMnemonic(mnemonic);
  const xkey = master.derivePath('m/44\'/0\'/0\'');

  const ring = KeyRing.fromPrivate(xkey.privateKey, false);

  const publicKey = ring.getAddress('base58');
  const privateKey = ring.getPrivateKey();

  console.log('W', mnemonic.getPhrase());
  console.log('M', master.toRaw().length, master.toRaw().toString('hex'));

  console.log('E', mnemonic.getEntropy().length, mnemonic.getEntropy().toString('hex'));
  const encryptedEntropy = encrypt(mnemonic.getEntropy());
  console.log('EE', encryptedEntropy.length, encryptedEntropy.toString('hex'));

  const encryptedPrivateKey = encrypt(privateKey);
  console.log('P', privateKey.length, privateKey.toString('hex'));
  console.log('EP', encryptedPrivateKey.length, encryptedPrivateKey.toString('hex'));

  const newKey = await Key.create(Object.assign({}, key, {
    mnemonicEntropy: encryptedEntropy.toString('hex'),
    privateKey: encryptedPrivateKey.toString('hex'),
    publicKey,
    userId
  }));

  return newKey.toJSON();
}

/**
 * @swagger
 *  operationId: logout
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

/**
 * TODO: move to secure module
 */
export async function exportKey(id: string): Promise<string> {
  const key = await Key.getById(id);

  if (!key) {
    throw new NotFoundKeyError();
  }

  const entropy = decrypt(key.get('mnemonicEntropy'));

  // Get key mnemonic
  const mnemonic = Mnemonic.fromEntropy(entropy);

  // Return phrase
  return mnemonic.getPhrase();
}

export async function getAllKeys(full = false): Promise<InternalKeyObject[]> {
  const keys = await Key.getAll({ full });
  return keys.map((key) => key.toJSON());
}

export async function getAllKeysOfUser(userId: string, full: boolean): Promise<InternalKeyObject[]> {
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

