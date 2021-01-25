import nacl from 'tweetnacl';

export const workerEncrypt = async (
  publicKey: ArrayBuffer,
  secretKey: ArrayBuffer,
  data: ArrayBuffer,
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const encrypted = nacl.box(
    new Uint8Array(data),
    nonce,
    new Uint8Array(publicKey),
    new Uint8Array(secretKey),
  );
  return { nonce: nonce, data: encrypted };
};
