import jwt, { sign } from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import IUser from '../interfaces/user';

const NAMESPACE = 'Auth';
const signJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void): void => {
    // set the expiration time inseconds with below three calculations

    let timeSinchEpoch = new Date().getTime(); // from 1970/1
    // *100000 to receive milliseconds
    let expirationTime = timeSinchEpoch + Number(config.server.token.expireTime) * 100000;
    let expirationTimeInSeconds = Math.floor(expirationTime / 1000);

    logging.info(NAMESPACE, `Attempting to sign token for ${user.username}`);

    // then try and catch, try jwt.sign() function
    try {
        jwt.sign({ username: user.username }, config.server.token.secret, { issuer: config.server.token.issuer, algorithm: 'HS256', expiresIn: expirationTimeInSeconds }, (error, token) => {
            if (error) {
                // if error, pass it to callback
                // so the error in callback is error, the token in callback is null
                callback(error, null);
            } else if (token) {
                // if token is valid, pass it to callbacl
                // so the error in callback is null, the token incallback is string(token)
                callback(null, token);
            }
        });
    } catch (error) {
        logging.error(NAMESPACE, error.message, error);
        callback(error, null);
    }
};

export default signJWT;
