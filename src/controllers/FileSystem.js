'use strict';

const utils = require('../utils/writer.js');
const FileSystem = require('../service/FileSystemService');

module.exports.createFolder = function createFolder(req, res, next) {
    const token = req.headers['authorization']
    const body = req.swagger.params['body'].value;
    FileSystem.createFolder(body.name, body.parentFolder, token)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.downloadFile = function downloadFile(req, res, next) {
    const token = req.headers['authorization']
    const body = req.swagger.params['body'].value;
    FileSystem.downloadFile(body.hash, token)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.getFolder = function getFolder(req, res, next) {
    const token = req.headers['authorization']
    const body = req.swagger.params['body'].value;
    FileSystem.getFolder(body.hash, token)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.uploadFile = function uploadFile(req, res, next) {
    const token = req.headers['authorization']
    const name = req.swagger.params['name'].value;
    const parentFolder = req.swagger.params['parentFolder'].value;
    const file = req.swagger.params['file'].value;
    FileSystem.uploadFile(name, parentFolder, file, token)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
