"use client";

import CustomerLayout from "@/src/Screens/CustomerLayout/CustomerLayout";
import NotificationsListScreen from "@/src/Screens/Customer/Notifications/NotificationsListScreen";

export default function NotificationsPage() {
    return (
        <CustomerLayout>
            <NotificationsListScreen />
        </CustomerLayout>
    );
}
