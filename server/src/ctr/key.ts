import * as crypto from "crypto";
import { ApiPostKeyObject, ApiPutKeyObject, InternalKeyObject } from "../typings";
import { NotFoundKeyError } from "../errors";
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
export async function addKey(key: ApiPostKeyObject): Promise<InternalKeyObject> {
  const private_key = crypto.randomBytes(32).toString('hex');

  const newKey = await db.key.create(Object.assign({}, key, { private_key }));

  return newKey.toJSON();
}

/**
 * @swagger
 *  operationId: logout
 */
export async function updateKey(id: string, attrs: ApiPutKeyObject) {
  const key = await db.key.update(id, attrs);

  if (!key)
    throw new NotFoundKeyError();

  return key.toJSON();
}

export async function getKeyById(id: string): Promise<InternalKeyObject> {
  const key = await db.key.getById(id);

  if (!key)
    throw new NotFoundKeyError();

  return key.toJSON();
}

export async function getAllKeys(): Promise<InternalKeyObject[]> {
  const keys = await db.key.getAll();
  return keys.map((key) => key.toJSON());
}
