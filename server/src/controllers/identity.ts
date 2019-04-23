import * as crypto from 'crypto';
import { Key } from '../database';
import { NotFoundKeyError, BlockedKeyError } from '../errors';

import { serializeIdentity } from '../api/serialize/identity';
import { getServerConfig } from './server-config';
import { signMessage } from './sign';
import { privateKeyTweakAdd } from 'secp256k1';

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

  if ((key.get('holder') === 'server') && leftData !== undefined) {
    const rightData = getServerConfig().identityURL + '.' + crypto.randomBytes(16).toString('hex');

    const signature = await signMessage(key, leftData + rightData, key.get('compressed'));

    return {
      rightData,
      signature,
      identity: serializeIdentity(identity, true),
      key: {
        name: key.get('name'),
        pubKey: key.get('publicKey'),
        holder: key.get('holder')
      }
    };
  } else {
    return {
      identity: serializeIdentity(identity, true),
      key: {
        name: key.get('name'),
        pubKey: key.get('publicKey'),
        holder: key.get('holder')
      }
    };
  }
}
