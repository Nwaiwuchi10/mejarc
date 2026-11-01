"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    ArrowLeft,
    Trash2,
    ChevronRight,
    CreditCard,
    ShieldCheck,
    Loader2,
    Check,
    Maximize
} from "lucide-react";

import { RootState } from "@/src/store/store";
import { removeItem, updateQuantity, clearCart } from "@/src/store/cartSlice";
import Api from "@/src/Utils/Api";
import CustomModal from "@/src/components/Message/Message";

const Navbar = dynamic(() => import("@/src/components/Navbar/Navbar"), { ssr: false });
const Footer = dynamic(() => import("@/src/components/Footer/Footer"), { ssr: false });

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);
    const { user } = useSelector((state: RootState) => state.auth);
    const [modal, setModal] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const id = localStorage.getItem("userId");
        if (!token || !id) {
            router.push("/login"); // or wherever the login page is
        }
    }, [router]);

    const [loading, setLoading] = useState(false);
    const [billingInfo, setBillingInfo] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: "",
        country: "Nigeria",
        address: "",
        city: "",
        state: "",
        postalCode: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBillingInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleInitializePayment = async () => {

        if (items.length === 0) return;
        const userId = localStorage.getItem("userId");
        const userToken = localStorage.getItem("userToken");
        if (!userId || !userToken) {
            router.push("/login");
            return;
        }
        setLoading(true);
        try {
            const orderItems = items.map(item => ({
                productId: item.id,
                totalQuantity: item.quantity
            }));

            const payload = {

                orderItems,
                email: billingInfo.email,
                billingInfo,
                redirect_url: `${window.location.origin}/order-success`,
            };

            const response = await Api.post("/order/initialize", payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                },
            });

            if (response.data?.authorization_url) {
                window.location.href = response.data.authorization_url;
            }
        } catch (error: any) {
            console.error("Order initialization failed:", error);
            setModal({
                type: "error",
                message: error?.response?.data?.message || "Failed to initialize payment. Please try again.",
            });

        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                    <div className="p-6 bg-gray-50 rounded-full">
                        <CreditCard size={48} className="text-gray-300" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
                    <button
                        onClick={() => router.push("/plans")}
                        className="text-blue-600 font-semibold hover:underline flex items-center gap-2"
                    >
                        <ArrowLeft size={18} /> Back to Plans
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    // Assuming the user is checking out one main product at a time for this specific UI
    const mainProduct = items[0];

    return (
        <>
            <div className="min-h-screen bg-[#F9FAFB] font-sans">
                <Navbar />

                <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Left Column - Product Details Sidebar (Matches Mockup) */}
                        <div className="w-full lg:w-[400px] space-y-6">
                            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm sticky top-28">
                                <div className="flex items-center justify-between mb-8">
                                    <button
                                        onClick={() => router.back()}
                                        className="flex items-center gap-3 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                                            <ArrowLeft size={18} className="text-gray-600" />
                                        </div>
                                        <span className="text-lg font-bold text-[#1a1a2e]">Confirm and pay</span>
                                    </button>
                                    <button
                                        onClick={() => dispatch(clearCart())}
                                        className="flex items-center gap-2 p-2 px-4 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                        <span className="text-sm font-bold cursor-pointer">Clear Cart</span>
                                    </button>
                                </div>

                                {/* Product Card */}
                                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-gray-100">
                                    <Image
                                        src={mainProduct.productImage?.[0] || ""}
                                        alt={mainProduct.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>

                                <h3 className="text-xl font-black text-[#1a1a2e] mb-3">
                                    {mainProduct.title}
                                </h3>

                                {mainProduct.area && (
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold mb-6 border border-blue-100">
                                        <Maximize size={14} className="text-blue-600" />
                                        <span>Plan Area: {mainProduct.area.toLowerCase().includes("sqm") || mainProduct.area.toLowerCase().includes("m²") ? mainProduct.area : `${mainProduct.area} sqm`}</span>
                                    </div>
                                )}

                                {/* Drawing Set Selection */}
                                <div className="bg-white border-2 border-blue-400 rounded-2xl p-5 mb-8 relative overflow-hidden">
                                    <div className="flex flex-col gap-3">
                                        <span className="text-xs font-black text-[#1a1a2e]">Drawing Set & Formats</span>
                                        {(mainProduct.drawingSets && mainProduct.drawingSets.length > 0 ? mainProduct.drawingSets : ["Architectural Plan"]).map((set: string) => {
                                            let formatLabel = "";
                                            if (mainProduct.fileType && mainProduct.fileType.includes(set)) {
                                                const match = mainProduct.fileType.match(new RegExp(`${set.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}\\s*\\(([^)]+)\\)`));
                                                if (match) formatLabel = match[1];
                                            }
                                            if (!formatLabel) {
                                                // Check for individual file types passed as keys or directly
                                                formatLabel = mainProduct.fileType || "CAD + PDF";
                                            }
                                            return (
                                                <div key={set} className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-5 h-5 rounded-[4px] bg-[#3B82F6] flex items-center justify-center text-white">
                                                            <Check size={14} strokeWidth={4} />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">
                                                            {set}
                                                        </span>
                                                    </div>
                                                    <div className="pl-8 flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                                                        <span>FORMAT:</span>
                                                        <span className="text-blue-600 font-bold uppercase">{formatLabel}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Price Summary Box */}
                                <div className="bg-[#F9FAFB] rounded-2xl p-6 flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black text-[#1a1a2e]">Total Price</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">NGN</span>
                                    </div>
                                    <span className="text-xl font-black text-[#1a1a2e]">
                                        ₦{totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Forms (Matches Mockup) */}
                        <div className="flex-1 space-y-8">

                            {/* 1. Payment Method */}
                            <section className="bg-white p-6 rounded-[24px] border border-blue-50 shadow-sm">
                                <div className="flex flex-col items-center text-center gap-6 py-2">
                                    <div className="w-full flex items-center justify-between border-b border-gray-50 pb-4 mb-2">
                                        <h2 className="text-lg font-black text-[#1a1a2e]">1. Payment Method</h2>
                                        <div className="flex items-center gap-2 text-green-500 bg-green-50 px-3 py-1 rounded-full">
                                            <ShieldCheck size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-wider">Secure</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#F9FAFB] w-full p-8 rounded-2xl flex flex-col items-center gap-4">
                                        <Image
                                            src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Paystack.png"
                                            alt="Paystack"
                                            width={140}
                                            height={42}
                                            className="object-contain"
                                            unoptimized
                                        />
                                        <p className="text-xs font-bold text-gray-400 max-w-[240px] leading-relaxed">
                                            You will be redirected to Paystack to complete your purchase securely via card, transfer or USSD.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* 2. Billing Address */}
                            <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                                <h2 className="text-xl font-black text-[#1a1a2e] mb-10">Billing address</h2>

                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-xs font-black text-[#1a1a2e] mb-3">Country/Region<span className="text-red-500">*</span></label>
                                        <select
                                            name="country"
                                            value={billingInfo.country}
                                            onChange={handleInputChange}
                                            className="w-full h-[60px] bg-[#F9FAFB] border-none rounded-2xl px-6 text-sm font-bold text-black outline-none appearance-none"
                                        >
                                            <option value="Nigeria">Nigeria</option>
                                            <option value="Ghana">Ghana</option>
                                            <option value="Kenya">Kenya</option>
                                        </select>
                                    </div>
                                    {/* jj */}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-xs font-black text-[#1a1a2e] mb-3 uppercase tracking-tighter">First Name (optional)</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="Holders Name"
                                                value={billingInfo.firstName}
                                                onChange={handleInputChange}
                                                className="w-full h-[60px] bg-[#F9FAFB] border-none rounded-2xl px-6 text-sm font-bold text-black outline-none placeholder:text-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-[#1a1a2e] mb-3 uppercase tracking-tighter">Last Name (optional)</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                placeholder="Holders Name"
                                                value={billingInfo.lastName}
                                                onChange={handleInputChange}
                                                className="w-full h-[60px] bg-[#F9FAFB] border-none rounded-2xl px-6 text-sm font-bold text-black outline-none placeholder:text-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-[#1a1a2e] mb-3 uppercase tracking-tighter">Adress</label>
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Lekki"
                                            value={billingInfo.address}
                                            onChange={handleInputChange}
                                            className="w-full h-[60px] bg-[#F9FAFB] border-none rounded-2xl px-6 text-sm font-bold text-black outline-none placeholder:text-gray-300"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div>
                                            <label className="block text-xs font-black text-[#1a1a2e] mb-3 uppercase tracking-tighter">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="Lagos"
                                                value={billingInfo.city}
                                                onChange={handleInputChange}
                                                className="w-full h-[60px] bg-[#F9FAFB] border-none rounded-2xl px-6 text-sm font-bold text-black outline-none placeholder:text-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-[#1a1a2e] mb-3 uppercase tracking-tighter">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                placeholder="Lagos"
                                                value={billingInfo.state}
                                                onChange={handleInputChange}
                                                className="w-full h-[60px] bg-[#F9FAFB] border-none rounded-2xl px-6 text-sm font-bold text-black outline-none placeholder:text-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-[#1a1a2e] mb-3 uppercase tracking-tighter">Poster Code (Optional)</label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                placeholder="Holders Name"
                                                value={billingInfo.postalCode}
                                                onChange={handleInputChange}
                                                className="w-full h-[60px] bg-[#F9FAFB] border-none rounded-2xl px-6 text-sm font-bold text-black outline-none placeholder:text-gray-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Centered Pay Button Area */}
                            <div className="flex flex-col items-center pt-10">
                                <button
                                    onClick={handleInitializePayment}
                                    disabled={loading}
                                    className="cursor-pointer w-full max-w-lg h-[70px] bg-[#3B82F6] hover:bg-blue-600 text-white font-black text-lg rounded-[20px] shadow-2xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-70 group"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            Confirm and pay
                                            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <div className="mt-8 flex items-center gap-6 grayscale opacity-40">
                                    <Image
                                        src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Paystack.png"
                                        alt="Paystack Secure"
                                        width={100}
                                        height={24}
                                        unoptimized
                                    />
                                    <div className="h-6 w-[1px] bg-gray-300" />
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <ShieldCheck size={14} />
                                        Secure SSL Encryption
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
            {modal && (
                <CustomModal
                    type={modal.type}
                    message={modal.message}
                    onClose={() => setModal(null)}
                />
            )}
        </>
    );
}
