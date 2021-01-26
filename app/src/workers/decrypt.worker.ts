import nacl from 'tweetnacl';

export const workerDecrypt = async (
  data: ArrayBuffer,
  nonce: ArrayBuffer,
  publicKey: ArrayBuffer,
  secretKey: ArrayBuffer,
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const decrypted = nacl.box.open(
    new Uint8Array(data),
    new Uint8Array(nonce),
    new Uint8Array(publicKey),
    new Uint8Array(secretKey),
  );
  return decrypted;
};
