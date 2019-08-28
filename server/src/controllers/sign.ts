import { Key, User } from '../database';
import { getServerConfig } from './server-config';
import { secureModule } from '../config';
import { Unauthorized } from 'http-errors';

import {
  NotFoundUserError, NotFoundKeyError, BlockedUserError,
  BlockedKeyError, NoDefaultKeyError, ServerNotReadyError,
  KeyOwnerMismatchError, ExpiredKeyError, KeyNotHeldByServerError, RevokedKeyError
} from '../errors';

export function signMessage(key: SequelizeKeyObject, message: string, compressed = true): Promise<string> {
  const privateKey = Buffer.from(key.get('privateKey'), 'hex');
  const privateKeyIV = Buffer.from(key.get('privateKeyIV'), 'hex');
  return secureModule.sign(privateKey, message, privateKeyIV, compressed);
}

export async function sign({ hashToSign, pubKey, userId, customUserId }) {
  let user: SequelizeUserObject;
  let key: SequelizeKeyObject;

  if (userId) {
    user = await User.getById(userId);
  } else if (customUserId) {
    user = await User.getByCustomUserId(customUserId);
  }

  if (pubKey) {
    key = await Key.getByPubKey(pubKey, user && user.get('id'), !user);
    if (!key) {
      throw new NotFoundKeyError();
    }
    if (!user) {
      user = key.get('user');
      if (user.get('mode') === 'esign') {
        throw new Unauthorized('Cannot use e-signature with an admin token.');
      }
    }
  }

  if ((userId || customUserId) && !user) {
    throw new NotFoundUserError();
  }

  // Key and user are specified, need to check that the user is the owner of a key.
  if (key && user) {
    if (key.get('userId') !== user.get('id')) {
      throw new KeyOwnerMismatchError();
    }
  }

  // If the pubkey is not specified, need to put the value by default.
  if (!pubKey) {
    let defaultKeyId;
    if (userId || customUserId) {
      defaultKeyId = user.get('defaultKeyId');
      if (!defaultKeyId) {
        throw new NoDefaultKeyError();
      }
    } else {
      const config = getServerConfig();
      if (!config) {
        throw new ServerNotReadyError();
      }
      if (!config.fallbackOnDefaultKey || !config.defaultKeyId) {
        throw new NoDefaultKeyError();
      }
      defaultKeyId = config.defaultKeyId;
    }
    key = await Key.getByIdAndPullUser(defaultKeyId);
    if (!key) {
      throw new Error(`Cannot find default key (${defaultKeyId})`);
    }
    if (!user) {
      user = key.get('user');
    }
  }

  // A blocked user cannot sign
  if (user.getDataValue('status') === 'blocked') {
    throw new BlockedUserError();
  }

  if (!key) {
    throw new NoDefaultKeyError();
  }

  // A blocked key cannot sign
  if (key.getDataValue('status') === 'blocked') {
    throw new BlockedKeyError();
  }

   // A revoked key cannot sign
   if (key.getDataValue('status') === 'revoked') {
    throw new RevokedKeyError();
  }

  // Block the call if the private key is not held by the server
  if (key.get('holder') !== 'server') {
    throw new KeyNotHeldByServerError();
  }

  // A expired key cannot sign
  const exp = key.getDataValue('expiration');
  if (exp && exp < +Date.now()) {
    throw new ExpiredKeyError();
  }

  const signature = await signMessage(key, hashToSign);

  return {
    userId: user.get('id'),
    keyId: key.get('id'),
    pubKey: key.get('publicKey'),
    signedHash: hashToSign,
    signature
  };
}
