"use client";

import React from "react";
import { CreditCard, Plus } from "lucide-react";

export default function PaymentsScreen() {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-bold text-gray-900 tracking-tight">Payments Methods</h2>
                <button className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-yellow-500 transition-all shadow-sm active:scale-95">
                    <Plus size={16} /> Add New Method
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border-2 border-yellow-400 bg-yellow-50/30 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-black">
                            <CreditCard size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Card Number</div>
                        <div className="text-base font-bold text-[#1a1a2e] tracking-widest">**** **** **** 4242</div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center border-dashed group cursor-pointer hover:bg-white hover:border-blue-200 transition-all">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                            <Plus size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600">Add Another Card</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
