"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const logging_1 = __importDefault(require("../config/logging"));
const NAMESPACE = 'Auth';
const signJWT = (user, callback) => {
    // set the expiration time inseconds with below three calculations
    let timeSinchEpoch = new Date().getTime(); // from 1970/1
    // *100000 to receive milliseconds
    let expirationTime = timeSinchEpoch + Number(config_1.default.server.token.expireTime) * 100000;
    let expirationTimeInSeconds = Math.floor(expirationTime / 1000);
    logging_1.default.info(NAMESPACE, `Attempting to sign token for ${user.username}`);
    // then try and catch, try jwt.sign() function
    try {
        jsonwebtoken_1.default.sign({ username: user.username }, config_1.default.server.token.secret, { issuer: config_1.default.server.token.issuer, algorithm: 'HS256', expiresIn: expirationTimeInSeconds }, (error, token) => {
            if (error) {
                // if error, pass it to callback
                // so the error in callback is error, the token in callback is null
                callback(error, null);
            }
            else if (token) {
                // if token is valid, pass it to callbacl
                // so the error in callback is null, the token incallback is string(token)
                callback(null, token);
            }
        });
    }
    catch (error) {
        logging_1.default.error(NAMESPACE, error.message, error);
        callback(error, null);
    }
};
exports.default = signJWT;
