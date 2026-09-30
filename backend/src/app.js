import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';

// Config & Middleware Imports
import { env } from './config/env.js';
import errorHandler from './middleware/error.middleware.js';
import { notFound } from './middleware/notFound.middleware.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { helmetSecurity } from './middleware/security.middleware.js';
import { sanitizeInput } from './middleware/sanitizer.middleware.js';
import { csrfProtection } from './middleware/csrf.middleware.js';
import { apiLimiter, authLimiter, uploadLimiter } from './middleware/rateLimiter.middleware.js';

// Route Imports
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.Routes.js';
import verificationRoutes from './routes/verification.routes.js';
import sessionRoutes from './routes/session.routes.js';
import profileRoutes from './routes/profile.routes.js';
import callRoutes from './routes/callSession.routes.js';
import reportRoutes from './routes/report.routes.js';
import blockRoutes from './routes/block.routes.js';
import moderationRoutes from './routes/moderation.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import supportRoutes from './routes/support.routes.js';
import adminUserRoutes from './routes/adminUser.routes.js';
import adminAnalyticsRoutes from './routes/adminAnalytics.routes.js';
import adminConfigRoutes from './routes/adminConfig.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import customRoomRoutes from './routes/customRoom.routes.js';

import { connectDB } from './config/db.js';

const app = express();

// 1. TRUST PROXY FIRST (Required for Render / Reverse Proxy & Rate Limiting)
app.set('trust proxy', 1);

// 2. Disable X-Powered-By & Enable Helmet Security
app.disable('x-powered-by');
app.use(helmetSecurity);

// 3. Exact CORS Origin Allowlist Configuration
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || env.parsedClientUrls.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('CORS Access Denied: Origin not allowed'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-request-id']
}));

connectDB();

// 4. Body Limits & Cookie Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieparser());
app.use(requestLogger);

// 5. Express 5 Non-Mutating Sanitizer
app.use(sanitizeInput);

// 6. Un-rate-limited & Un-logged Health Check Endpoints
app.use('/', healthRoutes);
app.use('/health', healthRoutes);

// 7. CSRF Protection & Rate Limiters
app.use('/api/', csrfProtection);
app.use('/api/', apiLimiter);

// Specific Auth & Upload Rate Limiters
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/verify-email', authLimiter);
app.use('/api/auth/resend-otp', authLimiter);
app.use('/api/upload/', uploadLimiter);

// 8. API Endpoint Registrations
app.use('/api/auth/', authRoutes);
app.use('/api/auth/', verificationRoutes);
app.use('/api/upload/', uploadRoutes);
app.use('/api/rooms/', customRoomRoutes);
app.use('/api/sessions/', sessionRoutes);
app.use('/api/user/', profileRoutes);
app.use('/api/', profileRoutes);
app.use('/api/calls/', callRoutes);
app.use('/api/reports/', reportRoutes);
app.use('/api/blocks/', blockRoutes);
app.use('/api/moderation/', moderationRoutes);
app.use('/api/notifications/', notificationRoutes);
app.use('/api/support/', supportRoutes);
app.use('/api/admin/', adminUserRoutes);
app.use('/api/admin/', adminAnalyticsRoutes);
app.use('/api/admin/', adminConfigRoutes);

// 9. 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;