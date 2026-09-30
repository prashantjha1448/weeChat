import React, { useState } from 'react';

const PasswordChangeModal = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState({ loading: false, success: false, error: '' });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: '' });

        if (newPassword.length < 6) {
            setStatus({ loading: false, success: false, error: 'Password must be at least 6 characters long' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setStatus({ loading: false, success: false, error: 'Passwords do not match' });
            return;
        }

        setTimeout(() => {
            setStatus({ loading: false, success: true, error: '' });
            setTimeout(() => {
                onClose();
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setStatus({ loading: false, success: false, error: '' });
            }, 1200);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">Change Password</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">Update your account security credentials</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {status.error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                        {status.error}
                    </div>
                )}

                {status.success && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
                        Password updated successfully
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Current Password</label>
                        <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-black transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">New Password</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-black transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-black transition-all"
                        />
                    </div>

                    <div className="pt-3 flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-full bg-neutral-100 text-neutral-700 font-semibold text-xs hover:bg-neutral-200 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={status.loading}
                            className="px-6 py-2.5 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-all active:scale-95 shadow-md shadow-neutral-300 cursor-pointer"
                        >
                            {status.loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordChangeModal;
