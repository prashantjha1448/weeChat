import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getReportsApi } from '../settings.api';
import { AppleGroupedList, AppleGroupedRow } from '../components/AppleGroupedList';

const MyReportsSubPage = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchReports = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await getReportsApi();
            const data = res.data || res;
            setReports(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('Reports API fetch notice:', err);
            setError(true);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

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
                <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">My Reports</h1>
                <p className="text-sm text-[#86868B] mt-1 font-normal">
                    Track status and actions taken on reports submitted by you
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
                    <p className="text-xs text-[#86868B]">Unable to load reports history.</p>
                    <button
                        onClick={fetchReports}
                        className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                        Try again
                    </button>
                </div>
            ) : reports.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200/70 p-8 text-center text-xs text-[#86868B]">
                    You haven't submitted any reports.
                </div>
            ) : (
                <AppleGroupedList header="SUBMITTED REPORTS">
                    {reports.map((report) => {
                        const rid = report.id || report._id;
                        const status = report.status || 'Pending';
                        return (
                            <AppleGroupedRow
                                key={rid}
                                label={report.reason || 'User Report'}
                                subtitle={`Submitted ${formatDate(report.createdAt)}${report.targetUsername ? ` • Target: @${report.targetUsername}` : ''}`}
                                control={
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            status === 'Resolved'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                                        }`}
                                    >
                                        {status}
                                    </span>
                                }
                            />
                        );
                    })}
                </AppleGroupedList>
            )}
        </div>
    );
};

export default MyReportsSubPage;
