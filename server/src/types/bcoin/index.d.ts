type LANGUAGES_ENUM = 'simplified chinese' | 'traditional chinese'
  | 'english' | 'french' | 'italian' | 'japanese' | 'spanish'

type NETWORKS_ENUM = 'main' | 'testnet' | 'regtest' | 'simnet'

type ENCODING_ENUM = 'hex' | 'base58' | null

type Base58Address = string

interface MnemonicOptions {
  bit: number,
  entropy: Buffer,
  phrase?: String,
  passphrase?: String,
  language?: LANGUAGES_ENUM
}

declare module 'bcoin' {

  class WordList {
    constructor(words: string[])

    words: string[]
    map: object
  }

  class HDPublicKey {
    toRaw(): Buffer
  }

  // not a real class
  export class digest {
    static hash160(data: Buffer): Buffer

    static sha256(data: Buffer): Buffer

    static hash256(data: Buffer): Buffer
  }

  // not a real class
  export class ec {
    static sign(msg: Buffer, key: Buffer): Buffer

    static verify(msg: Buffer, sig: Buffer, key: Buffer): boolean

    static fromDER(raw: Buffer): Buffer
  }

  // not a real class
  export class secp256k1 {
    static sign(msg: Buffer, key: Buffer, options?: object): Buffer

    static verify(msg: Buffer, sig: Buffer, key: Buffer): boolean
  }

  export class BufferWriter {
    writeI8(number)

    writeVarint(number)

    writeBytes(Buffer)

    writeString(string)

    render(): Buffer
  }

  export class KeyRing {

    generate(compress?: boolean, network?: NETWORKS_ENUM): KeyRing
    static generate(compress?: boolean, network?: NETWORKS_ENUM): KeyRing

    fromPrivate(key: Buffer, compress?: boolean, network?: NETWORKS_ENUM): KeyRing
    static fromPrivate(key: Buffer, compress?: boolean, network?: NETWORKS_ENUM): KeyRing

    static fromRaw(data: Buffer): KeyRing

    toRaw(): Buffer

    toSecret(): string

    getPrivateKey(): Buffer
    getPrivateKey(enc?: ENCODING_ENUM): Buffer | string

    getPublicKey(enc?: ENCODING_ENUM): Buffer | string

    getKeyAddress(enc?: ENCODING_ENUM): Address | Base58Address

    getAddress(): Address
    getAddress(enc?: null): Address
    getAddress(enc: 'base58'): Base58Address

    sign(msg: Buffer): Buffer

  }

  export class Address {

    static fromRaw(data: Buffer, network?: NETWORKS_ENUM): Address

    static fromBase58(data: Base58Address, network?: NETWORKS_ENUM): Address

    static fromPubkeyhash(data: Buffer, network?: NETWORKS_ENUM): Address

    toRaw(): Buffer

    toBase58(): string
  }

  export class HDPrivateKey {
    static generate(network: NETWORKS_ENUM): HDPrivateKey

    static fromMnemonic(mnemonic: Mnemonic, network?: NETWORKS_ENUM): HDPrivateKey

    static fromRaw(data: Buffer, network?: NETWORKS_ENUM): HDPrivateKey

    toRaw(): Buffer

    privateKey: Buffer
    publicKey: Buffer

    // toPublic(): HDPublicKey //todo do no use: not a public key for address, use publicKey attribute

    // derive(index: number, hardened?: boolean): HDPrivateKey

    fromSeed(seed: Buffer, network?: NETWORKS_ENUM): HDPrivateKey

    derivePath(path: string): HDPrivateKey

    toBase58(): string
  }

  export class Mnemonic {
    constructor(options?: MnemonicOptions)

    fromPhrase(phrase: string): Mnemonic

    fromEntropy(entropy: Buffer, lang: string): Mnemonic

    getPhrase(): string

    getEntropy(): Buffer

    static getWordlist(lang: LANGUAGES_ENUM): WordList

    static fromPhrase(phrase: string): Mnemonic

    toSeed(passphrase: string): Buffer

    static fromEntropy(entropy: Buffer, lang?: LANGUAGES_ENUM): Mnemonic
  }

}
