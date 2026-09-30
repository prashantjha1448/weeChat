import React, { useState, useEffect, useRef } from 'react';
import { getSocket } from '../services/socket.service';

/**
 * InCallChat — Apple Light Theme In-Call Text Overlay
 */
const InCallChat = ({ roomId }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const chatBottomRef = useRef(null);

    useEffect(() => {
        if (!roomId) return;
        const socket = getSocket();

        const handleReceiveChat = (data) => {
            setMessages((prev) => [...prev, data]);
        };

        socket.on('chat:receive', handleReceiveChat);

        return () => {
            socket.off('chat:receive', handleReceiveChat);
        };
    }, [roomId]);

    useEffect(() => {
        if (chatBottomRef.current) {
            chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() || !roomId) return;

        const socket = getSocket();
        const msgText = text.trim();

        // Emit chat:send to socket server
        socket.emit('chat:send', { roomId, text: msgText });

        // Add to local message list immediately
        setMessages((prev) => [
            ...prev,
            { senderName: "You", text: msgText, isSelf: true }
        ]);

        setText('');
    };

    return (
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-neutral-200 rounded-2xl p-4 shadow-xl flex flex-col gap-3 text-left mt-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-bold text-neutral-900">In-Call Text Chat</span>
                <span className="text-[10px] text-neutral-400 font-mono uppercase font-semibold">Live Overlay</span>
            </div>

            {/* Message History Window */}
            <div className="h-32 overflow-y-auto flex flex-col gap-2 pr-1 font-sans text-xs">
                {messages.length === 0 ? (
                    <p className="text-neutral-400 text-[11px] italic my-auto text-center">Say hi to your match...</p>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                        >
                            <span className="text-[10px] text-neutral-400 font-semibold mb-0.5">{msg.senderName}</span>
                            <div className={`px-3 py-1.5 rounded-xl max-w-[80%] text-xs font-medium ${
                                msg.isSelf ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-900'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
                <div ref={chatBottomRef} />
            </div>

            {/* Input Field */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer"
                >
                    Send
                </button>
            </form>

        </div>
    );
};

export default InCallChat;
