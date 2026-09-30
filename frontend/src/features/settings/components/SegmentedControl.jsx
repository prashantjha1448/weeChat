import React from 'react';

export const SegmentedControl = ({ options, value, onChange, className = '' }) => {
    return (
        <div className={`flex w-full bg-[#E3E3E8]/60 p-1 rounded-2xl gap-1 selection:bg-none ${className}`}>
            {options.map((opt) => {
                const isActive = value === opt.id;
                return (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => onChange(opt.id)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer text-center select-none ${
                            isActive
                                ? 'bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.1)] font-bold scale-[1.01]'
                                : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-white/40'
                        }`}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
};
