"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ChevronDown,
    Info,
    Bath,
    Maximize,
    Layers,
    ArrowRight,
    X,
    Upload
} from "lucide-react";

import { RootState } from "@/src/store/store";
import Api from "@/src/Utils/Api";
import CustomModal from "@/src/components/Message/Message";
import flat1 from "../../assests/images/flat1.png";
import uploadimg from "../../assests/images/uploadimg.png";

// Enums based on backend
const ProductCategory = ["Building Plan", "Product Design", "Building Guide"];
const PlanType = ["Residential", "Commercial", "Industrial"];
const FileTypeOption = ["PDF only", "CAD + PDF", "3D Model + CAD + PDF"];
const DrawingSetOptions = ["Architectural Plan", "Structural Plan", "Electrical Plan", "Mechanical Plan"];
const AddOnsOptions = ["Construction Plans", "MEP Drawings", "3D Rendering", "Adaptability Services"];

export default function UploadProduct() {
    const router = useRouter();
    const auth = useSelector((state: RootState) => state.auth);
    const agentToken = auth.agentToken || (typeof window !== "undefined" ? localStorage.getItem("agentToken") : null);

    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState<{ type: "success" | "error"; message: string } | null>(null);
    // Form State
    const [formData, setFormData] = useState({
        title: "",
        category: "Building Plan",
        planType: "Residential",
        numBedrooms: "",
        numBathrooms: "",
        numFloors: "",
        area: "",
        price: "",
        description: "",
        fileType: "CAD + PDF",
    });

    const [drawingSet, setDrawingSet] = useState<string[]>(["Architectural Plan"]);
    const [drawingSetTypes, setDrawingSetTypes] = useState<Record<string, string>>({
        "Architectural Plan": "CAD + PDF",
        "Structural Plan": "CAD + PDF",
        "Electrical Plan": "CAD + PDF",
        "Mechanical Plan": "CAD + PDF",
    });
    const [addOns, setAddOns] = useState<string[]>([]);

    // File State
    const [files, setFiles] = useState<{
        productImage: File[];
        architecturalPlan: File[];
        structuralPlan: File[];
        electricalPlan: File[];
        mechanicalPlan: File[];
    }>({
        productImage: [],
        architecturalPlan: [],
        structuralPlan: [],
        electricalPlan: [],
        mechanicalPlan: [],
    });

    const [previews, setPreviews] = useState<{
        productImage: string[];
        architecturalPlan: string[];
        structuralPlan: string[];
        electricalPlan: string[];
        mechanicalPlan: string[];
    }>({
        productImage: [],
        architecturalPlan: [],
        structuralPlan: [],
        electricalPlan: [],
        mechanicalPlan: [],
    });

    const productImageRef = useRef<HTMLInputElement>(null);
    const productFolderRef = useRef<HTMLInputElement>(null);
    const archPlanRef = useRef<HTMLInputElement>(null);
    const structPlanRef = useRef<HTMLInputElement>(null);
    const electPlanRef = useRef<HTMLInputElement>(null);
    const mechPlanRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
        if (e.target.files) {
            let newFiles = Array.from(e.target.files);

            if (type === "productImage") {
                newFiles = newFiles.filter(file => file.type.startsWith("image/"));
            }

            const planKeyToOptionMap: Record<string, string> = {
                architecturalPlan: "Architectural Plan",
                structuralPlan: "Structural Plan",
                electricalPlan: "Electrical Plan",
                mechanicalPlan: "Mechanical Plan"
            };

            const drawingSetOptionName = planKeyToOptionMap[type];
            if (drawingSetOptionName) {
                const selectedType = drawingSetTypes[drawingSetOptionName];
                let invalid = false;
                newFiles.forEach(file => {
                    const ext = file.name.split('.').pop()?.toLowerCase();
                    if (selectedType === "PDF only" && ext !== "pdf") invalid = true;
                    else if (selectedType === "CAD + PDF" && !["dwg", "dxf", "pdf", "dwf", "dgn", "zip", "rar"].includes(ext || "")) invalid = true;
                    else if (selectedType === "3D Model + CAD + PDF" && !["pdf", "dwg", "dxf", "zip", "rar", "7z", "rvt", "skp", "obj", "fbx", "3ds", "max"].includes(ext || "")) invalid = true;
                });
                if (invalid) {
                    setModal({
                        type: "error",
                        message: `All files under ${drawingSetOptionName} must match format ${selectedType} (Accepted: CAD and PDF files).`
                    });
                    return;
                }
            }

            const currentCount = files[type].length;
            if (currentCount + newFiles.length > 10) {
                setModal({
                    type: "error",
                    message: `You can only upload a maximum of 10 files for ${
                        type === "productImage"
                            ? "product images"
                            : type === "architecturalPlan"
                            ? "architectural plans"
                            : type === "structuralPlan"
                            ? "structural plans"
                            : type === "electricalPlan"
                            ? "electrical plans"
                            : "mechanical plans"
                    }.`
                });
                return;
            }

            setFiles(prev => ({ ...prev, [type]: [...prev[type], ...newFiles] }));

            const newPreviews = newFiles.map(file => {
                if (file.type.startsWith("image/")) {
                    return URL.createObjectURL(file);
                }
                return ""; // Placeholder for non-image files like PDFs
            });
            
            setPreviews(prev => ({
                ...prev,
                [type]: [...prev[type], ...newPreviews]
            }));
        }
    };

    const removeFile = (type: keyof typeof files, index: number) => {
        setFiles(prev => {
            const updated = [...prev[type]];
            updated.splice(index, 1);
            return { ...prev, [type]: updated };
        });

        setPreviews(prev => {
            const updated = [...prev[type]];
            if (updated[index]) URL.revokeObjectURL(updated[index]);
            updated.splice(index, 1);
            return { ...prev, [type]: updated };
        });
    };

    const toggleDrawingSet = (option: string) => {
        setDrawingSet(prev => prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]);
    };

    const toggleAddOns = (option: string) => {
        setAddOns(prev => prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]);
    };

    const handleSubmit = async () => {
        if (!agentToken) {
            setModal({ type: "error", message: "Agent authorization missing. Please login as agent." });
            return;
        }

        setLoading(true);
        const data = new FormData();

        // Append text fields
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));

        // Append arrays
        drawingSet.forEach(item => data.append("drawingSet[]", item));
        addOns.forEach(item => data.append("addOns[]", item));

        // Append selected file types
        if (drawingSet.includes("Architectural Plan")) {
            data.append("architecturalPlanFileType", drawingSetTypes["Architectural Plan"] || "CAD + PDF");
        }
        if (drawingSet.includes("Structural Plan")) {
            data.append("structuralPlanFileType", drawingSetTypes["Structural Plan"] || "CAD + PDF");
        }
        if (drawingSet.includes("Electrical Plan")) {
            data.append("electricalPlanFileType", drawingSetTypes["Electrical Plan"] || "CAD + PDF");
        }
        if (drawingSet.includes("Mechanical Plan")) {
            data.append("mechanicalPlanFileType", drawingSetTypes["Mechanical Plan"] || "CAD + PDF");
        }

        // Append files
        files.productImage.forEach(file => data.append("productImage", file));
        files.architecturalPlan.forEach(file => data.append("architecturalPlan", file));
        files.structuralPlan.forEach(file => data.append("structuralPlan", file));
        files.electricalPlan.forEach(file => data.append("electricalPlan", file));
        files.mechanicalPlan.forEach(file => data.append("mechanicalPlan", file));

        try {
            await Api.post("/marketproduct", data, {
                headers: {
                    Authorization: `Bearer ${agentToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setModal({
                type: "success",
                message: "Product created successfully! It is now under review by the Admin for approval before it goes public."
            });
            setTimeout(() => router.push("/vendor/products"), 3000);
        } catch (error: any) {
            setModal({
                type: "error",
                message: error.response?.data?.message || "Failed to upload product. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-[#f5f6fa] min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/vendor/products"
                    className="flex items-center justify-center w-10 h-10 bg-[#FFC700] rounded-full hover:bg-[#e5b300] transition-colors"
                >
                    <ArrowLeft size={20} className="text-[#1a1a2e]" />
                </Link>
                <h1 className="text-2xl font-bold text-[#1a1a2e]">Upload New Product</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-8">
                    {/* Form Fields */}
                    <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Product Title</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FFC700] transition-colors font-semibold text-sm"
                                    placeholder="Enter title"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FFC700] transition-colors font-semibold text-sm appearance-none"
                                >
                                    {ProductCategory.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Plan Type</label>
                                <select
                                    name="planType"
                                    value={formData.planType}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FFC700] transition-colors font-semibold text-sm"
                                >
                                    {PlanType.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Price (₦)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FFC700] transition-colors font-semibold text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Bedrooms</label>
                                <input
                                    name="numBedrooms"
                                    value={formData.numBedrooms}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 3-Bedroom"
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FFC700] transition-colors font-semibold text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Bathrooms</label>
                                <input
                                    name="numBathrooms"
                                    value={formData.numBathrooms}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 3-Bathroom"
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FFC700] transition-colors font-semibold text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Floors</label>
                                <input
                                    name="numFloors"
                                    value={formData.numFloors}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 2"
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FFC700] transition-colors font-semibold text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Area (Square Metres)</label>
                                <input
                                    name="area"
                                    value={formData.area}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 450 sqm"
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FFC700] transition-colors font-semibold text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
                        <h2 className="text-sm font-bold text-[#1a1a2e] mb-6">Upload Project Picture</h2>
                        <div className="border-2 border-dashed border-gray-100 rounded-[20px] p-12 flex flex-col items-center justify-center bg-[#F9FAFB]/50">
                            <div className="w-24 h-24 mb-4 flex items-center justify-center text-[#3B82F6]">
                                <Image src={uploadimg} alt="Upload" width={184} height={284} />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 mb-6">Drag and drop</span>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => productImageRef.current?.click()}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#1a1a2e] hover:bg-gray-50 transition-colors"
                                >
                                    <span className="w-4 h-4 border border-gray-200 rounded-px flex items-center justify-center">
                                        <span className="w-2 h-0.5 bg-gray-400"></span>
                                        <span className="w-0.5 h-2 bg-gray-400 absolute"></span>
                                    </span>
                                    Upload files
                                </button>
                                <button
                                    onClick={() => productFolderRef.current?.click()}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#1a1a2e] hover:bg-gray-50 transition-colors"
                                >
                                    <span className="w-4 h-4 border border-gray-200 rounded-px flex items-center justify-center">
                                        <span className="w-2 h-0.5 bg-gray-400"></span>
                                        <span className="w-0.5 h-2 bg-gray-400 absolute"></span>
                                    </span>
                                    Upload folders
                                </button>
                            </div>
                            <input
                                type="file"
                                ref={productImageRef}
                                multiple
                                hidden
                                onChange={(e) => handleFileChange(e, "productImage")}
                                accept="image/*"
                            />
                            <input
                                type="file"
                                ref={productFolderRef}
                                {...{ webkitdirectory: "true" }}
                                multiple
                                hidden
                                onChange={(e) => handleFileChange(e, "productImage")}
                            />
                        </div>
                        {files.productImage.length > 0 && (
                            <div className="mt-6 grid grid-cols-4 gap-4">
                                {previews.productImage.map((src, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100">
                                        <Image src={src} alt="preview" fill className="object-cover" />
                                        {i === 0 && (
                                            <span className="absolute top-2 left-2 bg-[#FFC700] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
                                                Cover Image
                                            </span>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFile("productImage", i); }}
                                                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Plans Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {drawingSet.includes("Architectural Plan") && (
                            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
                                <h2 className="text-sm font-bold text-[#1a1a2e]">Architectural Plans (Accepts: {drawingSetTypes["Architectural Plan"]})</h2>
                                <button
                                    onClick={() => archPlanRef.current?.click()}
                                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    <Upload size={16} /> {files.architecturalPlan.length} Files Selected
                                </button>
                                <input type="file" ref={archPlanRef} multiple hidden onChange={(e) => handleFileChange(e, "architecturalPlan")} />
                                
                                {files.architecturalPlan.length > 0 && (
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        {files.architecturalPlan.map((file, i) => {
                                            const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
                                            return (
                                                <div key={i} className="relative p-3 bg-gray-50 rounded-xl border border-gray-100 group flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 min-w-0 pr-4">
                                                        <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">{ext}</span>
                                                        <p className="text-[10px] font-medium text-gray-600 truncate">{file.name}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFile("architecturalPlan", i)}
                                                        className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm shrink-0"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {drawingSet.includes("Structural Plan") && (
                            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
                                <h2 className="text-sm font-bold text-[#1a1a2e]">Structural Plans (Accepts: {drawingSetTypes["Structural Plan"]})</h2>
                                <button
                                    onClick={() => structPlanRef.current?.click()}
                                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    <Upload size={16} /> {files.structuralPlan.length} Files Selected
                                </button>
                                <input type="file" ref={structPlanRef} multiple hidden onChange={(e) => handleFileChange(e, "structuralPlan")} />

                                {files.structuralPlan.length > 0 && (
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        {files.structuralPlan.map((file, i) => {
                                            const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
                                            return (
                                                <div key={i} className="relative p-3 bg-gray-50 rounded-xl border border-gray-100 group flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 min-w-0 pr-4">
                                                        <span className="bg-purple-100 text-purple-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">{ext}</span>
                                                        <p className="text-[10px] font-medium text-gray-600 truncate">{file.name}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFile("structuralPlan", i)}
                                                        className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm shrink-0"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {drawingSet.includes("Electrical Plan") && (
                            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
                                <h2 className="text-sm font-bold text-[#1a1a2e]">Electrical Plans (Accepts: {drawingSetTypes["Electrical Plan"]})</h2>
                                <button
                                    onClick={() => electPlanRef.current?.click()}
                                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    <Upload size={16} /> {files.electricalPlan.length} Files Selected
                                </button>
                                <input type="file" ref={electPlanRef} multiple hidden onChange={(e) => handleFileChange(e, "electricalPlan")} />

                                {files.electricalPlan.length > 0 && (
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        {files.electricalPlan.map((file, i) => {
                                            const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
                                            return (
                                                <div key={i} className="relative p-3 bg-gray-50 rounded-xl border border-gray-100 group flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 min-w-0 pr-4">
                                                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">{ext}</span>
                                                        <p className="text-[10px] font-medium text-gray-600 truncate">{file.name}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFile("electricalPlan", i)}
                                                        className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm shrink-0"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {drawingSet.includes("Mechanical Plan") && (
                            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
                                <h2 className="text-sm font-bold text-[#1a1a2e]">Mechanical Plans (Accepts: {drawingSetTypes["Mechanical Plan"]})</h2>
                                <button
                                    onClick={() => mechPlanRef.current?.click()}
                                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    <Upload size={16} /> {files.mechanicalPlan.length} Files Selected
                                </button>
                                <input type="file" ref={mechPlanRef} multiple hidden onChange={(e) => handleFileChange(e, "mechanicalPlan")} />

                                {files.mechanicalPlan.length > 0 && (
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        {files.mechanicalPlan.map((file, i) => {
                                            const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
                                            return (
                                                <div key={i} className="relative p-3 bg-gray-50 rounded-xl border border-gray-100 group flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 min-w-0 pr-4">
                                                        <span className="bg-orange-100 text-orange-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">{ext}</span>
                                                        <p className="text-[10px] font-medium text-gray-600 truncate">{file.name}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFile("mechanicalPlan", i)}
                                                        className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm shrink-0"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
                        <h2 className="text-sm font-bold text-[#1a1a2e] mb-6">Project Description</h2>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FFC700] text-sm leading-relaxed"
                            placeholder="e.g. This elegant 2-story home offers 4 spacious bedrooms and 5 bathrooms..."
                        />
                    </div>

                        <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-4 md:col-span-2">
                            <h2 className="text-sm font-bold text-[#1a1a2e]">Select Drawing Sets and File Types</h2>
                            <p className="text-xs text-gray-400">Select multiple drawing sets and specify a single file format for each.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                {DrawingSetOptions.map(opt => (
                                    <div key={opt} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={drawingSet.includes(opt)}
                                                onChange={() => toggleDrawingSet(opt)}
                                                className="w-4 h-4 accent-[#1a1a2e]"
                                            />
                                            <span className="text-xs font-bold text-gray-800">{opt}</span>
                                        </label>
                                        
                                        {drawingSet.includes(opt) && (
                                            <div className="mt-3 pl-7 space-y-2 border-t border-gray-100 pt-3">
                                                <span className="text-[10px] font-extrabold text-gray-400 uppercase block tracking-wider mb-1">Select Format:</span>
                                                <div className="flex flex-col gap-1.5">
                                                    {FileTypeOption.map((fmt) => (
                                                        <label key={fmt} className="flex items-center gap-3 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-gray-200/40 transition-colors">
                                                            <input
                                                                type="radio"
                                                                name={`fileType-${opt}`}
                                                                checked={drawingSetTypes[opt] === fmt}
                                                                onChange={() => setDrawingSetTypes(prev => ({ ...prev, [opt]: fmt }))}
                                                                className="w-3.5 h-3.5 accent-[#1a1a2e] shrink-0"
                                                            />
                                                            <span className="text-xs font-semibold text-gray-600">{fmt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                {/* Right Side Preview */}
                <div className="w-full lg:w-[380px] space-y-6">
                    <h2 className="text-sm font-bold text-[#1a1a2e]">Product Preview</h2>
                    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-3 pb-6">
                        <div className="relative h-56 w-full rounded-[18px] overflow-hidden mb-4 bg-gray-100">
                            <Image src={previews.productImage[0] || flat1} alt="Preview" fill className="object-cover" />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold text-gray-600">
                                {formData.category || "Building Plans"}
                            </div>
                        </div>

                        <div className="px-3">
                            <h3 className="text-sm font-bold text-[#1a1a2e] mb-3">{formData.title || "Luxury 3-Bedroom Duplex"}</h3>
                            <div className="flex items-center justify-between mb-6 text-gray-500">
                                <div className="flex items-center gap-1.5"><Bath size={14} /><span className="text-[10px] font-medium">{formData.numBathrooms || "3-Bathroom"}</span></div>
                                <div className="flex items-center gap-1.5"><Maximize size={14} /><span className="text-[10px] font-medium">{formData.area ? (formData.area.toLowerCase().includes("sqm") || formData.area.toLowerCase().includes("m²") ? formData.area : `${formData.area} sqm`) : "450 sqm"}</span></div>
                                <div className="flex items-center gap-1.5"><Layers size={14} /><span className="text-[10px] font-medium">{formData.numFloors || "2"} Floors</span></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <button className="bg-[#FFC700] text-[#1a1a2e] font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-[10px] hover:bg-[#e5b300] transition-colors shadow-sm">
                                    View details <ArrowRight size={14} />
                                </button>
                                <span className="text-lg font-extrabold text-[#1a1a2e]">₦{formData.price ? Number(formData.price).toLocaleString() : "5,800,000"}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-sm transition-colors shadow-sm mt-4"
                    >
                        {loading ? "Submitting..." : "Submit for Review"}
                    </button>
                </div>
            </div>

            {modal && <CustomModal type={modal.type} message={modal.message} onClose={() => setModal(null)} />}
        </div>
    );
}
