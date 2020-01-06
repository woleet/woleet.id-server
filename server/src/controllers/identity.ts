import * as crypto from 'crypto';
import { Key, User } from '../database';
import { NotFoundKeyError } from '../errors';

import { serializeIdentity } from '../api/serialize/identity';
import { getServerConfig } from './server-config';
import { signMessage } from './sign';

export async function getIdentity(leftData: string, pubKey: string) {

  const key = await Key.getByPubKey(pubKey, undefined, true);
  if (!key) {
    throw new NotFoundKeyError();
  }

  const keyUserId = key.get('userId');

  const user = await User.getById(keyUserId);

  const identity = serializeIdentity(user.toJSON(), true);

  const expired = key.get('expiration') ? (+key.get('expiration') < Date.now()) : false;

  // Compute key status
  let status;
  if (key.get('status') === 'revoked') {
    status = 'revoked';
  } else if (expired) {
    status = 'expired';
  } else {
    status = 'valid';
  }

  const identityKey: ApiIdentityKeyObject = {
    name: key.get('name'),
    pubKey: key.get('publicKey'),
    status
  };

  // Add expiration field if the expiration date is set, transform the Date string type into timestamp format
  if (key.get('expiration')) {
    identityKey.expiration = +key.get('expiration');
  }

  // Add the revocation date if set (transform the date string to a timestamp)
  if (key.get('revokedAt')) {
    identityKey.revokedAt = +key.get('revokedAt');
  }

  if ((key.get('holder') === 'server') && (leftData !== undefined) && (user.get('mode') === 'seal')) {
    const rightData = getServerConfig().identityURL + '.' + crypto.randomBytes(16).toString('hex');

    const signature = await signMessage(key, leftData + rightData, key.get('compressed'));

    return {
      rightData,
      signature,
      identity,
      key: identityKey
    };
  } else {
    return {
      identity,
      key: identityKey
    };
  }
}
