import React from 'react';
import { useNavigate } from 'react-router';
import { ShieldCheck, Lock, EyeOff, Server, Key, ArrowLeft, CheckCircle2 } from 'lucide-react';

/**
 * PrivacyPolicyPage — Comprehensive Data Protection & Privacy Policy
 * Route: /privacy
 */
const PrivacyPolicyPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased selection:bg-[#1D1D1F] selection:text-white">
            
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/80">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
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
                            weeChat Legal
                        </span>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="text-xs font-semibold text-neutral-600 hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Home</span>
                    </button>
                </div>
            </header>

            {/* Main Policy Content */}
            <main className="pt-28 pb-20 px-6 max-w-4xl mx-auto text-left">
                
                {/* Title */}
                <div className="border-b border-neutral-200/80 pb-8 mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Privacy & Data Protection</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1D1D1F]">
                        weeChat Privacy Policy
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-2">
                        Last Updated: November 20, 2026 • Effective Immediately
                    </p>
                </div>

                {/* Key Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                    <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex flex-col gap-2">
                        <EyeOff className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-sm font-bold text-neutral-900">Zero Video Recording</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                            Calls are direct Peer-to-Peer (WebRTC). Video & audio feeds are never recorded or stored on our servers.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex flex-col gap-2">
                        <Lock className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-bold text-neutral-900">End-to-End Encryption</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                            WebRTC streams are secured with DTLS/SRTP encryption. API traffic uses TLS 1.3 SSL protocols.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex flex-col gap-2">
                        <Key className="w-5 h-5 text-purple-600" />
                        <h3 className="text-sm font-bold text-neutral-900">You Control Your Data</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                            Update match preferences, change privacy filters, or permanently delete your account anytime in Settings.
                        </p>
                    </div>
                </div>

                {/* Detailed Legal Sections */}
                <div className="space-y-10 text-neutral-800 text-sm leading-relaxed">
                    
                    {/* Section 1 */}
                    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <span>1. Introduction & Our Core Privacy Promise</span>
                        </h2>
                        <p className="mb-3">
                            At weeChat ("we," "our," or "the platform"), we believe meaningful real-time communication should never come at the expense of your personal privacy. Unlike ad-tracking networks, weeChat operates on a minimalist data architecture: <strong>we only collect data that is strictly necessary to connect your video calls and safeguard our community from abuse.</strong>
                        </p>
                        <p>
                            This Privacy Policy explains what information we collect, what we deliberately do NOT collect, how your data is protected, and how you retain full control over your profile.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <span>2. Information We Collect</span>
                        </h2>
                        <p className="mb-4">
                            We collect limited information to provide instant video matchmaking and user authentication:
                        </p>
                        <ul className="space-y-3 pl-2">
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                <div>
                                    <strong>Account Credentials:</strong> When you register directly or via Google OAuth, we store your name, email address, profile avatar URL (if provided), and a salted bcrypt hash of your password. We never have access to plain-text passwords.
                                </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                <div>
                                    <strong>Matchmaking Preferences:</strong> Preferences you intentionally save—such as preferred gender matching, age filters, target location (city/state/pincode), and custom interest tags (e.g. #gaming, #coding)—are stored in MongoDB to calibrate your matchmaking queue.
                                </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                <div>
                                    <strong>Operational & Safety Logs:</strong> Temporary connection metadata, such as IP addresses (for rate-limiting, DDoS prevention, and ban enforcement against bad actors), socket connection IDs, and in-call abuse reports submitted by users.
                                </div>
                            </li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <span>3. What We DO NOT Collect (Zero Video Recording)</span>
                        </h2>
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 mb-4 text-xs sm:text-sm font-medium">
                            ⚠️ We never record, tap, monitor, or store your 1-on-1 video streams or microphone audio.
                        </div>
                        <p className="mb-3">
                            weeChat uses <strong>WebRTC (Web Real-Time Communication)</strong> technology. When you connect with a stranger in 1-on-1 video chat:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-neutral-700">
                            <li>The video and audio packets flow directly from your device to the stranger's device peer-to-peer.</li>
                            <li>Our backend servers only act as a signaling relay for exchanging SDP connection handshakes (ICE candidates). Once the connection is locked, media does not flow through our database or servers.</li>
                            <li>In-call text chat messages during 1-on-1 random calls exist strictly in volatile memory during the active session and are discarded as soon as the call ends or either party clicks "Next Stranger".</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <span>4. How We Protect Your Data (Security Architecture)</span>
                        </h2>
                        <p className="mb-4">
                            We implement defense-in-depth security standards to protect all stored and in-transit data:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60">
                                <strong className="text-neutral-900 text-xs block mb-1">Transport Security:</strong>
                                <span className="text-xs text-neutral-600">HTTPS with TLS 1.3 for all REST API endpoints and WSS (WebSocket Secure) for signaling handshakes.</span>
                            </div>
                            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60">
                                <strong className="text-neutral-900 text-xs block mb-1">Encrypted Database:</strong>
                                <span className="text-xs text-neutral-600">MongoDB Atlas storage encrypted at rest with automated firewalls and strict VPC network isolation.</span>
                            </div>
                            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60">
                                <strong className="text-neutral-900 text-xs block mb-1">Authentication Hardening:</strong>
                                <span className="text-xs text-neutral-600">Stateless JWTs stored in HTTP-Only, SameSite=Strict cookies to prevent cross-site scripting (XSS) extraction.</span>
                            </div>
                            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60">
                                <strong className="text-neutral-900 text-xs block mb-1">CSRF & Rate Limiting:</strong>
                                <span className="text-xs text-neutral-600">Custom request header verification and strict IP rate limiters (300 req / 15 min) to prevent brute-force abuse.</span>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <span>5. Third-Party Integrations</span>
                        </h2>
                        <p className="mb-3">
                            We do not sell, rent, or monetize your personal information to third-party data brokers. We only interface with trusted infrastructure providers:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-neutral-700">
                            <li><strong>Google OAuth:</strong> Allows one-click authentication. We only receive your verified email address and public display name.</li>
                            <li><strong>Google STUN Servers:</strong> Public STUN nodes (stun.l.google.com:19302) are utilized strictly for resolving NAT public IP mappings to establish WebRTC peer-to-peer tunnels.</li>
                            <li><strong>Render / Cloudflare / Vercel:</strong> Cloud edge infrastructure providers that host our static web assets and secure backend services.</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <span>6. Your Rights & Account Deletion (GDPR & CCPA)</span>
                        </h2>
                        <p className="mb-3">
                            Regardless of where you reside, you maintain full sovereignty over your personal data:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-neutral-700">
                            <li><strong>Right of Access & Modification:</strong> You can review, update, or edit your username, avatar, and match preferences directly in your Settings page at any time.</li>
                            <li><strong>Right to Erasure (Delete Account):</strong> You can permanently delete your account via <em>Settings → Account Security → Delete Account</em>. This permanently deletes your credentials, profile, and preferences from our active databases.</li>
                            <li><strong>Right to Block & Report:</strong> You can instantly block any user or report inappropriate behavior during or after a video call.</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <span>7. Contact Our Privacy Team</span>
                        </h2>
                        <p>
                            If you have questions, inquiries, or formal data protection requests regarding this Privacy Policy, please contact our privacy compliance team via our Support Center in Settings or by submitting a ticket at <a href="/home/settings/help/tickets" className="text-blue-600 underline font-medium">Support Tickets</a>.
                        </p>
                    </section>

                </div>

            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-200 py-10 bg-white text-center text-xs text-neutral-500">
                <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span>© {new Date().getFullYear()} weeChat Inc. All rights reserved.</span>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/')} className="hover:text-black cursor-pointer">Home</button>
                        <span>•</span>
                        <button onClick={() => navigate('/terms')} className="hover:text-black cursor-pointer font-medium text-blue-600">Terms of Service</button>
                        <span>•</span>
                        <button onClick={() => navigate('/comparison')} className="hover:text-black cursor-pointer">Why weeChat</button>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default PrivacyPolicyPage;
