// the function that works with token
import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import jwt from 'jsonwebtoken';
import config from '../config/config';
const NAMESPACE = 'AUTH';

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Validating Token');

    // extract the token from the header
    // split the array and grab the second part
    // the token is the bearer token, so we need to split
    // the token from the word "bearer"
    // then[0] is "bearer" and [1] is the token
    let token = req.headers.authorization?.split(' ')[1];
    if (token) {
        // import jwt and use the verify function
        // the parameters are:
        // 1.extracted token above
        // 2. the server object token
        // 3. error handle callback function(error, decoded)
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
                return res.status(404).json({
                    messsage: error.message,
                    error
                });
            } else {
                // res.local can save variables and pass them along
                res.locals.jwt = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

export default extractJWT;
