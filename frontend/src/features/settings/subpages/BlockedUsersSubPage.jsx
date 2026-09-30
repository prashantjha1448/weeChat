import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getBlockedUsersApi, unblockUserApi } from '../settings.api';
import { AppleGroupedList, AppleGroupedRow } from '../components/AppleGroupedList';

const BlockedUsersSubPage = () => {
    const navigate = useNavigate();
    const [blockedList, setBlockedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchBlocks = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await getBlockedUsersApi();
            const data = res.data || res;
            setBlockedList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('Blocked users API fetch notice:', err);
            setError(true);
            setBlockedList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlocks();
    }, []);

    const handleUnblock = async (userId) => {
        try {
            await unblockUserApi(userId);
            setBlockedList((prev) => prev.filter((item) => item.id !== userId && item._id !== userId));
        } catch (err) {
            console.warn('Unblock user notice:', err);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr));
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="w-full text-left flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Sub-page Parent Back Link */}
            <button
                onClick={() => navigate('/home/settings/privacy')}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer w-fit"
            >
                <span>‹ Privacy & Safety</span>
            </button>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Blocked Users</h1>
                <p className="text-sm text-[#86868B] mt-1 font-normal">
                    Users you block cannot match with you or view your profile
                </p>
            </div>

            {/* Content States */}
            {loading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-14 bg-white rounded-2xl border border-neutral-200" />
                    <div className="h-14 bg-white rounded-2xl border border-neutral-200" />
                </div>
            ) : error ? (
                <div className="bg-white rounded-2xl border border-neutral-200/70 p-8 text-center flex flex-col items-center gap-3">
                    <p className="text-xs text-[#86868B]">Unable to load blocked users.</p>
                    <button
                        onClick={fetchBlocks}
                        className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                        Try again
                    </button>
                </div>
            ) : blockedList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200/70 p-8 text-center text-xs text-[#86868B]">
                    You haven't blocked anyone.
                </div>
            ) : (
                <AppleGroupedList header="BLOCKED ACCOUNTS">
                    {blockedList.map((item) => {
                        const uid = item.id || item._id || item.user?._id;
                        const name = item.name || item.user?.name || 'Blocked User';
                        const username = item.username || item.user?.username || 'user';
                        return (
                            <AppleGroupedRow
                                key={uid}
                                label={name}
                                subtitle={`@${username}${item.createdAt ? ` • Blocked ${formatDate(item.createdAt)}` : ''}`}
                                control={
                                    <button
                                        type="button"
                                        onClick={() => handleUnblock(uid)}
                                        className="px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#1D1D1F] border border-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                        Unblock
                                    </button>
                                }
                            />
                        );
                    })}
                </AppleGroupedList>
            )}
        </div>
    );
};

export default BlockedUsersSubPage;
