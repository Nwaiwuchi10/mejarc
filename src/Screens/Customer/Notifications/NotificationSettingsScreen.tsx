"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save, Bell, Mail, Smartphone, RefreshCw, CheckCircle2 } from "lucide-react";
import Api from "@/src/Utils/Api";
import CustomModal from "@/src/components/Message/Message";

interface ModalState {
    show: boolean;
    type: "success" | "error";
    title: string;
    message: string;
}

interface NotificationSetting {
    id: string;
    label: string;
    key: string;
    enabled: boolean;
}

interface NotificationSection {
    title: string;
    icon: any;
    settings: NotificationSetting[];
}

export default function NotificationSettingsScreen() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modal, setModal] = useState<ModalState>({
        show: false,
        type: "success",
        title: "",
        message: ""
    });
    const [sections, setSections] = useState<NotificationSection[]>([
        {
            title: "Internal Notifications",
            icon: Bell,
            settings: [
                { id: "1", label: "New message from Admin", key: "messagesAdmin", enabled: true },
                { id: "2", label: "New message from Agent", key: "messagesAgent", enabled: true },
            ]
        },
        {
            title: "Project Updates",
            icon: RefreshCw,
            settings: [
                { id: "3", label: "New file uploaded", key: "projectFileUploaded", enabled: true },
                { id: "4", label: "Project status changed", key: "projectStatusChanged", enabled: true },
                { id: "5", label: "Revision request updates", key: "projectRevisionUpdates", enabled: true },
            ]
        },
        {
            title: "Payments & Orders",
            icon: CheckCircle2,
            settings: [
                { id: "6", label: "Payment successful", key: "paymentSuccessful", enabled: true },
                { id: "7", label: "New order confirmation", key: "paymentOrderConfirmation", enabled: true },
            ]
        },
        {
            title: "Reviews & Feedback",
            icon: RefreshCw,
            settings: [
                { id: "8", label: "Reminder to leave review", key: "reviewReminder", enabled: true },
                { id: "9", label: "Response to your review", key: "reviewResponse", enabled: true },
            ]
        },
        {
            title: "Delivery Channels",
            icon: Smartphone,
            settings: [
                { id: "10", label: "Receive updates via email", key: "emailNotifications", enabled: true },
                { id: "11", label: "Receive updates via SMS", key: "smsNotifications", enabled: false },
            ]
        }
    ]);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await Api.get('/user/profile/notification-settings');
            const backendSettings = res.data;

            setSections(prev => prev.map(section => ({
                ...section,
                settings: section.settings.map(s => ({
                    ...s,
                    enabled: backendSettings[s.key] ?? s.enabled
                }))
            })));
        } catch (error) {
            console.error("Error fetching settings:", error);
            // toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleToggle = (sectionTitle: string, settingId: string) => {
        setSections(prev => prev.map(section => {
            if (section.title === sectionTitle) {
                return {
                    ...section,
                    settings: section.settings.map(s =>
                        s.id === settingId ? { ...s, enabled: !s.enabled } : s
                    )
                };
            }
            return section;
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const flatSettings: any = {};
            sections.forEach(section => {
                section.settings.forEach(s => {
                    flatSettings[s.key] = s.enabled;
                });
            });

            await Api.patch('/user/profile/notification-settings', flatSettings);
            setModal({
                show: true,
                type: "success",
                title: "Settings Updated",
                message: "Your notification preferences have been saved successfully."
            });
        } catch (error) {
            console.error("Error saving settings:", error);
            setModal({
                show: true,
                type: "error",
                title: "Update Failed",
                message: "We encountered an error while saving your settings. Please try again."
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-yellow-500" size={32} />
                <p className="text-sm text-gray-400 font-medium">Loading your preferences...</p>
            </div>
        );
    }

    const NotificationSection = ({ title, settings, onToggle }: { title: string, settings: NotificationSetting[], onToggle: (id: string) => void }) => (
        <div className="mb-10">
            <h3 className="text-[10px] font-black text-gray-900 mb-6 uppercase tracking-[0.2em]">{title}</h3>
            <div className="space-y-4">
                {settings.map((s) => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
                        <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors uppercase tracking-tight">{s.label}</span>
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

    return (
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Notification Settings</h1>
                    <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold text-[10px]">Manage how and when you want to be notified.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white text-xs font-black rounded-2xl transition-all shadow-xl shadow-gray-200/50 disabled:opacity-50 disabled:cursor-not-allowed group uppercase tracking-widest text-[10px]"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} className="group-hover:scale-110 transition-transform" />}
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-sm">
                {sections.map((section, idx) => (
                    <React.Fragment key={section.title}>
                        {section.title === "Delivery Channels" && (
                            <div className="mt-8 mb-10 pt-10 border-t border-gray-100">
                                <h2 className="text-sm font-black text-gray-900 mb-8 tracking-tight uppercase">Delivery Channels</h2>
                            </div>
                        )}
                        <NotificationSection
                            title={section.title}
                            settings={section.settings}
                            onToggle={(id) => handleToggle(section.title, id)}
                        />
                    </React.Fragment>
                ))}


            </div>

            {modal.show && (
                <CustomModal
                    type={modal.type}
                    title={modal.title}
                    message={modal.message}
                    onClose={() => setModal(prev => ({ ...prev, show: false }))}
                />
            )}
        </div>
    );
}
