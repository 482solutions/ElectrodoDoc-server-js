import sha256 from 'sha256';
import { promisify } from 'util';

import dotenv from 'dotenv';
import validator from '../helpers/auth';
import configDB from '../database/configDB';
import connection from '../database/connect';
import { redisClient } from '../adapter/redis';

import DB from '../database/utils';
import { FileStorage } from '../FileStorage';
import sender from '../helpers/sender';

dotenv.config();

const redisGet = promisify(redisClient.get).bind(redisClient);
const conn = connection(configDB);

const { IPFS_API_URL } = process.env;
const fileStorage = new FileStorage(IPFS_API_URL);

/**
 * Create folder
 * Creating folder by user
 *
 * name - folder name
 * parentFolderHash - name of parent folder if exist
 * no response value expected for this operation
 * */
export const CreateFolder = async (name, parentFolderHash, token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const folderHash = sha256(name.concat(parentFolderHash));

  if (!name || name.length > 20 || name.length < 1 || name.trim().length < 1) {
    return { code: 422, payload: { message: 'Name is not correct' } };
  }
  if (!parentFolderHash) {
    return { code: 422, payload: { message: 'Cant create folder without parent folder' } };
  }
  const folders = await DB.getFolderByName(conn, name);
  if (folders.length > 0) {
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].hash === folderHash) {
        return { code: 409, payload: { message: 'Folder already exist' } };
      }
    }
  }
  let response;
  try {
    const props = [name, folderHash, parentFolderHash];
    response = await sender.sendToFabric(username, 'saveFolder', props);
  } catch (error) {
    return { code: 418, payload: { message: error } };
  }
  if (response.message && response.message === 'Folder already exist') {
    return { code: 409, payload: { message: 'Folder already exist' } };
  }
  await DB.insertFolder(conn, name, folderHash);
  return {
    code: 201,
    payload: {
      folder: response.parentFolder,
      folders: response.folders,
      files: response.files,
    },
  };
};

/**
 * Retrieves file's contents as a string
 *
 * @param hash
 * @param {string|CID} cid - IPFS identifier of the file
 * @param {string} token
 *
 * @returns {string} file contents
 */
export const DownloadFile = async (hash, cid, token) => {
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
    const props = [hash];
    response = await sender.sendToFabric(username, 'getFile', props);
  } catch (error) {
    return { code: 418, payload: { message: error } };
  }

  if (response.message === 'File with this hash does not exist') {
    return { code: 404, payload: { message: 'File with this hash does not exist' } };
  }
  const cidFromFabric = (!cid || cid.length !== 46)
    ? response.versions[response.versions.length - 1].cid : cid;
  const file = await fileStorage.getFileByHash(cidFromFabric);
  if (file === null) {
    return { code: 404, payload: { message: 'File not found.' } };
  }
  return { code: 200, payload: { type: response.fileType, file, name: response.fileName } };
};

/**
 * Get folder
 * Geting folder means that user will receive the contents of the folder (files and folders)
 *
 * body Body_1
 * no response value expected for this operation
 * */
export const GetFolder = async (hash, token) => {
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
    const props = [hash];
    response = await sender.sendToFabric(username, 'getFolder', props);
  } catch (error) {
    return { code: 418, payload: { message: error } };
  }
  if (response === null) {
    return { code: 404, payload: { message: 'Folder does not exist' } };
  }
  if (response.message && response.message === 'User does not have permission') {
    return { code: 409, payload: { message: response.message } };
  }
  return {
    code: 200,
    payload: { folder: response.folder, folders: response.folders, files: response.files },
  };
};

/**
 * Saves file to IPFS and adds returned `cid` to parent folder's `files` list
 *
 * @param {string} name
 * @param parentFolderHash
 * @param {string|Buffer} contents file data
 * @param {} token
 *
 * @returns {object} parent updated parent folder
 * */
export const UploadFile = async (name, parentFolderHash, contents, token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }

  if (!name) {
    return { code: 422, payload: { message: 'Name is not specified' } };
  }
  if (!parentFolderHash) {
    return { code: 422, payload: { message: 'Cant create folder without parent folder' } };
  }
  if (!contents.buffer || contents.buffer.length === 0) {
    return { code: 422, payload: { message: 'File is required' } };
  }
  const fileHash = sha256(name.concat(parentFolderHash));
  const cid = (await fileStorage.upload(contents.buffer)).toString();
  let response;
  try {
    const props = [name, fileHash, cid, parentFolderHash, contents.mimetype];
    response = await sender.sendToFabric(username, 'saveFile', props);
  } catch (error) {
    return { code: 418, payload: { message: error } };
  }

  if (response.message && response.message === 'File already exist') {
    return { code: 409, payload: { message: 'File already exist' } };
  }
  if (response.message && response.message === 'Parent folder with this hash does not exist') {
    return { code: 404, payload: { message: 'Parent folder not found' } };
  }
  await DB.insertFile(conn, name, fileHash);
  return {
    code: 200,
    payload: {
      folder: response.parentFolder,
      folders: response.folders,
      files: response.files,
    },
  };
};

export const UpdateFile = async (hash, file, token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const cid = (await fileStorage.upload(file.buffer)).toString();
  let response;
  try {
    const props = [hash, cid];
    response = await sender.sendToFabric(username, 'updateFile', props);
  } catch (error) {
    return { code: 418, payload: { message: error } };
  }
  if (response.message === 'File with this hash does not exist') {
    return { code: 404, payload: { message: 'File with this hash does not exist' } };
  }

  return { code: 200, payload: { file: response } };
};

/**
 * Search
 * Search folders and files means that user will receive folder or file if exist
 *
 * name String The folder or file name
 * no response value expected for this operation
 * */
export const Search = async (name, token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  if (!name) {
    return { code: 422, payload: { message: 'File name is not specified' } };
  }
  const folders = await DB.getFolderByName(conn, name);
  const files = await DB.getFileByName(conn, name);
  if (files.length === 0 && folders.length === 0) {
    return { code: 404, payload: { message: 'Files or folders does not exist' } };
  }
  return { code: 200, payload: { folders, files } };
};

/**
 * Versions of file
 * Get all existing versions of file
 *
 * hash String The folder or file name
 * no response value expected for this operation
 * */
export const Versions = async (hash, token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  // const certsList = await DB.getCerts(conn, username);
  let response;
  try {
    const props = [hash];
    response = await sender.sendToFabric(username, 'getFile', props);
  } catch (error) {
    return { code: 418, payload: { message: error } };
  }

  if (response.versions === undefined) {
    return { code: 404, payload: { message: 'File not found' } };
  }
  return { code: 200, payload: { versions: response.versions } };
};

/**
 * Get folders tree
 * Get tree of folders and shared folders of user
 *
 * no response value expected for this operation
 * */
export const Tree = async (token) => {
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
    response = await sender.sendToFabric(username, 'getFolderTree', props);
  } catch (error) {
    return { code: 418, payload: { message: error } };
  }
  return { code: 200, payload: { response } };
};
