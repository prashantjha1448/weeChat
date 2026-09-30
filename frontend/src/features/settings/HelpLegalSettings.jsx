import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AppleGroupedList, AppleGroupedRow } from './components/AppleGroupedList';

const HelpLegalSettings = () => {
    const navigate = useNavigate();
    const [activeLegalModal, setActiveLegalModal] = useState(null);

    const legalDocs = {
        terms: {
            title: 'Terms of Service',
            content: 'By accessing or using Nexus Match, you agree to abide by our terms. Users must be at least 18 years old. Misconduct, harassment, or unlawful content during video calls will result in immediate account termination.'
        },
        privacy: {
            title: 'Privacy Policy',
            content: 'Nexus protects user privacy. Video streams are encrypted using WebRTC peer-to-peer protocols. We do not sell personal data to third parties. Location data is only used for matching mode options.'
        },
        guidelines: {
            title: 'Community Guidelines',
            content: 'Keep calls respectful and enjoyable. Zero tolerance for nudeness, violence, hate speech, or harassment. Always adhere to Apple Human Interface Guidelines and local laws.'
        }
    };

    return (
        <div className="w-full text-left flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Help & Legal</h1>
                <p className="text-sm text-[#86868B] mt-1 font-normal">
                    Customer support center, legal terms, and app info
                </p>
            </div>

            {/* 1. Support Center */}
            <AppleGroupedList header="SUPPORT CENTER">
                <AppleGroupedRow
                    label="Contact support & my tickets"
                    subtitle="Create new help tickets or view ticket responses"
                    hasChevron
                    onClick={() => navigate('/home/settings/help/tickets')}
                />
            </AppleGroupedList>

            {/* 2. Legal Policies */}
            <AppleGroupedList header="LEGAL POLICIES">
                <AppleGroupedRow
                    label="Terms of Service"
                    hasChevron
                    onClick={() => setActiveLegalModal('terms')}
                />
                <AppleGroupedRow
                    label="Privacy Policy"
                    hasChevron
                    onClick={() => setActiveLegalModal('privacy')}
                />
                <AppleGroupedRow
                    label="Community Guidelines"
                    hasChevron
                    onClick={() => setActiveLegalModal('guidelines')}
                />
            </AppleGroupedList>

            {/* 3. About Nexus */}
            <AppleGroupedList header="ABOUT">
                <AppleGroupedRow
                    label="Nexus Match Application"
                    subtitle="Version 1.0.0 (Build 2026.09.30)"
                    control={
                        <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-[#1D1D1F] text-xs font-semibold">
                            Up to Date
                        </span>
                    }
                />
            </AppleGroupedList>

            {/* Legal Document Modal */}
            {activeLegalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-white border border-neutral-200/70 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left">
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
                            <h3 className="text-lg font-semibold text-[#1D1D1F]">{legalDocs[activeLegalModal].title}</h3>
                            <button
                                onClick={() => setActiveLegalModal(null)}
                                className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-xs text-[#86868B] leading-relaxed font-normal mb-6">
                            {legalDocs[activeLegalModal].content}
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setActiveLegalModal(null)}
                                className="px-5 py-2 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-all cursor-pointer"
                            >
                                Close Document
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpLegalSettings;
