import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import PasswordChangeModal from './modals/PasswordChangeModal';
import DeleteAccountModal from './modals/DeleteAccountModal';
import LogoutAllDevicesModal from './modals/LogoutAllDevicesModal';
import { AppleGroupedList, AppleGroupedRow } from './components/AppleGroupedList';

const AccountSecuritySettings = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const isVerified = Boolean(user?.isVerified || user?.emailVerified);

    return (
        <div className="w-full text-left flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Account & Security</h1>
                <p className="text-sm text-[#86868B] mt-1 font-normal">
                    Manage sign-in credentials, active devices, and account status
                </p>
            </div>

            {/* 1. Login Credentials */}
            <AppleGroupedList header="ACCOUNT CREDENTIALS">
                {/* Email Row */}
                <AppleGroupedRow
                    label="Email Address"
                    subtitle={user?.email || 'No email attached'}
                    control={
                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                isVerified
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                            }`}
                        >
                            {isVerified ? 'Verified' : 'Not verified'}
                        </span>
                    }
                />

                {/* Password Row */}
                <AppleGroupedRow
                    label="Password"
                    subtitle="••••••••••••"
                    control={
                        <button
                            type="button"
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                            Change
                        </button>
                    }
                />
            </AppleGroupedList>


            {/* 3. Devices & Sessions */}
            <AppleGroupedList header="SESSIONS">
                <AppleGroupedRow
                    label="Active devices"
                    subtitle="View signed-in locations and revoke sessions"
                    hasChevron
                    onClick={() => navigate('/home/settings/account/devices')}
                />
            </AppleGroupedList>

            {/* 4. Quiet Apple Style ACCOUNT REMOVAL */}
            <AppleGroupedList
                header="ACCOUNT REMOVAL"
                footer="Deleting your account removes your profile, preferences and call history. This can't be undone after 30 days."
            >
                <AppleGroupedRow
                    label="Log out of all devices"
                    hasChevron
                    onClick={() => setIsLogoutModalOpen(true)}
                />
                <AppleGroupedRow
                    label="Delete account"
                    isDanger
                    hasChevron
                    onClick={() => setIsDeleteModalOpen(true)}
                />
            </AppleGroupedList>

            {/* Modals */}
            <PasswordChangeModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDeleteSuccess={() => {
                    setIsDeleteModalOpen(false);
                    navigate('/login');
                }}
            />
            <LogoutAllDevicesModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={() => {
                    setIsLogoutModalOpen(false);
                    navigate('/login');
                }}
            />
        </div>
    );
};

export default AccountSecuritySettings;
