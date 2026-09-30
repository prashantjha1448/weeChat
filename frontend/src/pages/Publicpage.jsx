import React from 'react';
import { useNavigate } from 'react-router';
import { 
    Video, Users, ShieldCheck, MapPin, Sparkles, Sliders, 
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
        <div className="min-h-screen bg-[#F5F5F7] text-neutral-900 font-sans antialiased selection:bg-black selection:text-white">
            
            {/* 1. Apple Light Glass Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/80">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    
                    {/* Minimalist Nexus Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <span className="text-sm font-bold tracking-tight text-neutral-900">
                            Nexus
                        </span>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-600">
                        <button onClick={() => scrollToSection('feature-video')} className="hover:text-black transition-colors cursor-pointer">1-on-1 Video Chat</button>
                        <button onClick={() => scrollToSection('feature-rooms')} className="hover:text-black transition-colors cursor-pointer">Custom Rooms (100 Max)</button>
                        <button onClick={() => scrollToSection('feature-preferences')} className="hover:text-black transition-colors cursor-pointer">Location & Preferences</button>
                        <button onClick={() => scrollToSection('feature-security')} className="hover:text-black transition-colors cursor-pointer">Security & Protection</button>
                    </div>

                    {/* Nav Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-xs font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer px-3 py-1.5"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="text-xs font-semibold bg-black text-white px-4 py-1.5 rounded-full hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer shadow-xs"
                        >
                            Get Started
                        </button>
                    </div>

                </div>
            </header>

            {/* ------------------------------------------------------------- */}
            {/* HERO SECTION */}
            {/* ------------------------------------------------------------- */}
            <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col justify-center items-center text-center">
                
                {/* Feature Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900/5 border border-neutral-200 text-neutral-800 text-xs font-semibold mb-6 animate-in fade-in">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>1-on-1 Random Video + Custom Multi-Participant Rooms</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-neutral-900 mb-8 leading-[1.04]">
                    Meet Anyone, Anywhere. <br />
                    <span className="text-neutral-400 font-bold">Built for Real-Time Speed.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-neutral-600 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                    Nexus combines instant 1-on-1 WebRTC random video matching with custom group rooms for up to 100 participants—filtered by Pincode location, age range, and interest tags.
                </p>

                {/* Hero CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center mb-14">
                    <button
                        onClick={() => navigate('/register')}
                        className="w-full sm:w-auto px-8 py-3.5 bg-black text-white font-semibold rounded-full hover:bg-neutral-800 transition-all text-sm active:scale-95 cursor-pointer shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                    >
                        <span>Start Video Match Now</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full sm:w-auto px-8 py-3.5 bg-white border border-neutral-300 text-neutral-800 hover:text-black font-semibold rounded-full hover:bg-neutral-100 transition-all text-sm active:scale-95 cursor-pointer shadow-xs"
                    >
                        Explore Custom Rooms
                    </button>
                </div>

                {/* Key Metric Highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-8 border-t border-neutral-200/80">
                    <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-2xs text-left">
                        <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 block">100 Max</span>
                        <span className="text-xs text-neutral-500 font-medium">Custom Room Capacity</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-2xs text-left">
                        <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 block">&lt; 50ms</span>
                        <span className="text-xs text-neutral-500 font-medium">WebRTC Peer Latency</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-2xs text-left">
                        <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 block">GPS & Pin</span>
                        <span className="text-xs text-neutral-500 font-medium">Location Matching</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-2xs text-left">
                        <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 block">Zero-Trust</span>
                        <span className="text-xs text-neutral-500 font-medium">HttpOnly JWT Security</span>
                    </div>
                </div>

            </section>

            {/* ------------------------------------------------------------- */}
            {/* FEATURE 1: 1-ON-1 RANDOM VIDEO MATCHING */}
            {/* ------------------------------------------------------------- */}
            <section id="feature-video" className="py-24 px-6 max-w-6xl mx-auto border-t border-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Text Column */}
                    <div className="lg:col-span-5 text-left">
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-3 block">
                            FEATURE 01 / 1-ON-1 RANDOM CHAT
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 mb-6 leading-tight">
                            Instant 1-on-1 Video Matching.
                        </h2>
                        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 font-normal">
                            Connect with verified users around the globe or in your local area with one tap. Powered by high-speed WebRTC peer-to-peer video, in-call messaging, and instant queueing.
                        </p>
                        
                        <div className="space-y-3.5 mb-8">
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Peer-to-Peer WebRTC video with hardware acceleration</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Integrated in-call chat & participant controls</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Instant skip & next candidate queueing</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-3 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                        >
                            <Video className="w-4 h-4" />
                            <span>Try 1-on-1 Video Match</span>
                        </button>
                    </div>

                    {/* SVG Graphic Illustration: 1-on-1 Call Overlay */}
                    <div className="lg:col-span-7 flex justify-center">
                        <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl shadow-neutral-200/60 relative overflow-hidden group hover:border-neutral-300 transition-all">
                            
                            {/* Window Header */}
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                                    <span className="text-xs font-bold text-neutral-900">1-on-1 WebRTC Video Session</span>
                                </div>
                                <span className="text-[10px] font-mono tracking-widest text-neutral-400 font-bold">HD 1080P</span>
                            </div>

                            {/* SVG UI Mockup */}
                            <svg className="w-full h-auto" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Main Peer Video Screen */}
                                <rect x="10" y="10" width="380" height="220" rx="16" fill="#111827" />
                                <circle cx="200" cy="95" r="32" fill="#374151" />
                                <path d="M185 135 C185 115, 215 115, 215 135" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
                                
                                {/* Self Small Video PIP Box */}
                                <rect x="280" y="25" width="95" height="65" rx="10" fill="#1F2937" stroke="#4B5563" strokeWidth="2" />
                                <circle cx="327" cy="50" r="10" fill="#4B5563" />

                                {/* Live Video Status Badge */}
                                <rect x="25" y="25" width="105" height="24" rx="12" fill="rgba(0,0,0,0.6)" />
                                <circle cx="37" cy="37" r="4" fill="#10B981" />
                                <text x="47" y="41" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Live Match</text>

                                {/* Controls Pill */}
                                <rect x="110" y="185" width="180" height="34" rx="17" fill="#FFFFFF" />
                                <circle cx="140" cy="202" r="9" fill="#E5E7EB" />
                                <circle cx="170" cy="202" r="9" fill="#E5E7EB" />
                                <circle cx="200" cy="202" r="11" fill="#EF4444" />
                                <circle cx="230" cy="202" r="9" fill="#E5E7EB" />
                                <circle cx="260" cy="202" r="9" fill="#E5E7EB" />
                            </svg>

                        </div>
                    </div>

                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* FEATURE 2: CUSTOM ROOMS HUB (UP TO 100 PARTICIPANTS) */}
            {/* ------------------------------------------------------------- */}
            <section id="feature-rooms" className="py-24 px-6 max-w-6xl mx-auto border-t border-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* SVG Graphic Illustration (Left) */}
                    <div className="lg:col-span-7 flex justify-center order-2 lg:order-1">
                        <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl shadow-neutral-200/60 relative overflow-hidden group hover:border-neutral-300 transition-all">
                            
                            {/* Room Header */}
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-purple-600" />
                                    <span className="text-xs font-bold text-neutral-900">Tech & Gaming Lounge</span>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                    48 / 100 Online
                                </span>
                            </div>

                            {/* SVG Multi-Participant Grid Graphic */}
                            <svg className="w-full h-auto" viewBox="0 0 400 230" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Grid Box 1 */}
                                <rect x="15" y="15" width="115" height="90" rx="12" fill="#F3F4F6" stroke="#E5E7EB" />
                                <circle cx="72" cy="50" r="16" fill="#D1D5DB" />
                                <text x="45" y="88" fill="#374151" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Host Alex</text>

                                {/* Grid Box 2 */}
                                <rect x="142" y="15" width="115" height="90" rx="12" fill="#F3F4F6" stroke="#E5E7EB" />
                                <circle cx="200" cy="50" r="16" fill="#D1D5DB" />
                                <text x="175" y="88" fill="#374151" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Sarah</text>

                                {/* Grid Box 3 */}
                                <rect x="270" y="15" width="115" height="90" rx="12" fill="#F3F4F6" stroke="#E5E7EB" />
                                <circle cx="327" cy="50" r="16" fill="#D1D5DB" />
                                <text x="305" y="88" fill="#374151" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Rahul</text>

                                {/* Screen Share Main Banner */}
                                <rect x="15" y="115" width="370" height="95" rx="12" fill="#111827" />
                                <text x="145" y="155" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">💻 Screen Share Active</text>
                                <text x="130" y="175" fill="#9CA3AF" fontSize="9" fontFamily="sans-serif">Multi-participant audio + video + chat</text>
                            </svg>

                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="lg:col-span-5 text-left order-1 lg:order-2">
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-3 block">
                            FEATURE 02 / CUSTOM ROOMS HUB
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 mb-6 leading-tight">
                            Group Rooms for Up to 100 People.
                        </h2>
                        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 font-normal">
                            Host public or private custom rooms for community meetups, gaming lounges, audio discussions, or group video calls with screen sharing.
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <Video className="w-4 h-4 text-purple-600 shrink-0" />
                                <span>Video Call Rooms, Audio Lounges & Text Chat</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <MonitorUp className="w-4 h-4 text-purple-600 shrink-0" />
                                <span>Screen sharing & in-room group chat</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <Lock className="w-4 h-4 text-purple-600 shrink-0" />
                                <span>Passcode protection for private custom rooms</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-3 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                        >
                            <Users className="w-4 h-4" />
                            <span>Create Custom Room</span>
                        </button>
                    </div>

                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* FEATURE 3: SMART MATCH PREFERENCES (LOCATION & TAGS) */}
            {/* ------------------------------------------------------------- */}
            <section id="feature-preferences" className="py-24 px-6 max-w-6xl mx-auto border-t border-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Text Column */}
                    <div className="lg:col-span-5 text-left">
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-3 block">
                            FEATURE 03 / SMART MATCH PREFERENCES
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 mb-6 leading-tight">
                            Pincode, GPS & Custom Tag Filters.
                        </h2>
                        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 font-normal">
                            Filter candidate matches exactly how you want. Target specific genders, age limits, pincodes/city locations, or match based on custom interest tags.
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <Sliders className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>Interested In: Anyone, Male, Female, Non-Binary, LGBTQ+, Other</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>Match by Pincode, City Name, State, or GPS location</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>Custom Interest Tags (up to 5 custom tags)</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-3 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                        >
                            <Sliders className="w-4 h-4" />
                            <span>Set Match Preferences</span>
                        </button>
                    </div>

                    {/* SVG Preferences Graphic */}
                    <div className="lg:col-span-7 flex justify-center">
                        <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl shadow-neutral-200/60 relative overflow-hidden group hover:border-neutral-300 transition-all">
                            
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                                <span className="text-xs font-bold text-neutral-900">Target Preference Filter Card</span>
                                <span className="text-[10px] font-mono text-blue-600 font-bold">Saved in DB</span>
                            </div>

                            <svg className="w-full h-auto" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Background Card */}
                                <rect x="20" y="20" width="360" height="180" rx="16" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                                
                                {/* Gender Dropdown box */}
                                <rect x="40" y="40" width="155" height="42" rx="10" fill="#FFFFFF" stroke="#CBD5E1" />
                                <text x="52" y="58" fill="#64748B" fontSize="9" fontFamily="sans-serif">INTERESTED IN</text>
                                <text x="52" y="73" fill="#0F172A" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Anyone (All Genders)</text>

                                {/* Age Range box */}
                                <rect x="205" y="40" width="155" height="42" rx="10" fill="#FFFFFF" stroke="#CBD5E1" />
                                <text x="217" y="58" fill="#64748B" fontSize="9" fontFamily="sans-serif">AGE RANGE</text>
                                <text x="217" y="73" fill="#0F172A" fontSize="11" fontWeight="bold" fontFamily="sans-serif">18 – 60 years</text>

                                {/* Location Box */}
                                <rect x="40" y="95" width="320" height="42" rx="10" fill="#FFFFFF" stroke="#CBD5E1" />
                                <text x="52" y="113" fill="#64748B" fontSize="9" fontFamily="sans-serif">LOCATION MATCHING</text>
                                <text x="52" y="128" fill="#0F172A" fontSize="11" fontWeight="bold" fontFamily="sans-serif">📍 Mumbai (Pincode: 400001)</text>

                                {/* Custom Interest Chips */}
                                <rect x="40" y="150" width="90" height="26" rx="13" fill="#0F172A" />
                                <text x="55" y="167" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">#Coding</text>

                                <rect x="138" y="150" width="90" height="26" rx="13" fill="#0F172A" />
                                <text x="153" y="167" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">#Gaming</text>

                                <rect x="236" y="150" width="90" height="26" rx="13" fill="#0F172A" />
                                <text x="251" y="167" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">#Music</text>
                            </svg>

                        </div>
                    </div>

                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* FEATURE 4: ENTERPRISE SECURITY & OBSERVABILITY */}
            {/* ------------------------------------------------------------- */}
            <section id="feature-security" className="py-24 px-6 max-w-6xl mx-auto border-t border-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* SVG Security Graphic (Left) */}
                    <div className="lg:col-span-7 flex justify-center order-2 lg:order-1">
                        <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl shadow-neutral-200/60 relative overflow-hidden group hover:border-neutral-300 transition-all">
                            
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <span className="text-xs font-bold text-neutral-900">Nexus Security Baseline</span>
                                </div>
                                <span className="text-[10px] font-mono text-emerald-600 font-bold">Hardened Baseline</span>
                            </div>

                            <svg className="w-full h-auto" viewBox="0 0 400 210" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="20" y="15" width="360" height="180" rx="16" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                                
                                {/* Shield Badge */}
                                <circle cx="65" cy="55" r="22" fill="#ECFDF5" stroke="#10B981" strokeWidth="2" />
                                <path d="M65 43 L74 48 V58 C74 65, 65 70, 65 70 C65 70, 56 65, 56 58 V48 L65 43 Z" fill="#10B981" />

                                <text x="100" y="50" fill="#0F172A" fontSize="12" fontWeight="bold" fontFamily="sans-serif">HttpOnly JWT & CSRF Protection</text>
                                <text x="100" y="66" fill="#64748B" fontSize="10" fontFamily="sans-serif">X-Requested-With header enforcement & bcrypt salt cost 12</text>

                                {/* Rate Limiter Row */}
                                <rect x="40" y="95" width="320" height="38" rx="10" fill="#FFFFFF" stroke="#CBD5E1" />
                                <text x="52" y="118" fill="#0F172A" fontSize="10" fontWeight="bold" fontFamily="sans-serif">⚡ Brute-Force Rate Limiter + Account Lockout after 5 Fails</text>

                                {/* Health Monitoring Row */}
                                <rect x="40" y="142" width="320" height="38" rx="10" fill="#FFFFFF" stroke="#CBD5E1" />
                                <text x="52" y="165" fill="#0F172A" fontSize="10" fontWeight="bold" fontFamily="sans-serif">💚 24/7 Liveness & Readiness Endpoints (/health & /ready)</text>
                            </svg>

                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="lg:col-span-5 text-left order-1 lg:order-2">
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-3 block">
                            FEATURE 04 / ENTERPRISE SECURITY
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 mb-6 leading-tight">
                            Bank-Grade Hardened Security.
                        </h2>
                        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 font-normal">
                            Engineered with zero-trust security standards: HttpOnly cookies, Express 5 non-mutating object sanitization, rate limiting, and 5-attempt account lockout.
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>JWT in HttpOnly cookies with SameSite cross-domain protection</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Automatic 15-minute account lockout after 5 failed attempts</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Zod environment validation & express-rate-limit protection</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-3 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Create Encrypted Account</span>
                        </button>
                    </div>

                </div>
            </section>

            {/* ------------------------------------------------------------- */}
            {/* FOOTER & FINAL CTA */}
            {/* ------------------------------------------------------------- */}
            <footer className="border-t border-neutral-200 py-24 text-center bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-6 h-6 text-amber-400" />
                    </div>

                    <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 mb-6">
                        Ready to Connect on Nexus?
                    </h2>
                    <p className="text-neutral-600 text-sm sm:text-base mb-10 max-w-lg mx-auto font-normal leading-relaxed">
                        Start instant 1-on-1 video chats or host custom group rooms for up to 100 participants today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center mb-16">
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full sm:w-auto px-8 py-3.5 bg-black text-white font-semibold rounded-full hover:bg-neutral-800 transition-all text-sm active:scale-95 cursor-pointer shadow-lg shadow-black/10"
                        >
                            Create Your Free Account
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-8 py-3.5 bg-neutral-100 border border-neutral-200 text-neutral-900 font-semibold rounded-full hover:bg-neutral-200 transition-all text-sm active:scale-95 cursor-pointer"
                        >
                            Sign In to Account
                        </button>
                    </div>

                    <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500 gap-4">
                        <span>Copyright © {new Date().getFullYear()} Nexus Inc. All rights reserved.</span>
                        <div className="flex gap-6">
                            <span onClick={() => navigate('/login')} className="hover:text-black cursor-pointer transition-colors font-medium">Privacy Policy</span>
                            <span onClick={() => navigate('/login')} className="hover:text-black cursor-pointer transition-colors font-medium">Terms of Service</span>
                            <span onClick={() => navigate('/login')} className="hover:text-black cursor-pointer transition-colors font-medium">Security Baseline</span>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Publicpage;