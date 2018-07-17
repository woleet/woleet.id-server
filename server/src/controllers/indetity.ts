import * as crypto from "crypto";
import { Key, User } from "../database";
import { NotFoundKeyError, BlockedKeyError } from "../errors";

import * as message from 'bitcoinjs-message';
import { serializeIdentity } from "../api/serialize/identity";

const serverBase = 'http://localhost'

export async function getIdentity(leftData: string, pubKey: string) {

  const key = await Key.getByPubKey(pubKey, undefined, true);

  if (!key)
    throw new NotFoundKeyError();

  // A blocked key cannot sign
  if (key.getDataValue('status') === 'blocked')
    throw new BlockedKeyError();

  const identity = key.getDataValue('user');

  console.log('associated identity', { identity })

  const rightData = crypto.randomBytes(32).toString('hex');

  const sig = message.sign(leftData + rightData, Buffer.from(key.getDataValue('privateKey'), 'hex'));

  return {
    rightData,
    signature: sig.toString('base64'),
    identity: serializeIdentity(identity, true)
  }
}
