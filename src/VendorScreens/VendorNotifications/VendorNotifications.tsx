"use client";

import React, { useState, useEffect } from "react";
import {
    Wallet as WalletIcon,
    FileText,
    MessageSquare,
    Flag,
    ShoppingBag,
    ShieldAlert,
    UserCheck,
    Loader2,
    BellOff
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import Api from "@/src/Utils/Api";
import { formatDistanceToNow } from "date-fns";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    metadata?: any;
}

const getIcon = (type: string) => {
    switch (type) {
        case "product":
        case "customdesign":
            return FileText;
        case "order":
            return ShoppingBag;
        case "wallet":
        case "withdrawal":
        case "productpayment":
        case "customdesignpayment":
            return WalletIcon;
        case "admin":
            return ShieldAlert;
        case "kyc":
            return UserCheck;
        default:
            return BellOff;
    }
};

export default function VendorNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
    const [filter, setFilter] = useState("all");

    const auth = useSelector((state: RootState) => state.auth);

    const fetchNotifications = async () => {
        if (!auth.userToken) return;
        try {
            setLoading(true);
            const response = await Api.get("/notification", {
                headers: { Authorization: `Bearer ${auth.userToken}` }
            });
            const data = response.data?.data || response.data || [];
            if (!Array.isArray(data)) {
                setNotifications([]);
                return;
            }
            setNotifications(data);
            if (data.length > 0 && !selectedNotif) {
                setSelectedNotif(data[0]);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [auth.userToken]);

    const handleMarkAsRead = async (id: string) => {
        try {
            await Api.patch(`/notification/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${auth.userToken}` }
            });
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleSelectNotif = (notif: Notification) => {
        setSelectedNotif(notif);
        if (!notif.isRead) {
            handleMarkAsRead(notif.id);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === "unread") return !n.isRead;
        // Basic temporal filters could be added here if backend supported them
        return true;
    });

    return (
        <div className="p-8 bg-[#f5f6fa] min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-[#1a1a2e]">All Notifications Center</h1>
                <button 
                  onClick={fetchNotifications}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Notifications List */}
                <div className="flex-1 bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-8">
                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl w-fit mb-10">
                        <button 
                          onClick={() => setFilter("all")}
                          className={`px-10 py-2.5 font-bold text-sm rounded-xl transition-all ${filter === "all" ? "bg-white text-[#1a1a2e] shadow-sm" : "bg-transparent text-gray-500 hover:bg-gray-100/50"}`}
                        >
                            All
                        </button>
                        <button 
                          onClick={() => setFilter("unread")}
                          className={`px-10 py-2.5 font-bold text-sm rounded-xl transition-all ${filter === "unread" ? "bg-white text-[#1a1a2e] shadow-sm" : "bg-transparent text-gray-500 hover:bg-gray-100/50"}`}
                        >
                            Unread
                        </button>
                    </div>

                    {/* List */}
                    <div className="space-y-0 text-left">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="animate-spin text-blue-500" size={32} />
                                <p className="text-sm text-gray-400 font-medium">Loading notifications...</p>
                            </div>
                        ) : filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notif, idx) => {
                                const Icon = getIcon(notif.type);
                                return (
                                    <div 
                                        key={notif.id} 
                                        onClick={() => handleSelectNotif(notif)}
                                        className={`flex items-start gap-6 py-8 ${idx !== filteredNotifications.length - 1 ? 'border-b border-gray-50' : ''} group cursor-pointer relative ${selectedNotif?.id === notif.id ? 'bg-blue-50/30' : ''}`}
                                    >
                                        {!notif.isRead && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                                        )}
                                        <div className={`w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center transition-all shadow-sm flex-shrink-0 ${!notif.isRead ? 'bg-blue-50 text-blue-500 border-blue-100' : 'text-gray-400 group-hover:bg-gray-50'}`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`text-sm font-bold ${!notif.isRead ? 'text-[#1a1a2e]' : 'text-gray-500'}`}>{notif.title}</h3>
                                                {!notif.isRead && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed max-w-2xl line-clamp-2">{notif.message}</p>
                                        </div>
                                        <span className="text-[10px] font-semibold text-gray-400 italic flex-shrink-0">
                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                    <BellOff size={32} />
                                </div>
                                <div>
                                    <p className="text-gray-900 font-bold">No notifications found</p>
                                    <p className="text-sm text-gray-400 mt-1">We'll notify you when something important happens.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Body Panel */}
                <div className="w-full lg:w-[320px] bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 h-fit lg:sticky lg:top-8">
                    <h2 className="text-sm font-bold text-[#1a1a2e] mb-4 uppercase tracking-wide flex items-center gap-2">
                        <MessageSquare size={16} className="text-blue-500" />
                        Message Body
                    </h2>
                    {selectedNotif ? (
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-gray-50">
                                <h3 className="text-sm font-bold text-[#1a1a2e] mb-1">{selectedNotif.title}</h3>
                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                                    {formatDistanceToNow(new Date(selectedNotif.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {selectedNotif.message}
                            </p>
                            {selectedNotif.metadata && (
                                <div className="pt-4 mt-4 border-t border-gray-50">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Metadata</p>
                                    <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                                        {Object.entries(selectedNotif.metadata).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-center text-[10px]">
                                                <span className="text-gray-500 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                <span className="text-gray-900 font-black">{String(value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 leading-relaxed italic">
                            Select a notification to view its full details.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
