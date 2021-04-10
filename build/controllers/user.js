"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const signJWT_1 = __importDefault(require("../functions/signJWT"));
const NAMESPACE = 'User';
const validToken = (req, res, next) => {
    logging_1.default.info(NAMESPACE, 'Token validated, user authorized');
    return res.status(200).json({
        message: 'Authorized'
    });
};
const register = (req, res, next) => {
    let { username, password } = req.body;
    bcryptjs_1.default.hash(password, 10, (hasherror, hash) => {
        if (hasherror) {
            return res.status(500).json({
                message: hasherror.message,
                error: hasherror
            });
        }
        // insert user to DB
        const _user = new user_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
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
const login = (req, res, next) => {
    let { username, password } = req.body;
    user_1.default.find({ username })
        .exec()
        .then((users) => {
        if (users.length !== 1) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        // check the user password is valid or not
        bcryptjs_1.default.compare(password, users[0].password, (error, result) => {
            if (error) {
                logging_1.default.error(NAMESPACE, error.message, error);
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }
            // if there is no error, we give the user the token
            // the user needs to access the protected route with the token
            else if (result) {
                signJWT_1.default(users[0], (_error, token) => {
                    if (_error) {
                        logging_1.default.error(NAMESPACE, 'Unable to sign token', error);
                        return res.status(401).json({
                            message: 'Unauthorized',
                            error
                        });
                    }
                    else if (token) {
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
const getAllusers = (req, res, next) => {
    user_1.default.find()
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
exports.default = { validToken, register, login, getAllusers };
