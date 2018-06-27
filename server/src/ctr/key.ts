import * as crypto from "crypto";
import { ApiPostKeyObject, ApiPutKeyObject, InternalKeyObject } from "../typings";
import { NotFoundKeyError, NotFoundUserError } from "../errors";
import { db } from "../db";

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
export async function addKey(userId: string, key: ApiPostKeyObject): Promise<InternalKeyObject> {
  const privateKey = crypto.randomBytes(32).toString('hex');

  console.log(Object.assign({}, key, { privateKey }))

  try {
    const newKey = await db.Key.create(Object.assign({}, key, { privateKey, userId }));
    return newKey.toJSON();
  } catch (err) {

  }

}

/**
 * @swagger
 *  operationId: logout
 */
export async function updateKey(id: string, attrs: ApiPutKeyObject) {
  const key = await db.Key.update(id, attrs);

  if (!key)
    throw new NotFoundKeyError();

  return key.toJSON();
}

export async function getKeyById(id: string): Promise<InternalKeyObject> {
  const key = await db.Key.getById(id);

  if (!key)
    throw new NotFoundKeyError();

  return key.toJSON();
}

export async function getAllKeys(): Promise<InternalKeyObject[]> {
  const keys = await db.Key.getAll();
  return keys.map((key) => key.toJSON());
}

export async function getAllKeysOfUser(userId: string): Promise<InternalKeyObject[]> {
  const keys = await db.Key.getAll();
  return keys.map((key) => key.toJSON());
}
