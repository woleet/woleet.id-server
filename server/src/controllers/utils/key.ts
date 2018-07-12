import { privateKeyVerify, publicKeyCreate } from 'secp256k1';
import { randomBytes } from 'crypto';

export function generatePrivateKey(): Buffer {
  let priv: Buffer;

  do {
    priv = randomBytes(32);
  } while (!privateKeyVerify(priv));

  return priv;
}

export { publicKeyCreate };
