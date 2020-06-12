import { promisify } from 'util';
import validator from '../helpers/auth';
import { redisClient } from '../adapter/redis';

const redisGet = promisify(redisClient.get).bind(redisClient);
/**
 * Change permissions
 * After change permissions target user get selected permittions for file or folder
 *
 * body ChangePermissions
 * no response value expected for this operation
 * */
export const ChangePermissions = async (email, hash, permission, token) => {
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
