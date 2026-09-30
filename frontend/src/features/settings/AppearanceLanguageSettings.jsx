import React, { useState } from 'react';
import { AppleGroupedList } from './components/AppleGroupedList';
import { SegmentedControl } from './components/SegmentedControl';

const AppearanceLanguageSettings = () => {
    const [theme, setTheme] = useState(
        () => localStorage.getItem('nexus_theme') || 'light'
    );
    const [language, setLanguage] = useState(
        () => localStorage.getItem('nexus_language') || 'en'
    );

    const [saveToast, setSaveToast] = useState(false);

    const triggerToast = () => {
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2000);
    };

    const handleThemeChange = (mode) => {
        setTheme(mode);
        localStorage.setItem('nexus_theme', mode);
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        triggerToast();
    };

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setLanguage(lang);
        localStorage.setItem('nexus_language', lang);
        triggerToast();
    };

    return (
        <div className="w-full text-left flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Appearance & Language</h1>
                    <p className="text-sm text-[#86868B] mt-1 font-normal">
                        Customize application visual style theme and display language
                    </p>
                </div>
                {saveToast && (
                    <span className="px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-medium shadow-sm animate-in fade-in">
                        Saved
                    </span>
                )}
            </div>

            {/* 1. Theme Selection */}
            <AppleGroupedList header="APPEARANCE THEME">
                <div className="p-4 sm:p-5">
                    <SegmentedControl
                        options={[
                            { id: 'light', label: 'Light' },
                            { id: 'dark', label: 'Dark' },
                            { id: 'system', label: 'System' }
                        ]}
                        value={theme}
                        onChange={handleThemeChange}
                    />
                </div>
            </AppleGroupedList>

            {/* 2. Language Selection */}
            <AppleGroupedList header="LANGUAGE PREFERENCE">
                <div className="min-h-[56px] px-4 sm:px-5 py-3.5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-normal text-[#1D1D1F]">App Language</p>
                        <p className="text-xs text-[#86868B]">Select interface display language</p>
                    </div>

                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-semibold text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                    >
                        <option value="en">English (US)</option>
                        <option value="hi">Hindi (हिन्दी)</option>
                        <option value="es">Spanish (Español)</option>
                        <option value="fr">French (Français)</option>
                        <option value="de">German (Deutsch)</option>
                    </select>
                </div>
            </AppleGroupedList>
        </div>
    );
};

export default AppearanceLanguageSettings;
