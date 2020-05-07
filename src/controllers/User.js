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
    const login = req.swagger.params['login'].value;
    const email = req.swagger.params['email'].value;
    const password = req.swagger.params['password'].value;
    const csr = req.swagger.params['CSR'].value;
    User.createUser(login, email, password, csr)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.Login = function login(req, res, next) {
    const login = req.swagger.params['login'].value;
    const password = req.swagger.params['password'].value;
    const certificate = req.swagger.params['certificate'].value;
    const privateKey = req.swagger.params['privateKey'].value;
    User.login(login, password, certificate, privateKey)
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
