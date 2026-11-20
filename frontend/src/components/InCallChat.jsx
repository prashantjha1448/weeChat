import React, { useState, useEffect, useRef } from 'react';
import { getSocket } from '../services/socket.service';
import { X, Send, MessageSquare } from 'lucide-react';

/**
 * InCallChat — Apple Glassmorphism Left-Aligned In-Call Text Chat
 */
const InCallChat = ({ roomId, isOpen, onClose, onNewMessage }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const chatBottomRef = useRef(null);

    // Reset messages when room changes (new stranger)
    useEffect(() => {
        setMessages([]);
    }, [roomId]);

    useEffect(() => {
        if (!roomId) return;
        const socket = getSocket();

        const handleReceiveChat = (data) => {
            setMessages((prev) => [...prev.slice(-99), data]);
            if (onNewMessage) onNewMessage(data);
        };

        socket.on('chat:receive', handleReceiveChat);

        return () => {
            socket.off('chat:receive', handleReceiveChat);
        };
    }, [roomId, onNewMessage]);

    useEffect(() => {
        if (isOpen && chatBottomRef.current) {
            chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() || !roomId) return;

        const socket = getSocket();
        const msgText = text.trim();

        // Emit chat:send to socket server
        socket.emit('chat:send', { roomId, text: msgText });

        // Add to local message list immediately
        setMessages((prev) => [
            ...prev.slice(-99),
            { senderName: "You", text: msgText, isSelf: true }
        ]);

        setText('');
    };

    return (
        <div
            className={`absolute left-3 sm:left-4 top-3 sm:top-4 bottom-3 sm:bottom-4 z-20 w-[calc(100%-1.5rem)] sm:w-80 flex flex-col bg-neutral-950/85 backdrop-blur-2xl border border-neutral-800/80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out ${
                isOpen
                    ? 'translate-x-0 opacity-100 pointer-events-auto'
                    : '-translate-x-[110%] opacity-0 pointer-events-none'
            }`}
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-900/50">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white tracking-tight">Live Chat</span>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Close Chat"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Message History Window */}
            <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5 font-sans min-h-0 text-left">
                {messages.length === 0 ? (
                    <div className="my-auto flex flex-col items-center justify-center text-center p-4 text-neutral-500">
                        <MessageSquare className="w-8 h-8 mb-2 opacity-30 text-white" />
                        <p className="text-xs font-medium text-neutral-400">No messages yet</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Send a greeting to your match!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                        >
                            {!msg.isSelf && (
                                <span className="text-[10px] text-neutral-400 font-semibold mb-1 px-1">
                                    {msg.senderName || 'Stranger'}
                                </span>
                            )}
                            <div
                                className={`px-3 py-2 rounded-2xl max-w-[85%] text-xs leading-relaxed break-words font-medium ${
                                    msg.isSelf
                                        ? 'bg-blue-600 text-white rounded-tr-sm shadow-md'
                                        : 'bg-neutral-800/90 text-neutral-100 rounded-tl-sm border border-neutral-700/60 shadow-sm'
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
                <div ref={chatBottomRef} />
            </div>

            {/* Input Field */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-800/80 bg-neutral-900/60 flex gap-2 items-center">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700/70 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                    type="submit"
                    disabled={!text.trim()}
                    className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-xl transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed shadow-md"
                    title="Send message"
                >
                    <Send className="w-3.5 h-3.5" />
                </button>
            </form>
        </div>
    );
};

export default InCallChat;
