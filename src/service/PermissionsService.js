import { promisify } from 'util';
import dotenv from 'dotenv';
import validator from '../helpers/auth';
import { redisClient } from '../adapter/redis';
import DB from '../database/utils';
import connection from '../database/connect';
import configDB from '../database/configDB';
import sender from '../helpers/sender';

dotenv.config();
const conn = connection(configDB);
const redisGet = promisify(redisClient.get).bind(redisClient);
/**
 * Change permissions
 * After change permissions target user get selected permissions for file or folder
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
  if (!permission || permission.length < 4 || permission.length > 5) {
    return { code: 422, payload: { message: 'Incorrect permissions' } };
  }
  const userThatShared = (await DB.getUser(conn, username))[0];
  let users = await DB.getUserByEmail(conn, email);
  if (users.length === 0) {
    users = await DB.getUser(conn, email);
    if (users.length === 0) {
      return { code: 422, payload: { message: 'User for sharing not found' } };
    }
  }
  if (!hash || hash.length < 64) {
    return { code: 422, payload: { message: 'Incorrect hash' } };
  }
  const userForShare = users[0];
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
        props: [hash, userForShare.username, 'read', userForShare.folder],
      };
      break;
    case ('write'):
      request = {
        name: 'changePermissions',
        props: [hash, userForShare.username, 'write', userForShare.folder],
      };
      break;
    default:
      return { code: 422, payload: { message: 'No such permissions' } };
  }
  let response;
  try {
    response = await sender.sendToFabric(username, request.name, request.props);
  } catch (error) {
    return { code: 418, payload: { message: error } };
  }
  let resp;
  switch (response.message) {
    case ('This user is the owner of this file'):
      resp = { code: 409, payload: { message: response.message } };
      break;
    case ('This user is the editor of this file'):
      resp = { code: 409, payload: { message: response.message } };
      break;
    case ('This user is the viewer of this file'):
      resp = { code: 409, payload: { message: response.message } };
      break;
    case ('Folder for share already include this file'):
      resp = { code: 409, payload: { message: response.message } };
      break;
    case ('User does not have permission'):
      resp = { code: 422, payload: { message: response.message } };
      break;
    case ('File with this hash does not exist'):
      resp = { code: 422, payload: { message: response.message } };
      break;
    default:
      resp = { code: 200, payload: { response } };
  }
  return resp;
};

/**
 * Revoke permissions
 * After revoke permissions target user not get permissions for file or folder
 *
 * body RevokePermissions
 * no response value expected for this operation
 * */
export const revokePermissions = async (email, hash, permission, token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  if (!permission || permission.length < 6 || permission.length > 7) {
    return { code: 422, payload: { message: 'Incorrect permissions' } };
  }
  let users = await DB.getUser(conn, email);
  if (users.length === 0) {
    users = await DB.getUserByEmail(conn, email);
    if (users.length === 0) {
      return { code: 422, payload: { message: 'User for revoke not found' } };
    }
  }
  if (!hash || hash.length < 64) {
    return { code: 422, payload: { message: 'Incorrect hash' } };
  }
  const userForRevoke = users[0];
  if (userForRevoke.username === username) {
    return { code: 403, payload: { message: 'User does not have permission' } };
  }
  let request;
  switch (permission) {
    case ('unread'):
      request = {
        name: 'revokePermissions',
        props: [hash, userForRevoke.username, 'read', userForRevoke.folder],
      };
      break;
    case ('unwrite'):
      request = {
        name: 'revokePermissions',
        props: [hash, userForRevoke.username, 'write', userForRevoke.folder],
      };
      break;
    default:
      return { code: 422, payload: { message: 'No such permissions' } };
  }
  let response;
  try {
    response = await sender.sendToFabric(username, request.name, request.props);
  } catch (error) {
    return { code: 418, payload: { message: error } };
  }
  let resp;
  switch (response.message) {
    case ('User does not have such permissions'):
      resp = { code: 403, payload: { message: response.message } };
      break;
    case ('This user is the editor of this file'):
      resp = { code: 409, payload: { message: response.message } };
      break;
    case ('This user is the viewer of this file'):
      resp = { code: 409, payload: { message: response.message } };
      break;
    case ('Folder for share already include this file'):
      resp = { code: 409, payload: { message: response.message } };
      break;
    case ('User does not have permission'):
      resp = { code: 422, payload: { message: response.message } };
      break;
    case ('File with this hash does not exist'):
      resp = { code: 422, payload: { message: response.message } };
      break;
    default:
      resp = { code: 200, payload: { response } };
  }
  return resp;
};
