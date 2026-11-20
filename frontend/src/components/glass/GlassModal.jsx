import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * GlassModal — Apple Glassmorphic Modal & Sheet Primitive
 * Renders centered modal on desktop, animated bottom-sheet or centered on mobile.
 */
export const GlassModal = ({
    isOpen,
    onClose,
    title,
    children,
    className = '',
    maxWidth = 'max-w-lg',
    showClose = true
}) => {
    // Escape key listener & body scroll lock
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
            {/* Backdrop Dimmer */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            />

            {/* Glass Surface 3 Modal Box */}
            <div
                className={`relative w-full ${maxWidth} glass-3 p-6 sm:p-8 z-10 my-auto text-left transition-all duration-200 animate-in zoom-in-95 fade-in ${className}`}
            >
                {/* Header */}
                {(title || showClose) && (
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/5 dark:border-white/10">
                        {title && (
                            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
                                {title}
                            </h3>
                        )}
                        {showClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close dialog"
                                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer ml-auto"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                {children}
            </div>
        </div>
    );
};

export default GlassModal;
