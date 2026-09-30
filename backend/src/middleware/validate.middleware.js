import { z } from 'zod';
import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';

/**
 * Validate MongoDB ObjectId string
 */
export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const validateObjectIdParam = (paramName = 'id') => (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !isValidObjectId(id)) {
        throw new ApiError(400, `Invalid ${paramName} parameter. Must be a valid 24-character ObjectId.`);
    }
    next();
};

/**
 * Zod Schema Validation Middleware for body, params, query
 */
export const validateSchema = (schemas) => (req, res, next) => {
    try {
        if (schemas.body) {
            req.body = schemas.body.strict().parse(req.body);
        }
        if (schemas.params) {
            req.params = schemas.params.strict().parse(req.params);
        }
        if (schemas.query) {
            const targetQuery = req.cleanQuery || req.query;
            req.cleanQuery = schemas.query.strict().parse(targetQuery);
        }
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const issueMsgs = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
            throw new ApiError(400, `Validation Error: ${issueMsgs}`);
        }
        next(error);
    }
};

export const validate = (schema) => (req, res, next) => {
    try {
        if (schema && typeof schema.parse === 'function') {
            req.body = schema.parse(req.body);
        }
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const issueMsgs = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
            throw new ApiError(400, `Validation Error: ${issueMsgs}`);
        }
        next(error);
    }
};

