"use client";

import React from "react";
import { Eye, Heart, MessageSquare } from "lucide-react";

interface ProjectEngagementProps {
    totalViews?: number;
    totalSaves?: number;
    totalInquiries?: number;
    loading?: boolean;
}

export default function ProjectEngagement({ 
    totalViews = 0, 
    totalSaves = 0, 
    totalInquiries = 0,
    loading 
}: ProjectEngagementProps) {
    return (
        <div className="vd__card" style={{ flex: 1 }}>
            <h2 className="vd__card__title">Project Engagement</h2>
            <div className="vd__proj-engagement__cards">
                <div className="vd__proj-engagement__card">
                    <div className="vd__proj-engagement__card-icon"><Eye size={20} /></div>
                    <div className="vd__proj-engagement__card-value">{loading ? "..." : totalViews.toLocaleString()}</div>
                    <div className="vd__proj-engagement__card-label">Total Views</div>
                </div>
                <div className="vd__proj-engagement__card">
                    <div className="vd__proj-engagement__card-icon"><Heart size={20} /></div>
                    <div className="vd__proj-engagement__card-value">{loading ? "..." : totalSaves.toLocaleString()}</div>
                    <div className="vd__proj-engagement__card-label">Total Saves</div>
                </div>
                <div className="vd__proj-engagement__card">
                    <div className="vd__proj-engagement__card-icon"><MessageSquare size={20} /></div>
                    <div className="vd__proj-engagement__card-value">{loading ? "..." : totalInquiries.toLocaleString()}</div>
                    <div className="vd__proj-engagement__card-label">Total Inquiries</div>
                </div>
            </div>
        </div>
    );
}
