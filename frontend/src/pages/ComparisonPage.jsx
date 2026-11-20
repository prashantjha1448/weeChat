import React from 'react';
import { useNavigate } from 'react-router';
import { 
    Video, ShieldCheck, Zap, Lock, Users, 
    CheckCircle2, XCircle, ArrowRight, ArrowLeft, Globe2, Sparkles 
} from 'lucide-react';

/**
 * ComparisonPage — Dedicated SEO Comparison Page
 * Route: /comparison & /why-weechat
 */
const ComparisonPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased selection:bg-[#1D1D1F] selection:text-white">
            
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/80">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div 
                        className="flex items-center gap-2 cursor-pointer group" 
                        onClick={() => navigate('/')}
                    >
                        <img 
                            src="/weechat-logo.png" 
                            alt="weeChat Logo" 
                            className="w-6 h-6 rounded-lg object-cover group-hover:scale-105 transition-transform" 
                        />
                        <span className="text-sm font-semibold tracking-tight text-[#1D1D1F]">
                            weeChat
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="text-xs font-semibold text-neutral-600 hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Home</span>
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="text-xs font-semibold bg-[#1D1D1F] text-white px-4 py-1.5 rounded-full hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer shadow-xs"
                        >
                            Start Chatting
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
                
                {/* Hero / Intro */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Platform Comparison</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#1D1D1F] mb-6 leading-tight">
                        Why weeChat is the Best Modern Random Video Chat
                    </h1>

                    <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
                        A detailed side-by-side comparison of how weeChat’s low-latency WebRTC technology outperforms legacy platforms like Omegle, OmeTV, and other random chat services.
                    </p>
                </div>

                {/* The Comparison Table */}
                <div className="w-full bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden mb-16">
                    <div className="p-6 sm:p-8 border-b border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900">Feature Breakdown</h2>
                            <p className="text-xs text-neutral-500 mt-0.5">Updated for 2026 performance benchmarks</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                            Verified Benchmarks
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="border-b border-neutral-200 bg-neutral-50/70">
                                    <th className="p-4 sm:p-5 font-bold text-neutral-900 w-1/4">Feature</th>
                                    <th className="p-4 sm:p-5 font-bold text-blue-600 w-1/4 bg-blue-50/30">weeChat</th>
                                    <th className="p-4 sm:p-5 font-bold text-neutral-500 w-1/4">Old Omegle</th>
                                    <th className="p-4 sm:p-5 font-bold text-neutral-500 w-1/4">Other Alternatives</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                <tr>
                                    <td className="p-4 sm:p-5 font-semibold text-neutral-900">
                                        Matching Speed
                                        <span className="block text-[11px] text-neutral-400 font-normal">Time to pair with a stranger</span>
                                    </td>
                                    <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30">
                                        ⚡ Instant &lt;150ms
                                    </td>
                                    <td className="p-4 sm:p-5 text-neutral-500">2–5 seconds</td>
                                    <td className="p-4 sm:p-5 text-neutral-500">Variable / Laggy</td>
                                </tr>

                                <tr>
                                    <td className="p-4 sm:p-5 font-semibold text-neutral-900">
                                        Video Resolution
                                        <span className="block text-[11px] text-neutral-400 font-normal">Camera stream quality</span>
                                    </td>
                                    <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30">
                                        1080p HD WebRTC
                                    </td>
                                    <td className="p-4 sm:p-5 text-neutral-500">360p Low Bitrate</td>
                                    <td className="p-4 sm:p-5 text-neutral-500">480p standard</td>
                                </tr>

                                <tr>
                                    <td className="p-4 sm:p-5 font-semibold text-neutral-900">
                                        Group Video Lounges
                                        <span className="block text-[11px] text-neutral-400 font-normal">Multi-participant rooms</span>
                                    </td>
                                    <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30">
                                        Yes (Up to 100 people)
                                    </td>
                                    <td className="p-4 sm:p-5 text-red-500 font-medium">No (1-on-1 only)</td>
                                    <td className="p-4 sm:p-5 text-red-500 font-medium">Paid add-on / None</td>
                                </tr>

                                <tr>
                                    <td className="p-4 sm:p-5 font-semibold text-neutral-900">
                                        Screen Sharing
                                        <span className="block text-[11px] text-neutral-400 font-normal">Presenting screen to others</span>
                                    </td>
                                    <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30">
                                        Built-in (Free)
                                    </td>
                                    <td className="p-4 sm:p-5 text-red-500 font-medium">Not supported</td>
                                    <td className="p-4 sm:p-5 text-neutral-500">Requires third-party app</td>
                                </tr>

                                <tr>
                                    <td className="p-4 sm:p-5 font-semibold text-neutral-900">
                                        Mobile Web Experience
                                        <span className="block text-[11px] text-neutral-400 font-normal">iOS Safari & Android Chrome</span>
                                    </td>
                                    <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30">
                                        Native in any browser
                                    </td>
                                    <td className="p-4 sm:p-5 text-neutral-500">Clunky desktop view</td>
                                    <td className="p-4 sm:p-5 text-neutral-500">Forced App Store install</td>
                                </tr>

                                <tr>
                                    <td className="p-4 sm:p-5 font-semibold text-neutral-900">
                                        Safety & Moderation
                                        <span className="block text-[11px] text-neutral-400 font-normal">Abuse prevention and reporting</span>
                                    </td>
                                    <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30">
                                        Active Shield Reporting
                                    </td>
                                    <td className="p-4 sm:p-5 text-red-500 font-medium">Unmoderated bots</td>
                                    <td className="p-4 sm:p-5 text-neutral-500">Basic captcha only</td>
                                </tr>

                                <tr>
                                    <td className="p-4 sm:p-5 font-semibold text-neutral-900">
                                        Cost / Subscriptions
                                        <span className="block text-[11px] text-neutral-400 font-normal">Pricing tier</span>
                                    </td>
                                    <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30">
                                        100% Free Forever
                                    </td>
                                    <td className="p-4 sm:p-5 text-neutral-500">Free (Ad supported)</td>
                                    <td className="p-4 sm:p-5 text-neutral-500">Coins / Paywalls</td>
                                </tr>

                                <tr>
                                    <td className="p-4 sm:p-5 font-semibold text-neutral-900">
                                        Spacebar Keyboard Skip
                                        <span className="block text-[11px] text-neutral-400 font-normal">Rapid stranger shuffle</span>
                                    </td>
                                    <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30">
                                        Supported (Space = Next)
                                    </td>
                                    <td className="p-4 sm:p-5 text-neutral-500">Esc twice</td>
                                    <td className="p-4 sm:p-5 text-red-500 font-medium">Mouse click only</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Deep Dive Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm text-left">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                            <Zap className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">Sub-150ms Connection Speed</h3>
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                            While legacy random chat sites relied on centralized relay servers that buffered video and introduced 2–5 second delays, weeChat connects you directly via WebRTC peer-to-peer tunnels. Signaling offers and ICE candidates are buffered in memory to ensure you connect immediately.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm text-left">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">Community Safety & Moderation</h3>
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                            One of the reasons Omegle was discontinued was the lack of effective moderation. weeChat implements real-time shield reporting, automated abuse flagging, and instantaneous user blocking to keep the community welcoming and safe.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm text-left">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                            <Users className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">Group Lounges Up to 100 People</h3>
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                            Don't want to chat with just one person? With weeChat Custom Rooms, you can host interactive lounges for up to 100 participants. Share your screen, collaborate on projects, or host live audio panels.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm text-left">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                            <Globe2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">No App Install Required</h3>
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                            Unlike apps that demand device permissions and invasive tracking, weeChat works directly in mobile Safari, Chrome, Edge, and Firefox. You get a clean, Apple-inspired interface without taking up phone storage.
                        </p>
                    </div>
                </div>

                {/* Bottom Call to Action Card */}
                <div className="p-10 sm:p-14 rounded-3xl bg-[#1D1D1F] text-white text-center flex flex-col items-center justify-center gap-6 shadow-2xl">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-xl">
                        Experience the Difference for Yourself
                    </h2>
                    <p className="text-sm text-neutral-400 max-w-md">
                        Join thousands of people chatting in real time. It takes less than 5 seconds to start.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-all text-sm active:scale-95 cursor-pointer flex items-center gap-2 shadow-lg"
                    >
                        <Video className="w-4 h-4" />
                        <span>Start Video Chat Free</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-200 py-10 bg-white text-center text-xs text-neutral-500">
                <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span>© {new Date().getFullYear()} weeChat Inc. The modern, free Omegle alternative.</span>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/')} className="hover:text-black cursor-pointer">Home</button>
                        <span>•</span>
                        <button onClick={() => navigate('/login')} className="hover:text-black cursor-pointer">Sign In</button>
                        <span>•</span>
                        <button onClick={() => navigate('/register')} className="hover:text-black cursor-pointer">Register</button>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default ComparisonPage;
