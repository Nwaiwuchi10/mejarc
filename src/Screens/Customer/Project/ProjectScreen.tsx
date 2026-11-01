"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Download,
  History,
  AlertCircle,
  BarChart3,
  MessageSquare,
  FileText,
  Layers,
  Box,
  Archive,
  MoreVertical,
  Loader2,
  ExternalLink
} from "lucide-react";
import Api from "@/src/Utils/Api";
import { RootState } from "@/src/store/store";

export default function ProjectScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Custom Summary");
  const [agreedPrice, setAgreedPrice] = useState<string>("");
  const [settingPrice, setSettingPrice] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await Api.get('/custom-design/my', {
          params: { limit: 50 }
        });
        // Handle paginated response { data: [], total: ... }
        setProjects(res.data.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const project = projects[activeIndex];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-yellow-400" size={48} />
        <p className="text-gray-500 font-bold animate-pulse">Loading your projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-[32px] p-20 text-center border border-gray-100 shadow-sm">
        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500">
          <History size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">No Projects Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't started any custom design projects yet. Start one today to see it here!</p>
        <button
          onClick={() => router.push('/custom-design')}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-8 py-3 rounded-xl transition-all shadow-lg shadow-yellow-100"
        >
          Start Custom Design
        </button>
      </div>
    );
  }

  const tabs = ["Custom Summary", "Project Details"];

  const progressStages = [
    { label: "Submitted", value: project.status !== 'in_progress' ? 100 : 0, color: "bg-green-500" },
    { label: "Approved", value: (project.status === 'approved' || project.status === 'completed') ? 100 : 0, color: "bg-green-500" },
    { label: "In Progress", value: project.status === 'under_review' ? 50 : (project.status === 'approved' ? 100 : 0), color: "bg-yellow-400" },
    { label: "Completed", value: project.status === 'completed' ? 100 : 0, color: "bg-blue-500" },
  ];

  const handleChatWithAgent = async () => {
    if (!project.agentId) return;

    // Restriction: Only allow chat if approved
    if (project.status !== 'approved' && project.status !== 'completed') {
      setShowChatModal(true);
      return;
    }

    try {
      // Find the agent's userId (it might be in project.agent.userId if relations are loaded)
      const recipientId = project.agent?.userId;
      if (!recipientId) {
        alert("Agent details not fully loaded. Cannot start chat.");
        return;
      }
      const res = await Api.post(`/chat/start-dm/${recipientId}`);
      router.push(`/messages?conversationId=${res.data.id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  const handleProceedToPayment = async () => {
    try {
      const res = await Api.post(`/custom-design/${project.id}/initialize-payment`);
      // The backend returns the Paystack data directly based on the service code
      if (res.data.authorization_url) {
        window.location.href = res.data.authorization_url;
      } else if (res.data.data?.authorization_url) {
        window.location.href = res.data.data.authorization_url;
      }
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      alert(error.response?.data?.message || "Failed to initialize payment.");
    }
  };

  const handleSetAgreedPrice = async () => {
    if (!agreedPrice || isNaN(Number(agreedPrice))) {
      alert("Please enter a valid price.");
      return;
    }
    setSettingPrice(true);
    try {
      await Api.post(`/custom-design/${project.id}/agreed-price`, {
        price: Number(agreedPrice)
      });
      // Refresh projects to get the new payment status
      const res = await Api.get('/custom-design/my', { params: { limit: 50 } });
      setProjects(res.data.data || []);
      setAgreedPrice("");
      alert("Price proposal sent to agent for confirmation.");
    } catch (error: any) {
      console.error("Error setting agreed price:", error);
      alert(error.response?.data?.message || "Failed to set agreed price.");
    } finally {
      setSettingPrice(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Header and Project Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <h1 className="text-2xl font-black text-gray-900">Your Projects ({projects.length})</h1>
          <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm overflow-x-auto max-w-full scrollbar-hide">
            {projects.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActiveIndex(idx)}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all duration-200 whitespace-nowrap ${activeIndex === idx
                    ? "bg-yellow-400 text-black shadow-sm"
                    : "text-gray-400 hover:text-gray-900"
                  }`}
              >
                {p.serviceContext || `Project ${idx + 1}`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-gray-100 text-sm font-black text-gray-900 shadow-sm hover:bg-gray-50 transition-all">
            <History size={16} /> History
          </button>
        </div>
      </div>

      {/* Project Banner Card */}
      <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-8 lg:p-10 flex flex-col xl:flex-row gap-10">
          {/* Project Image */}
          <div className="relative w-full xl:w-[400px] aspect-[4/3] rounded-3xl overflow-hidden shrink-0 shadow-lg bg-gray-50 flex items-center justify-center">
            {project.attachedFiles?.[0] ? (
              <Image
                src={project.attachedFiles[0]}
                alt="Project"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-300">
                <Box size={48} strokeWidth={1} />
                <span className="text-[10px] font-bold uppercase tracking-widest">No Preview</span>
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="mb-0">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-3xl font-black text-[#111827]">{project.serviceContext}</h2>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm ${project.status === 'completed' ? 'bg-green-500 text-white' :
                    project.status === 'approved' ? 'bg-blue-500 text-white' :
                      'bg-yellow-400 text-black'
                  }`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-2xl mb-8">
                {project.additionalInformation || "No additional notes provided for this project."}
              </p>

              {/* Refined Attributes Grid */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { label: "Service:", value: project.serviceType },
                  { label: "Type:", value: project.projectType },
                  { label: "Scope:", value: project.scopeDeliverables?.[0] },
                  { label: "Size:", value: project.sizeComplexity },
                  { label: "Style:", value: project.style },
                  { label: "Timeline:", value: project.timeline }
                ].filter(attr => attr.value).map((attr, idx) => (
                  <div key={idx} className="bg-[#F9FAF8] px-4 py-2.5 rounded-xl border border-gray-100 flex items-center gap-2 shadow-sm">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{attr.label}</span>
                    <span className="text-[11px] font-black text-gray-900">{attr.value}</span>
                  </div>
                ))}
              </div>

              {/* Agent Details Section */}
              {project.agent && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-8 flex items-center justify-between group hover:bg-blue-50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {project.agent.user?.profilePics ? (
                        <Image
                          src={project.agent.user.profilePics}
                          alt="Agent"
                          width={48}
                          height={48}
                          className="rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                          {project.agent.user?.firstName?.[0] || "A"}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">Assigned Agent</p>
                      <h4 className="text-sm font-black text-gray-900">
                        {project.agent.user?.firstName} {project.agent.user?.lastName}
                      </h4>
                      {project.agent.businessName && (
                        <p className="text-[10px] font-medium text-gray-500 italic">{project.agent.businessName}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleChatWithAgent}
                    className="flex items-center gap-2 bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    <MessageSquare size={14} /> Chat Now
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-50">
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Created At</p>
                  <p className="text-sm font-black text-gray-900">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] mb-1">Timeline:</p>
                  <p className="text-sm font-black text-gray-900">{project.timeline || "Not set"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Budget:</p>
                  <p className="text-sm font-black text-gray-900">₦{Number(project.budget || 0).toLocaleString()}</p>
                </div>
                {project.estimateCost && (
                  <div>
                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em] mb-1">Est. Cost:</p>
                    <p className="text-sm font-black text-gray-900">₦{Number(project.estimateCost).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {project.status === 'approved' && (
                <div className="w-full sm:w-auto flex flex-col gap-3">
                  {!project.payment ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative flex-1 sm:w-48">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
                        <input
                          type="number"
                          value={agreedPrice}
                          onChange={(e) => setAgreedPrice(e.target.value)}
                          placeholder="Proposed Price"
                          className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
                        />
                      </div>
                      <button
                        onClick={handleSetAgreedPrice}
                        disabled={settingPrice}
                        className="bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-50 text-white font-black px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        {settingPrice ? <Loader2 size={16} className="animate-spin" /> : "Set Agreed Price"} <ChevronRight size={16} />
                      </button>
                    </div>
                  ) : project.payment.status === 'Pending Agreement' ? (
                    <div className="bg-yellow-50 text-yellow-700 px-6 py-3 rounded-xl border border-yellow-100 text-xs font-black flex items-center gap-2">
                      <AlertCircle size={14} /> Waiting for Agent: ₦{Number(project.payment.agreedPrice).toLocaleString()}
                    </div>
                  ) : project.payment.status === 'Awaiting Payment' ? (
                    <button
                      onClick={handleProceedToPayment}
                      className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-black px-8 py-3 rounded-xl transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                    >
                      Pay ₦{Number(project.payment.agreedPrice).toLocaleString()} <ChevronRight size={16} />
                    </button>
                  ) : null}
                </div>
              )}
              {project.status === 'completed' && (
                <div className="bg-green-50 text-green-600 px-6 py-3 rounded-xl border border-green-100 text-xs font-black flex items-center gap-2">
                  <Box size={14} /> Project Completed & Paid
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-black text-[#111827] mb-8">Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {progressStages.map((stage) => (
            <div key={stage.label} className="space-y-4">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider">
                <span className="text-gray-400">{stage.label}</span>
                <span className="text-gray-900">{stage.value}%</span>
              </div>
              <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stage.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${stage.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables Section */}
      <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <h3 className="text-xl font-black text-[#111827]">Deliverables</h3>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-100 text-xs font-black text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <AlertCircle size={14} /> Raise Dispute
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-100 text-xs font-black text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <Download size={14} /> Download Files
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-yellow-400 rounded-xl text-xs font-black text-black hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-100">
              <BarChart3 size={14} /> Open Chart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(project.attachedFiles || []).length > 0 ? (
            project.attachedFiles.map((url: string, idx: number) => {
              const isImage = url.match(/\.(jpeg|jpg|gif|png)$/) != null;
              const fileName = url.split('/').pop() || `File ${idx + 1}`;

              return (
                <div key={idx} className="group flex flex-col bg-white border border-gray-100 rounded-[24px] p-2 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
                  <div className="relative aspect-square rounded-[20px] overflow-hidden bg-gray-50 flex items-center justify-center">
                    {isImage ? (
                      <Image src={url} alt={fileName} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className={`w-full h-full bg-gray-100 flex flex-col items-center justify-center font-black text-gray-400`}>
                        <FileText size={64} strokeWidth={1} className="mb-2 opacity-50" />
                        <span className="text-xs uppercase tracking-widest">{url.split('.').pop()}</span>
                      </div>
                    )}

                    {/* Overlay for Action */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/90 backdrop-blur-md p-2 rounded-xl text-[10px] font-black uppercase tracking-tighter text-blue-600 shadow-sm flex items-center gap-1.5 hover:bg-white transition-all"
                      >
                        <ExternalLink size={12} /> View
                      </a>
                    </div>
                  </div>

                  <div className="p-4 pt-5">
                    <h4 className="text-sm font-black text-[#111827] mb-1 group-hover:text-yellow-500 transition-colors truncate">{fileName}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Added Recently</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[32px]">
              <FileText className="text-gray-200 mb-4" size={48} />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No deliverables uploaded yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Chat Warning Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-4">Chat Restricted</h3>
            <p className="text-sm text-gray-500 text-center font-medium leading-relaxed mb-8">
              You can only chat with an agent once your project request has been <span className="text-blue-600 font-bold">approved</span>
            </p>
            <button
              onClick={() => setShowChatModal(false)}
              className="w-full bg-[#111827] hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-gray-200"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
