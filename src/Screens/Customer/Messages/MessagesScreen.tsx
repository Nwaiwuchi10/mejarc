import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Paperclip, Send, MoreVertical, FileText, Loader2, MessageSquare, Search, ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import Api from "@/src/Utils/Api";
import { RootState } from "@/src/store/store";
import { getSocket, disconnectSocket } from "@/src/Utils/Socket";

export default function MessagesScreen() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const conversationId = searchParams ? searchParams.get("conversationId") : null;
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.userToken);
    
    const [inbox, setInbox] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [conversation, setConversation] = useState<any>(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [inboxLoading, setInboxLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const lastMessageRef = useRef<HTMLDivElement>(null);

    const fetchDMInbox = async () => {
        try {
            const res = await Api.get('/chat/dm-inbox');
            setInbox(res.data || []);
        } catch (error) {
            console.error("Error fetching DM inbox:", error);
        } finally {
            setInboxLoading(false);
        }
    };

    const fetchMessages = async (id: string) => {
        setLoading(true);
        try {
            const res = await Api.get(`/chat/messages/${id}`);
            setMessages(res.data.data || []);
            // Mark as read
            await Api.post(`/chat/read/${id}`);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDMInbox();
    }, []);

    useEffect(() => {
        if (conversationId) {
            fetchMessages(conversationId);
            const found = inbox.find(c => c.id === conversationId);
            if (found) {
                setConversation(found);
                // Locally mark as read in inbox list
                setInbox(prev => prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c));
            } else {
                // If not in current inbox, fetch inbox again or just fetch this conversation
                Api.get('/chat/dm-inbox').then(res => {
                    const c = res.data.find((x: any) => x.id === conversationId);
                    if (c) setConversation(c);
                    setInbox(res.data);
                });
            }
        } else {
            setConversation(null);
            setMessages([]);
        }
    }, [conversationId]);

    // WebSocket Integration
    useEffect(() => {
        if (!token) return;
        const socket = getSocket(token);

        socket.on("message:new", (payload: any) => {
            // If the message is for the currently open conversation
            if (payload.conversationId === conversationId) {
                // Check if already exists to avoid duplicates (from REST send)
                setMessages(prev => {
                    if (prev.find(m => m.id === payload.id)) return prev;
                    return [...prev, {
                        id: payload.id,
                        text: payload.text,
                        author: { id: payload.authorId },
                        attachments: payload.attachments,
                        createdAt: payload.createdAt
                    }];
                });
                // Mark as read via socket or rest
                socket.emit("chat:markAsRead", { conversationId });
            }
            // Update inbox preview and unread count
            setInbox(prev => prev.map(c => {
                if (c.id === payload.conversationId) {
                    return {
                        ...c,
                        lastMessage: { text: payload.text, createdAt: payload.createdAt },
                        unreadCount: c.id === conversationId ? 0 : (c.unreadCount || 0) + 1
                    };
                }
                return c;
            }));
        });

        socket.on("conversation:new", (newConv: any) => {
            setInbox(prev => [newConv, ...prev]);
        });

        return () => {
            socket.off("message:new");
            socket.off("conversation:new");
        };
    }, [token, conversationId]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || sending || !conversationId) return;
        setSending(true);
        try {
            const res = await Api.post(`/chat/send/${conversationId}`, { text: input });
            // The socket listener might handle adding this, but we do it manually for instant feedback
            setMessages(prev => {
               if (prev.find(m => m.id === res.data.id)) return prev;
               return [...prev, res.data];
            });
            setInput("");
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    const selectConversation = (id: string) => {
        router.push(`/messages?conversationId=${id}`);
    };

    const participant = conversation?.otherParticipant || {};

    return (
        <div className="flex h-[750px] bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            {/* Sidebar: DM Inbox */}
            <div className={`w-full lg:w-[380px] border-r border-gray-100 flex flex-col bg-[#F9FAFB]/30 ${conversationId ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-8 border-b border-gray-100 bg-white/50 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Messages</h2>
                        <div className="bg-blue-50 text-blue-600 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black">
                            {inbox.reduce((acc, c) => acc + (c.unreadCount || 0), 0)}
                        </div>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search conversations..." 
                            className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 scrollbar-hide">
                    {inboxLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 opacity-40">
                            <Loader2 className="animate-spin text-blue-500" size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Loading Chats...</span>
                        </div>
                    ) : inbox.length === 0 ? (
                        <div className="text-center py-20 px-10 opacity-40">
                             <MessageSquare className="mx-auto mb-4" size={40} strokeWidth={1} />
                             <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">No conversations yet</p>
                        </div>
                    ) : (
                        inbox.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => selectConversation(chat.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-[24px] transition-all duration-300 group ${
                                    conversationId === chat.id 
                                        ? 'bg-white shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/10' 
                                        : 'hover:bg-white hover:shadow-lg hover:shadow-gray-200/50'
                                }`}
                            >
                                <div className="relative shrink-0">
                                    {chat.otherParticipant?.profilePics ? (
                                        <Image 
                                            src={chat.otherParticipant.profilePics} 
                                            alt="User" 
                                            width={56} 
                                            height={56} 
                                            className="rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 font-black text-xl border border-white shadow-sm">
                                            {chat.otherParticipant?.firstName?.[0] || 'A'}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-black text-gray-900 truncate">
                                            {chat.otherParticipant?.firstName} {chat.otherParticipant?.lastName}
                                        </h4>
                                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">
                                            {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className={`text-[11px] font-medium truncate ${chat.unreadCount > 0 ? 'text-gray-900 font-black' : 'text-gray-400'}`}>
                                            {chat.lastMessage?.text || "No messages yet"}
                                        </p>
                                        {chat.unreadCount > 0 && (
                                            <span className="bg-blue-600 text-white text-[9px] font-black min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5 shadow-lg shadow-blue-200">
                                                {chat.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-white ${!conversationId ? 'hidden lg:flex' : 'flex'}`}>
                {conversationId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-xl z-20">
                            <div className="flex items-center gap-5">
                                <button onClick={() => router.push('/messages')} className="lg:hidden text-gray-400 hover:text-gray-900">
                                    <ChevronLeft size={24} />
                                </button>
                                <div className="relative">
                                    {participant.profilePics ? (
                                        <Image src={participant.profilePics} alt="User" width={50} height={50} className="rounded-2xl object-cover shadow-md" />
                                    ) : (
                                        <div className="w-[50px] h-[50px] rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-lg border border-gray-100">{participant.firstName?.[0] || 'A'}</div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base font-black text-gray-900 leading-tight truncate">{participant.firstName} {participant.lastName}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">Live Support</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"><Paperclip size={18} /></button>
                                <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"><MoreVertical size={18} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FAFBFF]/30 scrollbar-hide">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 pt-20">
                                    <Loader2 className="animate-spin text-blue-500" size={48} />
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Compiling History...</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-30 pt-20">
                                    <div className="w-20 h-20 bg-gray-100 rounded-[32px] flex items-center justify-center mb-6">
                                        <MessageSquare size={40} strokeWidth={1} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Safe & Secure Inbox</p>
                                </div>
                            ) : (
                                messages.map((m, index) => {
                                    const isMe = m.author?.id === user?.id;
                                    const isLast = index === messages.length - 1;
                                    const time = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <div 
                                            key={m.id} 
                                            ref={isLast ? lastMessageRef : null}
                                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group animate-in slide-in-from-bottom-2 duration-300`}
                                        >
                                            <div className="flex items-end gap-3 max-w-[85%] lg:max-w-[70%]">
                                                {!isMe && (
                                                    <div className="shrink-0 mb-1">
                                                       {participant.profilePics ? (
                                                            <Image src={participant.profilePics} alt="U" width={28} height={28} className="rounded-lg object-cover" />
                                                       ) : (
                                                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-200">{participant.firstName?.[0]}</div>
                                                       )}
                                                    </div>
                                                )}
                                                <div className={`p-5 rounded-[28px] shadow-sm transition-all hover:shadow-xl ${
                                                    isMe 
                                                        ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/10' 
                                                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-gray-200/50'
                                                }`}>
                                                    {m.attachments?.length > 0 && m.attachments.map((url: string, i: number) => (
                                                        <div key={i} className={`mb-4 rounded-2xl p-4 flex items-center gap-4 border ${isMe ? 'bg-white/10 border-white/20' : 'bg-gray-50 border-gray-100'}`}>
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isMe ? 'bg-white/20' : 'bg-blue-100 text-blue-600'}`}>
                                                                <FileText size={24} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-xs font-black truncate">File Attachment</div>
                                                                <a href={url} target="_blank" rel="noreferrer" className="text-[10px] font-bold underline opacity-80 mt-1 block">View Resource</a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <p className="text-[13px] font-medium leading-relaxed whitespace-pre-wrap">{m.text}</p>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] font-black text-gray-300 mt-2 uppercase tracking-widest px-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                {time}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 md:p-8 bg-white border-t border-gray-50">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                className="flex items-center gap-4 bg-gray-50/50 border border-gray-100 rounded-[32px] p-3 pl-8 focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-blue-500/10 focus-within:border-blue-200 transition-all duration-500"
                            >
                                <input 
                                    type="text" 
                                    placeholder="Write a message..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button 
                                    type="submit" 
                                    disabled={!input.trim() || sending}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white w-14 h-14 rounded-[24px] flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-90 transition-all shrink-0"
                                >
                                    {sending ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20 animate-in fade-in duration-1000">
                        <div className="relative mb-10">
                            <div className="absolute -inset-10 bg-blue-50/50 rounded-full blur-3xl animate-pulse"></div>
                            <div className="relative w-32 h-32 bg-white rounded-[48px] shadow-2xl border border-gray-100 flex items-center justify-center">
                                <MessageSquare size={64} className="text-blue-500" strokeWidth={1.5} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your Inbox</h2>
                        <p className="text-sm font-medium text-gray-400 max-w-sm leading-relaxed mb-10 italic">
                            Select a conversation from the sidebar to view messages or start a new discussion with our agents.
                        </p>
                        <div className="flex gap-4">
                            <div className="bg-gray-100 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-200">End-to-End Encryption</div>
                            <div className="bg-green-50 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-green-600 border border-green-100">Live Status: Active</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
