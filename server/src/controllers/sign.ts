import { Key, User } from "../database";
import { NotFoundUserError, NotFoundKeyError, BlockedUserError, BlockedKeyError } from "../errors";

import * as message from 'bitcoinjs-message';

const serverBase = 'http://localhost'

export async function sign(hashToSign, pubKey, userId, customUserId) {
  let user: SequelizeUserObject;
  if (userId) {
    user = await User.getById(userId);
  } else if (customUserId) {
    user = await User.getByCustomUserId(customUserId);
  } else {
    throw new Error('Must provide either "userId" or "customUserId"');
  }

  if (!user)
    throw new NotFoundUserError()

  // A blocked user cannot sign
  if (user.getDataValue('status') === 'blocked')
    throw new BlockedUserError()

  let key: SequelizeKeyObject;
  if (pubKey) {
    key = await Key.getByPubKey(pubKey, user.getDataValue('id'));
  } else if (user.getDataValue('defaultKeyId')) {
    key = await Key.getById(user.getDataValue('defaultKeyId'))
  }

  if (!key)
    throw new NotFoundKeyError()

  // A blocked key cannot sign
  if (key.getDataValue('status') === 'blocked')
    throw new BlockedKeyError()

  const sig = message.sign(hashToSign, Buffer.from(key.getDataValue('privateKey'), 'hex'));

  return {
    pubKey: key.getDataValue('publicKey'),
    signedHash: hashToSign,
    signature: sig.toString('base64'),
    identityURL: `${serverBase}/identity?user=${user.getDataValue('id')}`
  };
}
