import React, { forwardRef } from 'react';

/**
 * GlassInput — Apple Minimalist Input Primitive
 * Guarantees minimum 16px font-size to prevent iOS Safari auto-zoom.
 */
export const GlassInput = forwardRef(({
    label,
    error,
    leadingIcon,
    trailingIcon,
    className = '',
    wrapperClassName = '',
    id,
    ...props
}, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className={`w-full flex flex-col gap-1.5 text-left ${wrapperClassName}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)] tracking-tight ml-1"
                >
                    {label}
                </label>
            )}

            <div className="relative flex items-center w-full">
                {leadingIcon && (
                    <div className="absolute left-4 flex items-center pointer-events-none text-[var(--text-tertiary)]">
                        {leadingIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    className={`w-full text-base text-[var(--text-primary)] placeholder-[var(--text-tertiary)] bg-[var(--input-bg)] border ${
                        error ? 'border-[var(--destructive)]' : 'border-[var(--input-border)]'
                    } rounded-[18px] py-3.5 px-4.5 ${
                        leadingIcon ? 'pl-11' : ''
                    } ${
                        trailingIcon ? 'pr-11' : ''
                    } backdrop-blur-md outline-none transition-all duration-150 focus:border-[var(--input-focus-border)] focus:ring-3 focus:ring-[var(--input-focus-ring)] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                    {...props}
                />

                {trailingIcon && (
                    <div className="absolute right-4 flex items-center text-[var(--text-tertiary)]">
                        {trailingIcon}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-xs text-[var(--destructive)] font-medium mt-0.5 ml-1 animate-in fade-in">
                    {typeof error === 'string' ? error : error.message}
                </p>
            )}
        </div>
    );
});

GlassInput.displayName = 'GlassInput';
export default GlassInput;
