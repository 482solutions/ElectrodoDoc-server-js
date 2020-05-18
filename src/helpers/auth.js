"use strict";

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const jwt = require("jsonwebtoken");
const issuer = "482solutions";
const {InMemoryWallet, X509WalletMixin, Gateway} = require('fabric-network');

exports.verifyToken = function (req, authOrSecDef, token, callback) {
    function sendError() {
        return {code: 404, payload: {message: 'Invalid token supplied.'}};
    }

    if (token && token.indexOf("Bearer ") === 0) {
        const tokenString = token.split(" ")[1];
        jwt.verify(tokenString, "482solutions", function (verificationError, decodedToken) {
            if (verificationError === null && decodedToken) {
                const issuerMatch = decodedToken.issuer === issuer;
                return {code: 404, payload: {message: 'Invalid token supplied.'}};
                if (issuerMatch) {
                    req.auth = decodedToken;
                    return callback(null);
                } else {
                    return callback(sendError());
                }
            } else {
                return callback(sendError());
            }
        });
    } else {
        return callback(sendError());
    }
};

exports.issueToken = function (username) {
    return jwt.sign({name: username, issuer: issuer}, "482solutions", {expiresIn: '1h'})
};

exports.validationPrivateKey = (string) => {
    string = string.toString().trim();
    return string.startsWith("-----BEGIN PRIVATE KEY-----") && string.endsWith("-----END PRIVATE KEY-----");
}
exports.validationCertificate = (string) => {
    string = string.toString().trim();
    return string.startsWith("-----BEGIN CERTIFICATE-----") && string.endsWith("-----END CERTIFICATE-----");
}
exports.validationCSR = (string) => {
    string = string.toString().trim();
    return string.startsWith("-----BEGIN CERTIFICATE REQUEST-----") && string.endsWith("-----END CERTIFICATE REQUEST-----");
}

exports.getUserFromToken = async (token) => {
    if (token && token.indexOf("Bearer ") === 0) {
        const tokenString = token.split(" ")[1];
        if (tokenString.length < 5){
            return null
        }
        const decodedToken = await jwt.verify(tokenString, "482solutions".toString('base64'), )
        return decodedToken.data
    }
}

exports.sendTransaction = async ({ identity, transaction, network: networkOptions }) => {
    const wallet = new InMemoryWallet();
    const mixin = X509WalletMixin.createIdentity(identity.mspId, identity.certificate, identity.privateKey);
    await wallet.import(identity.label, mixin);

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {
        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(
            fs.readFileSync(path.resolve(__dirname, process.env.FABRIC_CONFIG_FILE), 'utf8')
        );

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: identity.label,
            wallet,
            discovery: { enabled: false, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        await gateway.connect(connectionProfile, connectionOptions);
        console.log('Connect to Fabric gateway');

        const network = await gateway.getNetwork(networkOptions.channel);
        console.log('Use network channel:', networkOptions.channel);

        const contract = await network.getContract(networkOptions.chaincode, networkOptions.contract);
        console.log(`Use ${networkOptions.contract} smart contract of chaincode ${networkOptions.chaincode}.`);

        const issueResponse = await contract.submitTransaction(transaction.name, ...transaction.props);
        console.log('Submit transaction:', transaction.name, 'with props:', transaction.props);

        gateway.disconnect();
        console.log('Disconnect from Fabric gateway.');

        return JSON.parse(issueResponse.toString());

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

        // Disconnect from the gateway
        gateway.disconnect();
        console.log('Disconnect from Fabric gateway.');

    }
}