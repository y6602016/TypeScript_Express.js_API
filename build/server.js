"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const logging_1 = __importDefault(require("./config/logging"));
const config_1 = __importDefault(require("./config/config"));
const user_1 = __importDefault(require("./routes/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const NAMESPACE = 'Server';
const router = express_1.default();
// connect DB
mongoose_1.default
    .connect(config_1.default.mongo.url, config_1.default.mongo.options)
    .then((result) => {
    logging_1.default.info(NAMESPACE, 'Connect to MondoDB!');
})
    .catch((error) => {
    logging_1.default.error(NAMESPACE, error.message, error);
});
// logging the request
router.use((req, res, next) => {
    logging_1.default.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}],
    IP - [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging_1.default.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}]
        ,IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });
    next();
});
// parse the request
router.use(express_1.default.urlencoded({ extended: false }));
router.use(express_1.default.json());
// rules of our API
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Request-Width, Content-Type,Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH POST DELETE PUT');
        return res.status(200).json();
    }
    next();
});
// Routes
router.use('/users', user_1.default);
// Error Handling
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});
// create the server
const httpServer = http_1.default.createServer(router);
httpServer.listen(config_1.default.server.port, () => {
    logging_1.default.info(NAMESPACE, `Server runing on ${config_1.default.server.hostname}:${config_1.default.server.port}`);
});
