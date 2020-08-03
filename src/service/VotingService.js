import { promisify } from 'util';
import sha256 from 'sha256';
import dotenv from 'dotenv';
import validator from '../helpers/auth';
import { redisClient } from '../adapter/redis';
import DB from '../database/utils';
import configDB from '../database/configDB';
import connection from '../database/connect';
import sender from '../helpers/sender';

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
export const CreateVoting = async (
  hash,
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
  if (timeCreating >= dueDate) {
    return { code: 422, payload: { message: 'Invalid due date' } };
  }
  if (description.length > 256) {
    return { code: 422, payload: { message: 'Description is bigger than 256 characters' } };
  }
  if (variants.length < 2 || variants.length > 5) {
    return { code: 422, payload: { message: 'Incorrect amount of variants' } };
  }
  const user = await DB.getUser(conn, username);
  let response;
  const votingHash = sha256(hash.concat(dueDate).concat(variants.toString()));
  try {
    // eslint-disable-next-line max-len
    const props = [hash, votingHash, dueDate, variants.toString(), excludedUsers.toString(), description, user[0].folder];
    response = await sender.sendToFabric(username, 'createVoting', props);
  }
  catch (error) {
    return { code: 418, payload: { message: error } };
  }
  let resp;
  switch (response.message) {
    case ('You need to share this file with somebody'):
      resp = { code: 403, payload: { message: response.message } };
      break;
    case ('User does not have permission'):
      resp = { code: 422, payload: { message: response.message } };
      break;
    case ('File with this hash does not exist'):
      resp = { code: 404, payload: { message: response.message } };
      break;
    case ('You can`t create voting without voters'):
      resp = { code: 422, payload: { message: response.message } };
      break;
    default:
      resp = { code: 201, payload: { response } };
  }
  return resp;
};

/**
 * Get voting list
 * User can get voting list of owned files or shared files
 *
 * no response value expected for this operation
 * */
export const GetVoting = async (token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const user = (await DB.getUser(conn, username))[0];
  let response;
  try {
    const props = [user.folder];
    response = await sender.sendToFabric(username, 'getVoting', props);
  }
  catch (error) {
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
export const UpdateVoting = async (hash, variant, token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  let response;
  try {
    const props = [hash, variant];
    response = await sender.sendToFabric(username, 'updateVoting', props);
  }
  catch (error) {
    return { code: 418, payload: { message: error } };
  }
  let resp;
  switch (response.message) {
    case ('You have already voted in this vote'):
      resp = { code: 409, payload: { message: response.message } };
      break;
    case ('Variant does not exist'):
      resp = { code: 422, payload: { message: response.message } };
      break;
    case ('User does not have permission'):
      resp = { code: 403, payload: { message: response.message } };
      break;
    case ('Voting does not exist'):
      resp = { code: 422, payload: { message: response.message } };
      break;
    default:
      resp = { code: 200, payload: { response } };
  }
  return resp;
};
