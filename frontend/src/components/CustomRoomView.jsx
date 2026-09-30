import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { 
    Mic, MicOff, Video, VideoOff, Monitor, MessageSquare, 
    Users, LogOut, Copy, Shield, Trash2, Send, X, Radio, Share2
} from 'lucide-react';
import { useCustomRoom } from '../hooks/useCustomRoom';
import { getRoomDetailsApi, endRoomApi } from '../services/customRoom.services';
import { toast } from 'sonner';

const CustomRoomView = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [roomInfo, setRoomInfo] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [rosterOpen, setRosterOpen] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    const {
        localStream,
        remoteStreams,
        participants,
        messages,
        isMuted,
        isCameraOff,
        isSharingScreen,
        hostId,
        roomEnded,
        toggleMic,
        toggleCamera,
        toggleScreenShare,
        sendMessage,
        kickUser,
        endRoom
    } = useCustomRoom(roomId, user);

    // Fetch initial room details
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const resData = await getRoomDetailsApi(roomId);
                setRoomInfo(resData.data);
            } catch (err) {
                toast.error('Room not found or has ended');
                navigate('/home/rooms');
            }
        };

        if (roomId) fetchDetails();
    }, [roomId, navigate]);

    // Handle room end redirection
    useEffect(() => {
        if (roomEnded) {
            setTimeout(() => {
                navigate('/home/rooms');
            }, 1500);
        }
    }, [roomEnded, navigate]);

    const isHost = String(hostId || roomInfo?.hostId?._id) === String(user?._id);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(roomId.toUpperCase());
        toast.success('Room code copied to clipboard!');
    };

    const handleCopyShareLink = () => {
        const shareUrl = `${window.location.origin}/join/${roomId}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success('Room share link copied!', {
            description: shareUrl
        });
    };

    const handleSendMsg = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        sendMessage(messageInput);
        setMessageInput('');
    };

    const handleLeaveOrEnd = async () => {
        if (isHost) {
            if (window.confirm('Are you sure you want to end this room for all participants?')) {
                endRoom();
                try {
                    await endRoomApi(roomId);
                } catch (e) {
                    console.error(e);
                }
                navigate('/home/rooms');
            }
        } else {
            navigate('/home/rooms');
        }
    };

    return (
        <div className="relative w-full h-[calc(100vh-3.5rem)] bg-neutral-950 text-white flex flex-col overflow-hidden select-none font-sans">
            
            {/* 1. Top Bar */}
            <header className="h-16 px-6 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800/80 flex items-center justify-between z-30">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-bold text-red-400">
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                        <span>LIVE ROOM</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate max-w-xs sm:max-w-md">
                        {roomInfo?.title || 'Custom Room'}
                    </h2>
                    
                    {/* Room Code Badge */}
                    <button
                        type="button"
                        onClick={handleCopyCode}
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-full text-xs font-mono font-bold text-neutral-300 border border-neutral-700 transition-colors cursor-pointer"
                        title="Click to copy room code"
                    >
                        <span>{roomId?.toUpperCase()}</span>
                        <Copy className="w-3 h-3 text-neutral-400" />
                    </button>

                    {/* Share Link Button */}
                    <button
                        type="button"
                        onClick={handleCopyShareLink}
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white text-black hover:bg-neutral-200 rounded-full text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        title="Click to copy shareable room link"
                    >
                        <Share2 className="w-3 h-3 text-black" />
                        <span>Share Link</span>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {/* Participant & Seat Counter */}
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-800/80 rounded-full text-xs font-bold text-neutral-300 border border-neutral-700">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{participants.length} Joined</span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-400">{Math.max(0, (roomInfo?.maxParticipants || 100) - participants.length)} Seats Left</span>
                    </div>

                    {/* Exit/End Room Button */}
                    <button
                        type="button"
                        onClick={handleLeaveOrEnd}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-lg shadow-red-900/20"
                    >
                        {isHost ? 'End Room' : 'Leave Room'}
                    </button>
                </div>
            </header>

            {/* 2. Main Stage & Grid */}
            <main className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
                <div className={`w-full h-full grid gap-4 transition-all duration-300 ${
                    participants.length <= 1 ? 'grid-cols-1 max-w-2xl max-h-[75vh]' :
                    participants.length <= 4 ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl' :
                    participants.length <= 9 ? 'grid-cols-2 md:grid-cols-3 max-w-5xl' :
                    'grid-cols-3 md:grid-cols-4 lg:grid-cols-5 max-w-7xl'
                } auto-rows-fr my-auto`}>

                    {/* Local User Card */}
                    <div className="relative rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center shadow-xl group">
                        {!isCameraOff && localStream ? (
                            <video
                                ref={(el) => { if (el) el.srcObject = localStream; }}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover transform -scale-x-100"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xl font-bold text-white uppercase shadow-inner">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0) || 'U'
                                    )}
                                </div>
                                <span className="text-xs text-neutral-400 font-medium">Camera is off</span>
                            </div>
                        )}

                        {/* Name Tag & Badges */}
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold text-white flex items-center gap-2 border border-white/10">
                            <span>You {isHost ? '(Host)' : ''}</span>
                            {isMuted ? <MicOff className="w-3 h-3 text-red-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                        </div>
                    </div>

                    {/* Remote Participants Cards */}
                    {participants.filter(p => String(p.userId) !== String(user?._id)).map((peer) => {
                        const stream = remoteStreams.get(peer.socketId);
                        return (
                            <div key={peer.socketId || peer.userId} className="relative rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center shadow-xl">
                                {stream && !peer.isCameraOff ? (
                                    <video
                                        ref={(el) => { if (el) el.srcObject = stream; }}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xl font-bold text-white uppercase shadow-inner">
                                            {peer.avatar ? (
                                                <img src={peer.avatar} alt={peer.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                peer.name?.charAt(0) || 'P'
                                            )}
                                        </div>
                                        <span className="text-xs text-neutral-400 font-medium">{peer.name}</span>
                                    </div>
                                )}

                                {/* Name Tag & Badges */}
                                <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold text-white flex items-center gap-2 border border-white/10">
                                    <span>{peer.name} {peer.role === 'host' ? '(Host)' : ''}</span>
                                    {peer.isMuted ? <MicOff className="w-3 h-3 text-red-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* 3. Bottom Floating Control Bar (Apple Floating Glass Pill) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
                <div className="flex items-center gap-3 px-6 py-3 bg-neutral-900/90 backdrop-blur-xl border border-neutral-700/80 rounded-full shadow-2xl">
                    
                    {/* Mic Toggle */}
                    <button
                        type="button"
                        onClick={toggleMic}
                        className={`p-3.5 rounded-full transition-all cursor-pointer ${
                            isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                        }`}
                        title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
                    >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    {/* Camera Toggle */}
                    <button
                        type="button"
                        onClick={toggleCamera}
                        className={`p-3.5 rounded-full transition-all cursor-pointer ${
                            isCameraOff ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                        }`}
                        title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
                    >
                        {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </button>

                    {/* Screen Share Toggle */}
                    <button
                        type="button"
                        onClick={toggleScreenShare}
                        className={`p-3.5 rounded-full transition-all cursor-pointer ${
                            isSharingScreen ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                        }`}
                        title={isSharingScreen ? 'Stop Screen Share' : 'Share Screen'}
                    >
                        <Monitor className="w-5 h-5" />
                    </button>

                    <div className="w-px h-6 bg-neutral-700 mx-1" />

                    {/* Chat Drawer Toggle */}
                    <button
                        type="button"
                        onClick={() => { setChatOpen(!chatOpen); setRosterOpen(false); }}
                        className={`p-3.5 rounded-full transition-all relative cursor-pointer ${
                            chatOpen ? 'bg-white text-black font-bold' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                        }`}
                        title="Group Text Chat"
                    >
                        <MessageSquare className="w-5 h-5" />
                        {messages.length > 0 && !chatOpen && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-500" />
                        )}
                    </button>

                    {/* Participant Roster Toggle */}
                    <button
                        type="button"
                        onClick={() => { setRosterOpen(!rosterOpen); setChatOpen(false); }}
                        className={`p-3.5 rounded-full transition-all cursor-pointer ${
                            rosterOpen ? 'bg-white text-black font-bold' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                        }`}
                        title="Participants List"
                    >
                        <Users className="w-5 h-5" />
                    </button>

                    {/* Leave/End Red Pill Button */}
                    <button
                        type="button"
                        onClick={handleLeaveOrEnd}
                        className="p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30 transition-all cursor-pointer"
                        title={isHost ? 'End Room' : 'Leave Room'}
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* 4. Side Drawer: Group Chat */}
            {chatOpen && (
                <aside className="absolute right-4 top-20 bottom-24 w-80 sm:w-96 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-3xl shadow-2xl flex flex-col z-40 animate-in slide-in-from-right duration-200">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-neutral-400" />
                            <h3 className="text-sm font-bold text-white">Group Chat</h3>
                        </div>
                        <button type="button" onClick={() => setChatOpen(false)} className="text-neutral-400 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                        {messages.length === 0 ? (
                            <div className="text-center my-auto text-xs text-neutral-500">
                                No messages yet. Start the conversation!
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
                                        <span className="font-bold text-neutral-200">{msg.senderName}</span>
                                        <span>•</span>
                                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-neutral-800 border border-neutral-700/50 text-xs text-white leading-relaxed">
                                        {msg.text}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={handleSendMsg} className="p-3 border-t border-neutral-800 flex gap-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-full text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!messageInput.trim()}
                            className="p-2.5 rounded-full bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                        >
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </form>
                </aside>
            )}

            {/* 5. Side Drawer: Participant Roster */}
            {rosterOpen && (
                <aside className="absolute right-4 top-20 bottom-24 w-80 sm:w-96 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-3xl shadow-2xl flex flex-col z-40 animate-in slide-in-from-right duration-200">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-neutral-400" />
                            <h3 className="text-sm font-bold text-white">Participants ({participants.length} Joined • {Math.max(0, (roomInfo?.maxParticipants || 100) - participants.length)} Left)</h3>
                        </div>
                        <button type="button" onClick={() => setRosterOpen(false)} className="text-neutral-400 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
                        {participants.map((peer) => (
                            <div key={peer.socketId || peer.userId} className="p-3 bg-neutral-800/70 border border-neutral-700/50 rounded-2xl flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0 overflow-hidden">
                                        {peer.avatar ? (
                                            <img src={peer.avatar} alt={peer.name} className="w-full h-full object-cover" />
                                        ) : (
                                            peer.name?.charAt(0) || 'P'
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-xs font-bold text-white truncate">{peer.name}</p>
                                            {peer.role === 'host' && (
                                                <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded text-[9px] font-bold text-amber-400">
                                                    HOST
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-neutral-400 truncate">@{peer.username}</p>
                                    </div>
                                </div>

                                {/* Host Moderation Actions */}
                                {isHost && String(peer.userId) !== String(user?._id) && (
                                    <button
                                        type="button"
                                        onClick={() => kickUser(peer.socketId, peer.userId)}
                                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                                        title="Kick Participant"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>
            )}
        </div>
    );
};

export default CustomRoomView;
