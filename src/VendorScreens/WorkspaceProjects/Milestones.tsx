"use client";

import React, { useState } from "react";
import { MoreVertical, Loader2, X, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface MilestoneProps {
  milestones: any[];
  projectId: string;
  onRefresh: () => void;
  showMessage: (type: "success" | "error", message: string, title?: string) => void;
}

export default function Milestones({ milestones, projectId, onRefresh, showMessage }: MilestoneProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    dueDate: "",
  });

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("agentToken") || localStorage.getItem("userToken");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/custom-design/${projectId}/milestones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create milestone");

      showMessage("success", "Milestone created successfully!");
      setIsCreating(false);
      setFormData({ title: "", description: "", duration: "", dueDate: "" });
      onRefresh();
    } catch (err: any) {
      showMessage("error", err.message || "Failed to create milestone");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (milestoneId: string, status: string) => {
    setIsSubmitting(true);
    const token = localStorage.getItem("agentToken") || localStorage.getItem("userToken");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/custom-design/milestones/${milestoneId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      showMessage("success", `Milestone marked as ${status}`);
      setShowStatusMenu(null);
      onRefresh();
    } catch (err: any) {
      showMessage("error", err.message || "Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[12px] font-semibold rounded-full border border-green-100">
            <CheckCircle2 size={12} />
            Completed
          </span>
        );
      case "in-progress":
      case "inprogress":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-[12px] font-semibold rounded-full border border-blue-100">
            <Clock size={12} className="animate-pulse" />
            In-Progress
          </span>
        );
      case "pending":
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 text-[12px] font-semibold rounded-full border border-gray-100">
            <AlertCircle size={12} />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white h-full p-8 max-w-6xl shadow-sm rounded-md border border-gray-100 relative">
      
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-[15px] font-bold text-gray-800">Project Milestones</h2>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-[#FFC700] hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2 rounded text-[13px] transition-all shadow-sm active:scale-95"
          >
            + Create Milestone
          </button>
        )}
      </div>

      {isCreating && (
        <div className="mb-10 bg-gray-50 p-6 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-800">New Milestone Details</h3>
            <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleCreateMilestone} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-600 px-1">Title</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Concept Design Approval"
                className="w-full bg-white border border-gray-200 rounded-md py-2.5 px-4 text-[13px] outline-none focus:border-blue-400 transition-colors"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-600 px-1">Duration</label>
              <input 
                required
                type="text" 
                placeholder="e.g. 3 Days"
                className="w-full bg-white border border-gray-200 rounded-md py-2.5 px-4 text-[13px] outline-none focus:border-blue-400 transition-colors"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-600 px-1">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                  required
                  type="date" 
                  className="w-full bg-white border border-gray-200 rounded-md py-2.5 pl-10 pr-4 text-[13px] outline-none focus:border-blue-400 transition-colors"
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[12px] font-bold text-gray-600 px-1">Description</label>
              <textarea 
                required
                placeholder="What needs to be achieved in this milestone?"
                className="w-full bg-white border border-gray-200 rounded-md py-3 px-4 text-[13px] outline-none focus:border-blue-400 transition-colors min-h-[100px]"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button 
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-6 py-2.5 text-gray-500 text-[13px] font-semibold hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmitting}
                type="submit"
                className="bg-blue-600 text-white font-bold px-8 py-2.5 rounded-md text-[13px] hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Milestone"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA] rounded-md">
              <th className="text-left py-4 px-6 text-[13px] font-bold text-gray-700 whitespace-nowrap rounded-l-md">Milestone</th>
              <th className="text-left py-4 px-6 text-[13px] font-bold text-gray-700 whitespace-nowrap">Deliverables / Description</th>
              <th className="text-left py-4 px-6 text-[13px] font-bold text-gray-700 whitespace-nowrap">Timeline</th>
              <th className="text-left py-4 px-6 text-[13px] font-bold text-gray-700 whitespace-nowrap">Due Date</th>
              <th className="text-left py-4 px-6 text-[13px] font-bold text-gray-700 whitespace-nowrap">Status</th>
              <th className="text-right py-4 px-6 text-[13px] font-bold text-gray-700 whitespace-nowrap rounded-r-md">Action</th>
            </tr>
          </thead>
          <tbody>
            {!milestones || milestones.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center text-gray-400 text-sm italic">
                  No milestones defined yet. Click "Create Milestone" to get started.
                </td>
              </tr>
            ) : (
              milestones.map((milestone) => (
                <tr key={milestone.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-5 px-6 text-[13px] text-gray-800 font-bold whitespace-nowrap">
                    {milestone.title}
                  </td>
                  <td className="py-5 px-6 text-[12px] text-gray-500 leading-relaxed max-w-[300px]">
                    {milestone.description}
                  </td>
                  <td className="py-5 px-6 text-[13px] text-gray-600 whitespace-nowrap">
                    {milestone.duration}
                  </td>
                  <td className="py-5 px-6 text-[13px] text-gray-600 whitespace-nowrap font-medium">
                    {new Date(milestone.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-5 px-6 whitespace-nowrap">
                    {getStatusBadge(milestone.status)}
                  </td>
                  <td className="py-5 px-6 text-right whitespace-nowrap text-gray-400 relative">
                    <button 
                      onClick={() => setShowStatusMenu(showStatusMenu === milestone.id ? null : milestone.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {showStatusMenu === milestone.id && (
                      <div className="absolute right-6 top-14 w-40 bg-white shadow-xl border border-gray-100 rounded-xl z-20 py-2 animate-in fade-in zoom-in duration-200">
                        <p className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Update Status</p>
                        <button 
                          onClick={() => handleUpdateStatus(milestone.id, "pending")}
                          className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors font-medium border-l-2 border-transparent hover:border-gray-300"
                        >
                          Mark Pending
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(milestone.id, "in-progress")}
                          className="w-full text-left px-4 py-2 text-[13px] text-blue-600 hover:bg-blue-50 transition-colors font-medium border-l-2 border-transparent hover:border-blue-300"
                        >
                          Mark In-Progress
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(milestone.id, "completed")}
                          className="w-full text-left px-4 py-2 text-[13px] text-green-600 hover:bg-green-50 transition-colors font-medium border-l-2 border-transparent hover:border-green-300"
                        >
                          Mark Completed
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
