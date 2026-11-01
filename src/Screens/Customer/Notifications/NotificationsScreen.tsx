"use client";

import React, { useState } from "react";

interface NotificationSetting {
    id: string;
    label: string;
    enabled: boolean;
}

interface NotificationSectionProps {
    title: string;
    settings: NotificationSetting[];
    onToggle: (id: string) => void;
}

const NotificationSection = ({ title, settings, onToggle }: NotificationSectionProps) => (
    <div className="mb-10">
        <h3 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">{title}</h3>
        <div className="space-y-4">
            {settings.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 transition-colors">{s.label}</span>
                    <button 
                        onClick={() => onToggle(s.id)}
                        className={`w-10 h-5 rounded-full relative transition-all duration-300 ${s.enabled ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'bg-gray-200'}`}
                    >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${s.enabled ? 'left-6' : 'left-1'}`} />
                    </button>
                </div>
            ))}
        </div>
    </div>
);

export default function NotificationsScreen() {
    const [sections, setSections] = useState({
        messages: [
            { id: "msg_admin", label: "New message from Admin", enabled: true },
            { id: "msg_agent", label: "New message from Agent", enabled: false },
        ],
        projectUpdates: [
            { id: "proj_file", label: "New file uploaded", enabled: true },
            { id: "proj_status", label: "Project status changed (In Progress • Review • Completed)", enabled: true },
            { id: "proj_revision", label: "Revision request updates", enabled: false },
        ],
        payments: [
            { id: "pay_success", label: "Payment successful", enabled: true },
            { id: "pay_refund", label: "Refund", enabled: true },
            { id: "pay_order", label: "New order confirmation", enabled: true },
        ],
        reviews: [
            { id: "rev_reminder", label: "Reminder to leave review", enabled: true },
            { id: "rev_response", label: "Response to your review", enabled: false },
        ],
        email: [
            { id: "email_updates", label: "Receive updates via email", enabled: true },
        ],
        sms: [
            { id: "sms_updates", label: "Receive updates via SMS", enabled: false },
        ]
    });

    const handleToggle = (sectionKey: string, id: string) => {
        setSections(prev => ({
            ...prev,
            [sectionKey]: (prev as any)[sectionKey].map((s: any) => 
                s.id === id ? { ...s, enabled: !s.enabled } : s
            )
        }));
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm max-w-4xl">
            <NotificationSection 
                title="Messages" 
                settings={sections.messages} 
                onToggle={(id) => handleToggle('messages', id)} 
            />
            <NotificationSection 
                title="Project Updates" 
                settings={sections.projectUpdates} 
                onToggle={(id) => handleToggle('projectUpdates', id)} 
            />
            <NotificationSection 
                title="Payments & Orders" 
                settings={sections.payments} 
                onToggle={(id) => handleToggle('payments', id)} 
            />
            <NotificationSection 
                title="Reviews & Feedback" 
                settings={sections.reviews} 
                onToggle={(id) => handleToggle('reviews', id)} 
            />
            
            <hr className="my-10 border-gray-100" />
            
            <h2 className="text-sm font-bold text-gray-900 mb-8 tracking-tight">Delivery Channels</h2>
            
            <NotificationSection 
                title="Email Notifications" 
                settings={sections.email} 
                onToggle={(id) => handleToggle('email', id)} 
            />
            <NotificationSection 
                title="SMS Notifications" 
                settings={sections.sms} 
                onToggle={(id) => handleToggle('sms', id)} 
            />
        </div>
    );
}
