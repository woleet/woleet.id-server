import { Key, User } from '../database';
import { getServerConfig } from './server-config';
import { secureModule } from '../config';

import {
  NotFoundUserError, NotFoundKeyError, BlockedUserError,
  BlockedKeyError, NoDefaultKeyError, ServerNotReadyError,
  KeyOwnerMismatchError, ExpiredKeyError
} from '../errors';

export function signMessage(key: SequelizeKeyObject, message: string, compressed = true): Promise<string> {
  const privateKey = Buffer.from(key.get('privateKey'), 'hex');
  const privateKeyIV = Buffer.from(key.get('privateKeyIV'), 'hex');
  return secureModule.sign(privateKey, message, privateKeyIV, compressed);
}

export async function sign({ hashToSign, pubKey, userId, customUserId }) {
  let user: SequelizeUserObject;
  let key: SequelizeKeyObject;

  if (!(userId || pubKey || customUserId)) {
    const config = getServerConfig();
    if (!config) {
      throw new ServerNotReadyError();
    }
    if (!config.fallbackOnDefaultKey || !config.defaultKeyId) {
      throw new NoDefaultKeyError();
    }
    key = await Key.getByIdAndPullUser(config.defaultKeyId);
    if (!key) {
      throw new Error(`Cannot find default key (${config.defaultKeyId})`);
    }
    user = key.get('user');
  }

  if (userId) {
    user = await User.getById(userId);
  } else if (customUserId) {
    user = await User.getByCustomUserId(customUserId);
  }

  // Key and user are specified, need to check that the user is the owner of a key.
  if (key && user) {
    if (key.get('userId') !== user.get('id')) {
      throw new KeyOwnerMismatchError();
    }
  }

  if (pubKey) {
    key = await Key.getByPubKey(pubKey, user && user.get('id'), !user);
    if (!key) {
      throw new NotFoundKeyError();
    }
    if (!user) {
      user = key.get('user');
    }
  }

  if (!user) {
    throw new NotFoundUserError();
  }

  // A blocked user cannot sign
  if (user.getDataValue('status') === 'blocked') {
    throw new BlockedUserError();
  }

  if (!key && user.getDataValue('defaultKeyId')) {
    key = await Key.getById(user.getDataValue('defaultKeyId'));
  }

  if (!key) {
    throw new NoDefaultKeyError();
  }

  // A blocked key cannot sign
  if (key.getDataValue('status') === 'blocked') {
    throw new BlockedKeyError();
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
