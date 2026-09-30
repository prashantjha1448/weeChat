import React, { useState } from 'react';

const LogoutAllDevicesModal = ({ isOpen, onClose, onConfirm }) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            setIsLoggingOut(false);
            if (onConfirm) onConfirm();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">Log Out of All Devices</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">Session security control</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-2xl mb-6 text-left">
                    <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                        Are you sure you want to log out of all active web and mobile sessions? You will need to sign in again on each device.
                    </p>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-full bg-neutral-100 text-neutral-700 font-semibold text-xs hover:bg-neutral-200 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoggingOut}
                        className="px-6 py-2.5 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-all active:scale-95 shadow-md shadow-neutral-300 cursor-pointer"
                    >
                        {isLoggingOut ? 'Logging Out...' : 'Confirm Log Out'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutAllDevicesModal;
