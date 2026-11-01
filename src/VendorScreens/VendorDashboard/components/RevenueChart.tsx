"use client";

import React from "react";

interface RevenueData {
    month: string;
    revenue: number;
}

interface RevenueChartProps {
    data?: RevenueData[];
    loading?: boolean;
}

export default function RevenueChart({ data = [], loading }: RevenueChartProps) {
    const maxRevenue = data.length > 0 ? Math.max(...data.map(d => d.revenue)) : 1;
    
    return (
        <div className="vd__card vd__revenue-chart">
            <div className="flex items-center justify-between mb-6">
                <h2 className="vd__card__title">Revenue</h2>
                {!loading && data.length > 0 && (
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        ₦{data[data.length - 1].revenue.toLocaleString()} this month
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex items-end justify-between h-32 pt-4 px-2 gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-1 bg-gray-50 animate-pulse rounded-t-sm h-[30%]" style={{ height: `${(i+1)*15}%` }} />
                    ))}
                </div>
            ) : data.length > 0 ? (
                <div className="flex items-end justify-between h-32 pt-4 px-2 gap-2">
                    {data.map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group relative">
                            <div 
                                className="w-full bg-[#FFC700] rounded-t-sm transition-all duration-500 group-hover:bg-[#e5b300]" 
                                style={{ height: `${(item.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a2e] text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    ₦{item.revenue.toLocaleString()}
                                </div>
                            </div>
                            <span className="text-[9px] text-gray-400 mt-2 font-bold uppercase">{item.month}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-50 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No data for chart</p>
                </div>
            )}
        </div>
    );
}
