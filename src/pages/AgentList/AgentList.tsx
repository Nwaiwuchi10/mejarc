"use client";


import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { setSelectedAgent } from "@/src/store/customDesignSlice";
import { ArrowLeft, Star, Loader2 } from "lucide-react";
import HireSuccessModal from "@/src/components/Modals/HireSuccessModal";
import Footer from "@/src/components/Footer/Footer";
import Navbar from "@/src/components/Navbar/Navbar";
import { useState, useEffect } from "react";
import Api from "@/src/Utils/Api";
import CustomModal from "@/src/components/Message/Message";

export default function AgentListPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const customDesign = useSelector((state: RootState) => state.customDesign);
    const [showModal, setShowModal] = useState(false);
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await Api.get("/agent/pros", {
                    params: { page: 1, limit: 10 }
                });
                if (response.data && response.data.data) {
                    setAgents(response.data.data);
                }
            } catch (error: any) {
                if (error.code === "ERR_NETWORK") {
                    console.warn("API Server is unreachable. Please check your backend connection.");
                } else {
                    console.error("Error fetching agents:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    const [submitting, setSubmitting] = useState(false);

    const handleHire = async (agent: any) => {
        try {
            const userToken = localStorage.getItem("userToken");
            setSubmitting(true);
            dispatch(setSelectedAgent(agent));

            // Map values to API enums
            const mapCategoryToService = (cat: string) => {
                const maps: Record<string, string> = {
                    "Landscape": "landscape-design",
                    "Product Design": "product-design",
                    "Product Design 2": "product-design",
                    "3D Rendering & Visualization": "3d-rendering",
                    "2D Architectural Drawings": "2d-architectural",
                    "Building Information Modeling": "building-information-modeling",
                    "Mechanical & Electrical Drawings": "mep-drawings",
                    "Structural Engineering Drawings": "structural-engineering"
                };
                return maps[cat] || cat.toLowerCase().replace(/\s/g, '-');
            };

            const mapSelectionMethod = (method: string | null) => {
                if (!method) return "manual";
                const maps: Record<string, string> = {
                    "Contest": "contest",
                    "Hire a Pro": "hire_pro",
                    "Fixed Quote": "fixed_quote"
                };
                return maps[method] || "manual";
            };

            // Prepare the submission DTO from Redux state
            const submissionData = {
                serviceType: mapCategoryToService(customDesign.category),
                serviceContext: customDesign.selections.serviceContext,
                projectType: customDesign.selections.projectType,
                scopeDeliverables: customDesign.selections.scopeDeliverables,
                sizeComplexity: customDesign.selections.sizeComplexity,
                style: customDesign.selections.style,
                budget: Number(String(customDesign.selections.budget).replace(/[^0-9.]/g, '')) || 0,
                timeline: customDesign.selections.timeline,
                additionalInformation: customDesign.selections.additionalInformation || "",
                attachedFiles: customDesign.selections.attachedFiles || [],
                selectionMethod: mapSelectionMethod(customDesign.engagementModel),
                agentId: agent.id
            };

            await Api.post("/custom-design", submissionData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`
                }
            });
            setShowModal(true);
        } catch (error: any) {
            console.error("Submission failed:", error);
            setModal({
                type: "error",
                message: error?.response?.data?.message || "Failed to submit request. Please ensure you are logged in and try again",
            });


        } finally {
            setSubmitting(false);
        }
    };

    const handleAgentClick = (agent: any) => {
        dispatch(setSelectedAgent(agent));
        router.push("/custom-design/agent-details");
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#F9FBFF] py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-3xl p-8 mb-8 flex items-center gap-6 shadow-sm">
                        <button
                            onClick={() => router.back()}
                            className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-1">Find & Hire a Pro</h1>
                            <p className="text-sm font-medium text-gray-500">Connect with certified architects and landscape experts to bring your custom design to life.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-24 gap-4">
                                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                    <p className="text-gray-500 font-bold animate-pulse">Loading professionals...</p>
                                </div>
                            ) : agents.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="bg-[#FAFBFF] border-b border-gray-100">
                                        <tr>
                                            <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Business Name</th>
                                            <th className="px-6 py-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Specialization</th>
                                            <th className="px-6 py-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                                            <th className="px-6 py-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Experience Level</th>
                                            <th className="px-6 py-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Price Range</th>
                                            <th className="px-6 py-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Response Time</th>
                                            <th className="px-8 py-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {agents.map((agent) => (
                                            <tr
                                                key={agent.id}
                                                className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                                onClick={() => handleAgentClick(agent)}
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-white shadow-sm">
                                                            <Image
                                                                src={agent.profilePicture || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"}
                                                                alt={agent.businessName}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized={true}
                                                            />
                                                        </div>
                                                        <span className="font-bold text-gray-900">{agent.businessName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <p className="text-xs font-medium text-gray-500 max-w-[200px] leading-relaxed">
                                                        {agent.professionalTitle}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-1">
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={14} fill={i < Math.floor(agent.rating || 0) ? "currentColor" : "none"} />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-900 ml-1">{agent.rating || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <p className="text-sm font-bold text-gray-900 mb-0.5">{agent.yearsOfExperience}+ years experience</p>
                                                    <p className="text-xs font-bold text-blue-500">{agent.completedProjects || 0} completed projects.</p>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <p className="text-sm font-medium text-gray-500">{agent.location || 'N/A'}</p>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <p className="text-sm font-medium text-gray-500">{agent.priceRange}</p>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <p className="text-sm font-medium text-gray-500">{agent.responseTime}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleHire(agent);
                                                        }}
                                                        disabled={submitting}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-8 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                    >
                                                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                                        Hire
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 gap-2">
                                    <p className="text-gray-500 font-bold text-lg">No professionals found.</p>
                                    <p className="text-gray-400 text-sm">Please check back later or try adjusting your filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {modal && (
                    <CustomModal
                        type={modal.type}
                        message={modal.message}
                        onClose={() => setModal(null)}
                    />
                )}
                <HireSuccessModal 
                    isOpen={showModal} 
                    onClose={() => {
                        setShowModal(false);
                        router.push("/");
                    }} 
                />
            </div>
            <Footer />
        </>
    );
}
