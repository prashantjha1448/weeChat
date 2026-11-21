import React from 'react';
import { useNavigate } from 'react-router';
import { FileText, ShieldAlert, AlertTriangle, Scale, UserX, ArrowLeft, CheckCircle2 } from 'lucide-react';

/**
 * TermsOfServicePage — User Terms of Service & Fair Use Policy
 * Route: /terms
 */
const TermsOfServicePage = () => {
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

            {/* Main Terms Content */}
            <main className="pt-28 pb-20 px-6 max-w-4xl mx-auto text-left">
                
                {/* Title */}
                <div className="border-b border-neutral-200/80 pb-8 mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Legal Terms & Community Guidelines</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1D1D1F]">
                        Terms of Service & Fair Use Policy
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-2">
                        Last Updated: November 20, 2026 • Governs All weeChat Services & Rooms
                    </p>
                </div>

                {/* Important Notice Banner */}
                <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200/80 text-amber-900 mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
                    <div className="text-xs sm:text-sm leading-relaxed">
                        <strong className="block text-sm font-bold text-amber-950 mb-0.5">Important Safety Summary:</strong>
                        weeChat maintains a strict <strong>Zero Tolerance Policy</strong> against nudity, harassment, hate speech, and illegal activities during video calls. Violators will face immediate session termination, account suspension, and permanent hardware/IP bans.
                    </div>
                </div>

                {/* Detailed Legal Sections */}
                <div className="space-y-10 text-neutral-800 text-sm leading-relaxed">
                    
                    {/* Section 1 */}
                    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <span>1. Agreement to Terms & Minimum Age Requirement</span>
                        </h2>
                        <p className="mb-3">
                            By creating an account, browsing, or using any feature on weeChat (including 1-on-1 random video chat and custom group lounges), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service.
                        </p>
                        <p>
                            <strong>Age Requirement:</strong> You must be at least <strong>18 years of age</strong> (or the legal age of majority in your jurisdiction) to use weeChat. If you are under 18, you are strictly prohibited from using or creating an account on this platform.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-red-500" />
                            <span>2. Fair Use & Prohibited Conduct (Zero Tolerance)</span>
                        </h2>
                        <p className="mb-4">
                            You agree to use weeChat exclusively for lawful, respectful, and consensual communication. You strictly agree NOT to:
                        </p>
                        <ul className="space-y-3 pl-2">
                            <li className="flex items-start gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                                <div>
                                    <strong>Nudity & Sexual Content:</strong> Display, perform, stream, or broadcast nudity, pornographic material, sexual acts, or sexually suggestive conduct on camera.
                                </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                                <div>
                                    <strong>Harassment & Hate Speech:</strong> Bully, threaten, stalk, demean, intimidate, or promote hatred or discrimination based on race, ethnicity, religion, sexual orientation, disability, or gender identity.
                                </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                                <div>
                                    <strong>Non-Consensual Recording:</strong> Record, screenshot, broadcast, or republish other users’ video feeds, voices, or messages without their explicit written permission.
                                </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                                <div>
                                    <strong>Bots, Automation & Spam:</strong> Deploy automated bots, virtual camera scripts, commercial advertisements, phishing links, or malware on the platform.
                                </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                                <div>
                                    <strong>Illegal Activities:</strong> Display weapons, promote violence, facilitate illegal transactions, or violate any applicable municipal, national, or international law.
                                </div>
                            </li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <UserX className="w-5 h-5 text-amber-500" />
                            <span>3. Reporting & Enforcement Mechanisms</span>
                        </h2>
                        <p className="mb-3">
                            weeChat provides an in-call <strong>Shield / Report User</strong> button accessible during any active video call or room. When a report is submitted:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-neutral-700 mb-4">
                            <li>An internal audit log is automatically dispatched with timestamp and encrypted session identifiers.</li>
                            <li>Users engaging in repeated infractions are automatically blacklisted in our database using hashed device and network identifiers.</li>
                            <li>Moderation actions include immediate matchmaking disconnects, temporary account suspensions (24 hours to 30 days), and permanent account and IP terminations.</li>
                        </ul>
                        <p className="text-xs text-neutral-500">
                            We cooperate fully with law enforcement authorities in cases involving child exploitation, credible threats of violence, or illegal behavior.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <span>4. Custom Rooms & Host Responsibilities</span>
                        </h2>
                        <p className="mb-3">
                            Users who create Custom Rooms (up to 100 participants) act as designated moderators for their lounge:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-neutral-700">
                            <li>Hosts must ensure that discussions, screen shares, and video feeds within their room comply with this Fair Use Policy.</li>
                            <li>Hosts of private rooms are responsible for managing passcode access and evicting disruptive participants.</li>
                            <li>weeChat reserves the right to close any public or private room that facilitates prohibited content.</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <Scale className="w-5 h-5 text-blue-500" />
                            <span>5. Disclaimer of Warranties & Limitation of Liability</span>
                        </h2>
                        <p className="mb-3">
                            weeChat is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied.
                        </p>
                        <p className="mb-3">
                            Because video chats connect you with random strangers across the Internet, weeChat cannot guarantee the conduct, identity, or statements of users you encounter. <strong>You interact with strangers at your own discretion and risk.</strong>
                        </p>
                        <p>
                            To the maximum extent permitted by applicable law, weeChat Inc. and its operators shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from your use of or inability to use the platform.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <span>6. Account Termination & Voluntary Departure</span>
                        </h2>
                        <p className="mb-3">
                            You may terminate these terms at any time by simply ceasing use of the platform or permanently deleting your account in <em>Settings → Account Security → Delete Account</em>.
                        </p>
                        <p>
                            weeChat reserves the right to suspend or terminate any user's access immediately and without notice if these terms are breached.
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
                        <button onClick={() => navigate('/privacy')} className="hover:text-black cursor-pointer font-medium text-blue-600">Privacy Policy</button>
                        <span>•</span>
                        <button onClick={() => navigate('/comparison')} className="hover:text-black cursor-pointer">Why weeChat</button>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default TermsOfServicePage;
