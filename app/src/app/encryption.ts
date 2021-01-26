import base32Decode from 'base32-decode';
import base32Encode from 'base32-encode';
import { workerDecrypt } from 'src/workers/decrypt.worker';
import { workerEncrypt } from 'src/workers/encrypt.worker';
import nacl from 'tweetnacl';
import { DataReader } from './datareader';
import { DataWriter } from './datawriter';
import { AppMsg } from './msg';
import { concatArray, readFile } from './utils';

const FILE_PREFIX = 'PSOP1';
const FILE_HEADER_SIZE =
  FILE_PREFIX.length +
  nacl.box.publicKeyLength + // recipientPubKey
  nacl.box.publicKeyLength + // senderPubKey
  nacl.box.nonceLength; // nonce

const toBase32 = (v: Uint8Array) => {
  return base32Encode(v, 'Crockford');
};
const fromBase32 = (v: string) => {
  return new Uint8Array(base32Decode(v, 'Crockford'));
};

const deriveSecretKey = (secret: Uint8Array, passwd: string) => {
  return nacl
    .hash(concatArray(secret, new TextEncoder().encode(passwd || '')))
    .slice(0, nacl.box.secretKeyLength);
};

export class AppEncryption {
  constructor(private appMsg: AppMsg) {}

  private errMsgs = this.appMsg.msgs.errors;

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
    const recipientPubKey = fromBase32(publicCode);
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

  async decryptFile(
    file: File,
    secretCode: string,
    passPhrase: string,
    cb: (stage: string, val?: number) => void,
  ) {
    cb('read_header');

    const header = await readFile(file.slice(0, FILE_HEADER_SIZE));
    if (header.byteLength < FILE_HEADER_SIZE) {
      return this.errMsgs.decryptFile.fileFormat;
    }

    const headerReader = new DataReader(header);
    const filePrefix = new TextDecoder().decode(headerReader.readBytes(FILE_PREFIX.length));
    if (filePrefix != FILE_PREFIX) {
      return this.errMsgs.decryptFile.fileFormat;
    }

    headerReader.readBytes(nacl.box.publicKeyLength); // recipientPubKey
    const senderPubKey = headerReader.readBytes(nacl.box.publicKeyLength);
    const nonce = headerReader.readBytes(nacl.secretbox.nonceLength);
    const secret = fromBase32(secretCode);
    const secretKey = deriveSecretKey(secret, passPhrase);

    cb('read', 0);
    const encrypted = await readFile(file.slice(FILE_HEADER_SIZE), loaded => {
      cb('read', loaded);
    });
    cb('read_end');

    cb('decrypt_begin');
    const decrypted = await workerDecrypt(
      encrypted.buffer,
      nonce.buffer,
      senderPubKey.buffer,
      secretKey.buffer,
    );
    cb('decrypt_end');

    if (!decrypted) {
      return this.errMsgs.decryptFile.decrypt;
    }

    const reader = new DataReader(decrypted);
    reader.readInt8(); // version
    const fileCount = reader.readInt32();
    const files: { filename: string; data: Uint8Array }[] = [];
    for (let i = 0; i < fileCount; i++) {
      const filename = reader.readString();
      const data = reader.readUint8Array();
      files.push({ filename: filename, data: data });
    }
    return files;
  }
}
