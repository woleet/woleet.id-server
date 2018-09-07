import { NotFoundUserError, NotFoundKeyError, BlockedUserError, BlockedKeyError } from '../errors';
import { Key, User } from '../database';

import * as message from 'bitcoinjs-message';

export async function sign({ hashToSign, pubKey, userId, customUserId }) {
  let user: SequelizeUserObject;
  let key: SequelizeKeyObject;

  if (!(userId || pubKey || customUserId)) {
    throw new Error('Must provide either "userId", "customUserId" or "pubKey"');
  }

  if (userId) {
    user = await User.getById(userId);
  } else if (customUserId) {
    user = await User.getByCustomUserId(customUserId);
  }

  if (pubKey) {
    key = await Key.getByPubKey(pubKey, user && user.get('id'), !user);
    if (!user) {
      user = key && key.get('user');
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
    throw new NotFoundKeyError();
  }

  // A blocked key cannot sign
  if (key.getDataValue('status') === 'blocked') {
    throw new BlockedKeyError();
  }

  const sig = message.sign(hashToSign, Buffer.from(key.getDataValue('privateKey'), 'hex'));

  return {
    userId: user.get('id'),
    keyId: key.get('id'),
    pubKey: key.get('publicKey'),
    signedHash: hashToSign,
    signature: sig.toString('base64')
  };
}
