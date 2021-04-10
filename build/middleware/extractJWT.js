"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const NAMESPACE = 'AUTH';
const extractJWT = (req, res, next) => {
    var _a;
    logging_1.default.info(NAMESPACE, 'Validating Token');
    // extract the token from the header
    // split the array and grab the second part
    // the token is the bearer token, so we need to split
    // the token from the word "bearer"
    // then[0] is "bearer" and [1] is the token
    let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        // import jwt and use the verify function
        // the parameters are:
        // 1.extracted token above
        // 2. the server object token
        // 3. error handle callback function(error, decoded)
        jsonwebtoken_1.default.verify(token, config_1.default.server.token.secret, (error, decoded) => {
            if (error) {
                return res.status(404).json({
                    messsage: error.message,
                    error
                });
            }
            else {
                // res.local can save variables and pass them along
                res.locals.jwt = decoded;
                next();
            }
        });
    }
    else {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};
exports.default = extractJWT;
