/// <reference types="node" />

declare module 'bitcoinjs-message' {

  /**
   * A base 64 encoded string
   */
  type Base64String = string;

  interface BitcoinjsMessage {
    magicHash(message: string, messagePrefix?: Buffer | string): Buffer;
    sign(message: string, privateKey: Buffer, compressed?: boolean, messagePrefix?: Buffer | string): Buffer;
    verify(message: string, address: Buffer, signature: Buffer | Base64String, messagePrefix?: Buffer | string): boolean;
  }

  export default BitcoinjsMessage;
}
