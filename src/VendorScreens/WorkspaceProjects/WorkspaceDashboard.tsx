"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Bell, ChevronDown, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import CustomModal from "@/src/components/Message/Message";

// Import all tabs
import ProjectBrief from "./ProjectBrief";
import ChatClientAdmin from "./ChatClientAdmin";
import Milestones from "./Milestones";
import FilesDeliverables from "./FilesDeliverables";
import ActivityLog from "./ActivityLog";

// Define tab options exactly matching image
type TabType = "brief" | "chat" | "files" | "milestones" | "activity";

export default function WorkspaceDashboard() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const id = params?.id;
  const [activeTab, setActiveTab] = useState<TabType>("brief");

  // State for workspace data
  const [workspaceData, setWorkspaceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    show: boolean;
    type: "success" | "error";
    title?: string;
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  const showMessage = (type: "success" | "error", message: string, title?: string) => {
    setModalConfig({ show: true, type, message, title });
  };

  const fetchWorkspaceData = useCallback(async () => {
    const token = localStorage.getItem("agentToken") || localStorage.getItem("userToken");
    if (!token) {
      setError("Authorization token not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/custom-design/${id}/workspace`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workspace data");
      }

      const data = await response.json();
      setWorkspaceData(data);
    } catch (err: any) {
      console.error("Error fetching workspace:", err);
      setError(err.message || "Something went wrong while fetching data");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchWorkspaceData();
    }
  }, [id, fetchWorkspaceData]);

  // Renders the specific content based on active tab
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-white rounded-md border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Loading Workspace...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-white rounded-md border border-gray-100 shadow-sm p-8 text-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button
              onClick={() => { setError(null); setIsLoading(true); fetchWorkspaceData(); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "brief":
        return <ProjectBrief data={workspaceData?.projectBrief} />;
      case "chat":
        return <ChatClientAdmin project={workspaceData?.projectBrief} />;
      case "files":
        return (
          <FilesDeliverables
            files={workspaceData?.filesDeliverables || []}
            projectId={id as string}
            onRefresh={fetchWorkspaceData}
            showMessage={showMessage}
          />
        );
      case "milestones":
        return (
          <Milestones
            milestones={workspaceData?.milestones || []}
            projectId={id as string}
            onRefresh={fetchWorkspaceData}
            showMessage={showMessage}
          />
        );
      case "activity":
        return <ActivityLog activities={workspaceData?.activityLog || []} />;
      default:
        return <ProjectBrief data={workspaceData?.projectBrief} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] w-full">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          {/* Back Button matching the yellow circle style */}
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-[#FFC700] hover:bg-yellow-500 transition-colors flex items-center justify-center shadow-sm"
          >
            <ArrowLeft size={18} className="text-black" />
          </button>
          <h1 className="text-xl font-bold text-[#1a1a2e]">Workspace</h1>
        </div>

        {/* User / Notification Area */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={20} />
          </button>
          <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              <img src="/placeholder-avatar.png" alt="User" onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=Agent&background=random")} />
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto h-full">

          {/* Left Column: 6-Card Grid Navigation Wrapper */}
          <div className="lg:w-[320px] shrink-0">
            <div className="grid grid-cols-2 gap-3">
              {/* 1. Project Brief */}
              <button
                onClick={() => setActiveTab("brief")}
                className={`flex flex-col items-center justify-center p-6 border rounded shadow-sm hover:shadow-md transition-all h-[140px] ${activeTab === "brief"
                  ? "bg-gray-50 border-gray-800 shadow-inner"
                  : "bg-white border-transparent hover:border-gray-100 text-gray-400"
                  }`}
              >
                <div className="relative mb-3">
                  <img
                    src="/icons/document.svg"
                    className={`w-6 h-6 ${activeTab === "brief" ? "opacity-100" : "opacity-60 grayscale"}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className={`text-[13px] font-semibold text-center ${activeTab === "brief" ? "text-gray-800" : "text-gray-500"}`}>Project Brief</span>
              </button>

              {/* 2. Chat */}
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex flex-col items-center justify-center p-6 border rounded shadow-sm hover:shadow-md transition-all h-[140px] ${activeTab === "chat"
                  ? "bg-gray-50 border-gray-800 shadow-inner"
                  : "bg-white border-transparent hover:border-gray-100 text-gray-400"
                  }`}
              >
                <svg className={`w-6 h-6 mb-3 ${activeTab === "chat" ? "text-gray-800 opacity-100" : "opacity-60"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="9" y1="10" x2="15" y2="10"></line><line x1="12" y1="14" x2="12" y2="6"></line></svg>
                <span className={`text-[13px] font-semibold text-center ${activeTab === "chat" ? "text-gray-800" : "text-gray-500"}`}>Chat (Client & Admin)</span>
              </button>

              {/* 3. Files Deliverables */}
              <button
                onClick={() => setActiveTab("files")}
                className={`flex flex-col items-center justify-center p-6 border rounded shadow-sm hover:shadow-md transition-all h-[140px] ${activeTab === "files"
                  ? "bg-gray-50 border-gray-800 shadow-inner"
                  : "bg-white border-transparent hover:border-gray-100 text-gray-400"
                  }`}
              >
                <svg className={`w-6 h-6 mb-3 ${activeTab === "files" ? "text-gray-800 opacity-100" : "opacity-60"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                <span className={`text-[13px] font-semibold text-center ${activeTab === "files" ? "text-gray-800" : "text-gray-500"}`}>Files (Deliverables)</span>
              </button>

              {/* 4. Milestones */}
              <button
                onClick={() => setActiveTab("milestones")}
                className={`flex flex-col items-center justify-center p-6 border rounded shadow-sm hover:shadow-md transition-all h-[140px] ${activeTab === "milestones"
                  ? "bg-gray-50 border-gray-800 shadow-inner"
                  : "bg-white border-transparent hover:border-gray-100 text-gray-400"
                  }`}
              >
                <svg className={`w-6 h-6 mb-3 ${activeTab === "milestones" ? "text-gray-800 opacity-100" : "opacity-60"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                <span className={`text-[13px] font-semibold text-center ${activeTab === "milestones" ? "text-gray-800" : "text-gray-500"}`}>Milestone</span>
              </button>

              {/* 5 Activity Log */}
              <button
                onClick={() => setActiveTab("activity")}
                className={`flex flex-col items-center justify-center p-6 border rounded shadow-sm hover:shadow-md transition-all h-[140px] ${activeTab === "activity"
                  ? "bg-gray-50 border-gray-800 shadow-inner"
                  : "bg-white border-transparent hover:border-gray-100 text-gray-400"
                  }`}
              >
                <svg className={`w-6 h-6 mb-3 ${activeTab === "activity" ? "text-gray-800 opacity-100" : "opacity-60"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span className={`text-[13px] font-semibold text-center ${activeTab === "activity" ? "text-gray-800" : "text-gray-500"}`}>Activity Log</span>
              </button>
            </div>
          </div>

          {/* Right Column: Active Component Content */}
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>

        </div>
      </div>

      {/* Custom Message Modal */}
      {modalConfig.show && (
        <CustomModal
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          onClose={() => setModalConfig({ ...modalConfig, show: false })}
        />
      )}
    </div>
  );
}
