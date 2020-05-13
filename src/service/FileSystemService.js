'use strict';
const sha256 = require('sha256');
const {promisify} = require("util");

const configDB = require('../database/configDB');
const connection = require('../database/connect');
const validator = require('../helpers/auth')
const {redis} = require('../adapter/redis')

const DB = require('../database/utils');
const {FileStorage} = require('../FileStorage');
const redisGet = promisify(redis.get).bind(redis);
const conn = connection(configDB);

const {IPFS_API_URL} = process.env;
const fileStorage = new FileStorage(IPFS_API_URL);

/**
 * Create folder
 * Creating folder by user
 *
 * name - folder name
 * parentFolderHash - name of parent folder if exist
 * no response value expected for this operation
 **/
exports.createFolder = async (name, parentFolderHash, token) => {
    const folderHash = sha256(name.concat(parentFolderHash))
    const blackToken = await redisGet(token);
    if (blackToken != null) {
        return {code: 203, payload: "Not Authorized"};
    }

    if (!name) {
        return {code: 422, payload: 'Name is not specified'};
    }
    if (!parentFolderHash) {
        return {code: 422, payload: 'Cant create folder without parent folder'};
    }

    const folderList = await DB.getFolder(conn, parentFolderHash);
    if (folderList.length === 0) {
        return {code: 404, payload: 'Parent folder not found.'};
    }

    const childrenFolders = JSON.parse(folderList[0].folders);
    console.log("from database", childrenFolders)
    for (let item in childrenFolders) {
        if (childrenFolders[item].name === name) {
            return {code: 409, payload: 'Folder with the same already exist'};
        }
    }
    const child = {
        name: name, hash: folderHash
    }
    childrenFolders.push(child);
    console.log("result child:", childrenFolders);
    await DB.insertFolder(conn, name, folderHash, parentFolderHash);
    await DB.updateFolder(conn, parentFolderHash, 'folders', JSON.stringify(childrenFolders))

    const folderListAfter = await DB.getFolder(conn, parentFolderHash);
    return {code: 201, payload: {folder: folderListAfter[0]}};
}

/**
 * Retrieves file's contents as a string
 *
 * @param {string|CID} cid - IPFS identifier of the file
 * @param {string} token
 *
 * @returns {string} file contents
 */
exports.downloadFile = async (cid, token) => {
    const blackToken = await redisGet(token);
    if (blackToken != null) {
        return {code: 203, payload: "Not Authorized"};
    }
    const file = fileStorage.getFileByHash(cid);
    if (file === null) {
        return {code: 404, payload: 'File not found.'};
    }

    return {code: 200, payload: file};
}


/**
 * Get folder
 * Geting folder means that user will receive the contents of the folder (files and folders)
 *
 * body Body_1
 * no response value expected for this operation
 **/
exports.getFolder = async (hash, token) => {
    const blackToken = await redisGet(token);
    if (blackToken != null) {
        return {code: 203, payload: "Not Authorized"};
    }
    const folderList = await DB.getFolder(conn, hash);

    if (folderList.length === 0) {
        return {code: 404, payload: 'folder not found.'};
    }
    return {code: 200, payload: {folder: folderList[0]}};
}


/**
 * Saves file to IPFS and adds returned `cid` to parent folder's `files` list
 *
 * @param {string} name
 * @param {string} parentName
 * @param {string|Buffer} contents file data
 * @param {} token
 *
 * @returns {object} parent updated parent folder
 **/
exports.uploadFile = async (name, parentName, contents, token) => {
    const blackToken = await redisGet(token);
    if (blackToken != null) {
        return {code: 203, payload: "Not Authorized"};
    }

    if (!name) {
        return {code: 422, payload: 'Name is not specified'};
    }
    if (!parentName) {
        return {code: 422, payload: 'Cant create folder without parent folder'};
    }

    // Add validation
    const cid = await fileStorage.upload(contents);
    /* Get list of files in parent folder */
    const parentFolder = (await DB.getFolder(conn, parentName))[0];

    if (parentFolder === null) {
        return {code: 404, payload: 'Parent folder not found.'};
    }
    const {files} = parentFolder;
    files.push({name, hash: cid});
    await DB.insertFile(conn, name, cid, parentFolder.hash)
    await DB.updateFolder(conn, parentFolder.hash, 'files', JSON.stringify(files));
    const folderListAfter = await DB.getFolder(conn, parentName)[0];
    return {code: 200, payload: folderListAfter};
}

/**
 * Search
 * Search folders and files means that user will receive folder or file if exist
 *
 * name String The folder or file name
 * no response value expected for this operation
 **/
exports.search = async (name, token) => {
    const blackToken = await redisGet(token);
    if (blackToken != null) {
        return {code: 203, payload: "Not Authorized"};
    }
    if (!name) {
        return {code: 422, payload: 'File name is not specified'};
    }
    const folders = await DB.getFolderByName(conn, name)
    const files = await DB.getFileByName(conn, name)
    if(files.length === 0 && folders.length === 0){
        return {code: 404, payload: "Files or folders does not exist"};
    }
    return {code: 200, payload: {folders: folders, files: files}};
}

