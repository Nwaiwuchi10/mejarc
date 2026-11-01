"use client";

import React from "react";

interface PortfolioEngagementProps {
    views?: number;
    saves?: number;
    inquiries?: number;
    viewsPreviousWeek?: number;
    loading?: boolean;
}

export default function PortfolioEngagement({ 
    views = 0, 
    saves = 0, 
    inquiries = 0, 
    viewsPreviousWeek = 0,
    loading 
}: PortfolioEngagementProps) {
    return (
        <div className="vd__card">
            <h2 className="vd__card__title">Portfolio Engagement</h2>
            <div className="vd__portfolio">
                <div className="vd__portfolio__chart-wrap">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="70" cy="70" r="64" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                        <circle cx="70" cy="70" r="64" stroke="#FFC700" strokeWidth="12" fill="none"
                            strokeDasharray="402" strokeDashoffset={402 - (402 * 0.75)} strokeLinecap="round" />
                    </svg>
                    <div className="vd__portfolio__chart-center">
                        <span className="vd__portfolio__chart-center-label">Views</span>
                        <span className="vd__portfolio__chart-center-value">{loading ? "..." : views.toLocaleString()}</span>
                    </div>
                </div>

                <div className="vd__portfolio__legend">
                    <div className="vd__portfolio__legend-item">
                        <div className="vd__portfolio__legend-dot" style={{ background: '#FFC700' }} />
                        <span>Saves: <span className="vd__portfolio__legend-label">{loading ? "..." : saves.toLocaleString()}</span></span>
                    </div>
                    <div className="vd__portfolio__legend-item">
                        <div className="vd__portfolio__legend-dot" style={{ background: '#3B82F6' }} />
                        <span>Inquiries: <span className="vd__portfolio__legend-label">{loading ? "..." : inquiries.toLocaleString()}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
