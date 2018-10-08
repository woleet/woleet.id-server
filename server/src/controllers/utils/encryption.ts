import * as crypto from 'crypto';
import { encryption as config } from '../../config';

let _secret;

export function setSecret(secret: string) {
  _secret = crypto.createHash('sha256')
    .update(secret, 'utf8')
    .digest();
}

export function encrypt(data: Buffer) {
  const cipher = crypto.createCipher('aes-256-cbc', _secret);
  return Buffer.concat([cipher.update(data), cipher.final()]);
}

export function decrypt(data: string) {
  const decipher = crypto.createDecipher('aes-256-cbc', _secret);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(data, 'hex')), decipher.final()]);
  return decrypted;
}
