import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3002'),
    MONGO_URI: z.string().min(1, 'MONGO_URI or MONGODB_URL is required').catch(() => process.env.MONGODB_URL || ''),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET or ACCESS_TOKEN_SECRET must be at least 32 characters long').catch(() => process.env.ACCESS_TOKEN_SECRET || 'default_jwt_secret_min_32_characters_long_key_12345'),
    REFRESH_TOKEN_SECRET: z.string().optional().default(process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret_min_32_characters_long_key_67890'),
    CLIENT_URLS: z.string().min(1, 'CLIENT_URLS comma-separated list of origins is required').default('http://localhost:5173,https://wee-chat-virid.vercel.app'),
    COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default('lax'),
    COOKIE_DOMAIN: z.string().optional(),
    REDIS_URL: z.string().optional(),
    SENTRY_DSN: z.string().optional(),
    TURN_URL: z.string().optional(),
    TURN_SECRET: z.string().optional(),
    TURN_USERNAME: z.string().optional()
});

let parsedEnv;
try {
    const rawMongo = process.env.MONGO_URI || process.env.MONGODB_URL || '';
    const rawJwtSecret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || '';
    const rawClientUrls = process.env.CLIENT_URLS || process.env.CORS_ORIGIN || 'http://localhost:5173,https://wee-chat-virid.vercel.app';

    parsedEnv = envSchema.parse({
        ...process.env,
        MONGO_URI: rawMongo,
        JWT_SECRET: rawJwtSecret.length >= 32 ? rawJwtSecret : 'default_jwt_secret_min_32_characters_long_key_12345',
        CLIENT_URLS: rawClientUrls
    });
} catch (error) {
    console.error('❌ FATAL: Invalid Environment Configuration:');
    if (error instanceof z.ZodError) {
        error.errors.forEach(err => console.error(`  - ${err.path.join('.')}: ${err.message}`));
    } else {
        console.error(error);
    }
    process.exit(1);
}

export const env = {
    ...parsedEnv,
    parsedClientUrls: parsedEnv.CLIENT_URLS.split(',').map(url => url.trim()).filter(Boolean)
};
