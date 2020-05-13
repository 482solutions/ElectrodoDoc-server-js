'use strict';
const fs = require('fs');
const sha256 = require('sha256');
const path = require('path');
const jwt = require('jsonwebtoken');
const FabricCAService = require('fabric-ca-client');
const {promisify} = require("util");
const validator = require('../helpers/auth')

const {InMemoryWallet, X509WalletMixin, Gateway} = require('fabric-network');
const yaml = require('js-yaml');
const configDB = require('../database/configDB');
const connection = require('../database/connect');
const DB = require('../database/utils');
const {redis} = require('../adapter/redis')

const HOST = process.env.FABRIC_HOST || '167.71.49.240';
const PORT = process.env.FABRIC_PORT || 7054;

const ca = new FabricCAService(`http://${HOST}:${PORT}`);
const conn = connection(configDB);
const redisGet = promisify(redis.get).bind(redis);
/**
 * Update user password
 * Changing user credentials
 *
 * body Body
 * no response value expected for this operation
 **/
exports.changeUser = async (oldPassword, newPassword, token) => {
    const username = validator.getUserFromToken(token)

    const blackToken = await redisGet(token);
    if (blackToken != null) {
        return {code: 203, payload: "Not Authorized"};
    }

    if (oldPassword === newPassword){
        return {code: 422, payload: "You cannot change the password to the same"};
    }

    if (!newPassword) {
        return {code: 203, payload: "New password is empty"};
    }

    let users;
    try {
        users = await DB.getUser(conn, username);
    } catch (e) {
        return {code: 500, payload: "Something happened with database connection."};
    }
    if (users.length === 0) {
        return {code: 404, payload: 'User not found.'};
    }

    const user = users[0];
    if (oldPassword !== user.password) {
        return {code: 422, payload: {message: 'Invalid password supplied.'}};
    }

    await DB.updateUser(conn, username, 'password', newPassword);
    return {code: 200, payload: 'User password successfully changed.'};
}


/**
 * Create user
 * After registration user receive Certificate for Fabric CA
 *
 * login String
 * email String
 * password String
 * csr byte[]
 * no response value expected for this operation
 **/
exports.createUser = async (login, email, password, csr) => {
    if (!login.match(/^[a-zA-Z0-9-_.]{2,20}$/g)) {
        return {code: 422, payload: 'Username is not specified'};
    }
    if (!email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g)) {
        return {code: 422, payload: 'Email is not specified'};
    }
    if (!password) {
        return {code: 422, payload: 'Password is not specified'};
    }

    if (!validator.validationCSR(csr)) {
        return {code: 422, payload: 'CSR is not correct'};
    }

    // Check that user doesnt exit;
    const userList = await DB.getUser(conn, login);
    if (userList.length !== 0) {
        return {code: 409, payload: 'User with the same name already exists.'};
    }
    /**
     *
     * @type {FabricCAServices.IEnrollResponse}
     */
    const adminData = await ca.enroll({enrollmentID: 'admin', enrollmentSecret: 'password'});
    const identity = {
        label: 'client',
        certificate: adminData.certificate,
        privateKey: adminData.key.toBytes(),
        mspId: '482solutions',
    };
    const wallet = new InMemoryWallet();
    const mixin = X509WalletMixin.createIdentity(identity.mspId,
        identity.certificate,
        identity.privateKey);
    await wallet.import(identity.label, mixin);
    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();
    try {
        // Load connection profile; will be used to locate a gateway
        const connectionProfile = yaml.safeLoad(
            fs.readFileSync(path.resolve(__dirname, '../config/networkConnection.yaml'), 'utf8'),
        );
        // Set connection options; identity and wallet
        const connectionOptions = {
            identity: identity.label,
            wallet,
            discovery: {enabled: false, asLocalhost: true},
        };

        // Connect to gateway using application specified parameters
        await gateway.connect(connectionProfile, connectionOptions);

        const admin = await gateway.getCurrentIdentity();

        const secret = await ca.register({
            enrollmentID: login,
            enrollmentSecret: password,
            role: 'peer',
            affiliation: '482solutions.prj-fabric',
            maxEnrollments: -1,
        }, admin);

        const userData = await ca.enroll({
            enrollmentID: login,
            enrollmentSecret: secret,
            csr: csr,
        });

        gateway.disconnect();
        const folder = sha256(login)
        await DB.insertUser(conn, login, password, email, folder);
        await  DB.insertFolder(conn, login, folder, null)
        await DB.insertCertData(conn, login, userData.certificate);
        return {code: 201, payload: {cert: userData.certificate}};

    } catch (error) {
        // Disconnect from the gateway
        gateway.disconnect();
        return {code: 400, payload: {err: error}};
    }
}


/**
 * Login user into the system
 * Authentication for users to get in to the system and receive JWT token
 *
 * login String
 * password String
 * certificate byte[]
 * privateKey byte[]
 * no response value expected for this operation
 **/
exports.login = async (login, password, certificate, privateKey) => {
    if (!login) {
        return {code: 422, payload: 'Invalid username/email supplied.'};
    }
    if (!password) {
        return {code: 422, payload: 'Invalid password supplied.'};
    }
    if (!validator.validationCertificate(certificate)) {
        return {code: 422, payload: 'Certificate is not correct'};
    }
    if (!validator.validationPrivateKey(privateKey)) {
        return {code: 422, payload: 'Private Key is not correct'};
    }

    const users = await DB.getUser(conn, login);
    if (users.length === 0) {
        return {code: 404, payload: 'User not found.'};
    }

    // Check if password matches
    const user = users[0];
    if (user.password === password) {
        const wallet = new InMemoryWallet();
        const mixin = X509WalletMixin.createIdentity("482solutions", certificate, privateKey);
        await wallet.import(user.username, mixin);
        const token = jwt.sign({data: user.username, issuer: "482solutions"},
            "482solutions",
            {expiresIn: '1h'})
        return {code: 200, payload: {token: token, folder: user.folder}};
    }

    return {code: 400, payload: {message: 'Invalid password supplied.'}};
}


/**
 * Logout user from the system
 * Manualy exit from the system
 *
 * no response value expected for this operation
 **/
exports.logout = async (token) => {
    const blackToken = await redisGet(token);
    if (blackToken != null) {
        return {code: 203, payload: {message: 'Not Authorized'}};
    }
    const user = validator.getUserFromToken(token)

    await redis.set(token, user, 'EX', 60 * 60);
    return {code: 200, payload: {message: 'User successfully logout.'}};
}



