import React from 'react';
import { useNavigate } from 'react-router';
import { 
    Video, Users, ShieldCheck, MapPin, Sliders, 
    Lock, Zap, CheckCircle2, MessageSquare, Mic, MonitorUp, ArrowRight 
} from 'lucide-react';

const Publicpage = () => {
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased selection:bg-[#1D1D1F] selection:text-white">
            
            {/* 1. Apple Light Glass Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/80">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    
                    {/* Minimalist weeChat Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-4 h-4 rounded-full bg-[#1D1D1F] flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight text-[#1D1D1F]">
                            weeChat
                        </span>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[#86868B]">
                        <button onClick={() => scrollToSection('service-messaging')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">Messaging</button>
                        <button onClick={() => scrollToSection('service-video')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">1-on-1 Video</button>
                        <button onClick={() => scrollToSection('service-rooms')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">Custom Rooms (100 Max)</button>
                        <button onClick={() => scrollToSection('service-location')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">Location Matching</button>
                    </div>

                    {/* Nav Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="text-xs font-semibold bg-[#1D1D1F] text-white px-4 py-1.5 rounded-full hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer shadow-xs"
                        >
                            Get Started
                        </button>
                    </div>

                </div>
            </header>

            {/* ------------------------------------------------------------- */}
            {/* HERO SECTION (APPLE THEME) */}
            {/* ------------------------------------------------------------- */}
            <section className="min-h-screen pt-28 pb-16 px-6 max-w-6xl mx-auto flex flex-col justify-center items-center text-center relative">
                
                {/* Main Apple Light Headline */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#1D1D1F] mb-8 leading-[1.05]">
                    Everything connected. <br />
                    <span className="text-[#86868B] font-normal">Built for speed.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-[#86868B] text-base sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-normal">
                    weeChat delivers a unified suite of real-time communication tools—engineered with zero latency, bank-grade encryption, and seamless Apple light design.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => scrollToSection('service-messaging')}
                        className="px-8 py-3.5 bg-[#1D1D1F] text-white font-semibold rounded-full hover:bg-neutral-800 transition-all text-sm active:scale-95 cursor-pointer shadow-lg shadow-neutral-300"
                    >
                        Explore Services ↓
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-3.5 bg-white border border-neutral-300 text-[#1D1D1F] hover:bg-neutral-100 transition-all text-sm font-semibold rounded-full active:scale-95 cursor-pointer shadow-xs"
                    >
                        Create Free Account
                    </button>
                </div>

            </section>

            {/* ------------------------------------------------------------- */}
            {/* SERVICE 01: REALTIME MESSAGING */}
            {/* ------------------------------------------------------------- */}
            <section id="service-messaging" className="min-h-screen py-24 px-6 max-w-6xl mx-auto flex flex-col justify-center border-t border-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Text Column */}
                    <div className="lg:col-span-5 text-left">
                        <span className="text-xs uppercase tracking-widest text-[#86868B] font-bold mb-3 block">
                            Service 01 / Realtime Messaging
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-6 leading-tight">
                            Ultra-Fast Chat Engine.
                        </h2>
                        <p className="text-[#86868B] text-sm sm:text-base leading-relaxed mb-8 font-normal">
                            Built on direct WebSocket connections, weeChat messaging delivers your conversations in real time with zero lag. Features live typing indicators, delivery status, presence updates, and complete privacy.
                        </p>
                        
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
                                <span>Sub-millisecond latency socket connection</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
                                <span>End-to-End message encryption & presence</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
                                <span>Rich media embeds & in-room group chat</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="text-xs font-bold text-[#1D1D1F] hover:text-neutral-600 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <span>Try Messaging Free</span>
                            <span>→</span>
                        </button>
                    </div>

                    {/* Apple Light Style SVG Graphic Illustration */}
                    <div className="lg:col-span-7 flex justify-center">
                        <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl shadow-neutral-200/60 relative overflow-hidden group hover:border-neutral-300 transition-all">
                            
                            {/* Window Header */}
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-neutral-300" />
                                    <div className="w-3 h-3 rounded-full bg-neutral-300" />
                                    <div className="w-3 h-3 rounded-full bg-neutral-300" />
                                </div>
                                <span className="text-[10px] uppercase font-mono tracking-widest text-[#86868B] font-semibold">Direct Chat Engine</span>
                            </div>

                            {/* SVG UI Mockup */}
                            <svg className="w-full h-auto" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Receiver Bubble */}
                                <rect x="20" y="20" width="220" height="48" rx="14" fill="#F3F4F6" />
                                <rect x="36" y="34" width="140" height="8" rx="4" fill="#9CA3AF" />
                                <rect x="36" y="48" width="90" height="6" rx="3" fill="#D1D5DB" />

                                {/* Sender Bubble */}
                                <rect x="160" y="84" width="220" height="56" rx="14" fill="#0071E3" />
                                <rect x="176" y="98" width="160" height="8" rx="4" fill="#FFFFFF" />
                                <rect x="176" y="114" width="110" height="6" rx="3" fill="#BFDBFE" />
                                <circle cx="362" cy="125" r="4" fill="#10B981" />

                                {/* Typing Bubble */}
                                <rect x="20" y="156" width="90" height="40" rx="14" fill="#F3F4F6" />
                                <circle cx="45" cy="176" r="4" fill="#9CA3AF" className="animate-pulse" />
                                <circle cx="65" cy="176" r="4" fill="#6B7280" className="animate-pulse" />
                                <circle cx="85" cy="176" r="4" fill="#111827" className="animate-pulse" />
                            </svg>

                            <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-between items-center text-[10px] text-[#86868B] font-mono font-medium">
                                <span>Status: Connected</span>
                                <span>WebSocket SSL Secured</span>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* SERVICE 02: 1-ON-1 RANDOM VIDEO MATCHING */}
            {/* ------------------------------------------------------------- */}
            <section id="service-video" className="min-h-screen py-24 px-6 max-w-6xl mx-auto flex flex-col justify-center border-t border-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* SVG Graphic (Left on desktop) */}
                    <div className="lg:col-span-7 flex justify-center order-2 lg:order-1">
                        <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl shadow-neutral-200/60 relative overflow-hidden group hover:border-neutral-300 transition-all">
                            
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                                    <span className="text-xs font-semibold text-[#1D1D1F]">1-on-1 WebRTC Video Session</span>
                                </div>
                                <span className="text-[10px] uppercase font-mono text-[#86868B] font-semibold">HD 1080P</span>
                            </div>

                            <svg className="w-full h-auto" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="10" y="10" width="380" height="220" rx="16" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                                <circle cx="200" cy="100" r="36" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
                                <path d="M185 145 C185 125, 215 125, 215 145" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />

                                <rect x="280" y="25" width="95" height="65" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                                <circle cx="327" cy="50" r="10" fill="#E2E8F0" />

                                <rect x="120" y="195" width="160" height="28" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
                                <circle cx="150" cy="209" r="7" fill="#CBD5E1" />
                                <circle cx="200" cy="209" r="9" fill="#EF4444" />
                                <circle cx="250" cy="209" r="7" fill="#CBD5E1" />
                            </svg>

                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="lg:col-span-5 text-left order-1 lg:order-2">
                        <span className="text-xs uppercase tracking-widest text-[#86868B] font-bold mb-3 block">
                            Service 02 / 1-on-1 Video Chat
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-6 leading-tight">
                            Instant Video Match.
                        </h2>
                        <p className="text-[#86868B] text-sm sm:text-base leading-relaxed mb-8 font-normal">
                            High-definition 1-on-1 video calling powered by WebRTC technology. Connect instantly with verified users with noise suppression, adaptive bitrates, and hardware acceleration.
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
                                <span>WebRTC Peer-to-Peer video infrastructure</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
                                <span>Instant queueing & candidate skip controls</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
                                <span>Real-time in-call text chat overlay</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="text-xs font-bold text-[#1D1D1F] hover:text-neutral-600 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <span>Explore 1-on-1 Match</span>
                            <span>→</span>
                        </button>
                    </div>

                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* SERVICE 03: CUSTOM ROOMS HUB (UP TO 100 PEOPLE) */}
            {/* ------------------------------------------------------------- */}
            <section id="service-rooms" className="min-h-screen py-24 px-6 max-w-6xl mx-auto flex flex-col justify-center border-t border-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Text Column */}
                    <div className="lg:col-span-5 text-left">
                        <span className="text-xs uppercase tracking-widest text-[#86868B] font-bold mb-3 block">
                            Service 03 / Custom Rooms Hub
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-6 leading-tight">
                            Rooms for Up to 100 People.
                        </h2>
                        <p className="text-[#86868B] text-sm sm:text-base leading-relaxed mb-8 font-normal">
                            Host public or private custom rooms for community discussions, audio lounges, or multi-participant video calls with screen sharing capabilities.
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
                                <span>Video Call Grid, Audio Lounges & Text Chat</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
                                <span>Screen sharing & in-room group chat</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
                                <span>Passcode protection for private custom rooms</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="text-xs font-bold text-[#1D1D1F] hover:text-neutral-600 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <span>Launch Custom Room</span>
                            <span>→</span>
                        </button>
                    </div>

                    {/* SVG Multi-Participant Room Graphic */}
                    <div className="lg:col-span-7 flex justify-center">
                        <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl shadow-neutral-200/60 relative overflow-hidden group hover:border-neutral-300 transition-all">
                            
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-neutral-700" />
                                    <span className="text-xs font-semibold text-[#1D1D1F]">weeChat Multi-Participant Lounge</span>
                                </div>
                                <span className="text-[10px] font-mono text-emerald-600 font-bold">● 48 / 100 Online</span>
                            </div>

                            <svg className="w-full h-auto" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="15" y="15" width="115" height="85" rx="12" fill="#F8FAFC" stroke="#E2E8F0" />
                                <circle cx="72" cy="48" r="15" fill="#E2E8F0" />
                                <text x="48" y="82" fill="#1D1D1F" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Host Alex</text>

                                <rect x="142" y="15" width="115" height="85" rx="12" fill="#F8FAFC" stroke="#E2E8F0" />
                                <circle cx="200" cy="48" r="15" fill="#E2E8F0" />
                                <text x="178" y="82" fill="#1D1D1F" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Sarah</text>

                                <rect x="270" y="15" width="115" height="85" rx="12" fill="#F8FAFC" stroke="#E2E8F0" />
                                <circle cx="327" cy="48" r="15" fill="#E2E8F0" />
                                <text x="306" y="82" fill="#1D1D1F" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Rahul</text>

                                <rect x="15" y="112" width="370" height="92" rx="12" fill="#1D1D1F" />
                                <text x="145" y="152" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">💻 Screen Share Active</text>
                                <text x="130" y="172" fill="#86868B" fontSize="9" fontFamily="sans-serif">Multi-participant audio + video + chat</text>
                            </svg>

                        </div>
                    </div>

                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* SERVICE 04: PINCODE, GPS & CUSTOM TAG PREFERENCES */}
            {/* ------------------------------------------------------------- */}
            <section id="service-location" className="min-h-screen py-24 px-6 max-w-6xl mx-auto flex flex-col justify-center border-t border-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* SVG Graphic (Left on desktop) */}
                    <div className="lg:col-span-7 flex justify-center order-2 lg:order-1">
                        <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl shadow-neutral-200/60 relative overflow-hidden group hover:border-neutral-300 transition-all">
                            
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                                <span className="text-xs uppercase font-mono tracking-widest text-[#86868B] font-semibold">Match Preferences Card</span>
                                <span className="text-[10px] font-mono text-emerald-600 font-bold">● DB Saved</span>
                            </div>

                            <svg className="w-full h-auto" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="20" y="20" width="360" height="180" rx="16" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                                
                                <rect x="40" y="40" width="155" height="42" rx="10" fill="#FFFFFF" stroke="#CBD5E1" />
                                <text x="52" y="58" fill="#86868B" fontSize="9" fontFamily="sans-serif">INTERESTED IN</text>
                                <text x="52" y="73" fill="#1D1D1F" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Anyone (All Genders)</text>

                                <rect x="205" y="40" width="155" height="42" rx="10" fill="#FFFFFF" stroke="#CBD5E1" />
                                <text x="217" y="58" fill="#86868B" fontSize="9" fontFamily="sans-serif">AGE RANGE</text>
                                <text x="217" y="73" fill="#1D1D1F" fontSize="11" fontWeight="bold" fontFamily="sans-serif">18 – 60 years</text>

                                <rect x="40" y="95" width="320" height="42" rx="10" fill="#FFFFFF" stroke="#CBD5E1" />
                                <text x="52" y="113" fill="#86868B" fontSize="9" fontFamily="sans-serif">LOCATION MATCHING</text>
                                <text x="52" y="128" fill="#1D1D1F" fontSize="11" fontWeight="bold" fontFamily="sans-serif">📍 Mumbai (Pincode: 400001)</text>

                                <rect x="40" y="150" width="90" height="26" rx="13" fill="#1D1D1F" />
                                <text x="55" y="167" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">#Coding</text>

                                <rect x="138" y="150" width="90" height="26" rx="13" fill="#1D1D1F" />
                                <text x="153" y="167" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">#Gaming</text>

                                <rect x="236" y="150" width="90" height="26" rx="13" fill="#1D1D1F" />
                                <text x="251" y="167" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">#Music</text>
                            </svg>

                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="lg:col-span-5 text-left order-1 lg:order-2">
                        <span className="text-xs uppercase tracking-widest text-[#86868B] font-bold mb-3 block">
                            Service 04 / Smart Preferences
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-6 leading-tight">
                            Pincode, GPS & Custom Tags.
                        </h2>
                        <p className="text-[#86868B] text-sm sm:text-base leading-relaxed mb-8 font-normal">
                            Filter candidate matches exactly how you want. Target specific genders, age limits, pincodes/city locations, or match based on custom interest tags.
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
                                <span>Interested In: Anyone, Male, Female, Non-Binary, LGBTQ+, Other</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
                                <span>Match by Pincode, City Name, State, or GPS location</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
                                <span>Custom Interest Tags (up to 5 custom tags)</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="text-xs font-bold text-[#1D1D1F] hover:text-neutral-600 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <span>Configure Preferences</span>
                            <span>→</span>
                        </button>
                    </div>

                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* FOOTER & FINAL CTA (APPLE LIGHT MODE) */}
            {/* ------------------------------------------------------------- */}
            <footer className="border-t border-neutral-200 py-24 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1D1D1F] mb-6">
                        Ready to experience weeChat?
                    </h2>
                    <p className="text-[#86868B] text-sm sm:text-base mb-10 max-w-lg mx-auto font-normal">
                        Join thousands using the ultimate all-in-one Apple Light communication platform today.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-3.5 bg-[#1D1D1F] text-white font-semibold rounded-full hover:bg-neutral-800 transition-all text-sm active:scale-95 cursor-pointer mb-16 shadow-lg shadow-neutral-300"
                    >
                        Create Your Free Account
                    </button>

                    <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center text-xs text-[#86868B] gap-4">
                        <span>Copyright © {new Date().getFullYear()} weeChat Inc. All rights reserved.</span>
                        <div className="flex gap-6">
                            <span onClick={() => navigate('/login')} className="hover:text-[#1D1D1F] cursor-pointer transition-colors font-medium">Privacy Policy</span>
                            <span onClick={() => navigate('/login')} className="hover:text-[#1D1D1F] cursor-pointer transition-colors font-medium">Terms of Service</span>
                            <span onClick={() => navigate('/login')} className="hover:text-[#1D1D1F] cursor-pointer transition-colors font-medium">Security</span>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Publicpage;