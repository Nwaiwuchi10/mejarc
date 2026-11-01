"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface StatCardProps {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    value: string | number;
    viewAllHref?: string;
    loading?: boolean;
}

export default function StatCard({ icon, iconBg, label, value, viewAllHref, loading }: StatCardProps) {
    return (
        <div className="vd__stat-card">
            <div className="vd__stat-card__top">
                <div className="vd__stat-card__icon-wrap" style={{ backgroundColor: iconBg }}>
                    {icon}
                </div>
                <div className="vd__stat-card__info">
                    <span className="vd__stat-card__label">{label}</span>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md mt-1" />
                    ) : (
                        <h3 className="vd__stat-card__value">{value}</h3>
                    )}
                </div>
            </div>
            {viewAllHref && (
                <Link href={viewAllHref} className="vd__stat-card__link">
                    View All <ChevronRight size={14} />
                </Link>
            )}
        </div>
    );
}
