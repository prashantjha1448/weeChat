import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
    Users, Plus, Search, Video, Mic, MessageSquare, 
    RefreshCw, Lock, ArrowRight, Calendar, Clock, Share2, X
} from 'lucide-react';
import CreateRoomModal from '../components/CreateRoomModal';
import { getActiveRoomsApi, joinRoomApi } from '../services/customRoom.services';
import { toast } from 'sonner';

const RoomsDashboardPage = () => {
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [scheduleFilter, setScheduleFilter] = useState('all'); // 'all', 'live', 'scheduled'
    const [quickCodeInput, setQuickCodeInput] = useState('');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
    const [targetRoomId, setTargetRoomId] = useState(null);
    const [passcodeInput, setPasscodeInput] = useState('');

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const resData = await getActiveRoomsApi();
            setRooms(resData.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleJoinClick = async (roomId, isPrivate = false) => {
        if (isPrivate) {
            setTargetRoomId(roomId);
            setPasscodeModalOpen(true);
            return;
        }

        try {
            await joinRoomApi(roomId);
            navigate(`/home/rooms/${roomId}`);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to join room';
            toast.error(msg);
        }
    };

    const handlePasscodeSubmit = async (e) => {
        e.preventDefault();
        if (!targetRoomId || !passcodeInput.trim()) return;

        try {
            await joinRoomApi(targetRoomId, passcodeInput.trim());
            setPasscodeModalOpen(false);
            navigate(`/home/rooms/${targetRoomId}`);
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid passcode';
            toast.error(msg);
        }
    };

    const handleQuickJoinSubmit = (e) => {
        e.preventDefault();
        if (!quickCodeInput.trim()) return;
        const code = quickCodeInput.trim().toUpperCase();
        handleJoinClick(code);
    };

    const handleCopyShareLink = (e, roomId) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}/join/${roomId}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success('Room share link copied!', {
            description: shareUrl
        });
    };

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.roomId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.host?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || room.roomType === selectedType;
        const matchesSchedule = 
            scheduleFilter === 'all' ? true :
            scheduleFilter === 'scheduled' ? Boolean(room.isScheduled) :
            !room.isScheduled;

        return matchesSearch && matchesType && matchesSchedule;
    });

    return (
        <div className="w-full min-h-screen bg-[#F5F5F7] text-neutral-900 font-sans p-6 sm:p-10">
            
            {/* Header Section */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-black text-white text-[11px] font-bold tracking-widest uppercase rounded-full">
                            NEW FEATURE
                        </span>
                        <span className="text-xs font-semibold text-neutral-500">Up to 100 Participants</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
                        Custom Rooms Hub
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1 max-w-xl">
                        Create or join multi-participant audio, video, screen share & group chat lounges.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={fetchRooms}
                        className="p-3 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-full text-neutral-700 transition-all cursor-pointer shadow-xs shrink-0"
                        title="Refresh rooms list"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        className="flex-1 md:flex-initial px-6 py-3.5 bg-black hover:bg-neutral-800 active:scale-95 text-white text-sm font-bold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/10"
                    >
                        <Plus className="w-4 h-4 text-white stroke-[2.5]" />
                        <span>Create Custom Room</span>
                    </button>
                </div>
            </div>

            {/* Quick Join & Search Controls */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                
                {/* 1. Search Active Rooms */}
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search rooms by title, host, or room code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-200/80 rounded-2xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all shadow-xs"
                    />
                </div>

                {/* 2. Quick Join Code Input */}
                <form onSubmit={handleQuickJoinSubmit} className="relative flex items-center">
                    <input
                        type="text"
                        placeholder="Enter Room Code (e.g. WEECHAT-X7K9)"
                        value={quickCodeInput}
                        onChange={(e) => setQuickCodeInput(e.target.value)}
                        className="w-full pl-4 pr-12 py-3.5 bg-white border border-neutral-200/80 rounded-2xl text-sm font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all shadow-xs"
                    />
                    <button
                        type="submit"
                        disabled={!quickCodeInput.trim()}
                        className="absolute right-2 p-2 rounded-xl bg-black text-white hover:bg-neutral-800 disabled:opacity-30 transition-all cursor-pointer"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </div>

            {/* Filter Tabs (Live vs Scheduled + Room Type) */}
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                {/* Live / Scheduled Filters */}
                <div className="flex items-center gap-1.5 p-1 bg-white border border-neutral-200/80 rounded-full text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => setScheduleFilter('all')}
                        className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                            scheduleFilter === 'all' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                        }`}
                    >
                        All Rooms
                    </button>
                    <button
                        type="button"
                        onClick={() => setScheduleFilter('live')}
                        className={`px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                            scheduleFilter === 'live' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                        }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Now
                    </button>
                    <button
                        type="button"
                        onClick={() => setScheduleFilter('scheduled')}
                        className={`px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                            scheduleFilter === 'scheduled' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        Scheduled
                    </button>
                </div>

                {/* Room Mode Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                    {[
                        { id: 'all', label: 'All Modes' },
                        { id: 'video', label: 'Video', icon: Video },
                        { id: 'audio', label: 'Audio', icon: Mic },
                        { id: 'chat', label: 'Text Chat', icon: MessageSquare }
                    ].map((tag) => {
                        const Icon = tag.icon;
                        const isSelected = selectedType === tag.id;
                        return (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => setSelectedType(tag.id)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                                    isSelected
                                        ? 'bg-neutral-800 text-white shadow-xs'
                                        : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                                }`}
                            >
                                {Icon && <Icon className="w-3.5 h-3.5" />}
                                <span>{tag.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Rooms Grid */}
            <div className="max-w-6xl mx-auto">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="h-48 bg-white border border-neutral-200/80 rounded-3xl animate-pulse p-6" />
                        ))}
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="bg-white border border-neutral-200/80 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm flex flex-col items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-neutral-900">No Rooms Found</h3>
                            <p className="text-xs text-neutral-500 mt-1">
                                Be the first host to create a custom room for up to 100 participants!
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setCreateModalOpen(true)}
                            className="px-6 py-3 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-all cursor-pointer"
                        >
                            Create Custom Room
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRooms.map((room) => (
                            <div
                                key={room._id}
                                className="bg-white border border-neutral-200/80 hover:border-neutral-300 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
                            >
                                <div>
                                    {/* Top Row: Room Type Badge & Schedule / Capacity */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className="px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-full text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
                                                {room.roomType === 'all' ? 'All Features' : room.roomType}
                                            </span>
                                            {room.isScheduled && (
                                                <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Scheduled
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
                                            <Users className="w-3.5 h-3.5" />
                                            <span>{room.participantCount} / {room.maxParticipants}</span>
                                        </div>
                                    </div>

                                    {/* Scheduled Date Display if Applicable */}
                                    {room.isScheduled && room.scheduledAt && (
                                        <div className="mb-2 px-3 py-1.5 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[11px] text-neutral-600 flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                                            <span>
                                                {new Date(room.scheduledAt).toLocaleString(undefined, {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })}
                                            </span>
                                        </div>
                                    )}

                                    {/* Title & Description */}
                                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-black transition-colors line-clamp-1">
                                        {room.title}
                                    </h3>
                                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                                        {room.description || 'No description provided.'}
                                    </p>
                                </div>

                                {/* Bottom Row: Host Info, Share Link & Join Button */}
                                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center justify-center uppercase overflow-hidden shrink-0">
                                            {room.host?.avatar ? (
                                                <img src={room.host.avatar} alt={room.host.name} className="w-full h-full object-cover" />
                                            ) : (
                                                room.host?.name?.charAt(0) || 'H'
                                            )}
                                        </div>
                                        <span className="text-xs font-medium text-neutral-600 truncate">
                                            {room.host?.name || 'Host'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => handleCopyShareLink(e, room.roomId)}
                                            className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition-all cursor-pointer"
                                            title="Copy Share Link"
                                        >
                                            <Share2 className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleJoinClick(room.roomId)}
                                            className="px-4 py-2.5 bg-black hover:bg-neutral-800 active:scale-95 text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-md shadow-black/10 flex items-center gap-1"
                                        >
                                            <span>Join</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Room Modal */}
            <CreateRoomModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onRoomCreated={(newRoom) => {
                    if (newRoom.isScheduled) {
                        fetchRooms();
                    } else {
                        navigate(`/home/rooms/${newRoom.roomId}`);
                    }
                }}
            />

            {/* Passcode Modal */}
            {passcodeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-neutral-200 shadow-2xl flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-neutral-700" />
                                Private Room Passcode
                            </h3>
                            <button type="button" onClick={() => setPasscodeModalOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handlePasscodeSubmit} className="flex flex-col gap-4">
                            <input
                                type="password"
                                placeholder="Enter passcode"
                                value={passcodeInput}
                                onChange={(e) => setPasscodeInput(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-mono text-neutral-900 focus:outline-none focus:border-black transition-all"
                            />
                            <button
                                type="submit"
                                className="w-full py-3 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-all cursor-pointer"
                            >
                                Unlock & Join Room
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomsDashboardPage;
