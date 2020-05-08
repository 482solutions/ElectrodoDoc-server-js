'use strict';


/**
 * Create folder
 * Creating folder by user
 *
 * name - folder name
 * parentFolder - name of parent folder if exist
 * no response value expected for this operation
 **/
exports.createFolder = function (name, parentFolder) {
    return new Promise(function (resolve, reject) {
        resolve();
    });
}


/**
 * Download file
 * Downloading file from current folder
 *
 * body Body_3
 * no response value expected for this operation
 **/
exports.downloadFile = function (hash) {
    return new Promise(function (resolve, reject) {
        resolve();
    });
}


/**
 * Get folder
 * Geting folder means that user will receive the contents of the folder (files and folders)
 *
 * body Body_1
 * no response value expected for this operation
 **/
exports.getFolder = function (hash) {
    return new Promise(function (resolve, reject) {
        resolve();
    });
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
exports.uploadFile = function (name, parentFolder, file) {
    return new Promise(function (resolve, reject) {
        resolve();
    });
}

