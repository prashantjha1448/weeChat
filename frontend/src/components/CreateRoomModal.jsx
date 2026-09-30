import React, { useState } from 'react';
import { X, Users, Lock, Video, Mic, MessageSquare, Sparkles } from 'lucide-react';
import { createRoomApi } from '../services/customRoom.services';
import { toast } from 'sonner';

const CreateRoomModal = ({ isOpen, onClose, onRoomCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [roomType, setRoomType] = useState('all');
    const [maxParticipants, setMaxParticipants] = useState(100);
    const [isPrivate, setIsPrivate] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error('Please enter a room title');
            return;
        }

        setIsSubmitting(true);
        try {
            const resData = await createRoomApi({
                title: title.trim(),
                description: description.trim(),
                roomType,
                maxParticipants: Number(maxParticipants),
                isPrivate,
                passcode: isPrivate ? passcode : undefined
            });

            toast.success('Custom Room Created!', {
                description: `Room Code: ${resData.data.roomId}`
            });

            if (onRoomCreated) onRoomCreated(resData.data);
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create custom room';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                            <Sparkles className="w-5 h-5 text-amber-400 stroke-[1.8]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Create Custom Room</h3>
                            <p className="text-xs text-neutral-500 font-medium">Host up to 100 participants in real-time</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-all cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[80vh]">
                    
                    {/* Room Title */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                            Room Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Nexus Tech Lounge & Chill"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
                        />
                    </div>

                    {/* Room Description */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                            Description (Optional)
                        </label>
                        <textarea
                            rows={2}
                            placeholder="What's this room about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition-all resize-none"
                        />
                    </div>

                    {/* Room Type Options */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                            Room Type Mode
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                            {[
                                { id: 'all', label: 'All Features', desc: 'Video + Audio + Chat + Share', icon: Sparkles },
                                { id: 'video', label: 'Video Call', desc: 'Face-to-face video grid', icon: Video },
                                { id: 'audio', label: 'Audio Lounge', desc: 'Voice chat & podcast style', icon: Mic },
                                { id: 'chat', label: 'Text Chat Room', desc: 'High capacity group messaging', icon: MessageSquare }
                            ].map((type) => {
                                const Icon = type.icon;
                                const isSelected = roomType === type.id;
                                return (
                                    <div
                                        key={type.id}
                                        onClick={() => setRoomType(type.id)}
                                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1 ${
                                            isSelected
                                                ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                                                : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-neutral-600'}`} />
                                            <span className="text-xs font-bold">{type.label}</span>
                                        </div>
                                        <span className={`text-[10px] ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                            {type.desc}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Max Participants Slider (Up to 100) */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-neutral-700" />
                                Max Participants Limit
                            </label>
                            <span className="text-sm font-bold font-mono px-2.5 py-0.5 bg-neutral-100 border border-neutral-200 rounded-full text-neutral-900">
                                {maxParticipants} / 100 People
                            </span>
                        </div>
                        <input
                            type="range"
                            min={2}
                            max={100}
                            value={maxParticipants}
                            onChange={(e) => setMaxParticipants(e.target.value)}
                            className="w-full accent-black cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-neutral-400 font-semibold mt-1">
                            <span>2 Users</span>
                            <span>50 Users</span>
                            <span>100 Users (Max)</span>
                        </div>
                    </div>

                    {/* Privacy & Passcode */}
                    <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-2xl flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-neutral-700" />
                                <div>
                                    <p className="text-xs font-bold text-neutral-900">Private Room Passcode</p>
                                    <p className="text-[11px] text-neutral-500">Require password to join</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                                className="w-4 h-4 accent-black rounded cursor-pointer"
                            />
                        </div>

                        {isPrivate && (
                            <input
                                type="password"
                                placeholder="Enter 4-digit room passcode"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-mono text-neutral-900 focus:outline-none focus:border-black transition-all"
                            />
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !title.trim()}
                        className={`w-full py-4 rounded-full text-sm font-bold transition-all shadow-lg cursor-pointer ${
                            isSubmitting || !title.trim()
                                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-neutral-800 active:scale-[0.98]'
                        }`}
                    >
                        {isSubmitting ? 'Creating Room...' : 'Create & Launch Room'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomModal;
