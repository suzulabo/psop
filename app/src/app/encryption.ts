import base32Encode from 'base32-encode';
import nacl from 'tweetnacl';

const concatArray = (...arrays: Uint8Array[]) => {
  const len = arrays.reduce((acc, array) => {
    return acc + array.byteLength;
  }, 0);
  const result = new Uint8Array(len);
  let offset = 0;
  for (const array of arrays) {
    result.set(array, offset);
    offset += array.byteLength;
  }
  return result;
};

const toBase32 = (v: Uint8Array) => {
  return base32Encode(v, 'Crockford');
};

const deriveSecretKey = (secret: Uint8Array, passwd: string) => {
  return nacl
    .hash(concatArray(secret, new TextEncoder().encode(passwd || '')))
    .slice(0, nacl.box.secretKeyLength);
};

export class AppEncryption {
  generatePair(passwd: string) {
    const secret = nacl.randomBytes(32);
    const secretKey = deriveSecretKey(secret, passwd);
    const pair = nacl.box.keyPair.fromSecretKey(secretKey);
    return {
      secret: toBase32(secret),
      public: toBase32(pair.publicKey),
    };
  }
}
