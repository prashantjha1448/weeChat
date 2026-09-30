import React, { useEffect, useState } from 'react';
import VideoCallScreen from '../components/VideoCallScreen';
import { useSelector } from 'react-redux';
import { useProfile } from '../hooks/useProfile';
import { useMatchmaking } from '../hooks/useMatchmaking';

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    const {
        preference,
        interests,
        loadProfileAndPreferences,
        handleUpdatePreference
    } = useProfile();

    const {
        queueState,
        matchedPeer,
        callRoomId,
        isCaller,
        matchScore,
        joinQueue,
        leaveQueue
    } = useMatchmaking();

    const [selectedGender, setSelectedGender] = useState('any');
    const [selectedLocation, setSelectedLocation] = useState('anywhere');
    const [savedNotice, setSavedNotice] = useState(false);

    useEffect(() => {
        loadProfileAndPreferences();
    }, []);

    useEffect(() => {
        if (preference) {
            setSelectedGender(preference.gender || 'any');
            setSelectedLocation(preference.targetLocationMode || 'anywhere');
        }
    }, [preference]);

    const saveMatchFilter = async (gender, locationMode) => {
        setSelectedGender(gender);
        setSelectedLocation(locationMode);
        try {
            await handleUpdatePreference({
                gender,
                targetLocationMode: locationMode
            });
            setSavedNotice(true);
            setTimeout(() => setSavedNotice(false), 2500);
        } catch (err) {
            console.error("Failed to save filter", err);
        }
    };

    const handleNextSkip = () => {
        // Immediately re-queue user for next match (< 300ms transition)
        joinQueue();
    };

    return (
        <div className="w-full text-neutral-900 font-sans antialiased flex flex-col selection:bg-black selection:text-white">
            
            {/* Main Apple Light Hero / Video Call Screen */}
            <main className="flex-1 flex flex-col items-center text-center px-6 pt-10 pb-16 max-w-5xl mx-auto w-full">
                
                {/* Render Active Video Call Screen if Matched */}
                {queueState === 'matched' && callRoomId ? (
                    <VideoCallScreen
                        roomId={callRoomId}
                        isCaller={isCaller}
                        matchedPeer={matchedPeer}
                        matchScore={matchScore}
                        onSkip={handleNextSkip}
                        onEnd={leaveQueue}
                    />
                ) : (
                    /* Render Clean Hero & Matchmaking Queue Screen */
                    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center my-auto pt-8">

                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-3 leading-tight">
                            Welcome back, <span className="text-neutral-500">{user?.name || 'User'}</span>
                        </h1>

                        <p className="text-neutral-600 text-sm sm:text-base max-w-md mx-auto mb-10 leading-relaxed font-normal">
                            Connect instantly for 1-on-1 random WebRTC video calls with partners.
                        </p>

                        {/* REALTIME SOCKET MATCHMAKING QUEUE DISPLAY */}
                        {queueState === 'waiting' ? (
                            <div className="w-full p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl text-center flex flex-col items-center gap-4 animate-in fade-in">
                                <div className="w-10 h-10 border-3 border-neutral-300 border-t-black rounded-full animate-spin" />
                                <div>
                                    <p className="text-base font-semibold text-neutral-900">Searching for best match candidate...</p>
                                    <p className="text-xs text-neutral-500 mt-1">Matching algorithm evaluating queue</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={leaveQueue}
                                    className="mt-2 px-6 py-2 rounded-full bg-neutral-100 text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer transition-colors"
                                >
                                    Cancel Search
                                </button>
                            </div>
                        ) : (
                            /* Primary CTA Button */
                            <button
                                type="button"
                                onClick={joinQueue}
                                className="w-full max-w-md py-4 sm:py-4.5 rounded-full bg-black text-white font-semibold text-base sm:text-lg hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-xl shadow-black/10 cursor-pointer flex items-center justify-center gap-3 group"
                            >
                                <span>Start Random Matchmaking</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        )}

                    </div>
                )}

            </main>

        </div>
    );
};

export default Home;