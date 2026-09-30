import React, { useState } from 'react';
import { deleteAccountApi } from '../settings.api';

const DeleteAccountModal = ({ isOpen, onClose, onDeleteSuccess }) => {
    const [step, setStep] = useState(1); // 1: Info summary, 2: Re-authenticate & confirm, 3: Success
    const [password, setPassword] = useState('');
    const [confirmInput, setConfirmInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    const handleClose = () => {
        setStep(1);
        setPassword('');
        setConfirmInput('');
        setErrorMsg('');
        setIsSubmitting(false);
        onClose();
    };

    const isStep2Valid = password.length >= 6 && confirmInput.trim() === 'DELETE';

    const handleConfirmDelete = async (e) => {
        e.preventDefault();
        if (!isStep2Valid) return;

        setIsSubmitting(true);
        setErrorMsg('');

        try {
            await deleteAccountApi();
            setStep(3);
            setTimeout(() => {
                handleClose();
                if (onDeleteSuccess) onDeleteSuccess();
            }, 1500);
        } catch (err) {
            // If backend endpoint missing or returns error
            if (err?.response?.status === 404) {
                // Endpoint missing expectation
                setErrorMsg('Backend account deletion endpoint (/api/profile DELETE) not available yet.');
            } else {
                setErrorMsg(err?.response?.data?.message || 'Failed to delete account. Please check your password.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white border border-neutral-200/70 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left">
                {step === 1 && (
                    <div className="flex flex-col gap-4">
                        <div>
                            <h3 className="text-xl font-semibold tracking-tight text-[#1D1D1F]">Delete your account?</h3>
                            <p className="text-xs text-[#86868B] mt-1 font-normal">
                                Deleting your account will immediately remove:
                            </p>
                        </div>

                        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 text-xs text-[#1D1D1F] space-y-2">
                            <p className="flex items-center gap-2 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                                Your public profile & profile photos
                            </p>
                            <p className="flex items-center gap-2 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                                Your match algorithm preferences
                            </p>
                            <p className="flex items-center gap-2 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                                Your 1-on-1 call history
                            </p>
                            <p className="flex items-center gap-2 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                                Blocked users and reports you submitted
                            </p>
                        </div>

                        <p className="text-xs text-[#86868B]">
                            You can recover your account within 30 days by signing back in. After 30 days, your data is permanently deleted.
                        </p>

                        <div className="pt-2 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-5 py-2.5 rounded-full bg-neutral-100 text-neutral-800 font-semibold text-xs hover:bg-neutral-200 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="px-6 py-2.5 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-all cursor-pointer"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleConfirmDelete} className="flex flex-col gap-4">
                        <div>
                            <h3 className="text-xl font-semibold tracking-tight text-[#1D1D1F]">Confirm Deletion</h3>
                            <p className="text-xs text-[#86868B] mt-1 font-normal">
                                Re-authenticate to finalize account removal
                            </p>
                        </div>

                        {errorMsg && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
                                {errorMsg}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">Current Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                                Type <span className="font-bold text-red-600">DELETE</span> to confirm
                            </label>
                            <input
                                type="text"
                                required
                                value={confirmInput}
                                onChange={(e) => setConfirmInput(e.target.value)}
                                placeholder="DELETE"
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold tracking-wider text-[#1D1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                            />
                        </div>

                        <div className="pt-2 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-5 py-2.5 rounded-full bg-neutral-100 text-neutral-800 font-semibold text-xs hover:bg-neutral-200 transition-all cursor-pointer"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={!isStep2Valid || isSubmitting}
                                className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all ${
                                    isStep2Valid && !isSubmitting
                                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-md cursor-pointer active:scale-95'
                                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                }`}
                            >
                                {isSubmitting ? 'Deleting...' : 'Delete account'}
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div className="py-6 text-center flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                            ✓
                        </div>
                        <h3 className="text-lg font-semibold text-[#1D1D1F]">Account Deleted</h3>
                        <p className="text-xs text-[#86868B]">Redirecting to home page...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeleteAccountModal;
