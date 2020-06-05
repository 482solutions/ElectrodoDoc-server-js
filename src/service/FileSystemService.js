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
  console.log("username ", username)
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

  const certsList = await DB.getCerts(conn, username);
  const response = await validator.sendTransaction({
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
      name: 'saveFolder',
      props: [name, folderHash],
    },
  });
  console.log("Save folder in FileSystemService", response)

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

  const fileFromDB = (await DB.getFile(conn, hash));
  if (fileFromDB.length === 0) {
    return { code: 404, payload: { message: 'File not found.' } };
  }
  const file = await fileStorage.getFileByHash(cid);
  if (file === null) {
    return { code: 404, payload: { message: 'File not found.' } };
  }

  const certsList = await DB.getCerts(conn, username);
  const response = await validator.sendTransaction({
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
      name: 'getFile',
      props: [hash],
    },
  });
  console.log("get file in FileSystemService", response)

  return { code: 200, payload: { name: fileFromDB[0].name, type: fileFromDB[0].type, file } };
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
  const certsList = await DB.getCerts(conn, username);
  const response = await validator.sendTransaction({
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
      name: 'getFolder',
      props: [hash],
    },
  });
  console.log("get folder in FileSystemService", response)

  return { code: 200, payload: { folder: folderList[0] } };
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

  const fileHash = sha256(name.concat(parentFolderHash));
  const cid = (await fileStorage.upload(contents.buffer)).toString();
  /* Get list of files in parent folder */
  const parentFolder = (await DB.getFolder(conn, parentFolderHash))[0];

  if (parentFolder === undefined) {
    return { code: 404, payload: { message: 'Parent folder not found.' } };
  }
  const files = JSON.parse(parentFolder.files);
  files.push({ name, hash: fileHash });
  const versions = []
  const version = {
    cid, time: Math.floor(new Date() / 1000)
  };
  versions.push(version)

  const certsList = await DB.getCerts(conn, username);
  const response = await validator.sendTransaction({
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
      name: 'saveFile',
      props: [name, fileHash, cid],
    },
  });
  console.log("Save file in FileSystemService", response)

  await DB.insertFile(conn, name, fileHash, JSON.stringify(versions), parentFolder.hash, contents.mimetype);
  await DB.updateFolder(conn, parentFolder.hash, 'files', JSON.stringify(files));
  const folderListAfter = await DB.getFolder(conn, parentFolderHash);
  console.log(folderListAfter[0])
  return { code: 200, payload: { folder: folderListAfter[0] } };
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
  const cid = (await fileStorage.upload(contents.buffer)).toString();

  const certsList = await DB.getCerts(conn, username);
  const response = await validator.sendTransaction({
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
      name: 'updateFile',
      props: [ hash, cid],
    },
  });
  console.log("Update file in FileSystemService", response)

  const oldFile = (await DB.getFile(conn, hash))[0];
  if (oldFile === undefined) {
    return { code: 404, payload: { message: 'Parent folder not found.' } };
  }
  const versions = JSON.parse(oldFile.versions);
  const version = {
    cid, time: Math.floor(new Date() / 1000)
  };
  versions.push(version)
  await DB.updateFile(conn, hash, 'versions', JSON.stringify(versions));
  const fileListAfter = await DB.getFolder(conn, hash);
  console.log(fileListAfter[0])
  return { code: 200, payload: { file: fileListAfter[0] } };
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

  const fileFromDB = (await DB.getFile(conn, hash));
  if (fileFromDB.length === 0) {
    return { code: 404, payload: { message: 'File not found.' } };
  }

  const certsList = await DB.getCerts(conn, username);
  const response = await validator.sendTransaction({
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
      name: 'getFile',
      props: [hash],
    },
  });

  if (response.versions === undefined){
    return { code: 404, payload: { message: 'File does not exist in ledger' } };
  }
  console.log("get folder in FileSystemService", response)
  return { code: 200, payload: { message: fileFromDB[0].versions } };
};
