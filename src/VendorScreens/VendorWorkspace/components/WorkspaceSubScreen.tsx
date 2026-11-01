"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, ChevronDown, MoreHorizontal, ArrowUpDown, Loader2, X } from "lucide-react";
import { useSelector } from "react-redux";
import Api from "@/src/Utils/Api";

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
}

interface WorkspaceSubScreenProps {
    status: string;
    title: string;
    columns: Column[];
    data: any[];
}

export default function WorkspaceSubScreen({ status, title, columns, data: initialData }: WorkspaceSubScreenProps) {
    const [localData, setLocalData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { userToken } = useSelector((state: any) => state.auth);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!userToken) return;
            try {
                const res = await Api.get("/agent/projects", {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                const allProjects = res.data;
                
                let projects: any[] = [];
                if (status === "new") projects = allProjects.newProjects;
                else if (status === "progress") projects = allProjects.inProgressProjects;
                else if (status === "revision") projects = allProjects.revisionProjects;
                else if (status === "completed") projects = allProjects.completedProjects;

                const mappedData = projects.map(p => mapProjectToRow(p, status));
                setLocalData(mappedData);
            } catch (error) {
                console.error("Error fetching categorized projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [status]);

    const displayData = localData.length > 0 ? localData : [];

    return (
        <div className="p-8 bg-[#f5f6fa] min-h-screen">
            {/* Header / Title */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-[#1a1a2e]">{title}</h1>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link
                    href="/vendor/workspace"
                    className="flex items-center justify-center w-10 h-10 bg-[#FFC700] rounded-full hover:bg-[#e5b300] transition-colors"
                >
                    <ArrowLeft size={20} className="text-[#1a1a2e]" />
                </Link>

                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC700] transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-px"></span>
                            </span>
                            Sort by Date
                        </span>
                        <ChevronDown size={16} className="text-gray-400" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-px"></span>
                            </span>
                            Sort by Budget
                        </span>
                        <ChevronDown size={16} className="text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-[#FFC700]" size={48} />
                        <p className="text-gray-500 font-bold animate-pulse">Fetching {title}...</p>
                    </div>
                ) : displayData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                             <Search size={40} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">No {title} Found</h3>
                        <p className="text-gray-500">There are currently no projects in this category.</p>
                    </div>
                ) : (
                    <div className="overflow-visible">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-bottom border-gray-50">
                                    {columns.map((col) => (
                                        <th key={col.key} className="px-6 py-5 text-sm font-semibold text-[#1a1a2e]">
                                            <div className="flex items-center gap-2 cursor-pointer hover:opacity-70">
                                                {col.label}
                                                {col.sortable !== false && <ArrowUpDown size={14} className="text-gray-400" />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {displayData.map((row, idx) => (
                                    <tr key={idx} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        {columns.map((col) => (
                                            <td key={col.key} className="px-6 py-5">
                                                {renderCell(col.key, row[col.key], row)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function mapProjectToRow(p: any, status: string) {
    const common = {
        id: p.id,
        projectTitle: p.serviceContext || "No Title",
        clientName: `${p.user?.firstName || "Unknown"} ${p.user?.lastName || "Client"}`,
    };

    if (status === "new") {
        return {
            ...common,
            budget: `₦${Number(p.budget || 0).toLocaleString()}`,
            deliverable: p.scopeDeliverables || [],
            status: "Awaiting Acceptance",
        };
    }

    if (status === "progress") {
        return {
            ...common,
            progress: Math.min(Math.round((p.currentStep / 6) * 100), 100),
            deadline: p.timeline || "Not set",
            lastActivity: `Updated ${new Date(p.updatedAt).toLocaleDateString()}`,
            files: `${p.attachedFiles?.length || 0} files`,
        };
    }

    if (status === "revision") {
        return {
            ...common,
            revisionStatus: "View",
            updatedDeadline: p.timeline || "Not set",
            filesSubmitted: p.attachedFiles?.[0]?.split("/").pop() || "No files",
        };
    }

    if (status === "completed") {
        return {
            ...common,
            budget: `₦${Number(p.payment?.amountPaid || p.budget || 0).toLocaleString()}`,
            completedDate: new Date(p.updatedAt).toLocaleDateString(),
            files: `${p.attachedFiles?.length || 0} files`,
        };
    }

    return common;
}

function ActionDropdown({ projectId }: { projectId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalState, setModalState] = useState<'none' | 'accepted' | 'declined'>('none');
    const router = useRouter();
    const { userToken } = useSelector((state: any) => state.auth);

    const handleAccept = async () => {
        try {
            await Api.post(`/custom-design/${projectId}/agent-approve`, {}, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setModalState('accepted');
        } catch (error) {
            console.error("Error accepting project:", error);
            alert("Failed to accept project. Please try again.");
        }
        setIsOpen(false);
    };

    const handleReject = async () => {
        try {
            await Api.post(`/custom-design/${projectId}/agent-reject`, { notes: "Rejected by vendor" }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setModalState('declined');
        } catch (error) {
            console.error("Error rejecting project:", error);
            alert("Failed to reject project. Please try again.");
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all relative z-10"
            >
                <MoreHorizontal size={20} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-10 z-50 w-48 bg-white border border-transparent rounded-sm shadow-xl ring-1 ring-black/5 flex flex-col py-2">
                        <button 
                            onClick={() => {
                                setIsOpen(false);
                                router.push(`/vendor/project/${projectId}`);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            View Project
                        </button>
                        <button 
                            onClick={handleAccept}
                            className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors font-medium border-t border-gray-50"
                        >
                            Accept Project
                        </button>
                        <button 
                            onClick={handleReject}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium border-t border-gray-50"
                        >
                            Reject Project
                        </button>
                    </div>
                </>
            )}

            {/* Project Accepted Modal */}
            {modalState === 'accepted' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/10 backdrop-blur-[2px]">
                    <div className="bg-white rounded-[20px] p-8 max-w-[400px] w-full shadow-2xl relative text-center animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => window.location.reload()}
                            className="absolute top-5 right-5 p-1 text-black hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={18} strokeWidth={2.5} />
                        </button>
                        
                        <div className="flex justify-center mt-2 mb-6">
                            <div className="relative w-16 h-16 flex items-center justify-center scale-90">
                                {/* Back bubble */}
                                <div className="absolute top-1 right-2 w-10 h-8 bg-[#7A86EC] rounded-xl"></div>
                                {/* Front bubble */}
                                <div className="absolute bottom-3 left-1 z-10 w-[44px] h-[34px] bg-[#3B9FF4] rounded-xl flex items-center justify-center gap-[3px]">
                                    <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                                    <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                                    <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                                    <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                                </div>
                                {/* Tail */}
                                <div className="absolute z-10 bottom-1 left-6 w-0 h-0 border-l-[8px] border-l-[#3B9FF4] border-b-[8px] border-b-transparent"></div>
                            </div>
                        </div>

                        <h3 className="text-[22px] font-bold text-gray-900 mb-4 tracking-tight">Project Accepted</h3>
                        <p className="text-gray-600 text-[15px] mb-8 leading-relaxed px-2">
                            Your workspace is now active. You can view the project brief, review tasks, and begin work immediately.
                        </p>

                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full bg-[#FFC700] hover:bg-[#e6b400] text-gray-900 font-semibold py-3.5 rounded-[10px] transition-colors shadow-sm"
                        >
                            Open Workspace
                        </button>
                    </div>
                </div>
            )}

            {/* Project Declined Modal */}
            {modalState === 'declined' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/10 backdrop-blur-[2px]">
                    <div className="bg-white rounded-[20px] p-8 max-w-[400px] w-full shadow-2xl relative text-center animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => window.location.reload()}
                            className="absolute top-5 right-5 p-1 text-black hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={18} strokeWidth={2.5} />
                        </button>
                        
                        <div className="flex justify-center mt-2 mb-6">
                            <div className="relative w-16 h-16 flex items-center justify-center scale-90">
                                {/* Back bubble */}
                                <div className="absolute top-1 right-2 w-10 h-8 bg-[#7A86EC] rounded-xl"></div>
                                {/* Front bubble */}
                                <div className="absolute bottom-3 left-1 z-10 w-[44px] h-[34px] bg-[#3B9FF4] rounded-xl flex items-center justify-center gap-[3px]">
                                    <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                                    <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                                    <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                                    <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                                </div>
                                {/* Tail */}
                                <div className="absolute z-10 bottom-1 left-6 w-0 h-0 border-l-[8px] border-l-[#3B9FF4] border-b-[8px] border-b-transparent"></div>
                            </div>
                        </div>

                        <h3 className="text-[22px] font-bold text-gray-900 mb-4 tracking-tight">Project Declined</h3>
                        <p className="text-gray-600 text-[15px] mb-8 leading-[1.6] px-1">
                            The project has been returned to the pool and will be reassigned to another agent.<br/>
                            You will no longer receive updates on this project.
                        </p>

                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full bg-[#FFC700] hover:bg-[#e6b400] text-gray-900 font-semibold py-3.5 rounded-[10px] transition-colors shadow-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function renderCell(key: string, value: any, row: any) {
    if (key === "action") {
        return <ActionDropdown projectId={row.id} />;
    }

    if (key === "progress") {
        return (
            <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${value}%` }} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{value}%</span>
            </div>
        );
    }

    if (key === "deadline" || key === "updatedDeadline") {
        const colorClass = (value && (value.includes("Red") || value.includes("2 Days") || value.includes("4 Days"))) ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600";
        return (
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${colorClass}`}>
                {value}
            </span>
        );
    }

    if (key === "budget") {
        return <span className="font-bold text-green-600">{value}</span>;
    }

    if (key === "status") {
        if (value === "Awaiting Acceptance") {
            return (
                <span className="px-4 py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-xs font-bold">
                    {value}
                </span>
            );
        }
    }

    if (key === "files" || key === "filesSubmitted") {
        return (
            <div className="flex items-center gap-2 text-sm text-blue-500 font-medium cursor-pointer hover:underline">
                {value}
                <ChevronDown size={14} className="rotate-270" />
            </div>
        );
    }

    if (key === "revisionStatus") {
        return (
            <div className="flex items-center gap-1 text-sm text-blue-500 font-bold cursor-pointer hover:underline">
                {value}
                <ChevronDown size={14} className="rotate-270" />
            </div>
        );
    }

    if (key === "deliverable") {
        return (
            <div className="flex flex-wrap gap-2">
                {(value || []).map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold flex items-center gap-1">
                        {tag}
                        <ChevronDown size={10} />
                    </span>
                ))}
            </div>
        );
    }

    return <span className="text-sm font-medium text-gray-700">{value}</span>;
}
