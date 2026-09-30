import React from 'react';
import { useNavigate } from 'react-router';

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
                    
                    {/* Minimalist Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight text-neutral-900">
                            Nexus
                        </span>
                    </div>

                    {/* Nav Items */}
                    <div className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-600">
                        <button onClick={() => scrollToSection('service-chat')} className="hover:text-black transition-colors cursor-pointer">Messaging</button>
                        <button onClick={() => scrollToSection('service-calling')} className="hover:text-black transition-colors cursor-pointer">HD Calls</button>
                        <button onClick={() => scrollToSection('service-files')} className="hover:text-black transition-colors cursor-pointer">File Transfer</button>
                        <button onClick={() => scrollToSection('service-payments')} className="hover:text-black transition-colors cursor-pointer">Payments</button>
                    </div>

                    {/* Nav Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-xs font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="text-xs font-semibold bg-black text-white px-4 py-1.5 rounded-full hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer shadow-sm"
                        >
                            Get Started
                        </button>
                    </div>

                </div>
            </header>

            {/* ------------------------------------------------------------- */}
            {/* PAGE 1: HERO / MAIN OVERVIEW */}
            {/* ------------------------------------------------------------- */}
            <section className="min-h-screen pt-28 pb-16 px-6 max-w-6xl mx-auto flex flex-col justify-center items-center text-center relative">
                
                {/* Main Apple Light Headline */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-neutral-900 mb-8 leading-[1.05]">
                    Everything connected. <br />
                    <span className="text-neutral-400">Built for speed.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-neutral-600 text-base sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-normal">
                    Nexus delivers a unified suite of real-time communication tools—engineered with zero latency, bank-grade encryption, and seamless Apple light design.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => scrollToSection('service-chat')}
                        className="px-8 py-3.5 bg-black text-white font-semibold rounded-full hover:bg-neutral-800 transition-all text-sm active:scale-95 cursor-pointer shadow-lg shadow-neutral-300"
                    >
                        Explore Services ↓
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-3.5 bg-white border border-neutral-300 text-neutral-800 hover:text-black font-semibold rounded-full hover:bg-neutral-100 transition-all text-sm active:scale-95 cursor-pointer shadow-sm"
                    >
                        Create Free Account
                    </button>
                </div>

            </section>


            {/* ------------------------------------------------------------- */}
            {/* PAGE 2: SERVICE 01 - REALTIME MESSAGING */}
            {/* ------------------------------------------------------------- */}
            <section id="service-chat" className="min-h-screen py-24 px-6 max-w-6xl mx-auto flex flex-col justify-center border-t border-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Text Column */}
                    <div className="lg:col-span-5 text-left">
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-3 block">
                            Service 01 / Realtime Messaging
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-6 leading-tight">
                            Ultra-Fast Chat Engine.
                        </h2>
                        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 font-normal">
                            Built on direct WebSocket connections, Nexus messaging delivers your conversations in real time with zero lag. Features live typing indicators, delivery status, presence updates, and complete privacy.
                        </p>
                        
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                <span>Sub-millisecond latency socket connection</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                <span>End-to-End message encryption</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                <span>Rich media embeds & code syntax highlighting</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors flex items-center gap-2 cursor-pointer"
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
                                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 font-semibold">Direct Chat Engine</span>
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

                            <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-between items-center text-[10px] text-neutral-400 font-mono font-medium">
                                <span>Status: Connected</span>
                                <span>WebSocket SSL Secured</span>
                            </div>

                        </div>
                    </div>

                </div>
            </section>


            {/* ------------------------------------------------------------- */}
            {/* PAGE 3: SERVICE 02 - HD AUDIO & VIDEO CALLING */}
            {/* ------------------------------------------------------------- */}
            <section id="service-calling" className="min-h-screen py-24 px-6 max-w-6xl mx-auto flex flex-col justify-center border-t border-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Apple Light Style SVG Graphic Illustration (Left on desktop) */}
                    <div className="lg:col-span-7 flex justify-center order-2 lg:order-1">
                        <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl shadow-neutral-200/60 relative overflow-hidden group hover:border-neutral-300 transition-all">
                            
                            {/* Call Header */}
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                    <span className="text-[11px] font-semibold text-neutral-900">Live HD Video Stream</span>
                                </div>
                                <span className="text-[10px] uppercase font-mono text-neutral-400 font-semibold">4K 60fps</span>
                            </div>

                            {/* SVG Video Frame Graphic */}
                            <svg className="w-full h-auto" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Main Video Card Background */}
                                <rect x="10" y="10" width="380" height="220" rx="16" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                                
                                {/* User Avatar Circle */}
                                <circle cx="200" cy="100" r="36" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
                                <path d="M185 145 C185 125, 215 125, 215 145" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />

                                {/* Audio Waveform Spectrum Bar */}
                                <rect x="140" y="165" width="4" height="24" rx="2" fill="#0F172A" />
                                <rect x="152" y="155" width="4" height="44" rx="2" fill="#64748B" />
                                <rect x="164" y="145" width="4" height="64" rx="2" fill="#0F172A" />
                                <rect x="176" y="160" width="4" height="34" rx="2" fill="#94A3B8" />
                                <rect x="188" y="140" width="4" height="74" rx="2" fill="#0F172A" />
                                <rect x="200" y="150" width="4" height="54" rx="2" fill="#64748B" />
                                <rect x="212" y="145" width="4" height="64" rx="2" fill="#0F172A" />
                                <rect x="224" y="160" width="4" height="34" rx="2" fill="#94A3B8" />
                                <rect x="236" y="155" width="4" height="44" rx="2" fill="#0F172A" />
                                <rect x="248" y="165" width="4" height="24" rx="2" fill="#64748B" />

                                {/* Call Controls Floating Pill */}
                                <rect x="120" y="195" width="160" height="28" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
                                <circle cx="150" cy="209" r="7" fill="#CBD5E1" />
                                <circle cx="200" cy="209" r="9" fill="#EF4444" />
                                <circle cx="250" cy="209" r="7" fill="#CBD5E1" />
                            </svg>

                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="lg:col-span-5 text-left order-1 lg:order-2">
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-3 block">
                            Service 02 / HD Voice & Video
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-6 leading-tight">
                            Crystal-Clear Calls. Anywhere.
                        </h2>
                        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 font-normal">
                            High-definition audio and video calling powered by WebRTC technology. Seamlessly connects peers across low-bandwidth environments with noise suppression and adaptive bitrates.
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                <span>WebRTC Peer-to-Peer infrastructure</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                <span>AI Background Noise Cancellation</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                <span>One-click instant call join without apps</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <span>Explore Calling</span>
                            <span>→</span>
                        </button>
                    </div>

                </div>
            </section>


            {/* ------------------------------------------------------------- */}
            {/* PAGE 4: SERVICE 03 - SECURE FILE SHARING */}
            {/* ------------------------------------------------------------- */}
            <section id="service-files" className="min-h-screen py-24 px-6 max-w-6xl mx-auto flex flex-col justify-center border-t border-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Text Column */}
                    <div className="lg:col-span-5 text-left">
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-3 block">
                            Service 03 / File & Media Sharing
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-6 leading-tight">
                            Original Quality. Zero Compression.
                        </h2>
                        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 font-normal">
                            Share 4K video clips, RAW photo archives, software builds, and heavy documents instantly without quality reduction. High-speed transfers protected by chunked encryption.
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                <span>Uncompressed full-resolution media</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                <span>High-speed cloud chunking engine</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                <span>Auto-expiry link controls</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <span>Start Sharing</span>
                            <span>→</span>
                        </button>
                    </div>

                    {/* Apple Light Style SVG Graphic Illustration */}
                    <div className="lg:col-span-7 flex justify-center">
                        <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl shadow-neutral-200/60 relative overflow-hidden group hover:border-neutral-300 transition-all">
                            
                            {/* File Transfer Header */}
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-black" />
                                    <span className="text-xs font-semibold text-neutral-900">Project_Assets_4K.zip</span>
                                </div>
                                <span className="text-[10px] font-mono text-neutral-400 font-semibold">2.4 GB / 85MB/s</span>
                            </div>

                            {/* SVG File Transfer Mockup */}
                            <svg className="w-full h-auto" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Container background */}
                                <rect x="20" y="20" width="360" height="180" rx="14" fill="#F8FAFC" stroke="#E2E8F0" />

                                {/* File Icon Representation */}
                                <rect x="40" y="45" width="48" height="60" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                                <path d="M70 45 L88 63 L88 105 L40 105" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                                <text x="48" y="85" fill="#0F172A" fontSize="10" fontWeight="bold" fontFamily="sans-serif">ZIP</text>

                                {/* File Name & Subtext */}
                                <rect x="104" y="55" width="160" height="10" rx="5" fill="#0F172A" />
                                <rect x="104" y="75" width="100" height="8" rx="4" fill="#94A3B8" />

                                {/* Upload Progress Bar */}
                                <rect x="40" y="130" width="320" height="10" rx="5" fill="#E2E8F0" />
                                <rect x="40" y="130" width="240" height="10" rx="5" fill="#0071E3" />

                                {/* Progress stats */}
                                <text x="40" y="165" fill="#64748B" fontSize="11" fontFamily="sans-serif" fontWeight="500">75% Uploaded</text>
                                <text x="310" y="165" fill="#10B981" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Ultra-Fast</text>
                            </svg>

                        </div>
                    </div>

                </div>
            </section>


            {/* ------------------------------------------------------------- */}
            {/* PAGE 5: SERVICE 04 - IN-CHAT WALLET & PAYMENTS */}
            {/* ------------------------------------------------------------- */}
            <section id="service-payments" className="min-h-screen py-24 px-6 max-w-6xl mx-auto flex flex-col justify-center border-t border-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Apple Light Style SVG Graphic Illustration (Left on desktop) */}
                    <div className="lg:col-span-7 flex justify-center order-2 lg:order-1">
                        <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl shadow-neutral-200/60 relative overflow-hidden group hover:border-neutral-300 transition-all">
                            
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                                <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 font-semibold">Nexus Pay Card</span>
                                <span className="text-[10px] font-mono text-emerald-600 font-bold">● Encrypted Transfer</span>
                            </div>

                            {/* SVG Digital Credit Card / Payment Flow */}
                            <svg className="w-full h-auto" viewBox="0 0 400 230" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Digital Card Shape */}
                                <rect x="30" y="20" width="340" height="190" rx="20" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                                
                                {/* Card Chip */}
                                <rect x="60" y="50" width="40" height="30" rx="6" fill="#E2E8F0" stroke="#CBD5E1" />
                                <line x1="60" y1="65" x2="100" y2="65" stroke="#94A3B8" />

                                {/* Card Brand */}
                                <circle cx="320" cy="65" r="14" fill="#0071E3" fillOpacity="0.8" />
                                <circle cx="335" cy="65" r="14" fill="#0F172A" fillOpacity="0.3" />

                                {/* Payment Success Pill */}
                                <rect x="60" y="110" width="280" height="44" rx="22" fill="#FFFFFF" stroke="#E2E8F0" />
                                <circle cx="85" cy="132" r="10" fill="#10B981" />
                                <path d="M81 132 L84 135 L90 129" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <text x="105" y="136" fill="#0F172A" fontSize="13" fontWeight="600" fontFamily="sans-serif">$250.00 Sent to Alex</text>

                                {/* Bottom card number string */}
                                <text x="60" y="185" fill="#94A3B8" fontSize="12" fontFamily="monospace">•••• •••• •••• 8842</text>
                            </svg>

                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="lg:col-span-5 text-left order-1 lg:order-2">
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-3 block">
                            Service 04 / Peer-to-Peer Payments
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-6 leading-tight">
                            Send Money in Conversation.
                        </h2>
                        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 font-normal">
                            Transfer money directly inside any chat thread. Request payments, split bills, and manage digital balance instantly with zero extra app switching.
                        </p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                <span>Instant Peer-to-Peer transfers</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                <span>Bank-level security & multi-factor verification</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                <span>Zero transaction fee for friends & family</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <span>Setup Wallet</span>
                            <span>→</span>
                        </button>
                    </div>

                </div>
            </section>


            {/* ------------------------------------------------------------- */}
            {/* FOOTER & FINAL CTA (LIGHT MODE) */}
            {/* ------------------------------------------------------------- */}
            <footer className="border-t border-neutral-200 py-24 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900 mb-6">
                        Ready to experience Nexus?
                    </h2>
                    <p className="text-neutral-600 text-sm sm:text-base mb-10 max-w-lg mx-auto font-normal">
                        Join thousands using the ultimate all-in-one Apple Light communication platform today.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-3.5 bg-black text-white font-semibold rounded-full hover:bg-neutral-800 transition-all text-sm active:scale-95 cursor-pointer mb-16 shadow-lg shadow-neutral-300"
                    >
                        Create Your Free Account
                    </button>

                    <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500 gap-4">
                        <span>Copyright © {new Date().getFullYear()} Nexus Inc. All rights reserved.</span>
                        <div className="flex gap-6">
                            <span className="hover:text-black cursor-pointer transition-colors font-medium">Privacy Policy</span>
                            <span className="hover:text-black cursor-pointer transition-colors font-medium">Terms of Service</span>
                            <span className="hover:text-black cursor-pointer transition-colors font-medium">Security</span>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Publicpage;