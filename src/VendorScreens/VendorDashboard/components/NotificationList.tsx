"use client";

import React from "react";
import { formatRelative } from "date-fns";

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    type: string;
}

interface NotificationListProps {
    notifications?: NotificationItem[];
    loading?: boolean;
}

const avatarColors = ["#DBEAFE", "#FEF3C7", "#D1FAE5"];
const textColors = ["#2563EB", "#92400E", "#065F46"];

export default function NotificationList({ notifications = [], loading }: NotificationListProps) {
    return (
        <div className="vd__card">
            <h2 className="vd__card__title">Notification</h2>
            <div className="vd__notifications__list">
                {loading ? (
                    <div className="py-10 text-center text-xs text-gray-400">Loading notifications...</div>
                ) : notifications.length > 0 ? (
                    notifications.map((n, i) => {
                        const initials = n.title?.substring(0, 2).toUpperCase() || "N";
                        return (
                            <div key={n.id} className="vd__notifications__item">
                                <div
                                    className="vd__notifications__avatar"
                                    style={{ 
                                        background: avatarColors[i % avatarColors.length], 
                                        color: textColors[i % textColors.length] 
                                    }}
                                >
                                    {initials}
                                </div>
                                <div className="vd__notifications__info">
                                    <div className="vd__notifications__name">{n.title}</div>
                                    <div className="vd__notifications__msg">{n.message}</div>
                                </div>
                                <div className="vd__notifications__time">
                                    {formatRelative(new Date(n.createdAt), new Date()).replace('at ', '')}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-10 text-center text-xs text-gray-400">No notifications</div>
                )}
            </div>
        </div>
    );
}
