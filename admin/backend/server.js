import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // fallback to process.cwd() .env if any

// Route Imports
import authRoutes from './src/routes/auth.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';
import userRoutes from './src/routes/user.routes.js';
import queryRoutes from './src/routes/query.routes.js';
import adsRoutes from './src/routes/ads.routes.js';
import transactionRoutes from './src/routes/transaction.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to Shared MongoDB Atlas
connectDB();

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5174',
    'http://localhost:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5173',
    'https://wee-chat-virid.vercel.app'
];

if (process.env.CLIENT_URLS) {
    process.env.CLIENT_URLS.split(',').forEach((url) => {
        const clean = url.trim();
        if (clean && !allowedOrigins.includes(clean)) {
            allowedOrigins.push(clean);
        }
    });
}

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Admin-Client']
}));

// Body Parsers & Cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logger for admin audits
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [Admin Backend] ${req.method} ${req.originalUrl}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'weeChat Dedicated Admin Backend',
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'weeChat Dedicated Admin Backend',
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// Mount Routes (Direct and /api/admin aliases)
app.use('/api/auth', authRoutes);

// Analytics
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin/stats', analyticsRoutes);

// Users
app.use('/api/users', userRoutes);
app.use('/api/admin/users', userRoutes);

// Queries & Client Ticket Resolution
app.use('/api/queries', queryRoutes);
app.use('/api/admin/queries', queryRoutes);

// Ads
app.use('/api/ads', adsRoutes);
app.use('/api/admin/ads', adsRoutes);

// Transactions
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin/transactions', transactionRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Endpoint ${req.method} ${req.originalUrl} not found on Admin Backend Server`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ [Admin Backend Error]:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Admin Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || []
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 [Admin Backend] Dedicated Admin Server running on http://localhost:${PORT}`);
    console.log(`🔒 [Admin Security] Direct connection established to MongoDB Atlas`);
});
