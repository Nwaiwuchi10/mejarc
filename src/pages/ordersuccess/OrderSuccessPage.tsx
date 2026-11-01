"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { Loader2, X } from "lucide-react";

import Api from "@/src/Utils/Api";
import { clearCart } from "@/src/store/cartSlice";
import SuccessModal from "@/src/components/Modals/SuccessModal";

const Navbar = dynamic(() => import("@/src/components/Navbar/Navbar"), { ssr: false });
const Footer = dynamic(() => import("@/src/components/Footer/Footer"), { ssr: false });

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();

    // Safety check for searchParams being null in some Next.js environments
    const reference = searchParams ? searchParams.get("reference") : null;

    const [verifying, setVerifying] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!reference) {
                setError("No payment reference found.");
                setVerifying(false);
                return;
            }

            try {
                const response = await Api.get(`/order/paystack/verify?reference=${reference}`);
                const status = response.data?.status?.toLowerCase();
                if (status === "paid" || response.data?.message === "Payment verified successfully" || response.data?.message === "Payment already verified") {
                    dispatch(clearCart());
                    setShowModal(true);
                } else {
                    setError("Payment verification failed. Please contact support.");
                }
            } catch (err: any) {
                console.error("Verification error:", err);
                setError(err.response?.data?.message || "Error verifying payment.");
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [reference, dispatch]);

    const handleCloseModal = () => {
        setShowModal(false);
        router.push("/orders"); // Redirect to orders screen as requested
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="flex flex-col items-center justify-center min-h-[70vh] px-4">
                {verifying ? (
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-blue-50 border-t-blue-500 rounded-full animate-spin" />
                            <Loader2 className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={32} />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Verifying Payment</h2>
                            <p className="text-sm text-gray-500">Please wait while we confirm your transaction with Paystack...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <X size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Verification Failed</h2>
                        <p className="text-sm text-gray-500 mb-8">{error}</p>
                        <button
                            onClick={() => router.push("/checkout")}
                            className="bg-[#1a1a2e] text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all"
                        >
                            Back to Checkout
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-400 font-medium">Redirecting you to your orders...</p>
                    </div>
                )}
            </main>

            <SuccessModal
                isOpen={showModal}
                onClose={handleCloseModal}
            />

            <Footer />
        </div>
    );
}
