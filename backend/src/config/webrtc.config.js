/**
 * STUN / TURN Server Configuration Helper for WebRTC Production Traversal
 */
export const getIceServersConfig = () => {
    const stunServer = process.env.STUN_SERVER_URL || 'stun:stun.l.google.com:19302';
    const turnServer = process.env.TURN_SERVER_URL || null;
    const turnUsername = process.env.TURN_USERNAME || '';
    const turnCredential = process.env.TURN_CREDENTIAL || '';

    const iceServers = [
        { urls: stunServer },
        { urls: 'stun:stun1.l.google.com:19302' }
    ];

    if (turnServer) {
        iceServers.push({
            urls: turnServer,
            username: turnUsername,
            credential: turnCredential
        });
    }

    return { iceServers };
};
