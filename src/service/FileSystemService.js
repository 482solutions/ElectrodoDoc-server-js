'use strict';
const sha256 = require('sha256');
const {promisify} = require("util");

const configDB = require('../database/configDB');
const connection = require('../database/connect');
const validator = require('../helpers/auth')
const {redis} = require('../adapter/redis')

const DB = require('../database/utils');
const redisGet = promisify(redis.get).bind(redis);
const conn = connection(configDB);

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
 * Download file
 * Downloading file from current folder
 *
 * body Body_3
 * no response value expected for this operation
 **/
exports.downloadFile = async (hash, token) => {
    const blackToken = await redisGet(token);
    if (blackToken != null) {
        return {code: 203, payload: "Not Authorized"};
    }
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
        return {code: 404, payload: 'Parent folder not found.'};
    }
    return {code: 200, payload: {folder: folderList[0]}};
}


/**
 * Upload file
 * Uploading file in current folder
 *
 * name String
 * parentFolder String
 * file File The file to upload.
 * no response value expected for this operation
 **/
exports.uploadFile = async (name, parentFolder, file, token) => {
    const blackToken = await redisGet(token);
    if (blackToken != null) {
        return {code: 203, payload: "Not Authorized"};
    }
}

