import { promisify } from 'util';
import validator from '../helpers/auth';
import { redisClient } from '../adapter/redis';
import DB from '../database/utils';
import connection from '../database/connect';
import configDB from '../database/configDB';

const conn = connection(configDB);
const redisGet = promisify(redisClient.get).bind(redisClient);
/**
 * Change permissions
 * After change permissions target user get selected permittions for file or folder
 *
 * body ChangePermissions
 * no response value expected for this operation
 * */
export const changePermissions = async (email, hash, permission, token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }

  const userThatShared = (await DB.getUser(conn, username))[0];

  const users = await DB.getUserByEmail(conn, email);
  if (users.length === 0) {
    return { code: 422, payload: { message: 'User for sharing not found.' } };
  }
  const userForShare = users[0];
  const certsList = await DB.getCerts(conn, username);
  let request;
  switch (permission) {
    case ('owner'):
      request = {
        name: 'changeOwnership',
        props: [hash, userForShare.username, userThatShared.folder, userForShare.folder],
      };
      break;
    case ('read'):
      request = {
        name: 'changePermissions',
        props: [hash, userForShare.username, 'allow', 'read', userForShare.folder],
      };
      break;
    case ('write'):
      request = {
        name: 'changePermissions',
        props: [hash, userForShare.username, 'allow', 'write', userForShare.folder],
      };
      break;
    default:
      return { code: 422, payload: { message: 'No such permissions' } };
  }
  let response;
  try {
    response = await validator.sendTransaction({
      identity: {
        label: username,
        certificate: certsList[0].cert,
        privateKey: certsList[0].privatekey,
        mspId: '482solutions',
      },
      network: {
        channel: 'testchannel',
        chaincode: 'electricitycc',
        contract: 'org.fabric.marketcontract',
      },
      transaction: request,
    });
  } catch (error) {
    return { code: 418, payload: { message: error } };
  }

  console.log(response);
  return { code: 200, payload: { response } };
};
