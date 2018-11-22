import * as crypto from 'crypto';
import { Key } from '../database';
import { NotFoundKeyError, BlockedKeyError } from '../errors';

import { serializeIdentity } from '../api/serialize/identity';
import { getServerConfig } from './server-config';
import { signMessage } from './sign';

export async function getIdentity(leftData: string, pubKey: string) {

  const key = await Key.getByPubKey(pubKey, undefined, true);

  if (!key) {
    throw new NotFoundKeyError();
  }

  // A blocked key cannot sign
  if (key.get('status') === 'blocked') {
    throw new BlockedKeyError();
  }

  const identity = key.get('user');

  const rightData = getServerConfig().identityURL + '.' + crypto.randomBytes(16).toString('hex');

  const sig = await signMessage(key.get('privateKey'), leftData + rightData, key.get('compressed'));

  return {
    rightData,
    signature: sig.toString('base64'),
    identity: serializeIdentity(identity, true),
    key: {
      name: key.get('name'),
      pubKey: key.get('publicKey')
    }
  };
}
