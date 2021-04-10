import http from 'http';
import express from 'express';
import logging from './config/logging';
import config from './config/config';
import { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/user';
import mongoose from 'mongoose';

const NAMESPACE = 'Server';
const router = express();

// connect DB
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'Connect to MondoDB!');
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    });

// logging the request
router.use((req: Request, res: Response, next: NextFunction): void => {
    logging.info(
        NAMESPACE,
        `METHOD - [${req.method}], URL - [${req.url}],
    IP - [${req.socket.remoteAddress}]`
    );

    res.on('finish', (): void => {
        logging.info(
            NAMESPACE,
            `METHOD - [${req.method}], URL - [${req.url}]
        ,IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
        );
    });

    next();
});

// parse the request
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// rules of our API
router.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Request-Width, Content-Type,Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH POST DELETE PUT');
        return res.status(200).json();
    }

    next();
});

// Routes
router.use('/users', userRoutes);

// Error Handling
router.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('not found');

    return res.status(404).json({
        message: error.message
    });
});

// create the server
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, (): void => {
    logging.info(NAMESPACE, `Server runing on ${config.server.hostname}:${config.server.port}`);
});
