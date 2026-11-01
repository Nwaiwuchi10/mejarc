"use client";

import React, { use } from "react";
import WorkspaceSubScreen from "@/src/VendorScreens/VendorWorkspace/components/WorkspaceSubScreen";
import { notFound } from "next/navigation";

const configs: Record<string, any> = {
    new: {
        title: "New Project",
        columns: [
            { key: "projectTitle", label: "Project Title" },
            { key: "clientName", label: "Client Name" },
            { key: "budget", label: "Budget" },
            { key: "deliverable", label: "Deliverable" },
            { key: "status", label: "Status" },
            { key: "action", label: "Action", sortable: false },
        ],
        data: [
            {
                projectTitle: "3D Interior Visualization for Duplex",
                clientName: "John Smith Joseph",
                budget: "₦650,000.00",
                deliverable: ["File Type", "Drawing Set", "Add Ons"],
                status: "Awaiting Acceptance",
            },
        ],
    },
    progress: {
        title: "In Progress",
        columns: [
            { key: "projectTitle", label: "Project Title" },
            { key: "clientName", label: "Client Name" },
            { key: "progress", label: "Progress" },
            { key: "deadline", label: "Deadline" },
            { key: "lastActivity", label: "Last Activity" },
            { key: "files", label: "Files" },
            { key: "action", label: "Action", sortable: false },
        ],
        data: [
            {
                projectTitle: "3D Interior Visualization ...",
                clientName: "Sarah Johnson",
                progress: 91,
                deadline: "4 Days Left",
                lastActivity: "Uploaded Draft Render... 2 hours ago",
                files: "2 submitted • 1 pending",
            },
        ],
    },
    revision: {
        title: "Revision",
        columns: [
            { key: "projectTitle", label: "Project Title" },
            { key: "clientName", label: "Client Name" },
            { key: "revisionStatus", label: "Revision Status" },
            { key: "updatedDeadline", label: "Updated Deadline" },
            { key: "filesSubmitted", label: "Files Submitted" },
            { key: "action", label: "Action", sortable: false },
        ],
        data: [
            {
                projectTitle: "Modern Kitchen 3D Rendering",
                clientName: "Mark Benson",
                revisionStatus: "View",
                updatedDeadline: "2 Days Left",
                filesSubmitted: "Kitchen_Render_v1.png",
            },
        ],
    },
    completed: {
        title: "Completed",
        columns: [
            { key: "projectTitle", label: "Project Title" },
            { key: "clientName", label: "Client Name" },
            { key: "budget", label: "Budget" },
            { key: "completedDate", label: "Completed Date" },
            { key: "files", label: "Files" },
            { key: "action", label: "Action", sortable: false },
        ],
        data: [
            {
                projectTitle: "Luxury Villa Exterior",
                clientName: "Alice Williams",
                budget: "₦1,200,000.00",
                completedDate: "Feb 20, 2024",
                files: "5 files",
            },
        ],
    },
};

export default function WorkspaceCategoryPage({ params }: { params: Promise<{ status: string }> }) {
    const { status } = use(params);
    const config = configs[status];

    if (!config) {
        notFound();
    }

    return (
        <WorkspaceSubScreen
            status={status}
            title={config.title}
            columns={config.columns}
            data={config.data}
        />
    );
}
