import React, { useState, useEffect } from 'react';
import { getNotificationSettingsApi, updateNotificationSettingsApi } from './settings.api';
import { AppleGroupedList, AppleGroupedRow } from './components/AppleGroupedList';
import { IOSSwitch } from './components/IOSSwitch';

const NotificationsSettings = () => {
    const [securityAlerts, setSecurityAlerts] = useState(
        () => localStorage.getItem('nexus_notif_security') !== 'false'
    );
    const [productUpdates, setProductUpdates] = useState(
        () => localStorage.getItem('nexus_notif_product') === 'true'
    );
    const [matchAlerts, setMatchAlerts] = useState(
        () => localStorage.getItem('nexus_notif_match') !== 'false'
    );
    const [modUpdates, setModUpdates] = useState(
        () => localStorage.getItem('nexus_notif_mod') !== 'false'
    );

    const [saveToast, setSaveToast] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const loadNotifs = async () => {
            try {
                const res = await getNotificationSettingsApi();
                if (!isMounted) return;
                const data = res.data || res;
                if (typeof data.securityAlerts === 'boolean') setSecurityAlerts(data.securityAlerts);
                if (typeof data.productUpdates === 'boolean') setProductUpdates(data.productUpdates);
                if (typeof data.matchAlerts === 'boolean') setMatchAlerts(data.matchAlerts);
                if (typeof data.modUpdates === 'boolean') setModUpdates(data.modUpdates);
            } catch (err) {
                console.warn('Notifications API fetch notice:', err);
            }
        };
        loadNotifs();
        return () => {
            isMounted = false;
        };
    }, []);

    const triggerToast = () => {
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2000);
    };

    const updateNotifState = async (key, val, setter, currentAll) => {
        setter(val);
        localStorage.setItem(`nexus_notif_${key}`, String(val));
        triggerToast();

        const updated = { ...currentAll, [key]: val };
        try {
            await updateNotificationSettingsApi(updated);
        } catch (err) {
            console.warn('Notification API update notice:', err);
        }
    };

    const currentMap = { security: securityAlerts, product: productUpdates, match: matchAlerts, mod: modUpdates };

    return (
        <div className="w-full text-left flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Notifications</h1>
                    <p className="text-sm text-[#86868B] mt-1 font-normal">
                        Manage email and real-time in-app notification alerts
                    </p>
                </div>
                {saveToast && (
                    <span className="px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-medium shadow-sm animate-in fade-in">
                        Saved
                    </span>
                )}
            </div>

            {/* 1. Email Notifications */}
            <AppleGroupedList header="EMAIL NOTIFICATIONS">
                <AppleGroupedRow
                    label="Security Alerts"
                    subtitle="Alerts for new device sign-ins and security events"
                    control={
                        <IOSSwitch
                            checked={securityAlerts}
                            onChange={(val) => updateNotifState('security', val, setSecurityAlerts, currentMap)}
                            ariaLabel="Security alerts"
                        />
                    }
                />
                <AppleGroupedRow
                    label="Product Updates"
                    subtitle="Monthly newsletter and new features announcement"
                    control={
                        <IOSSwitch
                            checked={productUpdates}
                            onChange={(val) => updateNotifState('product', val, setProductUpdates, currentMap)}
                            ariaLabel="Product updates"
                        />
                    }
                />
            </AppleGroupedList>

            {/* 2. In-App Notifications */}
            <AppleGroupedList header="IN-APP ALERTS">
                <AppleGroupedRow
                    label="Match & Call Alerts"
                    subtitle="Real-time alerts when matched partner connects"
                    control={
                        <IOSSwitch
                            checked={matchAlerts}
                            onChange={(val) => updateNotifState('match', val, setMatchAlerts, currentMap)}
                            ariaLabel="Match alerts"
                        />
                    }
                />
                <AppleGroupedRow
                    label="Moderation Updates"
                    subtitle="Notifications regarding report status changes"
                    control={
                        <IOSSwitch
                            checked={modUpdates}
                            onChange={(val) => updateNotifState('mod', val, setModUpdates, currentMap)}
                            ariaLabel="Moderation updates"
                        />
                    }
                />
            </AppleGroupedList>
        </div>
    );
};

export default NotificationsSettings;
