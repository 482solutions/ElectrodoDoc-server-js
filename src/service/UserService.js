import fs from 'fs';
import sha256 from 'sha256';
import path from 'path';
import jwt from 'jsonwebtoken';
import FabricCAServices from 'fabric-ca-client';
// import hfc, { User } from 'fabric-client'
import { promisify } from 'util';
import dotenv from 'dotenv';

import { Gateway, Wallets } from 'fabric-network';

import yaml from 'js-yaml';
import validator from '../helpers/auth';
import configDB from '../database/configDB';
import connection from '../database/connect';
import DB from '../database/utils';
import { redisClient } from '../adapter/redis';

// "fabric-ca-client": "^2.2.18",
//     "fabric-client": "^1.4.20",
//     "fabric-network": "^2.2.18",

dotenv.config();

const HOST = process.env.FABRIC_HOST || '172.28.0.3';
const PORT = process.env.FABRIC_PORT || 7054;

const ca = new FabricCAServices(`https://${HOST}:${PORT}`);
const conn = connection(configDB);
const redisGet = promisify(redisClient.get).bind(redisClient);
// const client = new hfc()
/**
 * Update user password
 * Changing user credentials
 *
 * body Body
 * no response value expected for this operation
 * */
export const changeUser = async (oldPassword, newPassword, token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }

  if (oldPassword === newPassword) {
    return { code: 422, payload: 'You cannot change the password to the same' };
  }

  if (!newPassword || newPassword.length !== 64) {
    return { code: 422, payload: 'New password is empty' };
  }

  let users;
  try {
    users = await DB.getUser(conn, username);
  } catch (e) {
    return { code: 500, payload: { message: 'Something happened with database connection.' } };
  }
  if (users.length === 0) {
    return { code: 404, payload: { message: 'User not found.' } };
  }

  const user = users[0];
  if (oldPassword !== user.password) {
    return { code: 422, payload: { message: 'Invalid password supplied.' } };
  }

  await DB.updateUser(conn, username, 'password', newPassword);
  return { code: 200, payload: { message: 'User password successfully changed.' } };
};

/**
 * Create user
 * After registration user receive Certificate for Fabric CA
 *
 * login String
 * email String
 * password String
 * csr byte[]
 * no response value expected for this operation
 * */
