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
    BellOff,
    CheckCircle2,
    Clock,
    Zap
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
        case "agent_message":
            return MessageSquare;
        default:
            return Zap;
    }
};

const getIconColor = (type: string, isRead: boolean) => {
    if (isRead) return "text-gray-400 bg-gray-50 border-gray-100";
    switch (type) {
        case "admin": return "text-red-500 bg-red-50 border-red-100";
        case "order":
        case "productpayment":
        case "customdesignpayment": return "text-green-500 bg-green-50 border-green-100";
        case "agent_message": return "text-blue-500 bg-blue-50 border-blue-100";
        default: return "text-yellow-600 bg-yellow-50 border-yellow-100";
    }
}

export default function NotificationsListScreen() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
    const [filter, setFilter] = useState("all");

    const auth = useSelector((state: RootState) => state.auth);

    const fetchNotifications = async () => {
        if (!auth.userToken) return;
        try {
            setLoading(true);
            const response = await Api.get("/notification");
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
            await Api.patch(`/notification/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await Api.patch('/notification/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error marking all as read:", error);
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
        return true;
    });

    return (
        <div className="min-h-[calc(100vh-120px)] bg-transparent">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Notifications Center
                        <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Realtime
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Stay updated with your latest activities and messages.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleMarkAllAsRead}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                        <CheckCircle2 size={14} />
                        Mark all read
                    </button>
                    <button
                        onClick={fetchNotifications}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gray-900 rounded-xl transition-all hover:bg-black shadow-sm hover:shadow-lg"
                    >
                        <Clock size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main List Panel */}
                <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col">
                    {/* Filters bar */}
                    <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-6 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === "all" ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter("unread")}
                                className={`px-6 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === "unread" ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Unread
                            </button>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                            Showing {filteredNotifications.length} items
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center shadow-inner">
                                    <Loader2 className="animate-spin text-yellow-500" size={24} />
                                </div>
                                <p className="text-sm text-gray-400 font-medium italic">Fetching your updates...</p>
                            </div>
                        ) : filteredNotifications.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {filteredNotifications.map((notif) => {
                                    const Icon = getIcon(notif.type);
                                    const colorClasses = getIconColor(notif.type, notif.isRead);
                                    return (
                                        <div
                                            key={notif.id}
                                            onClick={() => handleSelectNotif(notif)}
                                            className={`group flex items-start gap-4 p-6 cursor-pointer transition-all hover:bg-gray-50 relative ${selectedNotif?.id === notif.id ? 'bg-yellow-50/30' : ''}`}
                                        >
                                            {/* Active Indicator */}
                                            {!notif.isRead && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-yellow-400 rounded-r-full shadow-[2px_0_10px_rgba(250,204,21,0.5)]" />
                                            )}

                                            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 ${colorClasses}`}>
                                                <Icon size={20} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className={`text-sm font-bold truncate pr-4 ${!notif.isRead ? 'text-gray-900' : 'text-gray-500'}`}>
                                                        {notif.title}
                                                    </h3>
                                                    <span className="text-[10px] font-semibold text-gray-400 italic flex-shrink-0 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
                                                    {notif.message}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-gray-50/20">
                                <div className="w-20 h-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-200 mb-6">
                                    <BellOff size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
                                <p className="text-sm text-gray-400 mt-1 max-w-[240px]">
                                    No notifications found. Sit back and relax while we watch for updates.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail View Panel */}
                <div className="w-full lg:w-[360px] flex flex-col gap-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 h-fit lg:sticky lg:top-[120px]">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <MessageSquare size={14} className="text-yellow-500" />
                            Message Details
                        </h2>

                        {selectedNotif ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="mb-6">
                                    <p className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full w-fit mb-3 uppercase tracking-wider">
                                        {selectedNotif.type.replace('_', ' ')}
                                    </p>
                                    <h3 className="text-lg font-black text-gray-900 leading-tight">
                                        {selectedNotif.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Clock size={10} className="text-gray-400" />
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                            {new Date(selectedNotif.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 border-dashed">
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
                                        {selectedNotif.message}
                                    </p>
                                </div>

                                {/* {selectedNotif.metadata && Object.keys(selectedNotif.metadata).length > 0 && (
                                    <div className="mt-8">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Properties</p>
                                        <div className="grid grid-cols-1 gap-3">
                                            {Object.entries(selectedNotif.metadata).map(([key, value]) => (
                                                <div key={key} className="bg-white border border-gray-100 rounded-xl p-3 flex justify-between items-center group hover:border-yellow-200 transition-colors">
                                                    <span className="text-[10px] text-gray-500 font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                    <span className="text-[10px] text-gray-900 font-black">{String(value)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        ) : (
                            <div className="py-12 px-4 text-center">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4 border border-gray-50">
                                    <Clock size={20} />
                                </div>
                                <p className="text-xs text-gray-400 font-medium italic">
                                    Select a notification to view full details and metadata.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
