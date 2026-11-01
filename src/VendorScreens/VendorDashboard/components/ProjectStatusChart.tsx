"use client";

import React from "react";

interface StatusDistribution {
    inProgress: number;
    revisionsNeeded: number;
    completed: number;
    cancelled: number;
}

interface ProjectStatusChartProps {
    data?: StatusDistribution;
    loading?: boolean;
}

export default function ProjectStatusChart({ 
    data = { inProgress: 0, revisionsNeeded: 0, completed: 0, cancelled: 0 }, 
    loading 
}: ProjectStatusChartProps) {
    const total = data.inProgress + data.revisionsNeeded + data.completed + data.cancelled || 1;

    return (
        <div className="vd__card">
            <h2 className="vd__card__title">Project Status</h2>
            <div className="vd__project-status">
                <div className="vd__project-status__chart-row">
                    <div className="vd__project-status__pie">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="15" fill="none" />
                            <circle cx="50" cy="50" r="40" stroke="#FFC700" strokeWidth="15" fill="none"
                                strokeDasharray="251" strokeDashoffset={251 - (251 * (data.completed / total))} strokeLinecap="round" transform="rotate(-90 50 50)" />
                        </svg>
                    </div>
                    <div className="vd__project-status__legend">
                        <div className="vd__project-status__legend-item">
                            <div className="vd__project-status__legend-dot" style={{ background: '#FFC700' }} />
                            <span>Completed: {loading ? "..." : data.completed}</span>
                        </div>
                        <div className="vd__project-status__legend-item">
                            <div className="vd__project-status__legend-dot" style={{ background: '#3B82F6' }} />
                            <span>In Progress: {loading ? "..." : data.inProgress}</span>
                        </div>
                        <div className="vd__project-status__legend-item">
                            <div className="vd__project-status__legend-dot" style={{ background: '#F59E0B' }} />
                            <span>Revisions: {loading ? "..." : data.revisionsNeeded}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
