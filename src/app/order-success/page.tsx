import OrderSuccessPage from "@/src/pages/ordersuccess/OrderSuccessPage";
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

const page = () => {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        }>
            <OrderSuccessPage />
        </Suspense>
    );
};

export default page;
