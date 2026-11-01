"use client";

import React, { Suspense } from "react";
import CustomerLayout from "@/src/Screens/CustomerLayout/CustomerLayout";
import MessagesScreen from "@/src/Screens/Customer/Messages/MessagesScreen";

export default function MessagesPage() {
    return (
        <CustomerLayout>
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading messages...</div>}>
                <MessagesScreen />
            </Suspense>
        </CustomerLayout>
    );
}
