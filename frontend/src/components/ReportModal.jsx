import React, { useState } from 'react';
import api from '../api/axios';

/**
 * ReportModal — Apple Light Theme Abuse Report Modal
 */
const ReportModal = ({ reportedUser, roomId, onClose }) => {
    const [reason, setReason] = useState('inappropriate_content');
    const [details, setDetails] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('reports/', {
                reportedUserId: reportedUser?.userId,
                reason,
                details
            });
            setSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 1800);
        } catch (err) {
            console.error("Report Submission Error:", err);
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/40 flex items-center justify-center p-6 animate-fade-in">
            <div className="w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-6 shadow-2xl text-left relative">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">Report User</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">Report @{reportedUser?.username || 'user'} for moderation review</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-900 text-sm font-semibold cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {submitted ? (
                    <div className="py-8 text-center flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                            ✓
                        </div>
                        <h4 className="text-base font-bold text-neutral-900">Report Submitted</h4>
                        <p className="text-xs text-neutral-500 max-w-xs">Our moderation team will review this call log shortly. Thank you for keeping Nexus safe.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        
                        {/* Reason Selection */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                                Reason for report
                            </label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-black"
                            >
                                <option value="inappropriate_content">Inappropriate Content</option>
                                <option value="harassment">Harassment / Bad Behavior</option>
                                <option value="spam">Fake Profile / Spam</option>
                                <option value="other">Other Violation</option>
                            </select>
                        </div>

                        {/* Additional Details */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                                Additional Details (Optional)
                            </label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Describe what happened during the call..."
                                rows="3"
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-1/2 py-3 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-1/2 py-3 rounded-full bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-all cursor-pointer shadow-md shadow-red-200"
                            >
                                {submitting ? "Submitting..." : "Submit Report"}
                            </button>
                        </div>

                    </form>
                )}

            </div>
        </div>
    );
};

export default ReportModal;
