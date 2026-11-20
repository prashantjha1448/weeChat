import crypto from 'crypto';

/**
 * STUN / TURN Server Configuration Helper for WebRTC Production Traversal
 * Supports time-limited credentials via coturn use-auth-secret (HMAC-SHA1)
 */
export const getIceServersConfig = (userId = 'guest') => {
    const stunServer = process.env.STUN_SERVER_URL || 'stun:stun.l.google.com:19302';
    const turnServer = process.env.TURN_SERVER_URL || null;
    const turnSecret = process.env.TURN_AUTH_SECRET || null;
    const turnUsername = process.env.TURN_USERNAME || '';
    const turnCredential = process.env.TURN_CREDENTIAL || '';

    const iceServers = [
        { urls: stunServer },
        { urls: 'stun:stun1.l.google.com:19302' }
    ];

    if (turnServer) {
        if (turnSecret) {
            // Coturn use-auth-secret: ephemeral time-limited credential (valid 24h)
            const expiry = Math.floor(Date.now() / 1000) + 86400;
            const username = `${expiry}:${userId}`;
            const hmac = crypto.createHmac('sha1', turnSecret);
            hmac.update(username);
            const credential = hmac.digest('base64');

            iceServers.push({
                urls: turnServer,
                username,
                credential
            });
        } else if (turnUsername && turnCredential) {
            iceServers.push({
                urls: turnServer,
                username: turnUsername,
                credential: turnCredential
            });
        }
    }

    return { iceServers };
};

