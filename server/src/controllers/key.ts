import * as crypto from "crypto";
import { NotFoundKeyError } from "../errors";
import { Key } from "../database";
import { generatePrivateKey, publicKeyCreate } from "./utils/key";
import * as bs58check from 'bs58check';

/**
 * Key
 * Request handlers for key.
 * @alias module:handlers.Key
 * @swagger
 *  tags: [authentication]
 */

/**
 * @swagger
 *  operationId: addKey
 */
export async function createKey(userId: string, key: ApiPostKeyObject): Promise<InternalKeyObject> {
  const privateKey = generatePrivateKey();
  const publicKey = bs58check.encode(publicKeyCreate(privateKey, true));
  const newKey = await Key.create(Object.assign({}, key, { privateKey: privateKey.toString('hex'), publicKey, userId }));
  return newKey.toJSON();
}

/**
 * @swagger
 *  operationId: logout
 */
export async function updateKey(id: string, attrs: ApiPutKeyObject) {
  const key = await Key.update(id, attrs);

  if (!key)
    throw new NotFoundKeyError();

  return key.toJSON();
}

export async function getKeyById(id: string): Promise<InternalKeyObject> {
  const key = await Key.getById(id);

  if (!key)
    throw new NotFoundKeyError();

  return key.toJSON();
}

export async function getAllKeys(): Promise<InternalKeyObject[]> {
  const keys = await Key.getAll();
  return keys.map((key) => key.toJSON());
}

export async function getAllKeysOfUser(userId: string): Promise<InternalKeyObject[]> {
  const keys = await Key.getAll();
  return keys.map((key) => key.toJSON());
}
