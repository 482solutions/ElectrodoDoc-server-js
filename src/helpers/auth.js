"use strict";

const jwt = require("jsonwebtoken");
const issuer = "482solutions";

exports.verifyToken = function (req, authOrSecDef, token, callback) {
    function sendError() {
        return {code: 404, payload: 'Invalid token supplied.'};
    }

    if (token && token.indexOf("Bearer ") === 0) {
        const tokenString = token.split(" ")[1];
        jwt.verify(tokenString, "482solutions", function (verificationError, decodedToken) {
            if (verificationError == null && decodedToken) {
                const issuerMatch = decodedToken.issuer === issuer;
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

exports.getUserFromToken = (token) => {
    if (token && token.indexOf("Bearer ") === 0) {
        const tokenString = token.split(" ")[1];
        const decodedToken = jwt.verify(tokenString, "482solutions")
        return decodedToken.data
    }
}