"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import { ArrowLeft, ArrowRight, Star, Loader2 } from "lucide-react";
import HireSuccessModal from "@/src/components/Modals/HireSuccessModal";
import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import Api from "@/src/Utils/Api";
import { setSelectedAgent } from "@/src/store/customDesignSlice";
import CustomModal from "@/src/components/Message/Message";

export default function AgentDetailsPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const customDesign = useSelector((state: RootState) => state.customDesign);
    const selectedAgent = customDesign.selectedAgent;
    const [agent, setAgent] = useState<any>(selectedAgent);
    const [loading, setLoading] = useState(!selectedAgent || !selectedAgent.id);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modal, setModal] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    useEffect(() => {
        const fetchAgentDetails = async () => {
            if (!selectedAgent?.id) return;

            try {
                setLoading(true);
                const response = await Api.get(`/agent/pros/${selectedAgent.id}`);
                if (response.data) {
                    setAgent(response.data);
                    // Also update Redux to keep it in sync
                    dispatch(setSelectedAgent(response.data));
                }
            } catch (error: any) {
                console.error("Error fetching agent details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgentDetails();
    }, [selectedAgent?.id, dispatch]);

    const handleHire = async () => {
        if (!displayAgent?.id) return;

        try {
            const userToken = localStorage.getItem("userToken");
            setSubmitting(true);

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
                agentId: displayAgent.id
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

    if (!selectedAgent && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 font-bold">No agent selected.</p>
            </div>
        );
    }

    // Use selectedAgent as fallback if API fetch hasn't finished or failed
    const displayAgent = agent || selectedAgent;

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-white py-32">
                <div className="h-64 sm:h-80 w-full relative">
                    <Image
                        src="/images/agent-banner.png"
                        alt="Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute top-8 left-8">
                        <button
                            onClick={() => router.back()}
                            className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-20">
                    {loading && !agent ? (
                        <div className="bg-white rounded-[32px] p-24 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                            <p className="text-gray-500 font-bold">Loading professional details...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="lg:w-1/3">
                                <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center">
                                    <div className="w-40 h-40 relative rounded-full overflow-hidden border-8 border-white shadow-lg -mt-24 mb-6">
                                        <Image
                                            src={displayAgent.profilePicture || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"}
                                            alt={displayAgent.businessName}
                                            fill
                                            className="object-cover"
                                            unoptimized={true}
                                        />
                                    </div>

                                    <h1 className="text-2xl font-black text-gray-900 mb-1">{displayAgent.businessName}</h1>
                                    <p className="text-sm font-bold text-gray-400 mb-8 uppercase tracking-wider">{displayAgent.professionalTitle || "Pro Professional"}</p>

                                    <div className="grid grid-cols-3 gap-6 w-full mb-8">
                                        <div>
                                            <p className="text-lg font-black text-gray-900">{displayAgent.yearsOfExperience}+</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Of Experience</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-gray-900">{displayAgent.rating || 0}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Ratings</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-gray-900">{displayAgent.priceRange?.split('from ')[1] || displayAgent.priceRange || "N/A"}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Starting Price</p>
                                        </div>
                                    </div>

                                    <p className="text-sm font-medium text-gray-500 leading-relaxed mb-10">
                                        {displayAgent.bio || `A certified professional with over ${displayAgent.yearsOfExperience} years of experience. Specializing in high-quality architectural and design solutions tailored to your ${displayAgent.businessName} unique requirements.`}
                                    </p>

                                    <button
                                        onClick={handleHire}
                                        disabled={submitting}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                                        Hire
                                    </button>
                                </div>
                            </div>

                            <div className="lg:w-2/3">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-black text-gray-900">Past projects</h2>
                                    <div className="flex gap-3">
                                        <button className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                                            <ArrowLeft size={16} />
                                        </button>
                                        <button className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {displayAgent.projects?.length > 0 ? (
                                        displayAgent.projects.map((project: any) => (
                                            <div key={project.id} className="aspect-square rounded-[24px] overflow-hidden relative group cursor-pointer bg-gray-100">
                                                <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                                    <p className="text-white font-bold text-sm">{project.title}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        [1, 2, 3].map((item) => (
                                            <div key={item} className="aspect-square bg-gray-100 rounded-[24px] overflow-hidden relative group cursor-pointer">
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300">
                                                        <ArrowRight size={18} className="text-gray-900" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
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
