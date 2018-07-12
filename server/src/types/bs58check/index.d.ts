/// <reference types="node" />

type Base58String = string;

declare module 'bs58check' {

  /** Decode a base58 encoded string */
  export function decode(str: Base58String): Buffer

  /** Encode a buffer as a base58 encoded string */
  export function encode(buf: Buffer): Base58String

  /** Decode a base58-check encoded string to a buffer, no result if checksum is wrong */
  export function decodeUnsafe(str: string): Buffer | undefined

}
