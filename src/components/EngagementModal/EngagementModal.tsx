"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setEngagementModel } from "@/src/store/customDesignSlice";
import { CheckCircle2 } from "lucide-react";

import contestImg from "@/src/assests/images/engagement_contest.png";
import hireProImg from "@/src/assests/images/engagement_hire_pro.png";
import fixedQuoteImg from "@/src/assests/images/engagement_fixed_quote.png";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function EngagementModelPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [selected, setSelected] = useState<string | null>(null);

    const models = [
        {
            id: "contest",
            title: "Contest",
            description: "You post your project details, and several landscape designers submit their own concepts.",
            image: contestImg,
        },
        {
            id: "hire-pro",
            title: "Hire a Pro",
            description: "Work directly with one experienced designer from start to finish.",
            image: hireProImg,
        },
        {
            id: "fixed-quote",
            title: "Fixed Quote",
            description: "You share your project requirements, and a professional gives you a single fixed price for the entire job.",
            image: fixedQuoteImg,
        },
    ];

    const handleConfirm = () => {
        if (selected) {
            const modelTitle = models.find(m => m.id === selected)?.title || "";
            dispatch(setEngagementModel(modelTitle));
            router.push("/custom-design/agent-list");
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-white py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {models.map((model) => (
                            <div
                                key={model.id}
                                onClick={() => setSelected(model.id)}
                                className={`relative cursor-pointer bg-white rounded-3xl p-8 border-2 transition-all duration-300 flex flex-col items-center text-center ${selected === model.id
                                    ? "border-blue-500 shadow-xl shadow-blue-50 scale-[1.02]"
                                    : "border-gray-100 hover:border-gray-200 shadow-sm"
                                    }`}
                            >
                                <div className="absolute top-6 right-6">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selected === model.id ? "bg-blue-500 border-blue-500" : "bg-white border-gray-200"
                                        }`}>
                                        {selected === model.id && <CheckCircle2 size={16} color="white" />}
                                    </div>
                                </div>

                                <div className="w-full h-64 relative mb-6 rounded-2xl overflow-hidden">
                                    <Image
                                        src={model.image}
                                        alt={model.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-4">{model.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    {model.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleConfirm}
                            disabled={!selected}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 min-w-[240px]"
                        >
                            Confirm choice
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
