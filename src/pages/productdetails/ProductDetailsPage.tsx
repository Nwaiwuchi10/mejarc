"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
    Star,
    BedDouble,
    Bath,
    Layers,
    Maximize,
    Share2,
    Heart,
    Info,
    Loader2,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import Api from "@/src/Utils/Api";
import { addItem } from "@/src/store/cartSlice";

const Navbar = dynamic(() => import("@/src/components/Navbar/Navbar"), { ssr: false });
const Footer = dynamic(() => import("@/src/components/Footer/Footer"), { ssr: false });

interface ProductDetailsPageProps {
    id: string;
}

export default function ProductDetailsPage({ id }: ProductDetailsPageProps) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await Api.get(`/marketproduct/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-white gap-4">
                <p className="text-gray-500 font-medium">Product not found.</p>
                <Link href="/plans" className="text-yellow-500 font-bold flex items-center gap-2">
                    <ArrowLeft size={18} /> Back to Plans
                </Link>
            </div>
        );
    }

    const includedPlans: Array<{ name: string; format: string }> = [];
    if (product.drawingSet?.includes("Architectural Plan")) {
        includedPlans.push({ name: "Architectural Plan", format: product.architecturalPlanFileType || "CAD + PDF" });
    }
    if (product.drawingSet?.includes("Structural Plan")) {
        includedPlans.push({ name: "Structural Plan", format: product.structuralPlanFileType || "CAD + PDF" });
    }
    if (product.drawingSet?.includes("Electrical Plan")) {
        includedPlans.push({ name: "Electrical Plan", format: product.electricalPlanFileType || "CAD + PDF" });
    }
    if (product.drawingSet?.includes("Mechanical Plan")) {
        includedPlans.push({ name: "Mechanical Plan", format: product.mechanicalPlanFileType || "CAD + PDF" });
    }
    if (includedPlans.length === 0) {
        includedPlans.push({ name: "Architectural Plan", format: product.architecturalPlanFileType || "CAD + PDF" });
    }

    const images = product.productImage || [];
    const mainImage = images[0] || "";
    const sideImages = images.slice(1, 5);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side - Content */}
                    <div className="flex-1 space-y-8">
                        {/* Image Gallery */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[300px] md:h-[500px]">
                            <div className="md:col-span-2 relative h-full rounded-2xl overflow-hidden shadow-sm">
                                <Image src={mainImage} alt={product.title} fill className="object-cover" unoptimized={true} />
                            </div>
                            <div className="hidden md:grid col-span-2 grid-cols-2 gap-4 h-full">
                                {sideImages.map((img: string, i: number) => (
                                    <div key={i} className="relative rounded-2xl overflow-hidden shadow-sm aspect-square bg-gray-100">
                                        <Image src={img} alt={`view-${i}`} fill className="object-cover" unoptimized={true} />
                                    </div>
                                ))}
                                {/* Placeholder if less than 5 images */}
                                {[...Array(Math.max(0, 4 - sideImages.length))].map((_, i) => (
                                    <div key={`placeholder-${i}`} className="bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-100">
                                        <Maximize size={24} className="text-gray-200" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Title & Actions */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
                                        Product ID: {product.productId || "BLP001"}
                                    </span>
                                    {product.agent?.businessName || product.agent?.user?.firstName ? (
                                        <span className="text-xs text-gray-500 font-medium">
                                            Vendor: <strong className="text-gray-700">{product.agent?.businessName || `${product.agent?.user?.firstName || ''} ${product.agent?.user?.lastName || ''}`.trim()}</strong>
                                        </span>
                                    ) : null}
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a2e]">
                                    {product.title}
                                </h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-2.5 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors border border-gray-100 hover:border-gray-200">
                                    <Share2 size={20} />
                                </button>
                                <button className="p-2.5 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-colors border border-gray-100 hover:border-gray-200">
                                    <Heart size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="flex flex-wrap items-center gap-y-4 gap-x-8 py-6 px-8 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <BedDouble size={18} />
                                <span className="text-xs font-bold whitespace-nowrap">{product.numBedrooms || 0} Bedroom</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Bath size={18} />
                                <span className="text-xs font-bold whitespace-nowrap">{product.numBathrooms || 0} Bathroom</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Layers size={18} />
                                <span className="text-xs font-bold whitespace-nowrap">{product.numFloors || 0} Floors</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Maximize size={18} />
                                <span className="text-xs font-bold whitespace-nowrap">
                                    {product.area ? (product.area.toLowerCase().includes("sqm") || product.area.toLowerCase().includes("m²") ? product.area : `${product.area} sqm`) : (product.size ? `${product.size} sqm` : "N/A")}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 h-10 px-4 bg-[#3B82F6] rounded-lg text-white font-bold ml-auto min-w-[140px] justify-center">
                                <span className="flex items-center gap-1">
                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                </span>
                                <span className="text-[10px] ml-1">{product.ratingCount || 162} reviews</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 p-8 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <h2 className="text-lg font-bold text-[#1a1a2e]">Product Descriptions</h2>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
                                {product.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Sidebar */}
                    <div className="w-full lg:w-[350px] space-y-6">
                        {/* Included Plans & Formats */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-[#1a1a2e]">Included Drawings & Formats</h3>
                            <div className="space-y-3">
                                {includedPlans.map((plan) => (
                                    <div key={plan.name} className="flex flex-col gap-1.5 p-3.5 bg-gray-50 border border-gray-100 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-[4px] bg-[#3B82F6] flex items-center justify-center text-white flex-shrink-0">
                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">
                                                {plan.name}
                                            </span>
                                        </div>
                                        <div className="pl-8 flex items-center gap-1.5 text-[10px] font-semibold text-gray-400">
                                            <span>FORMAT:</span>
                                            <span className="text-blue-600 font-bold uppercase">
                                                {plan.format}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Buy Now Button */}
                        <button 
                            onClick={() => {
                                dispatch(addItem({
                                    id: product.id,
                                    title: product.title,
                                    price: product.price,
                                    area: product.area,
                                    productImage: product.productImage || [],
                                    quantity: 1,
                                    fileType: includedPlans.map(p => `${p.name} (${p.format})`).join(", "),
                                    drawingSets: includedPlans.map(p => p.name),
                                    addOns: []
                                }));
                                router.push("/checkout");
                            }}
                            className="w-full bg-[#FFC700] hover:bg-[#e5b300] text-[#1a1a2e] font-extrabold py-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
                        >
                            Buy Now ₦{product.price.toLocaleString()}
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
