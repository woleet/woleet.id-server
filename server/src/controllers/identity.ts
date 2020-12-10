import * as crypto from 'crypto';
import { Key, User, SignedIdentity } from '../database';
import { NotFoundKeyError, SignedIdentityPublicKeyMismatchError } from '../errors';

import { serializeIdentity } from '../api/serialize/identity';
import { getServerConfig } from './server-config';
import { signMessage } from './sign';
import { deserializeX500DN } from './utils/x500-parser';

export async function getIdentity(leftData: string, pubKey: string, signedIdentity?: string) {

  const key = await Key.getByPubKey(pubKey, undefined, true);
  if (!key) {
    throw new NotFoundKeyError();
  }

  const keyUserId = key.get('userId');

  const user = await User.getById(keyUserId);

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

  let identity;

  if (signedIdentity) {
    const hash = crypto.createHash('sha256');
    const signedIdentityHash = hash.update(signedIdentity).digest('hex');
    const SignedIdentities = await SignedIdentity.getBySignedIdentity(signedIdentityHash);
    const matchingSignedIdentity = SignedIdentities.find(SignedId => SignedId.get('publicKey') === pubKey);
    if (!matchingSignedIdentity) {
      throw new SignedIdentityPublicKeyMismatchError();
    }
    identity = deserializeX500DN(signedIdentity);
  } else {
    identity = serializeIdentity(user.toJSON(), true);
  }

  console.log(identity);

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
