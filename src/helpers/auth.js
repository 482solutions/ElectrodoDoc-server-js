import fs from 'fs';
import { Gateway, InMemoryWallet, X509WalletMixin } from 'fabric-network';
import jwt from 'jsonwebtoken';
import yaml from 'js-yaml';
import path from 'path';

const issuer = '482solutions';

exports.verifyToken = function verifyToken(req, authOrSecDef, token, callback) {
  function sendError() {
    return { code: 404, payload: { message: 'Invalid token supplied.' } };
  }

  if (token && token.indexOf('Bearer ') === 0) {
    const tokenString = token.split(' ')[1];
    jwt.verify(tokenString, '482solutions', (verificationError, decodedToken) => {
      if (verificationError === null && decodedToken) {
        const issuerMatch = decodedToken.issuer === issuer;
        if (issuerMatch) {
          req.auth = decodedToken;
          return callback(null);
        }
        return callback(sendError());
      }
      return callback(sendError());
    });
  }
  return callback(sendError());
};

exports.issueToken = function issueToken(username) {
  return jwt.sign({ name: username, issuer }, '482solutions', { expiresIn: '1h' });
};

exports.validationPrivateKey = (string) => {
  const privateKey = string.toString().trim();
  return privateKey.startsWith('-----BEGIN PRIVATE KEY-----') && privateKey.endsWith('-----END PRIVATE KEY-----');
};
exports.validationCertificate = (string) => {
  const certificate = string.toString().trim();
  return certificate.startsWith('-----BEGIN CERTIFICATE-----') && certificate.endsWith('-----END CERTIFICATE-----');
};
exports.validationCSR = (string) => {
  const csr = string.toString().trim();
  return csr.startsWith('-----BEGIN CERTIFICATE REQUEST-----') && csr.endsWith('-----END CERTIFICATE REQUEST-----');
};

exports.getUserFromToken = async(token) => {
  if (token && token.indexOf('Bearer ') === 0) {
    const tokenString = token.split(' ')[1];
    try {
      return (await jwt.verify(tokenString, '482solutions'.toString('base64'))).data;
    } catch (e) {
      return null;
    }
  }
  return null;
};

exports.sendTransaction = async({ identity, transaction, network: networkOptions }) => {
  const wallet = new InMemoryWallet();
  const mixin = X509WalletMixin.createIdentity(
    identity.mspId,
    identity.certificate,
    identity.privateKey,
  );
  await wallet.import(identity.label, mixin);
  const gateway = new Gateway();
  try {
    const connectionProfile = yaml.safeLoad(
      fs.readFileSync(path.resolve(__dirname, process.env.FABRIC_CONFIG_FILE), 'utf8'),
    );
    const connectionOptions = {
      identity: identity.label,
      wallet,
      discovery: { enabled: false, asLocalhost: true },
    };
    await gateway.connect(connectionProfile, connectionOptions);
    const network = await gateway.getNetwork(networkOptions.channel);
    const contract = await network.getContract(networkOptions.chaincode, networkOptions.contract);
    const issueResponse = await contract.submitTransaction(transaction.name, ...transaction.props);
    gateway.disconnect();
    return JSON.parse(issueResponse.toString());
  } catch (error) {
    console.log(`Error processing transaction. ${error.stack}`);
    gateway.disconnect();
    return null;
  }
};
