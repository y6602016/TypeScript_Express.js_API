const gettimeStamp = (): string => {
    return new Date().toISOString();
};

const info = (namespace: string, message: string, object?: any): void => {
    if (object) {
        console.log(`[${gettimeStamp()}][INFO][${namespace}] ${message}`, object);
    } else {
        console.log(`[${gettimeStamp()}][INFO][${namespace}] ${message}`);
    }
};

const warn = (namespace: string, message: string, object?: any): void => {
    if (object) {
        console.warn(`[${gettimeStamp()}][WARN][${namespace}] ${message}`, object);
    } else {
        console.warn(`[${gettimeStamp()}][WARN][${namespace}] ${message}`);
    }
};

const error = (namespace: string, message: string, object?: any): void => {
    if (object) {
        console.error(`[${gettimeStamp()}][ERROR][${namespace}] ${message}`, object);
    } else {
        console.error(`[${gettimeStamp()}][ERROR][${namespace}] ${message}`);
    }
};

const debug = (namespace: string, message: string, object?: any): void => {
    if (object) {
        console.debug(`[${gettimeStamp()}][DEBUG][${namespace}] ${message}`, object);
    } else {
        console.debug(`[${gettimeStamp()}][DEBUG][${namespace}] ${message}`);
    }
};

export default {
    info,
    warn,
    error,
    debug
};
