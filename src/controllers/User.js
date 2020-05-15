'use strict';
const utils = require('../utils/writer.js');
const User = require('../service/UserService');

module.exports.ChangeUser = function changeUser(req, res, next) {
    const token = req.headers['authorization']
    const body = req.swagger.params['body'].value;
    User.changeUser(body.oldPassword, body.newPassword, token)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.CreateUser = function createUser(req, res, next) {
    const body = req.swagger.params['body'].value;

    User.createUser(body.login, body.email, body.password, body.CSR)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.Login = function login(req, res, next) {
    const body = req.swagger.params['body'].value;
    User.login(body.login, body.password, body.certificate, body.privateKey)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.Logout = function logout(req, res, next) {
    const token = req.headers['authorization']
    User.logout(token)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
