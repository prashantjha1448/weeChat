import React from 'react';
import { useNavigate } from 'react-router';

/**
 * SupportPage — Help & Support View for /home/support
 */
const SupportPage = () => {
    const navigate = useNavigate();

    const faqs = [
        { q: "How does random matchmaking work?", a: "Our algorithm matches user preferences (gender, location, interests, height) using real-time Socket.io signaling." },
        { q: "Is WebRTC video calling end-to-end encrypted?", a: "Yes, peer-to-peer video streams are encrypted directly between browsers using DTLS-SRTP standards." },
        { q: "How do I report inappropriate behavior?", a: "During any call, click the 'Report' button in the call header to submit a moderation log for immediate review." }
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 pt-10 pb-16">
            
            <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer mb-6"
            >
                <span>←</span>
                <span>Back</span>
            </button>

            <div className="mb-8 text-left">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Help & Support</h1>
                <p className="text-xs text-neutral-500 mt-1">Frequently asked questions and moderation assistance</p>
            </div>

            <div className="w-full bg-white border border-neutral-200/90 rounded-3xl p-8 shadow-2xl shadow-neutral-200/80 text-left">
                <div className="pb-6 mb-6 border-b border-neutral-100">
                    <h2 className="text-lg font-bold text-neutral-900">Frequently Asked Questions</h2>
                </div>

                <div className="flex flex-col gap-6">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl">
                            <h4 className="text-sm font-bold text-neutral-900 mb-2">{faq.q}</h4>
                            <p className="text-xs text-neutral-600 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default SupportPage;
