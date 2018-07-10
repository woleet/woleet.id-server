import { pbkdf2, randomBytes } from 'crypto';

const ITERATIONS = 8192;
const KEY_LENGTH = 512;
const KEY_DIGEST = 'sha512';

/**
 * @param password
 * @param salt
 * @param [iterations]
 */
function _encode(password: Buffer, salt: Buffer, iterations: number = ITERATIONS): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, iterations, KEY_LENGTH, KEY_DIGEST, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  })
}

type Key = { hash: string, salt: string, iterations: number };

export async function encode(password: string): Promise<Key> {
  const salt = randomBytes(128);
  const key = await _encode(Buffer.from(password, 'utf8'), salt).then((hash) => ({ salt, iterations: ITERATIONS, hash }))
  return {
    hash: key.hash.toString('hex'),
    salt: key.salt.toString('hex'),
    iterations: key.iterations
  };
};

export async function validate(password: string, key: Key): Promise<boolean> {
  const hash = Buffer.from(key.hash, 'hex');
  const salt = Buffer.from(key.salt, 'hex');

  return _encode(Buffer.from(password, 'utf8'), Buffer.from(salt), key.iterations)
    .then((result) => Buffer.compare(hash, result) == 0)
    .catch(() => false)
}
