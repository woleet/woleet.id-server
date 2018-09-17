import * as crypto from 'crypto';
import { Key } from '../database';
import { NotFoundKeyError, BlockedKeyError } from '../errors';

import * as message from 'bitcoinjs-message';
import { serializeIdentity } from '../api/serialize/identity';
import { getServerConfig } from './server-config';

export async function getIdentity(leftData: string, pubKey: string) {

  const key = await Key.getByPubKey(pubKey, undefined, true);

  if (!key) {
    throw new NotFoundKeyError();
  }

  // A blocked key cannot sign
  if (key.getDataValue('status') === 'blocked') {
    throw new BlockedKeyError();
  }

  const identity = key.getDataValue('user');

  const rightData = getServerConfig().identityUrl + '.' + crypto.randomBytes(16).toString('hex');

  const sig = message.sign(leftData + rightData, Buffer.from(key.getDataValue('privateKey'), 'hex'));

  return {
    rightData,
    signature: sig.toString('base64'),
    identity: serializeIdentity(identity, true)
  };
}
