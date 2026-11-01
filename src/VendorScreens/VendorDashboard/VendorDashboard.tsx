"use client";

import React, { useState, useEffect } from "react";
import { FileText, Clock, DollarSign, CreditCard, Loader2 } from "lucide-react";
import StatCard from "./components/StatCard";
import PortfolioEngagement from "./components/PortfolioEngagement";
import RevenueChart from "./components/RevenueChart";
import ProjectStatusChart from "./components/ProjectStatusChart";
import NotificationList from "./components/NotificationList";
import ProjectEngagement from "./components/ProjectEngagement";
import "./VendorDashboard.css";
import Api from "@/src/Utils/Api";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";

interface AnalyticsData {
    overview: {
        activeProjects: number;
        pendingTasks: number;
        totalEarnings: number;
        payoutStatus: number;
    };
    portfolioEngagement: {
        views: number;
        saves: number;
        inquiries: number;
        viewsPreviousWeek: number;
    };
    revenueChart: { month: string; revenue: number }[];
    projectStatus: {
        inProgress: number;
        revisionsNeeded: number;
        completed: number;
        cancelled: number;
    };
    notifications: any[];
    projectEngagement: {
        totalViews: number;
        totalSaves: number;
        totalInquiries: number;
    };
}

export default function VendorDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    
    const auth = useSelector((state: RootState) => state.auth);
    const token = auth.userToken;

    const fetchAnalytics = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await Api.get("/agent/analytics", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (error) {
            console.error("Error fetching dashboard analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [token]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const stats = [
        {
            icon: <FileText size={22} color="#F59E0B" />,
            iconBg: "#FEF3C7",
            label: "Active Projects",
            value: data?.overview.activeProjects.toString() || "0",
            viewAllHref: "/vendor/workspace",
        },
        {
            icon: <Clock size={22} color="#EF4444" />,
            iconBg: "#FEE2E2",
            label: "Pending Tasks",
            value: data?.overview.pendingTasks.toString() || "0",
            viewAllHref: "/vendor/workspace",
        },
        {
            icon: <DollarSign size={22} color="#10B981" />,
            iconBg: "#D1FAE5",
            label: "Total Earnings",
            value: formatCurrency(data?.overview.totalEarnings || 0),
        },
        {
            icon: <CreditCard size={22} color="#F59E0B" />,
            iconBg: "#FFF8E7",
            label: "Payout Status",
            value: formatCurrency(data?.overview.payoutStatus || 0),
        },
    ];

    return (
        <div className="vd">
            {/* ── Body ── */}
            <div className="vd__body">
                {/* Stats Row */}
                <div className="vd__stats-row">
                    {stats.map((s) => (
                        <StatCard
                            key={s.label}
                            icon={s.icon}
                            iconBg={s.iconBg}
                            label={s.label}
                            value={s.value}
                            viewAllHref={s.viewAllHref}
                            loading={loading}
                        />
                    ))}
                </div>

                {/* Middle Row: Charts */}
                <div className="vd__middle-row">
                    <PortfolioEngagement 
                        views={data?.portfolioEngagement.views}
                        saves={data?.portfolioEngagement.saves}
                        inquiries={data?.portfolioEngagement.inquiries}
                        viewsPreviousWeek={data?.portfolioEngagement.viewsPreviousWeek}
                        loading={loading}
                    />
                    <RevenueChart 
                        data={data?.revenueChart} 
                        loading={loading}
                    />
                    <ProjectStatusChart 
                        data={data?.projectStatus}
                        loading={loading}
                    />
                </div>

                {/* Bottom Row */}
                <div className="vd__bottom-row">
                    <NotificationList 
                        notifications={data?.notifications}
                        loading={loading}
                    />
                    <ProjectEngagement 
                        totalViews={data?.projectEngagement.totalViews}
                        totalSaves={data?.projectEngagement.totalSaves}
                        totalInquiries={data?.projectEngagement.totalInquiries}
                        loading={loading}
                    />
                </div>
            </div>
            
            {/* Refresh Button for UX */}
            {!loading && (
                <button 
                    onClick={fetchAnalytics}
                    className="fixed bottom-8 right-8 bg-[#1a1a2e] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 group"
                >
                    <Loader2 size={18} className="group-hover:animate-spin" />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold px-0 group-hover:px-2">Refresh</span>
                </button>
            )}
        </div>
    );
}
