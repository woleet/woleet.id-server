import * as crypto from 'crypto';
import { Key } from '../database';
import { NotFoundKeyError } from '../errors';

import { serializeIdentity } from '../api/serialize/identity';
import { getServerConfig } from './server-config';
import { signMessage } from './sign';

export async function getIdentity(leftData: string, pubKey: string) {

  const key = await Key.getByPubKey(pubKey, undefined, true);
  if (!key) {
    throw new NotFoundKeyError();
  }

  const identity = key.get('user');

  const expired = key.get('expiration') ? (+key.get('expiration') < Date.now()) : false;

  const status = expired && key.get('status') === 'active' ?
    'expired' : 'valid';

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
        status
      }
    };
  } else {
    return {
      identity: serializeIdentity(identity, true),
      key: {
        name: key.get('name'),
        pubKey: key.get('publicKey'),
        status
      }
    };
  }
}
