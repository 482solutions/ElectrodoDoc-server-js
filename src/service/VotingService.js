import { promisify } from 'util';
import dotenv from 'dotenv';
import validator from '../helpers/auth';
import { redisClient } from '../adapter/redis';
import DB from '../database/utils';
import configDB from '../database/configDB';
import connection from '../database/connect';

dotenv.config();
const conn = connection(configDB);
const redisGet = promisify(redisClient.get).bind(redisClient);
/**
 * Create voting
 * Owner can create voting on file
 *
 * body Voting
 * no response value expected for this operation
 * */
export const createVoting = async (
  hash,
  cid,
  dueDate,
  variants,
  excludedUsers,
  description,
  token,
) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const timeCreating = Math.floor(new Date() / 1000);
  if (timeCreating > dueDate) {
    return { code: 422, payload: { message: 'Invalid due date' } };
  }
  if (!description || description.length > 260 || description.trim().length < 1) {
    return { code: 422, payload: { message: 'Description is not correct' } };
  }
  if (variants.length < 2 || variants.length > 5) {
    return { code: 422, payload: { message: 'Incorrect amount of variants' } };
  }
  const certsList = await DB.getCerts(conn, username);
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
      transaction: {
        name: 'createVoting',
        props: [hash, cid, dueDate, variants, excludedUsers, description],
      },
    });
  } catch (error) {
    return { code: 418, payload: { message: error } };
  }
  if (response.message) {
    return { code: 404, payload: { message: response.message } };
  }
  return { code: 201, payload: { response } };
};

/**
 * Get voting list
 * User can get voting list of owned files or shared files
 *
 * no response value expected for this operation
 * */
export const getVoting = async (token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const user = (await DB.getUser(conn, username))[0];
  const certsList = await DB.getCerts(conn, username);
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
      transaction: {
        name: 'getVoting',
        props: [user.folder],
      },
    });
  } catch (error) {
    return { code: 418, payload: { message: error } };
  }
  if (response.message) {
    return { code: 422, payload: { message: response.message } };
  }
  return { code: 200, payload: { response } };
};

/**
 * User vote
 * User can vote in file if have permissions
 *
 * body Vote
 * no response value expected for this operation
 * */
export const updateVoting = async (variant, token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  return { code: 200, payload: { message: 'OK' } };
};
