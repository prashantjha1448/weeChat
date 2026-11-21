import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Search,
    Plus,
    CheckCircle2,
    Clock,
    XCircle,
    Copy,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Check,
    IndianRupee,
    Filter
} from 'lucide-react';
import { getAdminTransactions, createAdminTransaction, updateTransactionStatus } from './admin.api.js';
import { toast } from 'sonner';

/**
 * PaymentsTab — Payment Gateway Transaction History & Reference ID Inspector
 * ("payment , id realated deatils")
 */
const PaymentsTab = () => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ totalVolume: 0, totalTransactions: 0, successCount: 0, pendingCount: 0, failedCount: 0 });
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [gatewayFilter, setGatewayFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [copiedId, setCopiedId] = useState(null);

    // Manual Payment Modal
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        userEmail: '',
        amount: '',
        gateway: 'upi',
        gatewayRef: '',
        status: 'success'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, [pagination.page, gatewayFilter, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransactions(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchTransactions = async (page = pagination.page) => {
        try {
            setLoading(true);
            const params = {
                page,
                limit: pagination.limit,
                query: searchQuery.trim() || undefined,
                gateway: gatewayFilter !== 'all' ? gatewayFilter : undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined
            };
            const res = await getAdminTransactions(params);
            if (res) {
                setTransactions(res.transactions || []);
                setSummary(res.summary || { totalVolume: 0, totalTransactions: 0, successCount: 0, pendingCount: 0, failedCount: 0 });
                setPagination(res.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load transactions", {
                description: err.response?.data?.message || err.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCopyId = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        toast.success("Gateway Ref ID copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleStatusChange = async (txId, newStatus) => {
        try {
            await updateTransactionStatus(txId, newStatus);
            toast.success(`Transaction marked as ${newStatus}`);
            fetchTransactions();
        } catch (err) {
            toast.error("Status update failed", {
                description: err.response?.data?.message || err.message
            });
        }
    };

    const handleCreateTransaction = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await createAdminTransaction(createForm);
            toast.success("Transaction recorded successfully");
            setIsCreateOpen(false);
            setCreateForm({ userEmail: '', amount: '', gateway: 'upi', gatewayRef: '', status: 'success' });
            fetchTransactions();
        } catch (err) {
            toast.error("Record failed", {
                description: err.response?.data?.message || err.message
            });
        } finally {
            setSubmitting(false);
        }
    };

    const getGatewayBadge = (gw) => {
        if (gw === 'razorpay') {
            return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-bold">Razorpay</span>;
        }
        if (gw === 'stripe') {
            return <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 text-[10px] font-bold">Stripe</span>;
        }
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-bold">UPI / QR</span>;
    };

    const getStatusPill = (st) => {
        if (st === 'success') {
            return (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-3 h-3" />
                    Success
                </span>
            );
        }
        if (st === 'pending') {
            return (
                <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center gap-1 w-fit">
                    <Clock className="w-3 h-3" />
                    Pending
                </span>
            );
        }
        return (
            <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold flex items-center gap-1 w-fit">
                <XCircle className="w-3 h-3" />
                Failed
            </span>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            {/* Top Revenue Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Processed Volume</span>
                    <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mt-2">
                        ₹{summary.totalVolume?.toLocaleString('en-IN') || 0}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">Across all verified payment channels</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Transactions</span>
                    <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mt-2">
                        {summary.totalTransactions || 0}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">All gateway payment sessions</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Successful Invoices</span>
                    <p className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 mt-2">
                        {summary.successCount || 0}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                        {summary.totalTransactions > 0 ? Math.round((summary.successCount / summary.totalTransactions) * 100) : 100}% Success Rate
                    </p>
                </div>

                <div className="p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Pending & In-Flight</span>
                    <p className="text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400 mt-2">
                        {summary.pendingCount || 0}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">Awaiting bank/gateway settlement</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Payment Ref ID, user name, or email..."
                        className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-neutral-900 dark:text-neutral-100"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={gatewayFilter}
                        onChange={(e) => setGatewayFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium focus:outline-none"
                    >
                        <option value="all">Gateway: All</option>
                        <option value="razorpay">Razorpay</option>
                        <option value="upi">UPI / QR</option>
                        <option value="stripe">Stripe</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium focus:outline-none"
                    >
                        <option value="all">Status: All</option>
                        <option value="success">Success</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="px-4 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Record Payment</span>
                    </button>

                    <button
                        onClick={() => fetchTransactions()}
                        className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                        title="Reload"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-50/80 dark:bg-neutral-800/80 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-200/80 dark:border-neutral-800">
                            <tr>
                                <th className="py-3.5 px-6">Gateway Reference ID</th>
                                <th className="py-3.5 px-4">Customer Account</th>
                                <th className="py-3.5 px-4">Amount</th>
                                <th className="py-3.5 px-4">Gateway</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4">Date & Time</th>
                                <th className="py-3.5 px-6 text-right">Update Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                            {loading && transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-neutral-500">
                                        <div className="w-6 h-6 rounded-full border-2 border-neutral-300 border-t-black dark:border-t-white animate-spin mx-auto mb-2" />
                                        Loading transaction ledgers...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-neutral-500">
                                        No transaction logs found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t._id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                                        {/* Gateway Reference ID */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                                    {t.gatewayRef || 'GEN_' + t._id.slice(-8)}
                                                </span>
                                                <button
                                                    onClick={() => handleCopyId(t.gatewayRef || t._id)}
                                                    className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                                                    title="Copy ID"
                                                >
                                                    {copiedId === (t.gatewayRef || t._id) ? (
                                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                    ) : (
                                                        <Copy className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                            <span className="text-[10px] text-neutral-400 font-mono">DB: {t._id}</span>
                                        </td>

                                        {/* Customer */}
                                        <td className="py-4 px-4">
                                            <p className="font-bold text-neutral-900 dark:text-neutral-100">
                                                {t.userId?.name || 'Anonymous User'}
                                            </p>
                                            <p className="text-[11px] text-neutral-500 truncate max-w-[160px]" title={t.userId?.email}>
                                                {t.userId?.email || 'No email attached'}
                                            </p>
                                        </td>

                                        {/* Amount */}
                                        <td className="py-4 px-4 font-bold text-sm text-neutral-900 dark:text-neutral-100">
                                            ₹{t.amount?.toLocaleString('en-IN')}
                                            <span className="text-[10px] text-neutral-400 font-normal ml-1">
                                                {t.currency || 'INR'}
                                            </span>
                                        </td>

                                        {/* Gateway */}
                                        <td className="py-4 px-4">
                                            {getGatewayBadge(t.gateway)}
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 px-4">
                                            {getStatusPill(t.status)}
                                        </td>

                                        {/* Date */}
                                        <td className="py-4 px-4 text-neutral-500 whitespace-nowrap">
                                            {t.createdAt ? new Date(t.createdAt).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'N/A'}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-6 text-right">
                                            <select
                                                value={t.status}
                                                onChange={(e) => handleStatusChange(t._id, e.target.value)}
                                                className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
                                            >
                                                <option value="success">Success</option>
                                                <option value="pending">Pending</option>
                                                <option value="failed">Failed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                    <span>
                        Showing {transactions.length} of {pagination.total} transaction records
                    </span>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => fetchTransactions(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-300">
                            {pagination.page}
                        </span>
                        <button
                            onClick={() => fetchTransactions(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Record Manual Payment Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
                    <div
                        className="relative w-full max-w-md bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 text-neutral-900 dark:text-neutral-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-base font-bold tracking-tight mb-1">Record Manual Transaction</h3>
                        <p className="text-xs text-neutral-500 mb-4">Add an offline UPI transfer, Razorpay invoice, or direct payment</p>

                        <form onSubmit={handleCreateTransaction} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold mb-1">Customer Email</label>
                                <input
                                    type="email"
                                    required
                                    value={createForm.userEmail}
                                    onChange={(e) => setCreateForm({ ...createForm, userEmail: e.target.value })}
                                    placeholder="user@weechat.io"
                                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold mb-1">Amount (₹) *</label>
                                    <input
                                        type="number"
                                        required
                                        min={1}
                                        value={createForm.amount}
                                        onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
                                        placeholder="e.g. 499"
                                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1">Gateway *</label>
                                    <select
                                        value={createForm.gateway}
                                        onChange={(e) => setCreateForm({ ...createForm, gateway: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none font-semibold"
                                    >
                                        <option value="upi">UPI / QR</option>
                                        <option value="razorpay">Razorpay</option>
                                        <option value="stripe">Stripe</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">Gateway Reference / Payment ID *</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.gatewayRef}
                                    onChange={(e) => setCreateForm({ ...createForm, gatewayRef: e.target.value })}
                                    placeholder="e.g. pay_O93hd9s82 or upi_ref_849204"
                                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none font-mono"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">Payment Status</label>
                                <select
                                    value={createForm.status}
                                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none font-semibold"
                                >
                                    <option value="success">Success (Settled)</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>

                            <div className="pt-3 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-md disabled:opacity-50"
                                >
                                    {submitting ? 'Recording...' : 'Record Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentsTab;
