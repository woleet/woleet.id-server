import { Key, User } from '../database';
import { getServerConfig } from './server-config';
import { secureModule } from '../config';
import { Unauthorized } from 'http-errors';
import * as crypto from 'crypto';

import {
  BlockedKeyError, BlockedUserError, ExpiredKeyError, KeyNotHeldByServerError, KeyOwnerMismatchError, NoDefaultKeyError,
  NotFoundKeyError, NotFoundUserError, RevokedKeyError, ServerNotReadyError
} from '../errors';

export function signMessage(key: SequelizeKeyObject, message: string, compressed = true): Promise<string> {
  const privateKey = Buffer.from(key.get('privateKey'), 'hex');
  const privateKeyIV = Buffer.from(key.get('privateKeyIV'), 'hex');
  return secureModule.sign(privateKey, message, privateKeyIV, compressed);
}

export async function sign({ hashToSign, messageToSign, pubKey, userId, customUserId, path, identityToSign }) {
  let user: SequelizeUserObject;
  let key: SequelizeKeyObject;

  // Get the user if set (it is always set if accessed using a user token)
  if (userId) {
    user = await User.getById(userId);
  } else if (customUserId) {
    user = await User.getByCustomUserId(customUserId);
  }

  // If set, the user should have been found at this step
  if ((userId || customUserId) && !user) {
    throw new NotFoundUserError();
  }

  // Get the key if set
  if (pubKey) {
    key = await Key.getByPubKey(pubKey, user && user.get('id'), !user);
    if (!key) {
      throw new NotFoundKeyError();
    }

    // Get the user from the key if not set
    if (!user) {
      user = key.get('user');

      // Check that the user is a seal
      if (user.get('mode') === 'esign') {
        throw new Unauthorized('Cannot use e-signature with an admin token');
      }
    }
  }

  // If the key and the user are specified, the user must be the owner of a key
  if (key && user) {
    if (key.get('userId') !== user.get('id')) {
      throw new KeyOwnerMismatchError();
    }
  }

  // If the key is not specified, need to get the default key
  if (!pubKey) {
    let defaultKeyId;

    // Default key is user's default key
    if (userId || customUserId) {
      defaultKeyId = user.get('defaultKeyId');
    }

    // Default key is server's default key
    else {
      const config = getServerConfig();
      if (!config) {
        throw new ServerNotReadyError();
      }
      if (!config.fallbackOnDefaultKey || !config.defaultKeyId) {
        throw new NoDefaultKeyError();
      }
      defaultKeyId = config.defaultKeyId;
    }

    // Default key should be set at this step
    if (!defaultKeyId) {
      throw new NoDefaultKeyError();
    }

    // Get the key
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

  // Prepare the data to be signed
  let signedMessage = messageToSign || hashToSign;
  let signedIdentity = '';
  let signedIssuerDomain = '';

  // If the identity must be included in the signed data
  if (identityToSign) {

    // Prepare the identity to be signed
    if (identityToSign === 'ALL') {
      identityToSign = 'CN,O,OU,L,C,EMAILADDRESS';
    }
    const escapingRegex = /([=",;+])/mg;
    const tabIdentityToSign = identityToSign.split(',');
    if (user.get('x500CommonName') && tabIdentityToSign.includes('CN')) {
      signedIdentity += 'CN=' + user.get('x500CommonName').replace(escapingRegex, '\\$1');
    }
    if (user.get('x500Organization') && tabIdentityToSign.includes('O')) {
      if (signedIdentity) {
        signedIdentity += ',';
      }
      signedIdentity += 'O=' + user.get('x500Organization').replace(escapingRegex, '\\$1');
    }
    if (user.get('x500OrganizationalUnit') && tabIdentityToSign.includes('OU')) {
      if (signedIdentity) {
        signedIdentity += ',';
      }
      signedIdentity += 'OU=' + user.get('x500OrganizationalUnit').replace(escapingRegex, '\\$1');
    }
    if (user.get('x500Locality') && tabIdentityToSign.includes('L')) {
      if (signedIdentity) {
        signedIdentity += ',';
      }
      signedIdentity += 'L=' + user.get('x500Locality').replace(escapingRegex, '\\$1');
    }
    if (user.get('x500Country') && tabIdentityToSign.includes('C')) {
      if (signedIdentity) {
        signedIdentity += ',';
      }
      signedIdentity += 'C=' + user.get('x500Country').replace(escapingRegex, '\\$1');
    }
    if (user.get('email') && tabIdentityToSign.includes('EMAILADDRESS')) {
      if (signedIdentity) {
        signedIdentity += ',';
      }
      signedIdentity += 'EMAILADDRESS=' + user.get('email').replace(escapingRegex, '\\$1');
    }

    // Prepare the issuer domain to be signed (extract it from the identity URL)
    const sub = new URL(getServerConfig().identityURL).hostname.split('.');
    switch (sub.length) {
      case 0:
        break;
      case 1:
        signedIssuerDomain = sub[0];
        break;
      default:
        signedIssuerDomain = sub[sub.length - 2] + '.' + sub[sub.length - 1];
    }

    // Prepare the message including the identity and issuer domain to sign
    const hash = crypto.createHash('sha256');
    signedMessage = hash.update(signedMessage + signedIdentity + signedIssuerDomain).digest('hex');
  }

  // If no derivation path is specified, sign using the key unmodified
  let signature: string;
  let publicKey: string;
  if (!path) {
    signature = await signMessage(key, signedMessage);
    publicKey = key.get('publicKey');
  }

  // If a derivation path is specified, sign using the derived key
  else {
    const entropy = Buffer.from(key.get('mnemonicEntropy'), 'hex');
    const entropyIV = Buffer.from(key.get('mnemonicEntropyIV'), 'hex');
    const derivedKey = await secureModule.deriveKey(entropy, entropyIV, path);
    signature = await secureModule.sign(derivedKey.privateKey, signedMessage, derivedKey.privateKeyIV);
    publicKey = derivedKey.publicKey;
  }

  const now = new Date();

  await Key.update(key.get('id'), { lastUsed: now });

  return {
    userId: user.get('id'),
    keyId: key.get('id'),
    signedHash: hashToSign,
    signedMessage: messageToSign,
    pubKey: publicKey,
    signedIdentity: signedIdentity,
    signedIssuerDomain: signedIssuerDomain,
    signature
  };
}
