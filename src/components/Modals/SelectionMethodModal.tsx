"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import robotImg from "../../assests/images/Robot.png";
import manualImg from "../../assests/images/manual.png";

interface SelectionMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory?: string | null;
}

export default function SelectionMethodModal({
  isOpen,
  onClose,
  selectedCategory,
}: SelectionMethodModalProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<"ai" | "manual" | null>(
    null,
  );

  const handleContinue = () => {
    if (!selectedMethod) return;
    try {
      if (typeof window !== "undefined") {
        if (selectedCategory) {
          localStorage.setItem("customDesignCategory", selectedCategory);
        }
        localStorage.setItem("customDesignMethod", selectedMethod);
      }
    } catch (e) {}

    // Navigate to category-specific page if manual is selected
    let navigationPath = `/custom-design/service-context?method=${selectedMethod}`;

    if (selectedMethod === "manual") {
      if (selectedCategory === "Building Guide") {
        navigationPath = `/custom-design/landscape/service-context?method=${selectedMethod}`;
      } else if (selectedCategory === "Product Design") {
        navigationPath = `/custom-design/interior/service-context?method=${selectedMethod}`;
      } else if (selectedCategory === "Product Design 2") {
        navigationPath = `/custom-design/interior-design/service-context?method=${selectedMethod}`;
      } else if (selectedCategory === "3D Rendering & Visualization") {
        navigationPath = `/custom-design/3drendering/service-context?method=${selectedMethod}`;
      } else if (selectedCategory === "2D Architectural Drawings") {
        navigationPath = `/custom-design/2darchitectural/service-context?method=${selectedMethod}`;
      } else if (selectedCategory === "Building Information Modeling") {
        navigationPath = `/custom-design/bim/service-context?method=${selectedMethod}`;
      } else if (selectedCategory === "Structural Engineering Drawings") {
        navigationPath = `/custom-design/structural/service-context?method=${selectedMethod}`;
      } else if (selectedCategory === "Mechanical & Electrical Drawings") {
        navigationPath = `/custom-design/mechanical-electrical/service-context?method=${selectedMethod}`;
      }
    }

    router.push(navigationPath);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative bg-[#F9FBFF] rounded-[32px] shadow-2xl w-full max-w-5xl h-auto flex flex-col md:flex-row overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-black transition-colors rounded-full shadow-sm hover:bg-gray-50"
            >
              <X size={16} strokeWidth={3} />
            </button>

            {/* Left Content */}
            <div className="w-full md:w-[35%] p-10 lg:p-14 flex flex-col justify-center order-2 md:order-1 relative bg-[#F9FBFF]">
              <div className="mb-10 lg:mb-16">
                <h2 className="text-3xl lg:text-4xl font-black text-[#1a1a2e] mb-6 leading-tight">
                  Customize Your
                  <br />
                  Dream House
                  <br />
                  Plan
                </h2>
                <p className="text-sm font-bold text-gray-400 leading-relaxed pr-4 uppercase tracking-tighter">
                  Select your prefered method to bring your dream home to life.
                </p>
              </div>

              <button
                onClick={handleContinue}
                disabled={!selectedMethod}
                className="w-full max-w-[200px] bg-[#3B82F6] text-white font-black py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
              >
                Continue
              </button>
            </div>

            {/* Right Content - Cards */}
            <div className="w-full md:w-[65%] p-8 lg:p-14 flex flex-col sm:flex-row gap-6 order-1 md:order-2 bg-white rounded-[32px] md:rounded-l-none md:rounded-r-[32px]">
              {/* AI Method Card */}
              <div
                onClick={() => setSelectedMethod("ai")}
                className={`flex-1 relative cursor-pointer bg-white rounded-3xl p-8 border-2 transition-all duration-300 flex flex-col items-center text-center ${
                  selectedMethod === "ai"
                    ? "border-[#3B82F6] shadow-xl shadow-blue-100/50 scale-[1.02]"
                    : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Radio Checkbox */}
                <div className="absolute top-6 right-6">
                  {selectedMethod === "ai" ? (
                    <CheckCircle2
                      className="w-6 h-6 text-[#3B82F6]"
                      fill="#3B82F6"
                      color="white"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-[8px] border-2 border-gray-200 bg-white" />
                  )}
                </div>

                {/* Illustration Placeholder */}
                <div className="w-full h-44 mb-6 bg-[#F9FBFF] rounded-2xl flex items-center justify-center border border-blue-50 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/50 opacity-50"></div>
                  <Image
                    src={robotImg}
                    alt="AI Method"
                    fill
                    unoptimized
                    className="object-contain p-2 md:p-4 z-10 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h3 className="text-sm font-black text-[#1a1a2e] mb-3">
                  AI Method
                </h3>
                <p className="text-[11px] text-gray-500 font-bold leading-relaxed px-2">
                  Our intelligent system helps you pick the best design options
                  automatically.
                </p>
              </div>

              {/* Manual Selection Card */}
              <div
                onClick={() => setSelectedMethod("manual")}
                className={`flex-1 relative cursor-pointer bg-white rounded-3xl p-8 border-2 transition-all duration-300 flex flex-col items-center text-center ${
                  selectedMethod === "manual"
                    ? "border-[#3B82F6] shadow-xl shadow-blue-100/50 scale-[1.02]"
                    : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Radio Checkbox */}
                <div className="absolute top-6 right-6">
                  {selectedMethod === "manual" ? (
                    <CheckCircle2
                      className="w-6 h-6 text-[#3B82F6]"
                      fill="#3B82F6"
                      color="white"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-[8px] border-2 border-gray-200 bg-white" />
                  )}
                </div>

                {/* Illustration Placeholder */}
                <div className="w-full h-44 mb-6 bg-gray-50/50 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-slate-50/50 opacity-50"></div>
                  <Image
                    src={manualImg}
                    alt="Manual Selection"
                    fill
                    unoptimized
                    className="object-contain p-2 md:p-4 z-10 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h3 className="text-sm font-black text-[#1a1a2e] mb-3">
                  Manual Selection
                </h3>
                <p className="text-[11px] text-gray-500 font-bold leading-relaxed px-2">
                  You personally select your preferred options from room types
                  and layout styles to design features.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
