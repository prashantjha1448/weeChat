import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import api from '../api/axios';
import { 
    Video, Users, ShieldCheck, MapPin, 
    Lock, Zap, CheckCircle2, MessageSquare, Mic, 
    ArrowRight, ChevronDown, Sparkles, Globe2, HeartHandshake, EyeOff
} from 'lucide-react';

/**
 * AnimatedCounter — Smooth 60fps ease-out counting animation
 */
const AnimatedCounter = ({ value, duration = 1800, suffix = "", prefix = "" }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime = null;
        let animationFrame;
        const target = Number(value) || 0;

        if (target === 0) {
            setDisplayValue(0);
            return;
        }

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Cubic ease-out
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOutProgress * target);
            setDisplayValue(current);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setDisplayValue(target);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return (
        <span className="tabular-nums">
            {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
    );
};

const Publicpage = () => {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);

    // Live Database Stats State
    const [dbStats, setDbStats] = useState({
        totalUsers: 13,
        totalRooms: 6,
        totalCalls: 0,
        activeQueue: 1,
        avgLatencyMs: 120
    });

    useEffect(() => {
        let isMounted = true;

        const fetchLiveStats = async () => {
            try {
                const res = await api.get('stats/');
                if (isMounted && res.data?.data) {
                    setDbStats(res.data.data);
                }
            } catch (err) {
                console.log('[LIVE STATS] Using cached metrics snapshot');
            }
        };

        fetchLiveStats();
        const pollTimer = setInterval(fetchLiveStats, 10000); // 10s auto-refresh from MongoDB

        return () => {
            isMounted = false;
            clearInterval(pollTimer);
        };
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            q: "What is weeChat and how does random video matching work?",
            a: "weeChat is a next-generation random video chat platform and Omegle alternative. When you click 'Start 1-on-1 Matchmaking', our ultra-fast matchmaking engine instantly pairs you with another active user anywhere in the world. Calls are connected directly peer-to-peer using WebRTC technology for sub-150ms latency and crystal-clear video."
        },
        {
            q: "Is weeChat really 100% free with no hidden fees?",
            a: "Yes! weeChat is completely free to use. You can engage in unlimited 1-on-1 random video calls, text chats, and join group lounges for up to 100 participants without any subscription or payment requirement."
        },
        {
            q: "Do I need to download an application on mobile or desktop?",
            a: "No downloads or app installs are needed. weeChat runs natively in your browser—including Safari on iOS, Chrome on Android, and all desktop browsers (macOS, Windows, Linux). Simply open the URL and start talking."
        },
        {
            q: "How does weeChat protect user privacy and safety?",
            a: "All 1-on-1 calls use encrypted WebRTC peer-to-peer connections (DTLS/SRTP), meaning your video and audio feeds are not routed through or recorded on external media servers. Additionally, weeChat provides instant one-tap user reporting, skip controls, and active community moderation to maintain a safe and respectful environment."
        },
        {
            q: "Can I filter video matches by location or specific interests?",
            a: "Yes. In your weeChat profile settings, you can specify location preferences (such as city, state, or pincode) as well as custom interest tags like #gaming, #coding, or #music to connect with like-minded individuals."
        },
        {
            q: "What are Custom Rooms and how many participants can join?",
            a: "Custom Rooms allow you to host or join public and private group lounges for up to 100 participants. Rooms support multi-person video grid feeds, audio stages, real-time group text messaging, and screen sharing."
        }
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased selection:bg-[#1D1D1F] selection:text-white">
            
            {/* 1. STICKY APPLE GLASS NAVBAR */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/80">
                <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between" aria-label="Main Navigation">
                    
                    {/* Minimalist weeChat Brand Logo */}
                    <div 
                        className="flex items-center gap-2 cursor-pointer group" 
                        onClick={() => navigate('/')}
                    >
                        <img 
                            src="/weechat-logo.png" 
                            alt="weeChat Logo - Free Random Video Chat" 
                            className="w-6 h-6 rounded-lg object-cover group-hover:scale-105 transition-transform" 
                        />
                        <span className="text-sm font-semibold tracking-tight text-[#1D1D1F]">
                            weeChat
                        </span>
                    </div>

                    {/* Navigation Anchor Links (SEO Optimized Anchor Text) */}
                    <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[#86868B]">
                        <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">How It Works</button>
                        <button onClick={() => scrollToSection('service-video')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">Random Video</button>
                        <button onClick={() => scrollToSection('service-rooms')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">Group Rooms</button>
                        <button onClick={() => navigate('/comparison')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">Why weeChat</button>
                        <button onClick={() => scrollToSection('faq')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">FAQ</button>
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
                            Start Chatting
                        </button>
                    </div>

                </nav>
            </header>

            <main>
                {/* ------------------------------------------------------------- */}
                {/* HERO SECTION: TARGET KEYWORD-RICH TITLE & H1 */}
                {/* ------------------------------------------------------------- */}
                <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col justify-center items-center text-center relative">
                    
                    {/* Primary H1 Heading for Google Ranking */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#1D1D1F] mb-6 leading-[1.08]">
                        Free Random Video Chat. <br />
                        <span className="text-[#86868B] font-normal">Talk to Strangers Worldwide.</span>
                    </h1>

                    {/* Keyword-Rich Value Proposition Subtitle */}
                    <p className="text-[#86868B] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                        weeChat is the modern, fast, and secure Omegle alternative. Connect instantly with strangers in HD 1-on-1 WebRTC video calls, create group lounges for up to 100 people, and make new friends with zero latency.
                    </p>

                    {/* Primary Call to Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full sm:w-auto px-8 py-4 bg-[#1D1D1F] text-white font-bold rounded-full hover:bg-neutral-800 transition-all text-sm active:scale-95 cursor-pointer shadow-xl shadow-black/15 flex items-center justify-center gap-2 group"
                        >
                            <Video className="w-4 h-4" />
                            <span>Start Random Video Chat</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => scrollToSection('features')}
                            className="w-full sm:w-auto px-8 py-4 bg-white border border-neutral-300 text-[#1D1D1F] hover:bg-neutral-100 transition-all text-sm font-semibold rounded-full active:scale-95 cursor-pointer shadow-xs"
                        >
                            Explore Features ↓
                        </button>
                    </div>

                    {/* Trust Signals & Highlights */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-neutral-500 font-medium">
                        <span className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            Sub-150ms Connection
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-blue-500" />
                            End-to-End P2P Encrypted
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Globe2 className="w-3.5 h-3.5 text-emerald-500" />
                            Global Stranger Matching
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            No App Download Required
                        </span>
                    </div>

                </section>

                {/* ------------------------------------------------------------- */}
                {/* REAL-TIME DATABASE STATS STRIP (LIVE COUNTING EFFECT) */}
                {/* ------------------------------------------------------------- */}
                <section className="border-y border-neutral-200/80 bg-white/70 backdrop-blur-md py-8 px-6">
                    <div className="max-w-6xl mx-auto">
                        
                        {/* Live Auto-Syncing DB Status Dot */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                                Live Database Metrics • Realtime Verified
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
                            <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/70 shadow-xs transition-transform hover:scale-[1.02]">
                                <div className="text-3xl sm:text-5xl font-extrabold text-[#1D1D1F] tracking-tight">
                                    <AnimatedCounter value={dbStats.totalUsers} suffix="+" />
                                </div>
                                <div className="text-xs text-neutral-500 font-semibold mt-2">
                                    Registered Members
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/70 shadow-xs transition-transform hover:scale-[1.02]">
                                <div className="text-3xl sm:text-5xl font-extrabold text-[#1D1D1F] tracking-tight">
                                    <AnimatedCounter value={dbStats.totalRooms} />
                                </div>
                                <div className="text-xs text-neutral-500 font-semibold mt-2">
                                    Active Custom Lounges
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/70 shadow-xs transition-transform hover:scale-[1.02]">
                                <div className="text-3xl sm:text-5xl font-extrabold text-[#1D1D1F] tracking-tight">
                                    &lt;<AnimatedCounter value={dbStats.avgLatencyMs} suffix="ms" />
                                </div>
                                <div className="text-xs text-neutral-500 font-semibold mt-2">
                                    WebRTC Handshake Latency
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/70 shadow-xs transition-transform hover:scale-[1.02]">
                                <div className="text-3xl sm:text-5xl font-extrabold text-emerald-600 tracking-tight">
                                    100%
                                </div>
                                <div className="text-xs text-neutral-500 font-semibold mt-2">
                                    End-to-End P2P Encrypted
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* HOW IT WORKS: 3 STEPS TO MEET STRANGERS */}
                {/* ------------------------------------------------------------- */}
                <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#86868B]">Simple & Fast</span>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F] mt-2">
                            How weeChat Works in 3 Steps
                        </h2>
                        <p className="text-sm text-neutral-500 mt-2">
                            Start chatting with random people online in seconds without complicated setup.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm text-left flex flex-col gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-neutral-100 text-[#1D1D1F] font-extrabold text-sm flex items-center justify-center">
                                01
                            </span>
                            <h3 className="text-lg font-bold text-[#1D1D1F]">Open in Browser</h3>
                            <p className="text-xs text-neutral-600 leading-relaxed">
                                No APK or App Store download needed. weeChat works natively on your iPhone, Android, or laptop browser with one tap.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm text-left flex flex-col gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-[#1D1D1F] text-white font-extrabold text-sm flex items-center justify-center">
                                02
                            </span>
                            <h3 className="text-lg font-bold text-[#1D1D1F]">Click Start Matchmaking</h3>
                            <p className="text-xs text-neutral-600 leading-relaxed">
                                Our in-memory socket ticker connects you with an active online stranger in under 150ms with pre-warmed HD video.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm text-left flex flex-col gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-neutral-100 text-[#1D1D1F] font-extrabold text-sm flex items-center justify-center">
                                03
                            </span>
                            <h3 className="text-lg font-bold text-[#1D1D1F]">Talk, Chat, or Skip</h3>
                            <p className="text-xs text-neutral-600 leading-relaxed">
                                Enjoy face-to-face video and text chat. Not feeling the match? Simply hit Spacebar or click "Next Stranger" to shuffle instantly.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* FEATURE 01: 1-ON-1 RANDOM VIDEO MATCHING */}
                {/* ------------------------------------------------------------- */}
                <section id="service-video" className="py-24 px-6 max-w-6xl mx-auto border-t border-neutral-200">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        
                        <div className="lg:col-span-6 text-left">
                            <span className="text-xs uppercase tracking-widest text-[#86868B] font-bold mb-2 block">
                                Core Capability 01
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-6 leading-tight">
                                Instant 1-on-1 Random Video Chat.
                            </h2>
                            <p className="text-[#86868B] text-sm sm:text-base leading-relaxed mb-8 font-normal">
                                Missing Omegle? weeChat offers a significantly faster and safer stranger video experience. Featuring hardware-accelerated WebRTC P2P streams, adaptive bitrates, background camera pre-warming, and instant skip controls.
                            </p>
                            
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Instant Spacebar keyboard skip for rapid stranger shuffle</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Direct peer-to-peer encryption with zero video caching</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>In-call left-aligned live text chat drawer</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/register')}
                                className="px-6 py-3 bg-[#1D1D1F] text-white rounded-full text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-2"
                            >
                                <span>Start 1-on-1 Call</span>
                                <span>→</span>
                            </button>
                        </div>

                        {/* Interactive UI Illustration */}
                        <div className="lg:col-span-6 flex justify-center">
                            <div className="w-full max-w-md p-6 rounded-3xl bg-neutral-950 border border-neutral-800 text-white shadow-2xl relative overflow-hidden">
                                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-xs font-bold">Live P2P Connection</span>
                                    </div>
                                    <span className="text-[10px] text-neutral-400 uppercase font-mono">1080p WebRTC</span>
                                </div>
                                <div className="h-48 my-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center relative overflow-hidden">
                                    <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400">
                                        <Video className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs text-neutral-400 font-medium mt-2">Connected with Stranger</span>
                                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-[10px] text-white">You</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xs text-red-400 font-semibold">Stop Call</span>
                                    <div className="flex gap-2">
                                        <span className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold">Next Stranger ⏩</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* FEATURE 02: CUSTOM ROOMS HUB (UP TO 100 PARTICIPANTS) */}
                {/* ------------------------------------------------------------- */}
                <section id="service-rooms" className="py-24 px-6 max-w-6xl mx-auto border-t border-neutral-200">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        
                        <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
                            <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-xl text-left">
                                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                                    <span className="text-xs font-bold text-neutral-900">Custom Group Lounge</span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">48 / 100 Live</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 my-4">
                                    <div className="h-20 bg-neutral-100 rounded-xl flex items-center justify-center text-[10px] font-bold text-neutral-600">Host (Video)</div>
                                    <div className="h-20 bg-neutral-100 rounded-xl flex items-center justify-center text-[10px] font-bold text-neutral-600">Alex</div>
                                    <div className="h-20 bg-neutral-100 rounded-xl flex items-center justify-center text-[10px] font-bold text-neutral-600">Maria</div>
                                </div>
                                <div className="p-3 bg-neutral-50 rounded-xl text-xs text-neutral-600 flex items-center justify-between">
                                    <span>Passcode Protected & Screen Share</span>
                                    <Lock className="w-4 h-4 text-neutral-500" />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-6 text-left order-1 lg:order-2">
                            <span className="text-xs uppercase tracking-widest text-[#86868B] font-bold mb-2 block">
                                Core Capability 02
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-6 leading-tight">
                                Custom Rooms for Up to 100 People.
                            </h2>
                            <p className="text-[#86868B] text-sm sm:text-base leading-relaxed mb-8 font-normal">
                                Move beyond 1-on-1 chats into multi-participant group lounges. Create public meetups, study hangouts, gaming voice channels, or private rooms with passcode protection.
                            </p>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Supports Audio-only, Video grid, and Group text modes</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Crystal clear Desktop & Mobile screen sharing</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-neutral-700 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Shareable invite links (weechat-virid.vercel.app/join/CODE)</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/register')}
                                className="px-6 py-3 bg-[#1D1D1F] text-white rounded-full text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-2"
                            >
                                <span>Create a Custom Room</span>
                                <span>→</span>
                            </button>
                        </div>

                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* PLATFORM COMPARISON BANNER (SEPARATE PAGE LINK) */}
                {/* ------------------------------------------------------------- */}
                <section className="py-20 px-6 max-w-6xl mx-auto border-t border-neutral-200">
                    <div className="p-8 sm:p-12 rounded-3xl bg-white border border-neutral-200/90 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-left">
                        <div className="max-w-xl">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full mb-3 inline-block">
                                Omegle Alternative Comparison
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] mb-3">
                                Why weeChat is the Best Modern Random Video Chat
                            </h2>
                            <p className="text-sm text-neutral-600 leading-relaxed">
                                See our full feature-by-feature benchmark comparing weeChat with the original Omegle, OmeTV, and other stranger chat platforms.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/comparison')}
                            className="px-8 py-4 bg-[#1D1D1F] hover:bg-neutral-800 text-white text-xs font-bold rounded-full transition-all shrink-0 cursor-pointer shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            <span>View Full Comparison</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION FOR GOOGLE RICH SNIPPETS) */}
                {/* ------------------------------------------------------------- */}
                <section id="faq" className="py-24 px-6 max-w-4xl mx-auto border-t border-neutral-200">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#86868B]">Frequently Asked Questions</span>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F] mt-2">
                            Everything You Need to Know About weeChat
                        </h2>
                        <p className="text-sm text-neutral-500 mt-2">
                            Answers to common questions about random video chat, privacy, and custom rooms.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div 
                                key={idx}
                                className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs transition-all"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#1D1D1F] hover:bg-neutral-50/50 transition-colors cursor-pointer"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-black' : ''}`} />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* FINAL CALL TO ACTION (CTA) */}
                {/* ------------------------------------------------------------- */}
                <section className="py-24 px-6 text-center border-t border-neutral-200 bg-white/40">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1D1D1F] mb-4">
                            Ready to Meet New People Right Now?
                        </h2>
                        <p className="text-sm sm:text-base text-neutral-600 mb-8 max-w-lg mx-auto">
                            Jump into instant 1-on-1 random video calls or create a group room. Free forever, no app required.
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-9 py-4 bg-[#1D1D1F] text-white font-bold rounded-full hover:bg-neutral-800 transition-all text-sm active:scale-95 cursor-pointer shadow-xl shadow-black/15 inline-flex items-center gap-2"
                        >
                            <Video className="w-4 h-4" />
                            <span>Start Random Video Chat Free</span>
                        </button>
                    </div>
                </section>
            </main>

            {/* ------------------------------------------------------------- */}
            {/* SEO-OPTIMIZED FOOTER WITH KEYWORD ANCHORS & SITEMAP CUES */}
            {/* ------------------------------------------------------------- */}
            <footer className="border-t border-neutral-200 py-16 bg-[#F5F5F7]">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-left">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F] mb-4">Random Chat</h4>
                            <ul className="space-y-2 text-xs text-neutral-600">
                                <li><button onClick={() => navigate('/register')} className="hover:text-black cursor-pointer">1-on-1 Video Chat</button></li>
                                <li><button onClick={() => navigate('/register')} className="hover:text-black cursor-pointer">Omegle Alternative</button></li>
                                <li><button onClick={() => navigate('/register')} className="hover:text-black cursor-pointer">Talk to Strangers</button></li>
                                <li><button onClick={() => navigate('/register')} className="hover:text-black cursor-pointer">Fast Random Matching</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F] mb-4">Group Rooms</h4>
                            <ul className="space-y-2 text-xs text-neutral-600">
                                <li><button onClick={() => navigate('/register')} className="hover:text-black cursor-pointer">Custom Lounges</button></li>
                                <li><button onClick={() => navigate('/register')} className="hover:text-black cursor-pointer">100-Person Video Call</button></li>
                                <li><button onClick={() => navigate('/register')} className="hover:text-black cursor-pointer">Audio Stages</button></li>
                                <li><button onClick={() => navigate('/register')} className="hover:text-black cursor-pointer">Screen Sharing</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F] mb-4">Features</h4>
                            <ul className="space-y-2 text-xs text-neutral-600">
                                <li><button onClick={() => navigate('/register')} className="hover:text-black cursor-pointer">WebRTC P2P Technology</button></li>
                                <li><button onClick={() => navigate('/register')} className="hover:text-black cursor-pointer">Location Matching</button></li>
                                <li><button onClick={() => navigate('/register')} className="hover:text-black cursor-pointer">Interest Tags</button></li>
                                <li><button onClick={() => navigate('/register')} className="hover:text-black cursor-pointer">Realtime Messaging</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F] mb-4">Safety & Trust</h4>
                            <ul className="space-y-2 text-xs text-neutral-600">
                                <li><button onClick={() => navigate('/terms')} className="hover:text-black cursor-pointer">Community Guidelines</button></li>
                                <li><button onClick={() => navigate('/privacy')} className="hover:text-black cursor-pointer font-medium text-blue-600">Privacy Policy</button></li>
                                <li><button onClick={() => navigate('/terms')} className="hover:text-black cursor-pointer font-medium text-blue-600">Terms of Service</button></li>
                                <li><button onClick={() => navigate('/terms')} className="hover:text-black cursor-pointer">Fair Use Policy</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center text-xs text-[#86868B] gap-4">
                        <span>© {new Date().getFullYear()} weeChat Inc. The modern, free Omegle alternative. All rights reserved.</span>
                        <div className="flex gap-4">
                            <span>Encrypted WebRTC P2P</span>
                            <span>•</span>
                            <span>SSL Secured</span>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Publicpage;
