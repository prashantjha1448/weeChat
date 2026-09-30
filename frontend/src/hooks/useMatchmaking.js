import { useEffect, useState } from 'react';
import { getSocket, connectSocket } from '../services/socket.service';

/**
 * Custom Matchmaking Hook — Realtime Socket Queue & Match Found State
 */
export const useMatchmaking = () => {
    const [queueState, setQueueState] = useState('idle'); // 'idle' | 'waiting' | 'matched'
    const [matchedPeer, setMatchedPeer] = useState(null);
    const [callRoomId, setCallRoomId] = useState(null);
    const [isCaller, setIsCaller] = useState(false);
    const [matchScore, setMatchScore] = useState(0);

    useEffect(() => {
        connectSocket();
        const socket = getSocket();

        socket.on('queue:status', (data) => {
            setQueueState(data.status);
        });

        socket.on('match:found', (data) => {
            console.log("Realtime Match Found!", data);
            setQueueState('matched');
            setCallRoomId(data.roomId);
            setIsCaller(data.isCaller);
            setMatchedPeer(data.peer);
            setMatchScore(data.matchScore);
        });

        return () => {
            socket.off('queue:status');
            socket.off('match:found');
        };
    }, []);

    const joinQueue = () => {
        const socket = getSocket();
        setQueueState('waiting');
        setMatchedPeer(null);
        socket.emit('queue:join');
    };

    const leaveQueue = () => {
        const socket = getSocket();
        setQueueState('idle');
        setMatchedPeer(null);
        socket.emit('queue:leave');
    };

    return {
        queueState,
        matchedPeer,
        callRoomId,
        isCaller,
        matchScore,
        joinQueue,
        leaveQueue
    };
};
