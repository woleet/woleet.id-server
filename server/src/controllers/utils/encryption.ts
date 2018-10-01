import * as crypto from 'crypto';
import { encryption as config } from '../../config';

const secret = crypto.createHash('sha256')
  .update(config.secret, 'utf8')
  .digest();

export function encrypt(data: Buffer) {
  const cipher = crypto.createCipher('aes-256-cbc', secret);
  return Buffer.concat([cipher.update(data), cipher.final()]);
}

export function decrypt(data: string) {
  const decipher = crypto.createDecipher('aes-256-cbc', secret);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(data, 'hex')), decipher.final()]);
  return decrypted;
}

/*
export function encrypt(data: Buffer) {
  return crypto.publicEncrypt(config.pubkey, data);
}

export function decrypt(data: string) {
  return crypto.privateDecrypt(config.privkey, Buffer.from(data));
}
*/
