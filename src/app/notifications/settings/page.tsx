"use client";

import CustomerLayout from "@/src/Screens/CustomerLayout/CustomerLayout";
import NotificationSettingsScreen from "@/src/Screens/Customer/Notifications/NotificationSettingsScreen";

export default function NotificationSettingsPage() {
    return (
        <CustomerLayout>
            <div className="p-4 md:p-8">
                <NotificationSettingsScreen />
            </div>
        </CustomerLayout>
    );
}
