import * as crypto from 'crypto';
import * as message from 'bitcoinjs-message';
import { Mnemonic, HDPrivateKey, KeyRing } from 'bcoin';

import { promisify } from 'util';
import * as log from 'loglevel';
import * as read from 'read';

export interface SecureKey {
  entropyIV: Buffer;
  entropy: Buffer;
  privateKeyIV: Buffer;
  privateKey: Buffer;
  publicKey: Base58Address;
  compressed: boolean;
}

export class SecureModule {

  private secret: Buffer = null;

  private initialized() {
    return !!this.secret;
  }

  private _encrypt(data: Buffer, iv: Buffer) {
    const cipher = crypto.createCipheriv('aes-256-cbc', this.secret, iv);
    return Buffer.concat([cipher.update(data), cipher.final()]);
  }

  private _decrypt(data: Buffer, iv: Buffer) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.secret, iv);
    return Buffer.concat([decipher.update(data), decipher.final()]);
  }

  private _randomBytes(n: number) {
    return crypto.randomBytes(n);
  }

  public async init(): Promise<void> {
    let secret = process.env.WOLEET_ID_SERVER_ENCRYPTION_SECRET;

    if (!secret) {
      log.warn('No WOLEET_ID_SERVER_ENCRYPTION_SECRET environment set, please enter encryption secret:');
      const options = { prompt: '>', silent: true };
      const _read = promisify(read);
      let secret = '';
      while (!secret) {
        secret = await _read(options);
        if (!secret) {
          log.warn('Encryption secret must not be empty, please type it:');
        }
      }
    }

    this.secret = crypto.createHash('sha256')
      .update(secret, 'utf8')
      .digest();
  }

  public async encrypt(data: Buffer): Promise<{ data: Buffer, iv: Buffer }> {
    const iv = this._randomBytes(16);
    return {
      data: this._encrypt(data, iv),
      iv
    };
  }

  public async decrypt(data: Buffer, iv: Buffer): Promise<Buffer> {
    return this._decrypt(data, iv);
  }

  public async createKey(): Promise<SecureKey> {

    if (!this.initialized()) {
      throw new Error('Secure module is not initialized');
    }

    if (arguments.length !== 0) {
      throw new Error('Function "createKey" does not takes any argument');
    }

    // Get random phrase
    const mnemonic = new Mnemonic();

    return this.importPhrase(mnemonic.getPhrase());
  }

  public async importPhrase(phrase: string): Promise<SecureKey> {

    if (!this.initialized()) {
      throw new Error('Secure module is not initialized');
    }

    if (arguments.length !== 1) {
      throw new Error('Function "importPhrase" takes exactly one argument');
    }

    if (typeof phrase !== 'string') {
      throw new Error('First argument must be a string');
    }

    let mnemonic;
    // Get new phrase
    try {
      mnemonic = Mnemonic.fromPhrase(phrase);
    } catch (err) {
      throw new Error('First argument must be a valid phrase');
    }

    // Create an HD private key
    const master = HDPrivateKey.fromMnemonic(mnemonic);
    const xkey = master.derivePath('m/44\'/0\'/0\'');

    const compressed = true;
    const ring = KeyRing.fromPrivate(xkey.privateKey, compressed);

    const publicKey = ring.getAddress();
    const privateKey = ring.getPrivateKey();

    const entropyIV = this._randomBytes(16);
    const encryptedEntropy = this._encrypt(mnemonic.getEntropy(), entropyIV);
    const privateKeyIV = this._randomBytes(16);
    const encryptedPrivateKey = this._encrypt(privateKey, privateKeyIV);

    return {
      entropyIV: entropyIV,
      entropy: encryptedEntropy,
      privateKeyIV: privateKeyIV,
      privateKey: encryptedPrivateKey,
      publicKey: publicKey.toBase58(),
      compressed
    };
  }

  public async exportPhrase(entropy: Buffer, iv: Buffer): Promise<string> {

    if (!this.initialized()) {
      throw new Error('Secure module is not initialized');
    }

    if (arguments.length !== 2) {
      throw new Error('ExportPhrase takes exactly two arguments');
    }

    if (entropy.length !== (16 + 16)) {
      throw new Error('First argument must be a 32 bytes length buffer');
    }

    if (!(Buffer.isBuffer(iv) && iv.length === 16)) {
      throw new Error('Argument "iv" must be a 16 bytes buffer');
    }

    let decrypted = null;
    try {
      decrypted = this._decrypt(entropy, iv);
    } catch (err) {
      throw new Error('Failed to decrypt entropy');
    }

    // Get key mnemonic
    const mnemonic = Mnemonic.fromEntropy(decrypted);

    // Return phrase
    return mnemonic.getPhrase();
  }

  public async sign(key: Buffer, msg: string, iv: Buffer, compressed = true): Promise<string> {

    if (!this.initialized()) {
      throw new Error('Secure module is not initialized');
    }

    if (arguments.length !== 3 && arguments.length !== 4) {
      throw new Error('Function "sign" takes exactly three arguments');
    }

    if (!Buffer.isBuffer(key)) {
      throw new Error('Argument "key" must be a buffer');
    }

    if (key.length !== (32 + 16)) {
      throw new Error('Argument "key" must be a 38 bytes length buffer');
    }

    if (typeof msg !== 'string') {
      throw new Error('Argument "message" must be a string');
    }

    if (!(Buffer.isBuffer(iv) && iv.length === 16)) {
      throw new Error('Argument "iv" must be a 16 bytes buffer');
    }

    let decrypted = null;
    try {
      decrypted = this._decrypt(key, iv);
    } catch (err) {
      throw new Error('Failed to decrypt key');
    }

    return message.sign(msg, decrypted, compressed).toString('base64');
  }

}
