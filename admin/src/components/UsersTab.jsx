import React, { useState, useEffect } from 'react';
import {
    Search,
    UserPlus,
    Filter,
    Shield,
    ShieldAlert,
    Edit3,
    Trash2,
    Eye,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight,
    RefreshCw
} from 'lucide-react';
import { getAdminUsers, toggleBanUser, deleteAdminUser } from '../api/admin.api.js';
import UserInspectorModal from './UserInspectorModal.jsx';
import UserEditModal from './UserEditModal.jsx';
import { toast } from 'sonner';

/**
 * UsersTab — Complete Client CRUD, Search, Filters & Deep-Dive Trigger
 */
const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [genderFilter, setGenderFilter] = useState('all');

    // Modals
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isInspectorOpen, setIsInspectorOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, roleFilter, statusFilter, genderFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchUsers = async (page = pagination.page) => {
        try {
            setLoading(true);
            const params = {
                page,
                limit: pagination.limit,
                query: searchQuery.trim() || undefined,
                role: roleFilter !== 'all' ? roleFilter : undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
                gender: genderFilter !== 'all' ? genderFilter : undefined
            };
            const res = await getAdminUsers(params);
            if (res) {
                setUsers(res.users || []);
                setPagination(res.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load users", {
                description: err.response?.data?.message || err.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBan = async (user) => {
        const nextState = !user.isBanned;
        try {
            await toggleBanUser(user._id, nextState, nextState ? "Admin enforcement" : "Ban lifted");
            toast.success(nextState ? `User @${user.username} banned` : `User @${user.username} unbanned`);
            fetchUsers();
        } catch (err) {
            toast.error("Ban update failed", {
                description: err.response?.data?.message || err.message
            });
        }
    };

    const handleDeleteUser = async (user) => {
        if (!window.confirm(`Are you sure you want to permanently delete user @${user.username}?`)) {
            return;
        }
        try {
            await deleteAdminUser(user._id);
            toast.success(`User @${user.username} deleted`);
            fetchUsers();
        } catch (err) {
            toast.error("Delete failed", {
                description: err.response?.data?.message || err.message
            });
        }
    };

    const handleInspect = (user) => {
        setSelectedUserId(user._id);
        setIsInspectorOpen(true);
    };

    const handleOpenEdit = (user = null) => {
        setEditUser(user);
        setIsEditOpen(true);
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            {/* Top Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, @username, or email..."
                        className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-neutral-900 dark:text-neutral-100"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium focus:outline-none"
                    >
                        <option value="all">Role: All</option>
                        <option value="user">Users</option>
                        <option value="moderator">Moderators</option>
                        <option value="admin">Admins</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium focus:outline-none"
                    >
                        <option value="all">Status: All</option>
                        <option value="active">Active Only</option>
                        <option value="banned">Banned Only</option>
                    </select>

                    <select
                        value={genderFilter}
                        onChange={(e) => setGenderFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium focus:outline-none"
                    >
                        <option value="all">Gender: All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>

                    <button
                        onClick={() => handleOpenEdit(null)}
                        className="px-4 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add User</span>
                    </button>

                    <button
                        onClick={() => fetchUsers()}
                        className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                        title="Reload"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-50/80 dark:bg-neutral-800/80 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-200/80 dark:border-neutral-800">
                            <tr>
                                <th className="py-3.5 px-6">User Account</th>
                                <th className="py-3.5 px-4">Contact Info</th>
                                <th className="py-3.5 px-4">Gender & DOB</th>
                                <th className="py-3.5 px-4">Role</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4">Joined Date</th>
                                <th className="py-3.5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                            {loading && users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-neutral-500">
                                        <div className="w-6 h-6 rounded-full border-2 border-neutral-300 border-t-black dark:border-t-white animate-spin mx-auto mb-2" />
                                        Loading client records...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-neutral-500">
                                        No users found matching current filters.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u._id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-2xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-700 dark:text-neutral-300 shrink-0 overflow-hidden shadow-inner">
                                                    {u.avatar ? (
                                                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        u.name?.charAt(0).toUpperCase() || 'U'
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-neutral-900 dark:text-neutral-100">{u.name}</p>
                                                    <p className="text-[11px] text-neutral-500 font-mono">@{u.username}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4">
                                            <p className="text-neutral-800 dark:text-neutral-200 truncate max-w-[170px]" title={u.email}>
                                                {u.email}
                                            </p>
                                            <p className="text-[11px] text-neutral-400 font-mono">
                                                {u.mobile_Number || 'No phone'}
                                            </p>
                                        </td>

                                        <td className="py-4 px-4 capitalize">
                                            <p className="text-neutral-800 dark:text-neutral-200 font-semibold">
                                                {u.gender || 'Not specified'}
                                            </p>
                                            <p className="text-[11px] text-neutral-400">
                                                {u.dob ? new Date(u.dob).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : 'DOB N/A'}
                                            </p>
                                        </td>

                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                u.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                                                    : u.role === 'moderator'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                                    : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                                            }`}>
                                                {u.role || 'user'}
                                            </span>
                                        </td>

                                        <td className="py-4 px-4">
                                            {u.isBanned ? (
                                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-[10px] font-bold flex items-center gap-1 w-fit">
                                                    <XCircle className="w-3 h-3" />
                                                    Banned
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 w-fit">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Active
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-4 px-4 text-neutral-500 whitespace-nowrap">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }) : 'N/A'}
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => handleInspect(u)}
                                                    className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                                                    title="Inspect Device & Session History"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleOpenEdit(u)}
                                                    className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                                    title="Edit User"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleToggleBan(u)}
                                                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                                        u.isBanned
                                                            ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                                                            : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30'
                                                    }`}
                                                    title={u.isBanned ? 'Unban Account' : 'Ban Account'}
                                                >
                                                    <ShieldAlert className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteUser(u)}
                                                    className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-6 py-4 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                    <span>
                        Showing {users.length} of {pagination.total} total clients (Page {pagination.page} of {pagination.totalPages || 1})
                    </span>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => fetchUsers(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-300">
                            {pagination.page}
                        </span>
                        <button
                            onClick={() => fetchUsers(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Inspector Deep-Dive Modal */}
            <UserInspectorModal
                userId={selectedUserId}
                isOpen={isInspectorOpen}
                onClose={() => setIsInspectorOpen(false)}
            />

            {/* User Edit / Create Modal */}
            <UserEditModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                user={editUser}
                onSaved={() => fetchUsers()}
            />
        </div>
    );
};

export default UsersTab;
