import { KEYUTIL, KJUR } from 'jsrsasign'

export const getCSR = (userData) => {
  const kp = KEYUTIL.generateKeypair('EC', 'secp256r1');
  const privateHex = kp.prvKeyObj.prvKeyHex;

  const privateKeyPem = KEYUTIL.getPEM(kp.prvKeyObj, 'PKCS8PRV');
  const publicKeyPem = KEYUTIL.getPEM(kp.pubKeyObj, 'PKCS8PUB');

  const { username } = userData;
  const country = 'UA';
  const state = 'Odessa';
  const city = 'Odessa';
  //-----------------
  const csrPem = KJUR.asn1.csr.CSRUtil.newCSRPEM({
    subject: { str: `/CN=${username}/C=${country}/ST=${state}/O=Hyperledger/OU=Fabric/L=${city}` },
    ext: [
      { subjectAltName: { array: [{ dns: 'domain.net' }] } },
    ],
    sbjpubkey: publicKeyPem,
    sigalg: 'SHA256withECDSA',
    sbjprvkey: privateKeyPem,
  });
  return { csrPem, privateHex, privateKeyPem };
};
