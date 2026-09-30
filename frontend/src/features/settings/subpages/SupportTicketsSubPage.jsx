import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getSupportTicketsApi, createSupportTicketApi } from '../settings.api';
import { AppleGroupedList, AppleGroupedRow } from '../components/AppleGroupedList';

const SupportTicketsSubPage = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [showNewForm, setShowNewForm] = useState(false);
    const [category, setCategory] = useState('Technical Support');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const fetchTickets = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await getSupportTicketsApi();
            const data = res.data || res;
            setTickets(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('Tickets API fetch notice:', err);
            setError(true);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;

        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            await createSupportTicketApi({ category, subject, message });
            setSubmitSuccess(true);
            setSubject('');
            setMessage('');
            setTimeout(() => {
                setSubmitSuccess(false);
                setShowNewForm(false);
                fetchTickets();
            }, 1200);
        } catch (err) {
            if (err?.response?.status === 404) {
                setSubmitError('Backend ticket creation endpoint (/api/support/tickets) not available yet.');
            } else {
                setSubmitError(err?.response?.data?.message || 'Failed to submit support ticket.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Recently';
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
                onClick={() => navigate('/home/settings/help')}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer w-fit"
            >
                <span>‹ Help & Legal</span>
            </button>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Support Tickets</h1>
                    <p className="text-sm text-[#86868B] mt-1 font-normal">
                        Submit support requests and track help ticket updates
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowNewForm((prev) => !prev)}
                    className="px-4 py-2 rounded-full bg-[#1D1D1F] text-white hover:bg-neutral-800 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                >
                    {showNewForm ? 'View Tickets' : 'New Ticket'}
                </button>
            </div>

            {showNewForm ? (
                /* Real Ticket Form */
                <div className="bg-white rounded-2xl border border-neutral-200/70 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col gap-4">
                    <h2 className="text-base font-semibold text-[#1D1D1F]">Create Support Ticket</h2>

                    {submitSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
                            Ticket submitted successfully!
                        </div>
                    )}

                    {submitError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
                            {submitError}
                        </div>
                    )}

                    <form onSubmit={handleCreateTicket} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-medium text-[#1D1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                            >
                                <option value="Technical Support">Technical Support / Video Call</option>
                                <option value="Account & Security">Account & Security</option>
                                <option value="Billing & Matchmaking">Billing & Matchmaking</option>
                                <option value="Feedback & Ideas">Feedback & Ideas</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">Subject</label>
                            <input
                                type="text"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Brief summary of your issue"
                                className="w-full px-3.5 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-medium text-[#1D1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">Description</label>
                            <textarea
                                required
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Provide relevant details or steps to reproduce..."
                                className="w-full px-3.5 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-medium text-[#1D1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowNewForm(false)}
                                className="px-5 py-2 rounded-full bg-neutral-100 text-neutral-800 font-semibold text-xs hover:bg-neutral-200 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-all cursor-pointer shadow-sm"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                /* Tickets List */
                loading ? (
                    <div className="space-y-3 animate-pulse">
                        <div className="h-14 bg-white rounded-2xl border border-neutral-200" />
                        <div className="h-14 bg-white rounded-2xl border border-neutral-200" />
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-2xl border border-neutral-200/70 p-8 text-center flex flex-col items-center gap-3">
                        <p className="text-xs text-[#86868B]">Unable to load support tickets.</p>
                        <button
                            onClick={fetchTickets}
                            className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                            Try again
                        </button>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-neutral-200/70 p-8 text-center text-xs text-[#86868B]">
                        You haven't submitted any support tickets.
                    </div>
                ) : (
                    <AppleGroupedList header="MY SUPPORT TICKETS">
                        {tickets.map((t) => {
                            const tid = t.id || t._id;
                            const status = t.status || 'Open';
                            return (
                                <AppleGroupedRow
                                    key={tid}
                                    label={t.subject || 'Support Request'}
                                    subtitle={`Category: ${t.category || 'General'} • Created ${formatDate(t.createdAt)}`}
                                    control={
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                status === 'Open'
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                                            }`}
                                        >
                                            {status}
                                        </span>
                                    }
                                />
                            );
                        })}
                    </AppleGroupedList>
                )
            )}
        </div>
    );
};

export default SupportTicketsSubPage;
