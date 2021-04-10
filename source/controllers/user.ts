import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import bcryptjs, { hash } from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/user';
import signJWT from '../functions/signJWT';

const NAMESPACE = 'User';

const validToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated, user authorized');
    return res.status(200).json({
        message: 'Authorized'
    });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;

    bcryptjs.hash(password, 10, (hasherror, hash) => {
        if (hasherror) {
            return res.status(500).json({
                message: hasherror.message,
                error: hasherror
            });
        }

        // insert user to DB
        const _user = new User({
            _id: new mongoose.Types.ObjectId(),
            username,
            password: hash
        });
        _user
            .save()
            .then((user) => {
                return res.status(200).json({
                    user
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;
    User.find({ username })
        .exec()
        .then((users) => {
            if (users.length !== 1) {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }

            // check the user password is valid or not
            bcryptjs.compare(password, users[0].password, (error, result) => {
                if (error) {
                    logging.error(NAMESPACE, error.message, error);
                    return res.status(401).json({
                        message: 'Unauthorized'
                    });
                }
                // if there is no error, we give the user the token
                // the user needs to access the protected route with the token
                else if (result) {
                    signJWT(users[0], (_error, token) => {
                        if (_error) {
                            logging.error(NAMESPACE, 'Unable to sign token', error);
                            return res.status(401).json({
                                message: 'Unauthorized',
                                error
                            });
                        } else if (token) {
                            return res.status(200).json({
                                message: 'Auth Successful',
                                token,
                                user: users[0]
                            });
                        }
                    });
                }
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getAllusers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        // filter the password info, it should not be showed
        .select('-password')
        .exec()
        .then((users) => {
            return res.status(200).json({
                users,
                count: users.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { validToken, register, login, getAllusers };
