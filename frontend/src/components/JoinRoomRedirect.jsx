import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

/**
 * JoinRoomRedirect — Public Entry Point for Shared Room Links (/join/:roomId)
 * Automatically routes authenticated users straight into the room,
 * or saves target room URL & redirects unauthenticated users to Login/Register.
 */
const JoinRoomRedirect = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!roomId) {
            navigate('/home/rooms');
            return;
        }

        const targetUrl = `/home/rooms/${roomId.toUpperCase()}`;

        if (isAuthenticated) {
            navigate(targetUrl, { replace: true });
        } else {
            sessionStorage.setItem('redirect_after_auth', targetUrl);
            toast.info(`Sign in or register to join room ${roomId.toUpperCase()}`);
            navigate('/login', { replace: true });
        }
    }, [roomId, isAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-neutral-900 flex flex-col items-center justify-center font-sans p-6">
            <div className="w-8 h-8 border-3 border-neutral-300 border-t-black rounded-full animate-spin mb-3" />
            <p className="text-sm font-semibold text-neutral-600">Connecting to room...</p>
        </div>
    );
};

export default JoinRoomRedirect;
