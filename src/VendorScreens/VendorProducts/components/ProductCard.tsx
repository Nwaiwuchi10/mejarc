"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bath, Maximize, Layers, MoreHorizontal, ArrowRight, Star } from "lucide-react";

interface ProductCardProps {
    id: string;
    productId?: string;
    image: string;
    title: string;
    stats: {
        bathrooms: string | number;
        area?: string | number;
        size?: string | number;
        floors: string | number;
        bedrooms?: string | number;
    };
    metrics: {
        views: number;
        purchases: number;
        earnings: string;
    };
    price: string | number;
    category?: string;
    rating?: number;
    status?: string;
}

export default function ProductCard({ id, productId, image, title, stats, metrics, price, category, rating = 4.5, status }: ProductCardProps) {
    // Format price with commas
    const formattedPrice = typeof price === 'number' ? price.toLocaleString() : price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            {/* Project Image */}
            <div className="relative h-64 w-full">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={true} // In case of external URLs
                />
                {status && (
                    <div className="absolute top-4 left-4 z-10">
                        {status === "approved" && (
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-emerald-200">
                                Approved
                            </span>
                        )}
                        {status === "pending_review" && (
                            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-amber-200 animate-pulse">
                                Pending Approval
                            </span>
                        )}
                        {status === "rejected" && (
                            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-rose-200">
                                Rejected
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="p-6">
                {/* Title and Menu */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        {productId && (
                            <span className="inline-block text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 mb-1">
                                {productId}
                            </span>
                        )}
                        <h3 className="text-lg font-bold text-[#1a1a2e]">{title}</h3>
                    </div>
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                {/* Property Stats */}
                <div className="flex items-center gap-6 mb-6 text-gray-500">
                    <div className="flex items-center gap-2">
                        <Bath size={18} />
                        <span className="text-sm font-medium">{stats.bathrooms} Bathroom</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Maximize size={18} />
                        <span className="text-sm font-medium">
                            {stats.area ? (String(stats.area).toLowerCase().includes("sqm") || String(stats.area).toLowerCase().includes("m²") ? stats.area : `${stats.area} sqm`) : (stats.size ? `${stats.size} sqm` : 'N/A')}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Layers size={18} />
                        <span className="text-sm font-medium">{stats.floors} Floors</span>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-[#F8F9FA] p-3 rounded-xl flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-bold text-[#1a1a2e]">{metrics.views}</span>
                        <span className="text-[10px] text-gray-500 font-medium">Views</span>
                    </div>
                    <div className="bg-[#F8F9FA] p-3 rounded-xl flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-bold text-[#1a1a2e]">{metrics.purchases}</span>
                        <span className="text-[10px] text-gray-500 font-medium">Purchases</span>
                    </div>
                    <div className="bg-[#F8F9FA] p-3 rounded-xl flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-bold text-[#1a1a2e] leading-tight break-all">₦{metrics.earnings}</span>
                        <span className="text-[10px] text-gray-500 font-medium">Earnings</span>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-between pt-2">
                    <Link
                        href={`/vendor/products/edit/${id}`}
                        className="bg-[#FFC700] hover:bg-[#e5b300] text-[#1a1a2e] font-bold py-3 px-6 rounded-xl flex items-center gap-2 text-sm transition-colors"
                    >
                        Edit Details
                        <ArrowRight size={16} />
                    </Link>
                    <span className="text-xl font-extrabold text-[#1a1a2e]">₦{formattedPrice}</span>
                </div>
            </div>
        </div>

    );
}
