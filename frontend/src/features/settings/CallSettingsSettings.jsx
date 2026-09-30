import React, { useState, useEffect } from 'react';
import { useMediaPreview } from './hooks/useMediaPreview';
import { AppleGroupedList, AppleGroupedRow } from './components/AppleGroupedList';
import { IOSSwitch } from './components/IOSSwitch';
import { Camera, Mic, Video, Volume2, ShieldAlert } from 'lucide-react';

const CallSettingsSettings = () => {
    const [cameras, setCameras] = useState([]);
    const [mics, setMics] = useState([]);

    const [selectedCamera, setSelectedCamera] = useState(
        () => localStorage.getItem('nexus_camera_id') || ''
    );
    const [selectedMic, setSelectedMic] = useState(
        () => localStorage.getItem('nexus_mic_id') || ''
    );

    const [mirrorVideo, setMirrorVideo] = useState(
        () => localStorage.getItem('nexus_mirror_video') !== 'false'
    );
    const [hdQuality, setHdQuality] = useState(
        () => localStorage.getItem('nexus_hd_quality') !== 'false'
    );

    const [saveToast, setSaveToast] = useState(false);

    // Dedicated Media Preview Hook
    const {
        videoRef,
        previewState,
        errorMessage,
        autoStoppedNotice,
        micVolume,
        startPreview,
        stopPreview
    } = useMediaPreview(selectedCamera, selectedMic);

    // Enumerate Available Media Input Devices
    useEffect(() => {
        let isMounted = true;

        const enumerateHardware = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                if (!isMounted) return;

                const videoInputs = devices.filter((d) => d.kind === 'videoinput');
                const audioInputs = devices.filter((d) => d.kind === 'audioinput');

                setCameras(videoInputs);
                setMics(audioInputs);

                if (!selectedCamera && videoInputs.length > 0) {
                    setSelectedCamera(videoInputs[0].deviceId);
                    localStorage.setItem('nexus_camera_id', videoInputs[0].deviceId);
                }
                if (!selectedMic && audioInputs.length > 0) {
                    setSelectedMic(audioInputs[0].deviceId);
                    localStorage.setItem('nexus_mic_id', audioInputs[0].deviceId);
                }
            } catch (err) {
                console.warn('Failed to enumerate media devices:', err);
            }
        };

        enumerateHardware();

        return () => {
            isMounted = false;
        };
    }, []);

    const triggerToast = () => {
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2000);
    };

    const handleCameraChange = (e) => {
        const id = e.target.value;
        stopPreview();
        setSelectedCamera(id);
        localStorage.setItem('nexus_camera_id', id);
        triggerToast();
    };

    const handleMicChange = (e) => {
        const id = e.target.value;
        stopPreview();
        setSelectedMic(id);
        localStorage.setItem('nexus_mic_id', id);
        triggerToast();
    };

    const toggleMirror = (val) => {
        setMirrorVideo(val);
        localStorage.setItem('nexus_mirror_video', String(val));
        triggerToast();
    };

    const toggleHd = (val) => {
        setHdQuality(val);
        localStorage.setItem('nexus_hd_quality', String(val));
        triggerToast();
    };

    return (
        <div className="w-full text-left flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Call Settings</h1>
                    <p className="text-sm text-[#86868B] mt-1 font-normal">
                        Camera, microphone hardware inputs and video stream options
                    </p>
                </div>
                {saveToast && (
                    <span className="px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-medium shadow-sm animate-in fade-in">
                        Saved
                    </span>
                )}
            </div>

            {/* 1. Camera & Microphone Hardware Devices */}
            <AppleGroupedList header="HARDWARE INPUTS">
                {/* Camera Selector */}
                <div className="min-h-[56px] px-4 sm:px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-[#1D1D1F]">
                            <Camera className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-normal text-[#1D1D1F]">Camera</p>
                            <p className="text-xs text-[#86868B]">Select video input device</p>
                        </div>
                    </div>
                    <select
                        value={selectedCamera}
                        onChange={handleCameraChange}
                        className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-semibold text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-black cursor-pointer max-w-[180px] sm:max-w-xs truncate"
                    >
                        {cameras.length === 0 ? (
                            <option value="">Default Camera</option>
                        ) : (
                            cameras.map((c, i) => (
                                <option key={c.deviceId || i} value={c.deviceId}>
                                    {c.label || `Camera ${i + 1}`}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                {/* Microphone Selector */}
                <div className="min-h-[56px] px-4 sm:px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-[#1D1D1F]">
                            <Mic className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-normal text-[#1D1D1F]">Microphone</p>
                            <p className="text-xs text-[#86868B]">Select audio input device</p>
                        </div>
                    </div>
                    <select
                        value={selectedMic}
                        onChange={handleMicChange}
                        className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-semibold text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-black cursor-pointer max-w-[180px] sm:max-w-xs truncate"
                    >
                        {mics.length === 0 ? (
                            <option value="">Default Microphone</option>
                        ) : (
                            mics.map((m, i) => (
                                <option key={m.deviceId || i} value={m.deviceId}>
                                    {m.label || `Microphone ${i + 1}`}
                                </option>
                            ))
                        )}
                    </select>
                </div>
            </AppleGroupedList>

            {/* 2. Video Preview Surface */}
            <div className="bg-white rounded-2xl border border-neutral-200/70 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#1D1D1F]" />
                        <span className="text-xs font-medium tracking-wide text-[#86868B] uppercase">CAMERA PREVIEW</span>
                    </div>
                    {previewState === 'live' && (
                        <button
                            type="button"
                            onClick={stopPreview}
                            className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                            Turn off preview
                        </button>
                    )}
                </div>

                {autoStoppedNotice && (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-medium">
                        Camera preview auto-stopped after 60 seconds to save power.
                    </div>
                )}

                {/* Preview Box State Switch */}
                <div className="w-full h-56 sm:h-64 bg-[#1D1D1F] rounded-xl overflow-hidden relative flex items-center justify-center">
                    {previewState === 'live' ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover ${mirrorVideo ? 'scale-x-[-1]' : ''}`}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mb-3">
                                <Camera className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-semibold text-white">Camera is off</p>
                            <p className="text-xs text-neutral-400 mt-1 max-w-xs font-normal">
                                {errorMessage || 'Preview is turned off to save battery and camera resources.'}
                            </p>

                            {previewState === 'denied' ? (
                                <div className="mt-4 px-4 py-2 bg-red-950/80 border border-red-800 text-red-200 rounded-xl text-xs flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={startPreview}
                                    disabled={previewState === 'requesting'}
                                    className="mt-4 px-5 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-semibold transition-all cursor-pointer shadow-md"
                                >
                                    {previewState === 'requesting' ? 'Connecting camera...' : 'Turn on preview'}
                                </button>
                            )}
                        </div>
                    )}

                    {previewState === 'live' && (
                        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-white font-semibold tracking-wider uppercase">
                            Live Stream
                        </div>
                    )}
                </div>

                {/* Mic Volume Meter Bar */}
                {previewState === 'live' && (
                    <div className="flex items-center gap-3 pt-2">
                        <Volume2 className="w-4 h-4 text-[#86868B]" />
                        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-black transition-all duration-75 rounded-full"
                                style={{ width: `${micVolume}%` }}
                            />
                        </div>
                        <span className="text-xs text-[#86868B] font-medium w-8 text-right">{micVolume}%</span>
                    </div>
                )}
            </div>

            {/* 3. Stream Video Quality Options */}
            <AppleGroupedList header="VIDEO OPTIONS" footer="Mirroring flips your local preview feed. HD quality requires high bandwidth.">
                <AppleGroupedRow
                    label="Mirror My Video"
                    subtitle="Flip video preview horizontally"
                    control={<IOSSwitch checked={mirrorVideo} onChange={toggleMirror} ariaLabel="Mirror video" />}
                />
                <AppleGroupedRow
                    label="High Definition (HD Quality)"
                    subtitle="Stream 720p/1080p high resolution video"
                    control={<IOSSwitch checked={hdQuality} onChange={toggleHd} ariaLabel="HD Quality" />}
                />
            </AppleGroupedList>
        </div>
    );
};

export default CallSettingsSettings;
