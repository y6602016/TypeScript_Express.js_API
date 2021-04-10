"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gettimeStamp = () => {
    return new Date().toISOString();
};
const info = (namespace, message, object) => {
    if (object) {
        console.log(`[${gettimeStamp()}][INFO][${namespace}] ${message}`, object);
    }
    else {
        console.log(`[${gettimeStamp()}][INFO][${namespace}] ${message}`);
    }
};
const warn = (namespace, message, object) => {
    if (object) {
        console.warn(`[${gettimeStamp()}][WARN][${namespace}] ${message}`, object);
    }
    else {
        console.warn(`[${gettimeStamp()}][WARN][${namespace}] ${message}`);
    }
};
const error = (namespace, message, object) => {
    if (object) {
        console.error(`[${gettimeStamp()}][ERROR][${namespace}] ${message}`, object);
    }
    else {
        console.error(`[${gettimeStamp()}][ERROR][${namespace}] ${message}`);
    }
};
const debug = (namespace, message, object) => {
    if (object) {
        console.debug(`[${gettimeStamp()}][DEBUG][${namespace}] ${message}`, object);
    }
    else {
        console.debug(`[${gettimeStamp()}][DEBUG][${namespace}] ${message}`);
    }
};
exports.default = {
    info,
    warn,
    error,
    debug
};
