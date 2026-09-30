/**
 * Express 5 Compatible Input Sanitizer (No-Mutation for req.query getter)
 * Recursively strips keys starting with '$' (NoSQL injection) or containing '.'
 */
export const sanitizeObject = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        // Strip keys starting with '$' or containing '.'
        if (key.startsWith('$') || key.includes('.')) {
            continue;
        }
        sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
};

export const sanitizeInput = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    if (req.params && typeof req.params === 'object') {
        req.params = sanitizeObject(req.params);
    }
    // Express 5 query getter safety: store sanitized query in req.cleanQuery
    if (req.query && typeof req.query === 'object') {
        req.cleanQuery = sanitizeObject(req.query);
    } else {
        req.cleanQuery = {};
    }
    next();
};
