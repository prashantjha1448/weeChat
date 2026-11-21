import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    Send,
    Eye,
    ShieldAlert,
    RefreshCw,
    X,
    ChevronLeft,
    ChevronRight,
    Tag,
    AlertTriangle,
    Mail,
    LifeBuoy
} from 'lucide-react';
import {
    getSupportQueries,
    resolveSupportQuery,
    updateQueryStatus,
    getAbuseReports
} from '../api/admin.api.js';
import UserInspectorModal from './UserInspectorModal.jsx';
import { toast } from 'sonner';

/**
 * QueriesTab — Client Queries Resolution & Support Helpdesk
 * "aur client ki querry resolve kreyga"
 */
const QueriesTab = () => {
    const [activeSection, setActiveSection] = useState('tickets'); // 'tickets' | 'reports'
    const [tickets, setTickets] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 });
    const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');

    // Modals
    const [resolvingTicket, setResolvingTicket] = useState(null);
    const [resolutionText, setResolutionText] = useState('');
    const [resolutionStatus, setResolutionStatus] = useState('resolved');
    const [submittingResolution, setSubmittingResolution] = useState(false);

    // User Deep Dive Modal trigger
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isInspectorOpen, setIsInspectorOpen] = useState(false);

    useEffect(() => {
        if (activeSection === 'tickets') {
            fetchTickets();
        } else {
            fetchReports();
        }
    }, [pagination.page, statusFilter, categoryFilter, priorityFilter, activeSection]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (activeSection === 'tickets') {
                fetchTickets(1);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchTickets = async (pageOverride) => {
        try {
            setLoading(true);
            const targetPage = pageOverride || pagination.page;
            const res = await getSupportQueries({
                page: targetPage,
                limit: pagination.limit,
                query: searchQuery,
                status: statusFilter,
                category: categoryFilter,
                priority: priorityFilter
            });

            if (res) {
                setTickets(res.tickets || []);
                setSummary(res.summary || { total: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 });
                if (res.pagination) {
                    setPagination((prev) => ({
                        ...prev,
                        page: res.pagination.page,
                        total: res.pagination.total,
                        totalPages: res.pagination.totalPages
                    }));
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load support queries", {
                description: err.response?.data?.message || err.message
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await getAbuseReports();
            if (res) {
                setReports(res.reports || []);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load abuse reports", {
                description: err.response?.data?.message || err.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenResolveModal = (ticket) => {
        setResolvingTicket(ticket);
        setResolutionText(ticket.adminResponse || '');
        setResolutionStatus(ticket.status === 'resolved' ? 'resolved' : 'resolved');
    };

    const handleSubmitResolution = async (e) => {
        e.preventDefault();
        if (!resolvingTicket) return;
        if (!resolutionText.trim()) {
            toast.error("Please provide a resolution reply");
            return;
        }

        try {
            setSubmittingResolution(true);
            const updated = await resolveSupportQuery(resolvingTicket._id, resolutionText, resolutionStatus);
            toast.success("Query resolved and answer delivered to client", {
                description: `Ticket #${resolvingTicket._id.slice(-6)} marked as ${resolutionStatus}`
            });
            setResolvingTicket(null);
            setResolutionText('');
            // Update in place
            setTickets((prev) =>
                prev.map((t) => (t._id === resolvingTicket._id ? updated : t))
            );
            fetchTickets();
        } catch (err) {
            console.error(err);
            toast.error("Failed to resolve query", {
                description: err.response?.data?.message || err.message
            });
        } finally {
            setSubmittingResolution(false);
        }
    };

    const handleQuickStatusChange = async (ticketId, newStatus) => {
        try {
            await updateQueryStatus(ticketId, newStatus);
            toast.success(`Ticket marked as ${newStatus}`);
            setTickets((prev) =>
                prev.map((t) => (t._id === ticketId ? { ...t, status: newStatus } : t))
            );
        } catch (err) {
            console.error(err);
            toast.error("Status update failed", {
                description: err.response?.data?.message || err.message
            });
        }
    };

    const handleInspectUser = (userId) => {
        if (!userId) {
            toast.error("No linked user account");
            return;
        }
        setSelectedUserId(userId);
        setIsInspectorOpen(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'open':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Open (Awaiting Reply)
                    </span>
                );
            case 'in_progress':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                        <Clock className="w-3 h-3" />
                        In Progress
                    </span>
                );
            case 'resolved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                        <CheckCircle2 className="w-3 h-3" />
                        Resolved
                    </span>
                );
            case 'closed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
                        Closed
                    </span>
                );
            default:
                return null;
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'high':
                return (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40">
                        High Priority
                    </span>
                );
            case 'medium':
                return (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                        Medium
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        Low
                    </span>
                );
        }
    };

    const getCategoryBadge = (category) => {
        const colors = {
            account: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40',
            billing: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
            bug: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40',
            feedback: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/40',
            general: 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
        };
        const cls = colors[category] || colors.general;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cls}`}>
                <Tag className="w-2.5 h-2.5" />
                {category}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-neutral-500">Total Queries</span>
                        <LifeBuoy className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                        {summary.total}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">All customer inquiries</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 backdrop-blur-xl border border-blue-200/60 dark:border-blue-900/40 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Open & Pending</span>
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-2">
                        {summary.open}
                    </div>
                    <p className="text-[11px] text-blue-600/80 dark:text-blue-400/80 mt-0.5">Needs admin response</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 backdrop-blur-xl border border-amber-200/60 dark:border-amber-900/40 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">In Progress</span>
                        <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold text-amber-900 dark:text-amber-200 mt-2">
                        {summary.in_progress}
                    </div>
                    <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">Under investigation</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 backdrop-blur-xl border border-emerald-200/60 dark:border-emerald-900/40 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Resolved</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-200 mt-2">
                        {summary.resolved}
                    </div>
                    <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">Answers delivered</p>
                </div>
            </div>

            {/* Navigation Toggle (Tickets vs User Abuse Reports) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-200/70 dark:bg-neutral-800/70 backdrop-blur-md w-fit">
                    <button
                        onClick={() => setActiveSection('tickets')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeSection === 'tickets'
                                ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 shadow-sm'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                        }`}
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Client Support Queries ({summary.total})
                    </button>
                    <button
                        onClick={() => setActiveSection('reports')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeSection === 'reports'
                                ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 shadow-sm'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                        }`}
                    >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Abuse & Safety Reports
                    </button>
                </div>

                <button
                    onClick={() => (activeSection === 'tickets' ? fetchTickets() : fetchReports())}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors w-fit cursor-pointer"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Queries
                </button>
            </div>

            {/* If SECTION is TICKETS */}
            {activeSection === 'tickets' && (
                <div className="space-y-4">
                    {/* Filters Bar */}
                    <div className="p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search queries by subject, message, customer name, email..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none text-xs focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all placeholder:text-neutral-400"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Status */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 border-none outline-none cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                <option value="open">Open (Needs Resolution)</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>

                            {/* Category */}
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 border-none outline-none cursor-pointer"
                            >
                                <option value="all">All Categories</option>
                                <option value="account">Account & Login</option>
                                <option value="billing">Billing & UPI</option>
                                <option value="bug">Technical Bug</option>
                                <option value="feedback">Feature Request</option>
                            </select>

                            {/* Priority */}
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 border-none outline-none cursor-pointer"
                            >
                                <option value="all">All Priorities</option>
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                        </div>
                    </div>

                    {/* Ticket List */}
                    {loading ? (
                        <div className="p-12 text-center rounded-3xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800">
                            <RefreshCw className="w-8 h-8 text-neutral-400 animate-spin mx-auto mb-3" />
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                Connecting to MongoDB Atlas & Loading Client Queries...
                            </p>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="p-12 text-center rounded-3xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800">
                            <MessageSquare className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                No Support Queries Found
                            </h3>
                            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                                No customer inquiries match the current search or filter criteria.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tickets.map((ticket) => {
                                const customer = ticket.userId;
                                const isResolved = ticket.status === 'resolved';

                                return (
                                    <div
                                        key={ticket._id}
                                        className="p-5 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm transition-all hover:border-neutral-300 dark:hover:border-neutral-700 space-y-4"
                                    >
                                        {/* Card Header */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                {/* Customer Avatar */}
                                                <div className="relative">
                                                    {customer?.avatar ? (
                                                        <img
                                                            src={customer.avatar}
                                                            alt={customer.name}
                                                            className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-sm text-neutral-700 dark:text-neutral-300">
                                                            {customer?.name?.[0]?.toUpperCase() || 'U'}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                            {customer?.name || 'Anonymous User'}
                                                        </span>
                                                        <span className="text-xs text-neutral-500">
                                                            @{customer?.username || 'user'}
                                                        </span>
                                                        {customer && (
                                                            <button
                                                                onClick={() => handleInspectUser(customer._id)}
                                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                                                                title="Inspect User Device & History"
                                                            >
                                                                <Eye className="w-3 h-3 text-neutral-400" />
                                                                Inspect User
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                                                        <Mail className="w-3 h-3" />
                                                        <span>{customer?.email || 'No email'}</span>
                                                        <span>•</span>
                                                        <span>Ticket #{ticket._id.slice(-6)}</span>
                                                        <span>•</span>
                                                        <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Badges & Status */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {getCategoryBadge(ticket.category)}
                                                {getPriorityBadge(ticket.priority)}
                                                {getStatusBadge(ticket.status)}
                                            </div>
                                        </div>

                                        {/* Query Subject & Body */}
                                        <div className="p-4 rounded-xl bg-neutral-50/80 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-800/60 space-y-1.5">
                                            <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                                Subject: {ticket.subject}
                                            </div>
                                            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                                                {ticket.message}
                                            </p>
                                        </div>

                                        {/* Admin Resolution Section (If Resolved or Answered) */}
                                        {ticket.adminResponse && (
                                            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
                                                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                                    <div className="flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                        Official Admin Resolution
                                                    </div>
                                                    {ticket.resolvedAt && (
                                                        <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                                                            Resolved on {new Date(ticket.resolvedAt).toLocaleString()}
                                                            {ticket.resolvedBy?.name ? ` by ${ticket.resolvedBy.name}` : ''}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
                                                    {ticket.adminResponse}
                                                </p>
                                            </div>
                                        )}

                                        {/* Card Footer Actions */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-neutral-400 font-medium">Quick Status:</span>
                                                <select
                                                    value={ticket.status}
                                                    onChange={(e) => handleQuickStatusChange(ticket._id, e.target.value)}
                                                    className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 border-none outline-none cursor-pointer"
                                                >
                                                    <option value="open">Open</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="resolved">Resolved</option>
                                                    <option value="closed">Closed</option>
                                                </select>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenResolveModal(ticket)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                                                >
                                                    <Send className="w-3 h-3" />
                                                    {isResolved ? 'Update Resolution Answer' : 'Resolve Query & Reply'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Pagination Controls */}
                            {pagination.totalPages > 1 && (
                                <div className="p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
                                    <div className="text-xs text-neutral-500">
                                        Showing page <span className="font-bold">{pagination.page}</span> of <span className="font-bold">{pagination.totalPages}</span> ({pagination.total} total)
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={pagination.page <= 1}
                                            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                                            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 disabled:opacity-30 cursor-pointer"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            disabled={pagination.page >= pagination.totalPages}
                                            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                                            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 disabled:opacity-30 cursor-pointer"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* If SECTION is ABUSE & SAFETY REPORTS */}
            {activeSection === 'reports' && (
                <div className="space-y-4">
                    {loading ? (
                        <div className="p-12 text-center rounded-3xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800">
                            <RefreshCw className="w-8 h-8 text-neutral-400 animate-spin mx-auto mb-3" />
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                Loading User Abuse & Safety Reports...
                            </p>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="p-12 text-center rounded-3xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800">
                            <ShieldAlert className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                Clean Radar — No Pending Abuse Reports
                            </h3>
                            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                                All user interactions comply with platform community safety standards.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {reports.map((report) => (
                                <div
                                    key={report._id}
                                    className="p-5 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                                                Reason: {report.reason}
                                            </span>
                                        </div>
                                        <span className="text-xs text-neutral-400">
                                            {new Date(report.createdAt).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/40">
                                            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                                                Reported User (Offender)
                                            </span>
                                            <div className="font-bold text-neutral-900 dark:text-neutral-100">
                                                {report.reportedUserId?.name || 'Unknown User'}
                                            </div>
                                            <div className="text-neutral-500 text-[11px]">
                                                {report.reportedUserId?.email || report.reportedUserId?._id}
                                            </div>
                                            {report.reportedUserId?._id && (
                                                <button
                                                    onClick={() => handleInspectUser(report.reportedUserId._id)}
                                                    className="mt-2 text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                                                >
                                                    Inspect Offender Session & History &rarr;
                                                </button>
                                            )}
                                        </div>

                                        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/40">
                                            <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                                                Report Filed By
                                            </span>
                                            <div className="font-bold text-neutral-900 dark:text-neutral-100">
                                                {report.reporterId?.name || 'Anonymous Peer'}
                                            </div>
                                            <div className="text-neutral-500 text-[11px]">
                                                {report.reporterId?.email || report.reporterId?._id}
                                            </div>
                                        </div>
                                    </div>

                                    {report.details && (
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/40 p-2.5 rounded-lg">
                                            <span className="font-bold">Incident Notes:</span> {report.details}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Resolve Query Modal */}
            {resolvingTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 text-left space-y-5">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                                    Resolve Customer Query
                                </h3>
                                <p className="text-xs text-neutral-500 mt-0.5">
                                    Ticket #{resolvingTicket._id.slice(-6)} • {resolvingTicket.userId?.name || 'Client'}
                                </p>
                            </div>

                            <button
                                onClick={() => setResolvingTicket(null)}
                                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Query Preview */}
                        <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 text-xs space-y-1">
                            <div className="font-bold text-neutral-900 dark:text-neutral-100">
                                Subject: {resolvingTicket.subject}
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">
                                {resolvingTicket.message}
                            </p>
                        </div>

                        {/* Resolution Form */}
                        <form onSubmit={handleSubmitResolution} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Resolution Response / Answer to Client *
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    value={resolutionText}
                                    onChange={(e) => setResolutionText(e.target.value)}
                                    placeholder="Type your official response, troubleshooting steps, or resolution details here..."
                                    className="w-full p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none text-xs text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all placeholder:text-neutral-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Update Ticket Status
                                </label>
                                <select
                                    value={resolutionStatus}
                                    onChange={(e) => setResolutionStatus(e.target.value)}
                                    className="w-full p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none text-xs font-medium text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                >
                                    <option value="resolved">Mark as Resolved (Recommended)</option>
                                    <option value="in_progress">Keep in In-Progress</option>
                                    <option value="closed">Mark as Closed</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setResolvingTicket(null)}
                                    className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingResolution}
                                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-md disabled:opacity-50"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    {submittingResolution ? 'Delivering Resolution...' : 'Submit & Resolve Query'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Deep Dive Modal */}
            <UserInspectorModal
                userId={selectedUserId}
                isOpen={isInspectorOpen}
                onClose={() => {
                    setIsInspectorOpen(false);
                    setSelectedUserId(null);
                }}
            />
        </div>
    );
};

export default QueriesTab;
