import React from "react";
import WorkspaceDashboard from "@/src/VendorScreens/WorkspaceProjects/WorkspaceDashboard";

export const metadata = {
  title: "Vendor Project Workspace",
  description: "View and manage vendor project details, chat, milestones, files, and activity",
};

export default function VendorProjectPage({ params }: { params: { id: string } }) {
  // Pass the project ID down if WorkspaceDashboard supports it, 
  // or it can extract it from useParams internally.
  return <WorkspaceDashboard />;
}
