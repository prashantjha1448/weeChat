import React from 'react';

export const IOSSwitch = ({ checked, onChange, disabled = false, ariaLabel = 'Toggle setting' }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={ariaLabel}
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={`relative inline-flex w-[51px] h-[31px] shrink-0 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                disabled ? 'opacity-40 cursor-not-allowed' : ''
            } ${checked ? 'bg-black' : 'bg-[#E9E9EA]'}`}
        >
            <span
                className={`pointer-events-none inline-block w-[27px] h-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15)] ring-0 transition-transform duration-200 ease-in-out ${
                    checked ? 'translate-x-[20px]' : 'translate-x-0'
                }`}
            />
        </button>
    );
};
