"use client";

import CustomerLayout from "@/src/Screens/CustomerLayout/CustomerLayout";
import PaymentsScreen from "@/src/Screens/Customer/Payments/PaymentsScreen";

export default function PaymentsPage() {
    return (
        <CustomerLayout>
            <PaymentsScreen />
        </CustomerLayout>
    );
}
