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
    Upload,
    Loader2
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

interface EditProductProps {
    id: string;
}

export default function EditProduct({ id }: EditProductProps) {
    const router = useRouter();
    const auth = useSelector((state: RootState) => state.auth);
    const agentToken = auth.agentToken || (typeof window !== "undefined" ? localStorage.getItem("agentToken") : null);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
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

    const [drawingSet, setDrawingSet] = useState<string[]>([]);
    const [drawingSetTypes, setDrawingSetTypes] = useState<Record<string, string>>({
        "Architectural Plan": "CAD + PDF",
        "Structural Plan": "CAD + PDF",
        "Electrical Plan": "CAD + PDF",
        "Mechanical Plan": "CAD + PDF",
    });
    const [addOns, setAddOns] = useState<string[]>([]);

    // Existing URLs for files that were already uploaded
    const [existingFiles, setExistingFiles] = useState<{
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

    // New files to be uploaded
    const [newFiles, setNewFiles] = useState<{
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

    const [previews, setPreviews] = useState<string[]>([]);
    const [existingPreviews, setExistingPreviews] = useState<string[]>([]);

    const productImageRef = useRef<HTMLInputElement>(null);
    const productFolderRef = useRef<HTMLInputElement>(null);
    const archPlanRef = useRef<HTMLInputElement>(null);
    const structPlanRef = useRef<HTMLInputElement>(null);
    const electPlanRef = useRef<HTMLInputElement>(null);
    const mechPlanRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) return;
            try {
                const response = await Api.get(`/marketproduct/${id}`);
                const product = response.data;

                setFormData({
                    title: product.title || "",
                    category: product.category || "Building Plan",
                    planType: product.planType || "Residential",
                    numBedrooms: product.numBedrooms || "",
                    numBathrooms: product.numBathrooms || "",
                    numFloors: product.numFloors || "",
                    area: product.area || "",
                    price: product.price?.toString() || "",
                    description: product.description || "",
                    fileType: product.fileType || "CAD + PDF",
                });

                setDrawingSet(product.drawingSet || []);
                setDrawingSetTypes({
                    "Architectural Plan": product.architecturalPlanFileType || "CAD + PDF",
                    "Structural Plan": product.structuralPlanFileType || "CAD + PDF",
                    "Electrical Plan": product.electricalPlanFileType || "CAD + PDF",
                    "Mechanical Plan": product.mechanicalPlanFileType || "CAD + PDF",
                });
                setAddOns(product.addOns || []);
                
                setExistingFiles({
                    productImage: product.productImage || [],
                    architecturalPlan: product.architecturalPlan || [],
                    structuralPlan: product.structuralPlan || [],
                    electricalPlan: product.electricalPlan || [],
                    mechanicalPlan: product.mechanicalPlan || [],
                });
                setExistingPreviews(product.productImage || []);

            } catch (error) {
                console.error("Error fetching product details:", error);
                setModal({ type: "error", message: "Failed to load product details." });
            } finally {
                setFetching(false);
            }
        };

        fetchProductData();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof newFiles) => {
        if (e.target.files) {
            let selectedFiles = Array.from(e.target.files);

            if (type === "productImage") {
                selectedFiles = selectedFiles.filter(file => file.type.startsWith("image/"));
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
                selectedFiles.forEach(file => {
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

            setNewFiles(prev => ({ ...prev, [type]: [...prev[type], ...selectedFiles] }));

            if (type === "productImage") {
                const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
                setPreviews(prev => [...prev, ...newPreviews]);
            }
        }
    };

    const removeNewFile = (type: keyof typeof newFiles, index: number) => {
        setNewFiles(prev => {
            const updated = [...prev[type]];
            updated.splice(index, 1);
            return { ...prev, [type]: updated };
        });

        if (type === "productImage") {
            setPreviews(prev => {
                const updated = [...prev];
                URL.revokeObjectURL(updated[index]);
                updated.splice(index, 1);
                return updated;
            });
        }
    };

    const removeExistingFile = (type: keyof typeof existingFiles, index: number) => {
        setExistingFiles(prev => {
            const updated = [...prev[type]];
            updated.splice(index, 1);
            return { ...prev, [type]: updated };
        });

        if (type === "productImage") {
            setExistingPreviews(prev => {
                const updated = [...prev];
                updated.splice(index, 1);
                return updated;
            });
        }
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

        // Append existing file URLs (to keep them)
        existingFiles.productImage.forEach(url => data.append("productImage[]", url));
        existingFiles.architecturalPlan.forEach(url => data.append("architecturalPlan[]", url));
        existingFiles.structuralPlan.forEach(url => data.append("structuralPlan[]", url));
        existingFiles.electricalPlan.forEach(url => data.append("electricalPlan[]", url));
        existingFiles.mechanicalPlan.forEach(url => data.append("mechanicalPlan[]", url));

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

        // Append new files
        newFiles.productImage.forEach(file => data.append("productImage", file));
        newFiles.architecturalPlan.forEach(file => data.append("architecturalPlan", file));
        newFiles.structuralPlan.forEach(file => data.append("structuralPlan", file));
        newFiles.electricalPlan.forEach(file => data.append("electricalPlan", file));
        newFiles.mechanicalPlan.forEach(file => data.append("mechanicalPlan", file));

        try {
            await Api.patch(`/marketproduct/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${agentToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setModal({ type: "success", message: "Product updated successfully!" });
            setTimeout(() => router.push("/vendor/products"), 2000);
        } catch (error: any) {
            setModal({
                type: "error",
                message: error.response?.data?.message || "Failed to update product. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f5f6fa]">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 bg-[#f5f6fa] min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/vendor/products"
                    className="flex items-center justify-center w-10 h-10 bg-[#FFC700] rounded-full hover:bg-[#e5b300] transition-colors"
                >
                    <ArrowLeft size={20} className="text-[#1a1a2e]" />
                </Link>
                <h1 className="text-2xl font-bold text-[#1a1a2e]">Edit Product</h1>
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
                        <h2 className="text-sm font-bold text-[#1a1a2e] mb-6">Update Project Images</h2>
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
                                    Upload new files
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
                        </div>
                        
                        {(existingPreviews.length > 0 || previews.length > 0) && (
                            <div className="mt-6 grid grid-cols-4 gap-4">
                                {existingPreviews.map((src, i) => (
                                    <div key={`existing-${i}`} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                                        <Image src={src} alt="existing" fill className="object-cover" unoptimized={true} />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeExistingFile("productImage", i); }}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] py-1 text-center">Existing</div>
                                    </div>
                                ))}
                                {previews.map((src, i) => (
                                    <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden group border border-[#FFC700]">
                                        <Image src={src} alt="preview" fill className="object-cover" />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeNewFile("productImage", i); }}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-[#FFC700] text-[#1a1a2e] text-[8px] py-1 text-center font-bold">New</div>
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
                                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:bg-gray-50 mb-2 transition-colors"
                                >
                                    <Upload size={16} /> Add More Files ({newFiles.architecturalPlan.length})
                                </button>
                                <input type="file" ref={archPlanRef} multiple hidden onChange={(e) => handleFileChange(e, "architecturalPlan")} />
                                
                                {/* Existing Files */}
                                {existingFiles.architecturalPlan.length > 0 && (
                                    <div className="space-y-2 mt-3">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Existing Files ({existingFiles.architecturalPlan.length}):</span>
                                        <div className="grid grid-cols-1 gap-2">
                                            {existingFiles.architecturalPlan.map((url, i) => {
                                                const fileName = decodeURIComponent(url.split('/').pop()?.split('?')[0] || `File-${i + 1}`);
                                                const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
                                                return (
                                                    <div key={`exist-arch-${i}`} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between group">
                                                        <div className="flex items-center gap-2 min-w-0 pr-2">
                                                            <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">{ext}</span>
                                                            <p className="text-[11px] font-medium text-gray-700 truncate">{fileName}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeExistingFile("architecturalPlan", i)}
                                                            className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                            title="Remove file"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* New Files */}
                                {newFiles.architecturalPlan.length > 0 && (
                                    <div className="space-y-2 mt-3">
                                        <span className="text-[10px] font-bold text-green-600 uppercase">Newly Added ({newFiles.architecturalPlan.length}):</span>
                                        <div className="grid grid-cols-1 gap-2">
                                            {newFiles.architecturalPlan.map((file, i) => {
                                                const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
                                                return (
                                                    <div key={`new-arch-${i}`} className="p-2.5 bg-green-50/50 rounded-xl border border-green-200 flex items-center justify-between group">
                                                        <div className="flex items-center gap-2 min-w-0 pr-2">
                                                            <span className="bg-green-100 text-green-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">{ext}</span>
                                                            <p className="text-[11px] font-medium text-gray-700 truncate">{file.name}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeNewFile("architecturalPlan", i)}
                                                            className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {drawingSet.includes("Structural Plan") && (
                            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
                                <h2 className="text-sm font-bold text-[#1a1a2e]">Structural Plans (Accepts: {drawingSetTypes["Structural Plan"]})</h2>
                                <button
                                    onClick={() => structPlanRef.current?.click()}
                                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:bg-gray-50 mb-2 transition-colors"
                                >
                                    <Upload size={16} /> Add More Files ({newFiles.structuralPlan.length})
                                </button>
                                <input type="file" ref={structPlanRef} multiple hidden onChange={(e) => handleFileChange(e, "structuralPlan")} />

                                {/* Existing Files */}
                                {existingFiles.structuralPlan.length > 0 && (
                                    <div className="space-y-2 mt-3">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Existing Files ({existingFiles.structuralPlan.length}):</span>
                                        <div className="grid grid-cols-1 gap-2">
                                            {existingFiles.structuralPlan.map((url, i) => {
                                                const fileName = decodeURIComponent(url.split('/').pop()?.split('?')[0] || `File-${i + 1}`);
                                                const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
                                                return (
                                                    <div key={`exist-struct-${i}`} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between group">
                                                        <div className="flex items-center gap-2 min-w-0 pr-2">
                                                            <span className="bg-purple-100 text-purple-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">{ext}</span>
                                                            <p className="text-[11px] font-medium text-gray-700 truncate">{fileName}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeExistingFile("structuralPlan", i)}
                                                            className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* New Files */}
                                {newFiles.structuralPlan.length > 0 && (
                                    <div className="space-y-2 mt-3">
                                        <span className="text-[10px] font-bold text-green-600 uppercase">Newly Added ({newFiles.structuralPlan.length}):</span>
                                        <div className="grid grid-cols-1 gap-2">
                                            {newFiles.structuralPlan.map((file, i) => {
                                                const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
                                                return (
                                                    <div key={`new-struct-${i}`} className="p-2.5 bg-green-50/50 rounded-xl border border-green-200 flex items-center justify-between group">
                                                        <div className="flex items-center gap-2 min-w-0 pr-2">
                                                            <span className="bg-green-100 text-green-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">{ext}</span>
                                                            <p className="text-[11px] font-medium text-gray-700 truncate">{file.name}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeNewFile("structuralPlan", i)}
                                                            className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {drawingSet.includes("Electrical Plan") && (
                            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
                                <h2 className="text-sm font-bold text-[#1a1a2e]">Electrical Plans (Accepts: {drawingSetTypes["Electrical Plan"]})</h2>
                                <button
                                    onClick={() => electPlanRef.current?.click()}
                                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:bg-gray-50 mb-2 transition-colors"
                                >
                                    <Upload size={16} /> Add More Files ({newFiles.electricalPlan.length})
                                </button>
                                <input type="file" ref={electPlanRef} multiple hidden onChange={(e) => handleFileChange(e, "electricalPlan")} />

                                {/* Existing Files */}
                                {existingFiles.electricalPlan.length > 0 && (
                                    <div className="space-y-2 mt-3">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Existing Files ({existingFiles.electricalPlan.length}):</span>
                                        <div className="grid grid-cols-1 gap-2">
                                            {existingFiles.electricalPlan.map((url, i) => {
                                                const fileName = decodeURIComponent(url.split('/').pop()?.split('?')[0] || `File-${i + 1}`);
                                                const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
                                                return (
                                                    <div key={`exist-elect-${i}`} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between group">
                                                        <div className="flex items-center gap-2 min-w-0 pr-2">
                                                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">{ext}</span>
                                                            <p className="text-[11px] font-medium text-gray-700 truncate">{fileName}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeExistingFile("electricalPlan", i)}
                                                            className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* New Files */}
                                {newFiles.electricalPlan.length > 0 && (
                                    <div className="space-y-2 mt-3">
                                        <span className="text-[10px] font-bold text-green-600 uppercase">Newly Added ({newFiles.electricalPlan.length}):</span>
                                        <div className="grid grid-cols-1 gap-2">
                                            {newFiles.electricalPlan.map((file, i) => {
                                                const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
                                                return (
                                                    <div key={`new-elect-${i}`} className="p-2.5 bg-green-50/50 rounded-xl border border-green-200 flex items-center justify-between group">
                                                        <div className="flex items-center gap-2 min-w-0 pr-2">
                                                            <span className="bg-green-100 text-green-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">{ext}</span>
                                                            <p className="text-[11px] font-medium text-gray-700 truncate">{file.name}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeNewFile("electricalPlan", i)}
                                                            className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {drawingSet.includes("Mechanical Plan") && (
                            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
                                <h2 className="text-sm font-bold text-[#1a1a2e]">Mechanical Plans (Accepts: {drawingSetTypes["Mechanical Plan"]})</h2>
                                <button
                                    onClick={() => mechPlanRef.current?.click()}
                                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:bg-gray-50 mb-2 transition-colors"
                                >
                                    <Upload size={16} /> Add More Files ({newFiles.mechanicalPlan.length})
                                </button>
                                <input type="file" ref={mechPlanRef} multiple hidden onChange={(e) => handleFileChange(e, "mechanicalPlan")} />

                                {/* Existing Files */}
                                {existingFiles.mechanicalPlan.length > 0 && (
                                    <div className="space-y-2 mt-3">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Existing Files ({existingFiles.mechanicalPlan.length}):</span>
                                        <div className="grid grid-cols-1 gap-2">
                                            {existingFiles.mechanicalPlan.map((url, i) => {
                                                const fileName = decodeURIComponent(url.split('/').pop()?.split('?')[0] || `File-${i + 1}`);
                                                const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
                                                return (
                                                    <div key={`exist-mech-${i}`} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between group">
                                                        <div className="flex items-center gap-2 min-w-0 pr-2">
                                                            <span className="bg-orange-100 text-orange-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">{ext}</span>
                                                            <p className="text-[11px] font-medium text-gray-700 truncate">{fileName}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeExistingFile("mechanicalPlan", i)}
                                                            className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* New Files */}
                                {newFiles.mechanicalPlan.length > 0 && (
                                    <div className="space-y-2 mt-3">
                                        <span className="text-[10px] font-bold text-green-600 uppercase">Newly Added ({newFiles.mechanicalPlan.length}):</span>
                                        <div className="grid grid-cols-1 gap-2">
                                            {newFiles.mechanicalPlan.map((file, i) => {
                                                const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
                                                return (
                                                    <div key={`new-mech-${i}`} className="p-2.5 bg-green-50/50 rounded-xl border border-green-200 flex items-center justify-between group">
                                                        <div className="flex items-center gap-2 min-w-0 pr-2">
                                                            <span className="bg-green-100 text-green-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">{ext}</span>
                                                            <p className="text-[11px] font-medium text-gray-700 truncate">{file.name}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeNewFile("mechanicalPlan", i)}
                                                            className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
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
                        />
                    </div>

                        <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-4 md:col-span-2">
                            <h2 className="text-sm font-bold text-[#1a1a2e]">Select Drawing Sets and File Types</h2>
                            <p className="text-xs text-gray-400">Select multiple drawing sets and specify a single file format for each.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                {DrawingSetOptions.map(opt => (
                                    <div key={opt} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <label className="flex items-center gap-3 cursor-pointer font-medium text-gray-700">
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
                            <Image src={previews[0] || existingPreviews[0] || flat1} alt="Preview" fill className="object-cover" unoptimized={true} />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold text-gray-600">
                                {formData.category || "Building Plans"}
                            </div>
                        </div>

                        <div className="px-3">
                            <h3 className="text-sm font-bold text-[#1a1a2e] mb-3">{formData.title || "Luxury 3-Bedroom Duplex"}</h3>
                            <div className="flex items-center justify-between mb-6 text-gray-500">
                                <div className="flex items-center gap-1.5"><Bath size={14} /><span className="text-[10px] font-medium">{formData.numBathrooms || "3-Bathroom"}</span></div>
                                <div className="flex items-center gap-1.5"><Maximize size={14} /><span className="text-[10px] font-medium">{formData.area ? (formData.area.toLowerCase().includes("sqm") || formData.area.toLowerCase().includes("m²") ? formData.area : `${formData.area} sqm`) : "N/A"}</span></div>
                                <div className="flex items-center gap-1.5"><Layers size={14} /><span className="text-[10px] font-medium">{formData.numFloors || "2"} Floors</span></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <button className="bg-[#FFC700] text-[#1a1a2e] font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-[10px] hover:bg-[#e5b300] transition-colors shadow-sm">
                                    View details <ArrowRight size={14} />
                                </button>
                                <span className="text-lg font-extrabold text-[#1a1a2e]">₦{formData.price ? Number(formData.price).toLocaleString() : "0"}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-sm transition-colors shadow-sm mt-4"
                    >
                        {loading ? "Updating..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {modal && <CustomModal type={modal.type} message={modal.message} onClose={() => setModal(null)} />}
        </div>
    );
}
