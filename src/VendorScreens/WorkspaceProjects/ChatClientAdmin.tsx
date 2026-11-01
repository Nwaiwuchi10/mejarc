"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, MoreVertical, Paperclip, Send, Loader2, Check, CheckCheck, User, MessageSquare } from "lucide-react";
import { getSocket } from "@/src/Utils/Socket";
import { parseJwt } from "@/src/Utils/jwt";

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface ChatProps {
  project: any;
}

export default function ChatClientAdmin({ project }: ChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [conversation, setConversation] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = useCallback(async (convId: string) => {
    const token = localStorage.getItem("agentToken") || localStorage.getItem("userToken");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/messages/${convId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data.items || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initChat = useCallback(async () => {
    if (!project?.id) return;

    const token = localStorage.getItem("agentToken") || localStorage.getItem("userToken");
    const decoded = parseJwt(token);
    setCurrentUserId(decoded?.sub || decoded?.id);

    try {
      // 1. Try to get existing conversation
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/custom-design/${project.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data;
      if (response.status === 404) {
        // 2. Start new conversation if not exists
        response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/start-custom-design/${project.id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to start chat");
        data = await response.json();
      } else {
        data = await response.json();
      }

      setConversation(data);
      if (data.id) {
        fetchMessages(data.id);

        // 3. Initialize Socket
        const socket = getSocket(token!);
        socketRef.current = socket;

        socket.emit("joinConversation", { conversationId: data.id });

        socket.on("newMessage", (msg: any) => {
          if (msg.conversationId === data.id) {
            setMessages(prev => [...prev, msg]);
          }
        });
      }
    } catch (err) {
      console.error("Error initializing chat:", err);
      setIsLoading(false);
    }
  }, [project?.id, fetchMessages]);

  useEffect(() => {
    initChat();
    return () => {
      if (socketRef.current && conversation?.id) {
        socketRef.current.off("newMessage");
      }
    };
  }, [initChat, conversation?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation?.id) return;

    const token = localStorage.getItem("agentToken") || localStorage.getItem("userToken");
    const tempText = newMessage;
    setNewMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/send/${conversation.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: tempText }),
      });

      if (!response.ok) throw new Error("Failed to send message");
      // The socket will receive the message back and update the list
    } catch (err) {
      console.error("Error sending message:", err);
      setNewMessage(tempText); // Restore on failure
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-md">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex w-full h-full bg-white border border-gray-100 shadow-sm rounded-md overflow-hidden">

      {/* LEFT COLUMN: Project Info (reusing the layout structure) */}
      <div className="w-[300px] border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-100 bg-[#F8F9FA]">
          <h2 className="text-[14px] font-bold text-gray-800 mb-1">Project Support</h2>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Workspace Chat</p>
        </div>

        {/* Participants List */}
        <div className="flex-1 overflow-y-auto">
          {/* Client */}
          <div className="flex items-center gap-3 p-4 bg-[#E8F0FE] border-l-4 border-blue-600">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {project?.owner?.name?.charAt(0) || "C"}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <h4 className="text-[13px] font-bold text-blue-800 truncate">{project?.owner?.name || "Client"}</h4>
              <p className="text-[11px] text-blue-600 font-medium">Project Owner</p>
            </div>
          </div>

          {/* Admin / Support */}
          <div className="flex items-center gap-3 p-4 hover:bg-gray-50 border-l-4 border-transparent cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <User size={20} />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-gray-800">Mejarc Admin</h4>
              <p className="text-[11px] text-gray-500">System Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Chat Area */}
      <div className="flex-1 flex flex-col relative bg-[#F4F7FB]">

        {/* Chat Header */}
        <div className="h-[73px] border-b border-gray-100 bg-white px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
              {project?.owner?.name?.charAt(0) || "C"}
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-gray-800">{project?.owner?.name || "Client"}</h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">Active Project - {project?.id?.slice(-6)}</span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-md text-[12px] font-bold transition-all shadow-sm active:scale-95">
            More Actions
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Chat Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 flex flex-col gap-6"
        >
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare size={48} className="mb-3 opacity-10" />
              <p className="text-sm italic">No messages yet. Start the conversation!</p>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUserId;
            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const showDate = !prevMsg || new Date(msg.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString();

            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-white/50 backdrop-blur-sm text-gray-400 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gray-100">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}

                <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[12px] font-bold text-blue-600 mr-3 mt-1 shrink-0">
                      {msg.sender?.name?.charAt(0) || "C"}
                    </div>
                  )}

                  <div className="flex flex-col gap-1 max-w-[75%]">
                    <div
                      className={`rounded-2xl px-5 py-3 text-[13.5px] leading-relaxed shadow-sm relative ${isMe
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white text-gray-700 rounded-bl-sm border border-gray-100"
                        }`}
                    >
                      {msg.text}

                      <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? "text-blue-100/50" : "text-gray-300"}`}>
                        <span className="text-[9px] font-medium">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck size={12} />}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Chat Input */}
        <div className="p-5 bg-white border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-3 w-full bg-[#F4F7FB] border border-gray-100 rounded-full pl-5 pr-2 py-1.5 focus-within:bg-white focus-within:border-blue-200 transition-all">
            <input
              type="text"
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 outline-none text-[13.5px] text-gray-700 bg-transparent placeholder-gray-400 py-2"
            />

            <button className="text-gray-400 hover:text-gray-600 transition-colors p-2">
              <Paperclip size={20} />
            </button>

            <button
              onClick={handleSendMessage}
              className="w-10 h-10 bg-[#FFC700] hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90"
            >
              <Send size={18} className="text-gray-900 ml-0.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
