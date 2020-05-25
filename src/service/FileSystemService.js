import sha256 from 'sha256';
import { promisify } from 'util';

import validator from '../helpers/auth';
import configDB from '../database/configDB';
import connection from '../database/connect';
import { redisClient } from '../adapter/redis';


import DB from '../database/utils';
import { FileStorage } from '../FileStorage';


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

  const folderList = await DB.getFolder(conn, parentFolderHash);
  if (folderList.length === 0) {
    return { code: 404, payload: { message: 'Parent folder not found.' } };
  }

  const childrenFolders = JSON.parse(folderList[0].folders);
  for (const item in childrenFolders) {
    if (childrenFolders[item].name === name) {
      return { code: 409, payload: { message: 'Folder with the same already exist' } };
    }
  }
  const child = {
    name, hash: folderHash,
  };
  childrenFolders.push(child);
  await DB.insertFolder(conn, name, folderHash, parentFolderHash);
  await DB.updateFolder(conn, parentFolderHash, 'folders', JSON.stringify(childrenFolders));

  const folderListAfter = await DB.getFolder(conn, parentFolderHash);
  return { code: 201, payload: { folder: folderListAfter[0] } };
};

/**
 * Retrieves file's contents as a string
 *
 * @param {string|CID} cid - IPFS identifier of the file
 * @param {string} token
 *
 * @returns {string} file contents
 */
export const DownloadFile = async (cid, token) => {
  if (!token) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }
  const username = await validator.getUserFromToken(token);
  const blackToken = await redisGet(token);
  if (!username || blackToken != null) {
    return { code: 203, payload: { message: 'Not Authorized' } };
  }

  const fileFromDB = (await DB.getFile(conn, cid))[0];
  const file = await fileStorage.getFileByHash(cid);
  if (file === null) {
    return { code: 404, payload: { message: 'File not found.' } };
  }
  return { code: 200, payload: { name: fileFromDB.name, type: fileFromDB.type, file } };
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
  const folderList = await DB.getFolder(conn, hash);

  if (folderList.length === 0) {
    return { code: 404, payload: { message: 'folder not found.' } };
  }
  return { code: 200, payload: { folder: folderList[0] } };
};


/**
 * Saves file to IPFS and adds returned `cid` to parent folder's `files` list
 *
 * @param {string} name
 * @param {string} parentName
 * @param {string|Buffer} contents file data
 * @param {} token
 *
 * @returns {object} parent updated parent folder
 * */
export const UploadFile = async (name, parentName, contents, token) => {
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
  if (!parentName) {
    return { code: 422, payload: { message: 'Cant create folder without parent folder' } };
  }

  const cid = (await fileStorage.upload(contents.buffer)).toString();
  /* Get list of files in parent folder */
  const parentFolder = (await DB.getFolder(conn, parentName))[0];

  if (parentFolder === undefined) {
    return { code: 404, payload: { message: 'Parent folder not found.' } };
  }
  const files = JSON.parse(parentFolder.files);

  files.push({ name, hash: cid });
  await DB.insertFile(conn, name, cid, parentFolder.hash, contents.mimetype);
  await DB.updateFolder(conn, parentFolder.hash, 'files', JSON.stringify(files));
  const folderListAfter = await DB.getFolder(conn, parentName);
  return { code: 200, payload: { folder: folderListAfter[0] } };
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
