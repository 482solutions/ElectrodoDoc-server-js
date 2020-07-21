import validator from '../helpers/auth';
import { redisClient } from '../adapter/redis';
const redisGet = promisify(redisClient.get).bind(redisClient);
/**
 * Create voting
 * Owner can create voting on file
 *
 * body Voting
 * no response value expected for this operation
 **/
export const createVoting = async (hash, cid, dueDate, variants, excludedUsers, decription, token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
}


/**
 * Get voting list
 * User can get voting list of owned files or shared files
 *
 * no response value expected for this operation
 **/
export const getVoting = async (token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
}


/**
 * User vote
 * User can vote in file if have permissions
 *
 * body Vote
 * no response value expected for this operation
 **/
export const updateVoting = async (variant, token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
}

