import React, { useEffect, useRef, useState } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import InCallChat from './InCallChat';
import ReportModal from './ReportModal';

/**
 * VideoCallScreen — Apple Light Theme 1-on-1 WebRTC Video Chat View with In-Call Chat & Report Modal
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
        toggleAudio,
        toggleVideo,
        skipCall
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

    const handleSkip = () => {
        skipCall();
        if (onSkip) onSkip();
    };

    return (
        <div className="w-full max-w-4xl p-6 rounded-3xl bg-white border border-neutral-200 shadow-2xl shadow-neutral-200/80 relative overflow-hidden flex flex-col items-center">
            
            {/* Top Peer Info Header */}
            <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                        <h4 className="text-sm font-bold text-neutral-900">{matchedPeer?.name || 'Matched Peer'}</h4>
                        <p className="text-[11px] text-neutral-500">@{matchedPeer?.username || 'username'} • {matchedPeer?.gender} • {matchedPeer?.city || 'India'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {matchScore || 85}% Compatible
                    </span>
                    <button
                        type="button"
                        onClick={() => setShowReportModal(true)}
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                    >
                        Report
                    </button>
                </div>
            </div>

            {/* Video Player Display Container */}
            <div className="w-full h-[400px] bg-neutral-900 rounded-2xl relative overflow-hidden flex items-center justify-center">
                
                {/* Remote Peer Video Stream */}
                {remoteStream ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover rounded-2xl"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-3 text-neutral-400">
                        <div className="w-12 h-12 rounded-full border-3 border-neutral-700 border-t-white animate-spin" />
                        <p className="text-xs font-medium">Connecting P2P Video Stream...</p>
                    </div>
                )}

                {/* Local User Picture-in-Picture Overlay */}
                <div className="absolute bottom-4 right-4 w-32 h-44 bg-neutral-800 rounded-2xl border-2 border-white shadow-xl overflow-hidden">
                    {localStream && !videoOff ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover scale-x-[-1]"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500 font-semibold bg-neutral-800">
                            Camera Off
                        </div>
                    )}
                </div>

            </div>

            {/* In-Call Text Chat Overlay */}
            <InCallChat roomId={roomId} />

            {/* Bottom Controls Bar (Apple Light Style) */}
            <div className="flex items-center gap-4 mt-6">
                
                {/* Mute Audio Button */}
                <button
                    type="button"
                    onClick={toggleAudio}
                    className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        audioMuted ? 'bg-red-500 text-white' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                >
                    {audioMuted ? 'Unmute Mic' : 'Mute Mic'}
                </button>

                {/* Camera Toggle Button */}
                <button
                    type="button"
                    onClick={toggleVideo}
                    className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        videoOff ? 'bg-red-500 text-white' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                >
                    {videoOff ? 'Turn Cam On' : 'Cam Off'}
                </button>

                {/* INSTANT NEXT / SKIP BUTTON */}
                <button
                    type="button"
                    onClick={handleSkip}
                    className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all active:scale-95 shadow-md shadow-neutral-300 cursor-pointer flex items-center gap-2"
                >
                    <span>Next / Skip</span>
                    <span>→</span>
                </button>

            </div>

            {/* Report Modal Popup */}
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
