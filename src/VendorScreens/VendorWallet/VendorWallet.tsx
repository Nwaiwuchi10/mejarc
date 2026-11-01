"use client";

import React, { useState, useEffect } from "react";
import {
    ArrowUpRight,
    ArrowDownLeft,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Download,
    Loader2,
    Wallet as WalletIcon
} from "lucide-react";
import EnhancedWithdrawModal from "./components/EnhancedWithdrawModal";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import Api from "@/src/Utils/Api";
import { format } from "date-fns";

interface Transaction {
    id: string;
    createdAt: string;
    description: string;
    type: "CREDIT" | "DEBIT";
    amount: number;
    balanceAfter: number;
}

interface WalletOverview {
    balance: number;
    pendingClearance: number;
    lifetimeEarnings: number;
}

export default function VendorWallet() {
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [overview, setOverview] = useState<WalletOverview | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accountDetails, setAccountDetails] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const auth = useSelector((state: RootState) => state.auth);
    const userId = auth.user?.id;
    const token = auth.agentToken || auth.userToken;

    const fetchData = async () => {
        if (!userId || !token) return;
        try {
            setLoading(true);
            const [overviewRes, transactionsRes, agentRes] = await Promise.all([
                Api.get(`/wallet/overview/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                Api.get("/wallet/transactions", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                Api.get(`/agent/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setOverview(overviewRes.data);
            setTransactions(transactionsRes.data || []);
            
            // Extract bank details from latest KYC record
            if (agentRes.data?.kycRecords?.length > 0) {
                const latestKyc = agentRes.data.kycRecords.sort((a: any, b: any) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )[0];
                if (latestKyc.bankName && latestKyc.accountNumber) {
                    setAccountDetails(`${latestKyc.accountHolderName || ''} - ${latestKyc.accountNumber} - ${latestKyc.bankName}`);
                }
            }
        } catch (error) {
            console.error("Error fetching wallet data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId, token]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="p-8 bg-[#f5f6fa] min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-[#1a1a2e]">Wallet</h1>
                <button 
                    onClick={fetchData}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2"
                >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Refresh
                </button>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Main Section */}
                <div className="flex-1 space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* My Balance Card */}
                        <div className="bg-[#FFC700] p-6 rounded-[24px] shadow-sm flex flex-col justify-between relative overflow-hidden h-[180px]">
                            {loading && !overview ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-[#1a1a2e]/10 w-24 rounded"></div>
                                    <div className="h-10 bg-[#1a1a2e]/10 w-40 rounded"></div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <span className="text-sm font-medium text-[#1a1a2e]">My Balance</span>
                                        <h2 className="text-4xl font-extrabold text-[#1a1a2e] mt-2">
                                            {formatCurrency(overview?.balance || 0)}
                                        </h2>
                                    </div>
                                    <div className="bg-[#1a1a2e]/10 -mx-6 -mb-6 p-4 px-6 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-[#1a1a2e]/60 font-medium uppercase">Available for withdrawal</span>
                                            <span className="text-sm font-bold text-[#1a1a2e]">Ready</span>
                                        </div>
                                        <button
                                            onClick={() => setIsWithdrawModalOpen(true)}
                                            className="bg-[#FFC700] text-[#1a1a2e] px-4 py-2 rounded-lg text-xs font-bold border border-[#1a1a2e]/20 hover:bg-[#e5b300] transition-colors shadow-sm"
                                        >
                                            Withdraw
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Pending Clearance Card */}
                        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-center h-[180px]">
                            <div className="flex items-center gap-4">
                                <div className="w-1 h-12 bg-blue-500 rounded-full"></div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Pending Clearance</span>
                                    <h2 className="text-3xl font-extrabold text-[#1a1a2e] mt-1">
                                        {formatCurrency(overview?.pendingClearance || 0)}
                                    </h2>
                                    <span className="text-[10px] text-gray-400 font-medium mt-1 block">Earnings awaiting approval</span>
                                </div>
                            </div>
                        </div>

                        {/* Lifetime Earnings Card */}
                        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-center h-[180px]">
                            <div className="flex items-center gap-4">
                                <div className="w-1 h-12 bg-green-500 rounded-full"></div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Lifetime Earnings</span>
                                    <h2 className="text-3xl font-extrabold text-[#1a1a2e] mt-1">
                                        {formatCurrency(overview?.lifetimeEarnings || 0)}
                                    </h2>
                                    <span className="text-[10px] text-gray-400 font-medium mt-1 block">Total earnings since joining</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-6 pb-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-[#1a1a2e]">Transactions</h2>
                        </div>
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="animate-spin text-blue-500" size={32} />
                                    <p className="text-sm text-gray-400 font-medium">Loading transactions...</p>
                                </div>
                            ) : transactions.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            <th className="px-4 py-4 flex items-center gap-2 cursor-pointer hover:text-gray-600 transition-colors">Date <ArrowUpDown size={12} /></th>
                                            <th className="px-4 py-4">Description <ArrowUpDown size={12} className="inline ml-1" /></th>
                                            <th className="px-4 py-4">Type <ArrowUpDown size={12} className="inline ml-1" /></th>
                                            <th className="px-4 py-4">Amount <ArrowUpDown size={12} className="inline ml-1" /></th>
                                            <th className="px-4 py-4">Balance After <ArrowUpDown size={12} className="inline ml-1" /></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {transactions.map((tx) => (
                                            <tr key={tx.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-5 text-gray-500">
                                                    {format(new Date(tx.createdAt), "MMM d, yyyy")}
                                                </td>
                                                <td className="px-4 py-5 font-semibold text-[#1a1a2e] max-w-[200px]">{tx.description}</td>
                                                <td className="px-4 py-5 font-medium">
                                                    <div className={`flex items-center gap-2 ${tx.type === 'CREDIT' ? 'text-green-500' : 'text-red-500'}`}>
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-green-50' : 'bg-red-50'}`}>
                                                            {tx.type === 'CREDIT' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                        </div>
                                                        ({tx.type})
                                                    </div>
                                                </td>
                                                <td className="px-4 py-5 font-bold text-[#1a1a2e]">
                                                    {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                                                </td>
                                                <td className="px-4 py-5 font-medium text-gray-400">{formatCurrency(tx.balanceAfter)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                                        <WalletIcon size={32} />
                                    </div>
                                    <p className="text-gray-900 font-bold">No transactions found</p>
                                    <p className="text-sm text-gray-400 mt-1">Your wallet activity will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-full xl:w-[320px] space-y-8">
                    {/* Calendar */}
                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm font-bold text-[#1a1a2e]">
                                {format(new Date(), "MMMM yyyy")}
                            </span>
                            <div className="flex gap-2">
                                <button className="p-1 hover:bg-gray-100 rounded-lg"><ChevronLeft size={18} className="text-gray-400" /></button>
                                <button className="p-1 hover:bg-gray-100 rounded-lg"><ChevronRight size={18} className="text-gray-400" /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-y-4 text-center">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <span key={i} className="text-[10px] font-bold text-gray-400">{d}</span>
                            ))}
                            {[...Array(31)].map((_, i) => (
                                <span key={i} className={`text-[10px] font-bold py-2 ${i + 1 === new Date().getDate() ? 'bg-[#FFC700] rounded-lg text-[#1a1a2e]' : 'text-gray-600'}`}>
                                    {i + 1}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Earnings Breakdown */}
                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                        <h2 className="text-sm font-bold text-[#1a1a2e] mb-6">Earnings Breakdown</h2>

                        <div className="relative flex items-center justify-center mb-8">
                            <svg className="w-40 h-40 transform -rotate-90">
                                {/* Background Circle */}
                                <circle cx="80" cy="80" r="70" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                                {/* Placeholder circles - can be made dynamic later if needed */}
                                <circle cx="80" cy="80" r="70" stroke="#FFC700" strokeWidth="12" fill="none"
                                    strokeDasharray="440" strokeDashoffset={440 - (440 * 0.75)} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] text-gray-400 font-medium">Balance</span>
                                <span className="text-sm font-bold text-[#1a1a2e]">
                                    {formatCurrency(overview?.balance || 0)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 max-w-[200px] mx-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-[#FFC700] rounded-full"></div>
                                    <span className="text-[10px] font-medium text-gray-500">Available</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#1a1a2e]">
                                    {formatCurrency(overview?.balance || 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-[10px] font-medium text-gray-500">Pending</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#1a1a2e]">
                                    {formatCurrency(overview?.pendingClearance || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EnhancedWithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                onSuccess={fetchData}
                balance={overview?.balance || 0}
            />
        </div>
    );
}
