import React from 'react';

/**
 * GlassButton — Apple Spring-Press Pill Button Primitive
 * @param {('primary'|'secondary'|'destructive'|'glass'|'solid-black')} variant
 * @param {('sm'|'md'|'lg')} size
 * @param {boolean} isLoading
 */
export const GlassButton = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    className = '',
    type = 'button',
    ...props
}) => {
    // Touch targets >= 44px on mobile
    const sizeClasses = {
        sm: 'min-h-[36px] sm:min-h-[40px] px-3.5 py-1.5 text-xs rounded-full',
        md: 'min-h-[44px] px-5 py-2.5 text-sm font-semibold rounded-full',
        lg: 'min-h-[50px] px-7 py-3.5 text-base font-bold rounded-full'
    }[size] || 'min-h-[44px] px-5 py-2.5 text-sm font-semibold rounded-full';

    const variantClasses = {
        primary: 'bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-lg shadow-[#0071e3]/20 active:bg-[#0062c4]',
        secondary: 'glass-1 text-[var(--text-primary)] hover:bg-white/80 dark:hover:bg-white/15',
        destructive: 'bg-[#ff3b30] hover:bg-[#e0352b] text-white shadow-lg shadow-[#ff3b30]/20 active:bg-[#c92b23]',
        glass: 'bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20 text-[var(--text-primary)] border border-white/40 dark:border-white/15 backdrop-blur-md',
        'solid-black': 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-md'
    }[variant] || 'bg-[#0071e3] text-white';

    const stateClasses = disabled || isLoading
        ? 'opacity-50 cursor-not-allowed transform-none'
        : 'cursor-pointer btn-spring';

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={`inline-flex items-center justify-center gap-2 select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 ${sizeClasses} ${variantClasses} ${stateClasses} ${className}`}
            {...props}
        >
            {isLoading && (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
            )}
            {children}
        </button>
    );
};

export default GlassButton;
