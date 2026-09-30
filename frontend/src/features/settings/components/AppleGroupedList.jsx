import React from 'react';

export const AppleGroupedList = ({ header, footer, children, className = '' }) => {
    return (
        <div className={`flex flex-col text-left mb-6 ${className}`}>
            {header && (
                <div className="px-1 mb-2 text-xs font-medium tracking-wide text-[#86868B] uppercase">
                    {header}
                </div>
            )}
            <div className="bg-white rounded-2xl border border-neutral-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.04)] divide-y divide-neutral-100 overflow-hidden">
                {children}
            </div>
            {footer && (
                <div className="px-1 mt-2 text-[13px] text-[#86868B] font-normal leading-relaxed">
                    {footer}
                </div>
            )}
        </div>
    );
};

export const AppleGroupedRow = ({
    label,
    subtitle,
    control,
    onClick,
    isDanger = false,
    hasChevron = false,
    className = ''
}) => {
    const Component = onClick ? 'button' : 'div';

    return (
        <Component
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            className={`w-full min-h-[56px] px-4 sm:px-5 py-3.5 flex items-center justify-between text-left transition-colors duration-150 ${
                onClick ? 'hover:bg-neutral-50/80 active:bg-neutral-100 cursor-pointer active:scale-[0.99]' : ''
            } ${className}`}
        >
            <div className="flex flex-col justify-center min-w-0 pr-3">
                <span className={`text-sm sm:text-base font-normal tracking-tight truncate ${isDanger ? 'text-red-600' : 'text-[#1D1D1F]'}`}>
                    {label}
                </span>
                {subtitle && (
                    <span className="text-xs text-[#86868B] mt-0.5 font-normal truncate">
                        {subtitle}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
                {control}
                {hasChevron && (
                    <svg className="w-4 h-4 text-neutral-400 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                )}
            </div>
        </Component>
    );
};