export const createUser = async (login, email, password, privateKey, csr) => {
  if (!login || !login.match(/^[a-zA-Z0-9-_.]{2,20}$/g)) {
    return { code: 422, payload: { message: 'Username is not specified' } };
  }
  if (!email || !email.match(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g,
  )) {
    return { code: 422, payload: { message: 'Email is not specified' } };
  }
  if (!password || password.length !== 64) {
    return { code: 422, payload: { message: 'Password is invalid' } };
  }

  if (!csr || !validator.validationCSR(csr)) {
    return { code: 422, payload: { message: 'CSR is not correct' } };
  }

  const userList = await DB.getUser(conn, login);
  if (userList.length !== 0) {
    return { code: 409, payload: { message: 'User with the same name already exists.' } };
  }

  const folder = sha256(login);

  /**
   *
   * @type {FabricCAServices.IEnrollResponse}
   * 
   */
  const adminData = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
  const identity = {
    label: 'client',  //role ?
    certificate: adminData.certificate, //credentials: {]
    privateKey: adminData.key.toBytes(),
    mspId: 'Org1MSP',
  };

  const wallet = await Wallets.newInMemoryWallet();

  const x509Identity = {
    credentials: {
      certificate: adminData.certificate,
      privateKey: adminData.key.toBytes(),
    },
    mspId: identity.mspId,
    type: 'X.509',
  };
  await wallet.put('admin', x509Identity);

  const mixin = {
    credentials: {
        certificate: identity.certificate,
        privateKey: identity.privateKey,
    },
    mspId: identity.mspId,
    type: 'X.509',
  };

  await wallet.put(identity.label, mixin); // useless bullshit, why 'client' not 'login'

  const gateway = new Gateway();

  try {
    const connectionProfile = yaml.load(
      fs.readFileSync(path.resolve(__dirname, process.env.FABRIC_CONFIG_FILE), 'utf8'),
    );
    const connectionOptions = {
      identity: identity.label,
      wallet,
      discovery: { enabled: false, asLocalhost: true },
    };

    await gateway.connect(connectionProfile, connectionOptions);
    // const admin = await gateway.getCurrentIdentity();

    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
			throw {
				status: 401,
				message: 'An identity for the admin user does not exist in the wallet. Enroll the admin user before retrying'
			};
		}
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
		const admin = await provider.getUserContext(adminIdentity, 'admin');

    const secret = await ca.register({
      enrollmentID: login,
      enrollmentSecret: password, // ? 
      role: 'peer', // CLIENT!!!
      affiliation: 'org1.department1',
      maxEnrollments: -1,
    }, admin);

    const userData = await ca.enroll({
      enrollmentID: login,
      enrollmentSecret: secret,
      csr, // ???
    });

    // SRP (*S*OLID)
    await validator.sendTransaction({
      identity: {
        label: login,
        certificate: userData.certificate,
        privateKey, // userData.key.toBytes() !!!!!
        mspId: 'Org1MSP', // Org1MSP
      },
      network: {
        channel: 'mychannel',
        chaincode: 'wodencc',
        contract: 'org.fabric.wodencontract',
      },
      transaction: {
        name: 'saveFolder',
        props: [login, folder, 'root'],
      },
    });
    gateway.disconnect(); // move to finally 
    await DB.insertUser(conn, login, password, email, folder);
    await DB.insertCertData(conn, login, userData.certificate, privateKey);
    return { code: 201, payload: { cert: userData.certificate } };
  } catch (error) {
    // Disconnect from the gateway
    gateway.disconnect();
    return { code: 400, payload: { message: error } };
  }
};

/**
 * Login user into the system
 * Authentication for users to get in to the system and receive JWT token
 *
 * login String
 * password String
 * certificate byte[]
 * privateKey byte[]
 * no response value expected for this operation
 * */
export const logIn = async (login, password, certificate, privateKey) => {
  if (!login) {
    return { code: 422, payload: { message: 'Invalid username/email supplied.' } };
  }
  if (!password || password.length !== 64) {
    return { code: 422, payload: { message: 'Invalid password supplied.' } };
  }
  if (!validator.validationCertificate(certificate)) {
    return { code: 422, payload: { message: 'Certificate is not correct' } };
  }
  if (!validator.validationPrivateKey(privateKey)) {
    return { code: 422, payload: { message: 'Private Key is not correct' } };
  }
  let users = await DB.getUser(conn, login);
  if (users.length === 0) {
    users = await DB.getUserByEmail(conn, login);
    if (users.length === 0) {
      return { code: 404, payload: { message: 'User not found.' } };
    }
  }

  const user = users[0];
  if (user.password !== password) {
    return { code: 400, payload: { message: 'Invalid password supplied.' } };
  }
  const response = await validator.sendTransaction({
    identity: {
      label: user.username,
      certificate,
      privateKey,
      mspId: 'Org1MSP',
    },
    network: {
      channel: 'mychannel',
      chaincode: 'wodencc',
      contract: 'org.fabric.wodencontract',
    },
    transaction: {
      name: 'getFolder',
      props: [user.folder],
    },
  });
  if (response === null
    || response.folder.ownerId !== user.username) {
    return { code: 403, payload: { message: 'Invalid certificate/private key supplied.' } };
  }

  const token = jwt.sign({ data: user.username, issuer: '482solutions' },
    '482solutions',
    { expiresIn: '1h' });
  return { code: 200, payload: { message: 'Welcome', token, folder: user.folder } };
};

/**
 * Logout user from the system
 * Manually exit from the system
 *
 * no response value expected for this operation
 * */
export const logout = async (token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  await redisClient.set(token, username, 'EX', 60 * 60);
  return { code: 200, payload: { message: 'User successfully logout.' } };
};
