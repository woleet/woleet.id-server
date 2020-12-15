import * as crypto from 'crypto';
import { Key, SignedIdentity, User } from '../database';
import { NotFoundIdentityError, NotFoundKeyError } from '../errors';
import { serializeIdentity } from '../api/serialize/identity';
import { getServerConfig } from './server-config';
import { signMessage } from './sign';
import { deserializeX500DN } from './utils/x500-parser';

export async function getIdentity(publicKey: string, signedIdentity?: string, leftData?: string) {

  // Get the requested key
  const key = await Key.getByPublicKey(publicKey, undefined, true);
  if (!key) {
    throw new NotFoundKeyError();
  }

  // Compute the status of the key
  const expired = key.get('expiration') ? (+key.get('expiration') < Date.now()) : false;
  let status;
  if (key.get('status') === 'revoked') {
    status = 'revoked';
  } else if (expired) {
    status = 'expired';
  } else {
    status = 'valid';
  }

  // Prepare key information to return
  const identityKey: ApiIdentityKeyObject = {
    name: key.get('name'),
    pubKey: key.get('publicKey'),
    status
  };

  // Add the expiration timestamp if set
  if (key.get('expiration')) {
    identityKey.expiration = +key.get('expiration');
  }

  // Add the revocation timestamp if set
  if (key.get('revokedAt')) {
    identityKey.revokedAt = +key.get('revokedAt');
  }

  // Get the user associated to the requested key
  const user = await User.getById(key.get('userId'));

  // If a signed identity is provided to this function, it means the server implements identity URL contract V2
  let identity;
  if (signedIdentity) {

    // Check that the key was used at least once to sign the given identity
    const hash = crypto.createHash('sha256');
    const signedIdentityHash = hash.update(signedIdentity).digest('hex');
    if (!await SignedIdentity.getByPublicKeyAndSignedIdentity(publicKey, signedIdentityHash)) {
      throw new NotFoundIdentityError();
    }

    // Prepare identity information to return
    identity = deserializeX500DN(signedIdentity);
  }

  // Otherwise, it means the server implements identity URL contract V1
  else {
    identity = serializeIdentity(user.toJSON(), true);
  }

  // If some random data are provided, and the server holds the key, and the key is associated to a seal
  if (leftData && key.get('holder') === 'server' && user.get('mode') === 'seal') {

    // Build a proof of ownership by signed the random data
    const rightData = getServerConfig().identityURL + '.' + crypto.randomBytes(16).toString('hex');
    const signature = await signMessage(key, leftData + rightData, key.get('compressed'));

    // Return the proof of ownership, identity and key information
    return {
      rightData,
      signature,
      identity,
      key: identityKey
    };
  }

  // Otherwise, don't return a proof of ownership
  else {

    // Return identity and key information
    return {
      identity,
      key: identityKey
    };
  }
}
