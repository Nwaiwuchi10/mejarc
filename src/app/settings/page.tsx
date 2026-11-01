"use client";

import CustomerLayout from "@/src/Screens/CustomerLayout/CustomerLayout";
import ProfileSettingsScreen from "@/src/Screens/Customer/Profile/ProfileSettingsScreen";

export default function SettingsPage() {
    return (
        <CustomerLayout>
            <ProfileSettingsScreen />
        </CustomerLayout>
    );
}
