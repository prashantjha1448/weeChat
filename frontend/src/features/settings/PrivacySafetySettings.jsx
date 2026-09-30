import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getProfileApi, updateProfileVisibilityApi } from './settings.api';
import { AppleGroupedList, AppleGroupedRow } from './components/AppleGroupedList';
import { IOSSwitch } from './components/IOSSwitch';

const PrivacySafetySettings = () => {
    const navigate = useNavigate();

    const [showCountry, setShowCountry] = useState(
        () => localStorage.getItem('nexus_show_country') !== 'false'
    );
    const [showAge, setShowAge] = useState(
        () => localStorage.getItem('nexus_show_age') !== 'false'
    );

    const [saveToast, setSaveToast] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const loadProfileFlags = async () => {
            try {
                const res = await getProfileApi();
                if (!isMounted) return;
                const profile = res.data || res;
                if (typeof profile.showCountry === 'boolean') setShowCountry(profile.showCountry);
                if (typeof profile.showAge === 'boolean') setShowAge(profile.showAge);
            } catch (err) {
                console.warn('Profile visibility fetch notice:', err);
            }
        };
        loadProfileFlags();
        return () => {
            isMounted = false;
        };
    }, []);

    const triggerToast = () => {
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2000);
    };

    const toggleCountry = async (val) => {
        setShowCountry(val);
        localStorage.setItem('nexus_show_country', String(val));
        triggerToast();
        try {
            await updateProfileVisibilityApi({ showCountry: val, showAge });
        } catch (err) {
            console.warn('Visibility API update notice:', err);
        }
    };

    const toggleAge = async (val) => {
        setShowAge(val);
        localStorage.setItem('nexus_show_age', String(val));
        triggerToast();
        try {
            await updateProfileVisibilityApi({ showCountry, showAge: val });
        } catch (err) {
            console.warn('Visibility API update notice:', err);
        }
    };

    return (
        <div className="w-full text-left flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Privacy & Safety</h1>
                    <p className="text-sm text-[#86868B] mt-1 font-normal">
                        Control public profile visibility badges and safety controls
                    </p>
                </div>
                {saveToast && (
                    <span className="px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-medium shadow-sm animate-in fade-in">
                        Saved
                    </span>
                )}
            </div>

            {/* 1. Profile Visibility */}
            <AppleGroupedList header="PROFILE VISIBILITY">
                <AppleGroupedRow
                    label="Show My Country"
                    subtitle="Display country badge during random video calls"
                    control={<IOSSwitch checked={showCountry} onChange={toggleCountry} ariaLabel="Show country" />}
                />
                <AppleGroupedRow
                    label="Show My Age"
                    subtitle="Display your age on profile badge"
                    control={<IOSSwitch checked={showAge} onChange={toggleAge} ariaLabel="Show age" />}
                />
            </AppleGroupedList>

            {/* 2. Safety & Moderation */}
            <AppleGroupedList header="SAFETY & MODERATION">
                <AppleGroupedRow
                    label="Blocked users"
                    subtitle="Manage users blocked from matching"
                    hasChevron
                    onClick={() => navigate('/home/settings/privacy/blocked')}
                />
                <AppleGroupedRow
                    label="My reports"
                    subtitle="Track status of reports submitted by you"
                    hasChevron
                    onClick={() => navigate('/home/settings/privacy/reports')}
                />
            </AppleGroupedList>
        </div>
    );
};

export default PrivacySafetySettings;
