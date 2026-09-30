import { env } from '../config/env.js';

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const requestId = req.requestId || 'req_unknown';

    const responsePayload = {
        success: false,
        statusCode,
        requestId,
        message: (env.NODE_ENV === 'production' && statusCode === 500) 
            ? 'An unexpected internal error occurred' 
            : message,
        errors: err.errors || []
    };

    if (env.NODE_ENV !== 'production' && err.stack) {
        responsePayload.stack = err.stack;
    }

    res.status(statusCode).json(responsePayload);
};

export default errorHandler;
