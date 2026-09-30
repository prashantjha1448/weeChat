import 'dotenv/config';
import http from 'http';
import mongoose from 'mongoose';
import app from './src/app.js';
import { initSocketServer } from './src/sockets/index.js';
import { env } from './src/config/env.js';

const port = env.PORT || 3002;

// Create HTTP Server wrapping Express App
const httpServer = http.createServer(app);

// KeepAlive & Headers Timeout Configuration (Cloudflare / AWS / Reverse Proxy Alignment)
httpServer.keepAliveTimeout = 65000;
httpServer.headersTimeout = 66000;

// Initialize Socket.io Realtime Matchmaking Server
const io = initSocketServer(httpServer);

const server = httpServer.listen(port, () => {
    console.log(`🚀 Server & Socket.io running on port ${port} in [${env.NODE_ENV}] mode ✅`);
});

// Graceful Shutdown Handler
let isShuttingDown = false;
const gracefulShutdown = (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`\n⚠️  Received ${signal}. Initiating graceful shutdown...`);

    // Force exit after 10 seconds timeout
    const forceExitTimeout = setTimeout(() => {
        console.error('❌ Could not close connections in time, forcing process exit.');
        process.exit(1);
    }, 10000);

    // Stop HTTP Server
    server.close(async (err) => {
        if (err) {
            console.error('Error closing HTTP server:', err);
        } else {
            console.log('✅ HTTP Server closed successfully.');
        }

        try {
            // Close Socket.io
            if (io) {
                await io.close();
                console.log('✅ Socket.io server closed.');
            }

            // Close Mongoose DB connection
            if (mongoose.connection.readyState === 1) {
                await mongoose.connection.close(false);
                console.log('✅ MongoDB connection closed.');
            }

            clearTimeout(forceExitTimeout);
            process.exit(0);
        } catch (e) {
            console.error('Error during database/socket closure:', e);
            clearTimeout(forceExitTimeout);
            process.exit(1);
        }
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
    console.error('💥 UNCAUGHT EXCEPTION! Shutting down...', error);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 UNHANDLED REJECTION! Shutting down...', reason);
    gracefulShutdown('unhandledRejection');
});
