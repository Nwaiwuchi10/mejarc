"use client";

import React, { useState } from "react";
import { ArrowLeft, X, Clock, FileText, Activity, Maximize, Diamond } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ServiceContextPage() {
  const router = useRouter();
  const [selectedContext, setSelectedContext] = useState<string | null>(null);

  const contexts = [
    {
      title: "Residential Garden Design",
      description: "For private homes front yards, backyards, or personal gardens.",
    },
    {
      title: "Commercial Landscaping",
      description: "For estates, office complexes, or business environments that need a clean, professional outdoor look.",
    },
    {
      title: "Resort or Hospitality",
      description: "For hotels, resorts, or guest lodges where outdoor beauty adds to guest experience.",
    },
    {
      title: "Public Park",
      description: "For open public areas meant for relaxation, recreation, or community use.",
    },
  ];

  const steps = [
    { id: 1, title: "Service Context", icon: Clock, isActive: true },
    { id: 2, title: "Project Type", icon: FileText, isActive: false },
    { id: 3, title: "Scope & Deliverables", icon: Activity, isActive: false },
    { id: 4, title: "Size / Complexity", icon: Maximize, isActive: false },
    { id: 5, title: "Style", icon: Diamond, isActive: false },
  ];

  const handleNext = () => {
    // Navigate to next step placeholder
    if (selectedContext) {
      console.log("Selected:", selectedContext);
      // router.push("/custom-design/project-type");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col md:flex-row relative">
      
      {/* Top Floating Action Buttons (Back & Close) */}
      <div className="absolute top-6 left-6 md:left-10 z-20">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 shadow-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="absolute top-6 right-6 md:right-10 z-20">
        <button 
           onClick={() => router.push("/custom-design")}
           className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 shadow-sm text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Left Column - Main Content */}
      <div className="w-full md:w-[60%] lg:w-[65%] pt-28 px-6 md:px-16 lg:px-24 pb-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-black text-[#1a1a2e] mb-2 tracking-tight">
            Service Context
          </h1>
          <p className="text-sm font-medium text-gray-500 mb-12">
            What do you want us to design?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contexts.map((ctx, index) => (
              <div 
                key={index}
                onClick={() => setSelectedContext(ctx.title)}
                className={`cursor-pointer rounded-2xl p-6 md:p-8 border-2 transition-all duration-300 flex flex-col justify-start items-start text-left bg-white ${
                  selectedContext === ctx.title 
                  ? "border-[#3B82F6] shadow-xl shadow-blue-50 scale-[1.02]" 
                  : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                }`}
              >
                <h3 className="text-[15px] font-bold text-[#1a1a2e] mb-3 leading-tight">
                  {ctx.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium pr-4">
                  {ctx.description}
                </p>
              </div>
            ))}
          </div>

          {/* Optional continue button for mobile below the grid */}
          <div className="mt-12 md:hidden">
             <button
                onClick={handleNext}
                disabled={!selectedContext}
                className="w-full bg-[#1a1a2e] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
             >
               Next Step
             </button>
          </div>

        </div>
      </div>

      {/* Right Column - Stepper Sidebar */}
      <div className="w-full md:w-[40%] lg:w-[35%] bg-[#F9FBFF] min-h-screen pt-28 px-6 md:px-12 lg:px-16 pb-20 border-l border-blue-50">
        <div className="max-w-sm sticky top-28">
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Step 1</p>
          <h2 className="text-2xl md:text-3xl font-black text-[#1a1a2e] mb-12">
            Building Guide
          </h2>

          <div className="flex flex-col gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.id} 
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    step.isActive 
                    ? "bg-white shadow-lg shadow-gray-100 border border-white" 
                    : "bg-white/50 border border-transparent shadow-sm grayscale opacity-60"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.isActive ? "bg-[#F9FBFF]" : "bg-gray-100"}`}>
                     <Icon size={18} className={step.isActive ? "text-[#1a1a2e]" : "text-gray-400"} />
                  </div>
                  <span className={`text-sm font-bold ${step.isActive ? "text-[#1a1a2e]" : "text-gray-500"}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-16 hidden md:block">
             <button
                onClick={handleNext}
                disabled={!selectedContext}
                className="w-full bg-[#1a1a2e] text-white font-bold py-4 rounded-2xl shadow-xl shadow-gray-300 hover:bg-black hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
             >
               Confirm Selection
             </button>
          </div>
        </div>
      </div>

    </div>
  );
}
