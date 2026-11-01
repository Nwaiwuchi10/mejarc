"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Api from "@/src/Utils/Api";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    balance: number;
    defaultAccountDetails?: string;
}

const presets = [20000, 50000, 100000, 150000, 250000, 500000];

export default function WithdrawModal({ isOpen, onClose, onSuccess, balance, defaultAccountDetails }: WithdrawModalProps) {
    const [amount, setAmount] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [accountDetails, setAccountDetails] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);
    const [rules, setRules] = useState<{
        mode: "AUTO" | "MANUAL";
        minWithdrawalAmount: number;
        maxWithdrawalAmount: number;
        autoApproveThreshold: number;
    }>({
        mode: "AUTO",
        minWithdrawalAmount: 1000,
        maxWithdrawalAmount: 5000000,
        autoApproveThreshold: 100000,
    });

    const auth = useSelector((state: RootState) => state.auth);
    const token = auth.userToken;

    useEffect(() => {
        if (isOpen) {
            fetchRules();
        }
        if (defaultAccountDetails) {
            setAccountDetails(defaultAccountDetails);
        }
    }, [defaultAccountDetails, isOpen]);

    const fetchRules = async () => {
        try {
            const res = await Api.get("/wallet/rules");
            if (res.data) {
                setRules({
                    mode: res.data.mode?.toUpperCase() === "MANUAL" ? "MANUAL" : "AUTO",
                    minWithdrawalAmount: Number(res.data.minWithdrawalAmount || 1000),
                    maxWithdrawalAmount: Number(res.data.maxWithdrawalAmount || 5000000),
                    autoApproveThreshold: Number(res.data.autoApproveThreshold || 100000),
                });
            }
        } catch (err) {
            console.error("Failed to load withdrawal rules", err);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async () => {
        const numAmount = parseFloat(amount.replace(/,/g, ''));
        
        if (isNaN(numAmount) || numAmount < rules.minWithdrawalAmount) {
            setError(`Minimum withdrawal amount is ₦${rules.minWithdrawalAmount.toLocaleString()}`);
            return;
        }

        if (numAmount > rules.maxWithdrawalAmount) {
            setError(`Maximum withdrawal amount per request is ₦${rules.maxWithdrawalAmount.toLocaleString()}`);
            return;
        }

        if (numAmount > balance) {
            setError("Insufficient balance");
            return;
        }

        if (!accountDetails.trim()) {
            setError("Account details are required");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await Api.post("/wallet/withdraw", {
                amount: numAmount,
                description,
                accountDetails
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setDone(true);
            onSuccess(); // Refresh wallet data
            setTimeout(() => {
                onClose();
                setDone(false);
                setAmount("");
                setDescription("");
            }, 2000);
        } catch (err: any) {
            console.error("Withdrawal error:", err);
            setError(err.response?.data?.message || "Failed to process withdrawal. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#000000]/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-[500px] rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                {done ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1a1a2e]">Withdrawal Successful</h2>
                        <p className="text-sm text-gray-500 max-w-[280px]">
                            Your withdrawal request has been submitted and is awaiting admin approval.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-[#1a1a2e]">Withdraw Funds</h2>
                                <p className="text-xs text-gray-400 mt-1">Only cleared funds can be withdrawn</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 border border-gray-100 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                <X size={20} className="text-[#1a1a2e]" />
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-semibold">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {/* Amount Input Section */}
                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-3xl font-extrabold text-[#1a1a2e]">₦</span>
                            <div className="flex-1 flex items-center">
                                <div className="w-[3px] h-10 bg-blue-500 mr-2"></div>
                                <input
                                    type="text"
                                    className="text-4xl font-bold text-[#1a1a2e] placeholder:text-gray-200 focus:outline-none w-full bg-transparent"
                                    placeholder="00.00"
                                    value={amount}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9.]/g, '');
                                        setAmount(val);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Presets Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {presets.map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val.toString())}
                                    className="py-3.5 bg-gray-50 rounded-xl text-sm font-bold text-gray-600 hover:bg-[#FFC700]/10 hover:text-[#1a1a2e] transition-all border border-transparent hover:border-[#FFC700]"
                                >
                                    ₦{val.toLocaleString()}
                                </button>
                            ))}
                        </div>

                        {/* Descriptions */}
                        <div className="mb-8">
                            <label className="text-sm font-bold text-[#1a1a2e] mb-3 block">Description (Optional)</label>
                            <textarea
                                className="w-full h-24 p-4 rounded-[18px] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFC700]/50 text-xs text-gray-600 resize-none"
                                placeholder="Add purpose of withdrawal..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Account Details & Footer */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
                            <div className="w-full sm:flex-1">
                                <label className="text-sm font-bold text-[#1a1a2e] mb-3 block">Account Details</label>
                                <input 
                                    type="text"
                                    className="w-full bg-gray-50 p-4 rounded-xl text-[10px] font-bold text-gray-600 border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#FFC700]"
                                    value={accountDetails}
                                    onChange={(e) => setAccountDetails(e.target.value)}
                                    placeholder="NAME - NUMBER - BANK"
                                />
                            </div>
                            <button 
                                onClick={handleSubmit}
                                disabled={loading || !amount}
                                className="w-full sm:w-auto px-10 py-4 bg-[#FFC700] hover:bg-[#e5b300] disabled:bg-gray-100 disabled:text-gray-400 text-[#1a1a2e] font-extrabold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 min-w-[160px]"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : "Confirm"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
