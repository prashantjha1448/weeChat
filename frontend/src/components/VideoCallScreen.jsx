import React, { useEffect, useRef, useState } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import { Mic, MicOff, Video, VideoOff, FastForward, PhoneOff, ShieldAlert } from 'lucide-react';
import InCallChat from './InCallChat';
import ReportModal from './ReportModal';

/**
 * VideoCallScreen — Modern 1-on-1 Instant Video Chat (Omegle-Style)
 */
const VideoCallScreen = ({ roomId, isCaller, matchedPeer, matchScore, onSkip, onEnd }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [showReportModal, setShowReportModal] = useState(false);

    const {
        localStream,
        remoteStream,
        audioMuted,
        videoOff,
        connectionState,
        toggleAudio,
        toggleVideo,
        skipCall,
        stopAllTracks
    } = useWebRTC(roomId, isCaller, onSkip);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    // Keyboard Shortcuts: Space = Next Stranger, Esc = End Call
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.code === 'Space') {
                e.preventDefault();
                handleSkip();
            } else if (e.code === 'Escape') {
                e.preventDefault();
                handleEnd();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [roomId]);

    const handleSkip = () => {
        skipCall();
        if (onSkip) onSkip();
    };

    const handleEnd = () => {
        stopAllTracks();
        if (onEnd) onEnd();
    };

    return (
        <div className="w-full max-w-5xl mx-auto rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col items-center">
            
            {/* Top Bar: Stranger Info & Actions */}
            <div className="w-full px-6 py-3.5 flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <div className="text-left">
                        <h4 className="text-sm font-bold text-white tracking-tight">
                            {matchedPeer?.name || 'Stranger'}
                        </h4>
                        <p className="text-[11px] text-neutral-400">
                            @{matchedPeer?.username || 'stranger'} • {matchedPeer?.city || 'Online'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {matchScore || 92}% Match
                    </span>
                    <button
                        type="button"
                        onClick={() => setShowReportModal(true)}
                        className="text-xs text-neutral-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-neutral-800"
                        title="Report User"
                    >
                        <ShieldAlert className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Video Viewport Container */}
            <div className="w-full h-[460px] sm:h-[520px] bg-neutral-900 relative overflow-hidden flex items-center justify-center">
                
                {/* Remote Stranger Video Stream */}
                {remoteStream ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-3 text-neutral-400 animate-in fade-in">
                        <div className="w-12 h-12 rounded-full border-3 border-neutral-700 border-t-white animate-spin" />
                        <p className="text-sm font-medium">
                            {connectionState === 'connecting' ? 'Connecting video stream with stranger...' : 'Connecting...'}
                        </p>
                        <p className="text-xs text-neutral-500">Handshake establishing via WebRTC P2P</p>
                    </div>
                )}

                {/* Local User Picture-in-Picture Floating Camera */}
                <div className="absolute bottom-4 right-4 w-32 sm:w-40 h-44 sm:h-52 bg-neutral-950 rounded-2xl border-2 border-neutral-700/80 shadow-2xl overflow-hidden z-10">
                    {localStream && !videoOff ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover scale-x-[-1]"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-xs text-neutral-400 font-semibold bg-neutral-900 gap-1">
                            <VideoOff className="w-5 h-5 text-neutral-500" />
                            <span>Camera Off</span>
                        </div>
                    )}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium">
                        You
                    </span>
                </div>

                {/* Text Chat Drawer Overlay */}
                <InCallChat roomId={roomId} />

            </div>

            {/* Bottom Controls Bar (Omegle Fast Controls) */}
            <div className="w-full px-6 py-4 bg-neutral-950 border-t border-neutral-800/80 flex items-center justify-between">
                
                {/* Left: Leave / Stop Button */}
                <button
                    type="button"
                    onClick={handleEnd}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-all cursor-pointer border border-neutral-800"
                >
                    <PhoneOff className="w-4 h-4 text-red-400" />
                    <span>Stop Chat</span>
                </button>

                {/* Center: Mic & Cam Toggles */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleAudio}
                        className={`p-3 rounded-full transition-all cursor-pointer ${
                            audioMuted
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-neutral-900 text-neutral-200 hover:bg-neutral-800 border border-neutral-800'
                        }`}
                        title={audioMuted ? "Unmute Mic" : "Mute Mic"}
                    >
                        {audioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                        type="button"
                        onClick={toggleVideo}
                        className={`p-3 rounded-full transition-all cursor-pointer ${
                            videoOff
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-neutral-900 text-neutral-200 hover:bg-neutral-800 border border-neutral-800'
                        }`}
                        title={videoOff ? "Turn Video On" : "Turn Video Off"}
                    >
                        {videoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    </button>
                </div>

                {/* Right: NEXT STRANGER (Primary Action) */}
                <button
                    type="button"
                    onClick={handleSkip}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-sm transition-all active:scale-95 shadow-lg shadow-white/10 cursor-pointer group"
                >
                    <span>Next Stranger</span>
                    <FastForward className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

            </div>

            {/* Report Modal */}
            {showReportModal && (
                <ReportModal
                    reportedUser={matchedPeer}
                    roomId={roomId}
                    onClose={() => setShowReportModal(false)}
                />
            )}

        </div>
    );
};

export default VideoCallScreen;
