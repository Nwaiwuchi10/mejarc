import WorkspaceDashboard from "@/src/VendorScreens/WorkspaceProjects/WorkspaceDashboard";

export const metadata = {
  title: "Project Workspace",
  description:
    "View and manage your project details, chat, milestones, files, and activity",
};

export default function WorkspacePage() {
  return <WorkspaceDashboard />;
}
