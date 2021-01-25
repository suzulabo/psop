import base32Decode from 'base32-decode';
import base32Encode from 'base32-encode';
import { workerEncrypt } from 'src/workers/encrypt.worker';
import nacl from 'tweetnacl';
import { DataWriter } from './datawriter';
import { concatArray, readFile } from './utils';

const FILE_PREFIX = 'PSOP1';

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

  async encryptFiles(
    files: File[],
    publicCode: string,
    cb: (stage: string, file?: File, val?: number) => void,
  ) {
    const writer = new DataWriter();
    const recipientPubKey = base32Decode(publicCode, 'Crockford');
    const keyPair = nacl.box.keyPair();

    writer.writeInt8(1); // version
    writer.writeInt32(files.length);

    for (const file of files) {
      writer.writeString(file.name);
      const fileData = await readFile(file, loaded => {
        cb('read', file, loaded);
      });
      cb('read_end', file);
      writer.writeUint8Array(fileData);
    }

    const data = writer.toUint8Array();

    cb('encrypt_begin');
    const encrypted = await workerEncrypt(
      recipientPubKey.slice(0), // Because WebWorker will detatch ArrayBuffer
      keyPair.secretKey.buffer,
      data.buffer,
    );
    cb('encrypt_end');

    const blob = new Blob([
      FILE_PREFIX,
      recipientPubKey,
      keyPair.publicKey,
      encrypted.nonce,
      encrypted.data,
    ]);

    return blob;
  }
}
