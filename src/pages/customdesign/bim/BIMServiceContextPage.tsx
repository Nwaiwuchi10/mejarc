"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  X,
  Clock,
  FileText,
  Activity,
  Maximize,
  Diamond,
  CheckCircle2,
  DollarSign,
  Paperclip,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateSelections, startFlow } from "@/src/store/customDesignSlice";

export default function BIMServiceContextPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    serviceContext: "",
    projectType: "",
    scopeDeliverables: [] as string[],
    sizeComplexity: "",
    style: "",
    budget: "",
    timeline: "",
    attachedFiles: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("bimCurrentStep");
      const savedSelections = localStorage.getItem("bimSelections");

      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }
      if (savedSelections) {
        try {
          const parsed = JSON.parse(savedSelections);
          setSelections(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Failed to parse bimSelections", e);
        }
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever selections or step changes
  useEffect(() => {
    if (!isLoading && typeof window !== "undefined") {
      localStorage.setItem("bimCurrentStep", currentStep.toString());
      localStorage.setItem("bimSelections", JSON.stringify(selections));
    }
  }, [currentStep, selections, isLoading]);

  const steps = [
    { id: 1, title: "Service Context", icon: Clock },
    { id: 2, title: "Project Type", icon: FileText },
    { id: 3, title: "Scope & Deliverables", icon: Activity },
    { id: 4, title: "Size / Complexity", icon: Maximize },
    { id: 5, title: "Style", icon: Diamond },
    { id: 6, title: "Budget & Timeline", icon: DollarSign },
  ];

  // Step 1: Service Context Data - BIM Specific
  const contexts = [
    {
      title: "Architectural BIM Modeling",
      description:
        "Creation of a detailed 3D digital model of the architectural design.",
    },
    {
      title: "Structural BIM Modeling",
      description:
        "3D modeling of beams, columns, slabs, and structural elements.",
    },
    {
      title: "MEP (Mechanical, Electrical, Plumbing)",
      description:
        "Integrated modeling of building services to avoid clashes during construction.",
    },
    {
      title: "Full Project BIM Integration",
      description:
        "Complete coordination of architecture, structure, and MEP into one intelligent model.",
    },
  ];

  // Step 2: Project Type Data - BIM Specific
  const projectTypes = [
    {
      title: "Residential Building",
      description: "BIM modeling for houses or apartment buildings.",
    },
    {
      title: "Commercial Building",
      description: "BIM modeling for offices, retail, or business spaces.",
    },
    {
      title: "Institutional Project",
      description: "BIM modeling for schools, hospitals, or public facilities.",
    },
    {
      title: "Industrial / Infrastructure",
      description:
        "BIM modeling for factories, warehouses, or large infrastructure projects.",
    },
  ];

  // Step 3: Scope & Deliverables Data - BIM Specific
  const scopes = [
    {
      title: "Basic Package – LOD 200",
      description:
        "Basic 3D model showing general building elements and layout.",
    },
    {
      title: "Intermediate Package – LOD 300",
      description:
        "Detailed model including architectural, structural, and MEP integration.",
    },
    {
      title: "Advanced Package – LOD 400/500",
      description:
        "Complete model with all details ready for fabrication and construction.",
    },
  ];

  const addons = [
    {
      title: "IFC Export File",
      included: selections.scopeDeliverables.includes("IFC Export File"),
    },
    {
      title: "3D Coordination Review",
      included: selections.scopeDeliverables.includes("3D Coordination Review"),
    },
    {
      title: "Net Zero Compliance Analysis",
      included: selections.scopeDeliverables.includes(
        "Net Zero Compliance Analysis",
      ),
    },
  ];

  // Step 4: Size / Complexity Data - BIM Specific
  const sizes = [
    {
      title: "Single Dwelling",
      description: "One standalone building project.",
    },
    {
      title: "Multi-Unit Building",
      description: "Building with multiple units or apartments.",
    },
    {
      title: "High-Rise / Complex Facility",
      description: "Large or technically complex multi-storey project.",
    },
  ];

  // Step 5: Style Data - BIM Specific
  const styles = [
    {
      title: "ISO 19650 BIM Standards",
      description: "International standard for BIM information management.",
    },
    {
      title: "IFC Model Standards",
      description: "Global file standard for BIM collaboration.",
    },
    {
      title: "Nigerian / UK Building Codes",
      description: "Compliance with national construction regulations.",
    },
    {
      title: "Sustainable / Net Zero Design Integration",
      description:
        "Modeling aligned with environmental and energy-efficiency goals.",
    },
  ];

  const handleServiceContextSelect = (title: string) => {
    setSelections((prev) => ({ ...prev, serviceContext: title }));
    setCurrentStep(2);
  };

  const handleProjectTypeSelect = (title: string) => {
    setSelections((prev) => ({ ...prev, projectType: title }));
    setCurrentStep(3);
  };

  const handleScopeSelect = (title: string) => {
    setSelections((prev) => ({ ...prev, scopeDeliverables: [title] }));
    // Auto-advance after selection
    setTimeout(() => setCurrentStep(4), 300);
  };

  const handleAddonToggle = (title: string) => {
    setSelections((prev) => {
      const existingAddons = prev.scopeDeliverables.filter(
        (s) =>
          s !== "Basic Package – LOD 200" &&
          s !== "Intermediate Package – LOD 300" &&
          s !== "Advanced Package – LOD 400/500",
      );
      const included = existingAddons.includes(title);
      const basePackage = prev.scopeDeliverables.filter(
        (s) =>
          s === "Basic Package – LOD 200" ||
          s === "Intermediate Package – LOD 300" ||
          s === "Advanced Package – LOD 400/500",
      );
      return {
        ...prev,
        scopeDeliverables: included
          ? [...basePackage, ...existingAddons.filter((a) => a !== title)]
          : [...basePackage, ...existingAddons, title],
      };
    });
  };

  const handleSizeComplexitySelect = (title: string) => {
    setSelections((prev) => ({ ...prev, sizeComplexity: title }));
    setCurrentStep(5);
  };

  const handleStyleSelect = (title: string) => {
    setSelections((prev) => {
      const updated = { ...prev, style: title };
      return updated;
    });
    // Auto-advance after selection
    setTimeout(() => setCurrentStep(6), 300);
  };

  const handleScopeNext = () => {
    const hasBasePackage = selections.scopeDeliverables.some(
      (s) =>
        s === "Basic Package – LOD 200" ||
        s === "Intermediate Package – LOD 300" ||
        s === "Advanced Package – LOD 400/500",
    );
    if (hasBasePackage) {
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  if (isLoading) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col lg:flex-row relative">
      {/* Top Floating Action Buttons */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:left-10 z-20">
        <button
          onClick={handlePrevStep}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 shadow-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={16} className="sm:block hidden" />
          <ArrowLeft size={14} className="sm:hidden block" />
        </button>
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:right-10 z-20">
        <button
          onClick={() => router.push("/custom-design")}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 shadow-sm text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
        >
          <X size={16} className="sm:block hidden" />
          <X size={14} className="sm:hidden block" />
        </button>
      </div>

      {/* Left Column - Main Content */}
      <div className="w-full lg:w-[60%] pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 pb-16 sm:pb-20">
        <div className="max-w-3xl">
          {/* Step 1: Service Context */}
          {currentStep === 1 && (
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a1a2e] mb-2 tracking-tight">
                Service Context
              </h1>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-8 sm:mb-12">
                What do you want us to design?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {contexts.map((ctx, index) => (
                  <div
                    key={index}
                    onClick={() => handleServiceContextSelect(ctx.title)}
                    className={`cursor-pointer rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 transition-all duration-300 flex flex-col justify-start items-start text-left bg-white ${
                      selections.serviceContext === ctx.title
                        ? "border-[#3B82F6] shadow-xl shadow-blue-50 scale-[1.02]"
                        : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#1a1a2e] mb-2 sm:mb-3 leading-tight">
                      {ctx.title}
                    </h3>
                    <p className="text-xs sm:text-xs md:text-sm text-gray-500 leading-relaxed font-medium pr-2 sm:pr-4">
                      {ctx.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Project Type */}
          {currentStep === 2 && (
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a1a2e] mb-2 tracking-tight">
                Project Type
              </h1>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-8 sm:mb-12">
                What kind of building are you looking to model?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {projectTypes.map((project, index) => (
                  <div
                    key={index}
                    onClick={() => handleProjectTypeSelect(project.title)}
                    className={`cursor-pointer rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 transition-all duration-300 flex flex-col justify-start items-start text-left bg-white ${
                      selections.projectType === project.title
                        ? "border-[#3B82F6] shadow-xl shadow-blue-50 scale-[1.02]"
                        : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#1a1a2e] mb-2 sm:mb-3 leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-xs md:text-sm text-gray-500 leading-relaxed font-medium pr-2 sm:pr-4">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Scope & Deliverables */}
          {currentStep === 3 && (
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a1a2e] mb-2 tracking-tight">
                Scope & Deliverables
              </h1>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-8 sm:mb-12">
                What level of detail do you need?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {scopes.map((scope, index) => (
                  <div
                    key={index}
                    onClick={() => handleScopeSelect(scope.title)}
                    className={`cursor-pointer rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 transition-all duration-300 flex flex-col justify-start items-start text-left bg-white ${
                      selections.scopeDeliverables.includes(scope.title)
                        ? "border-[#3B82F6] shadow-xl shadow-blue-50 scale-[1.02]"
                        : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#1a1a2e] mb-2 sm:mb-3 leading-tight">
                      {scope.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {scope.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <p className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-wide">
                  Optional Add-ons
                </p>
                <div className="space-y-3">
                  {addons.map((addon, index) => (
                    <div
                      key={index}
                      onClick={() => handleAddonToggle(addon.title)}
                      className="flex items-center gap-3 p-3 sm:p-4 border-2 border-gray-100 rounded-lg sm:rounded-xl cursor-pointer hover:border-gray-200 transition-all bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={selections.scopeDeliverables.includes(
                          addon.title,
                        )}
                        onChange={() => {}}
                        className="w-4 h-4 rounded"
                      />
                      <label className="text-xs sm:text-sm font-bold text-[#1a1a2e] cursor-pointer">
                        {addon.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 sm:mt-12 lg:hidden">
                <button
                  onClick={handleScopeNext}
                  disabled={
                    !selections.scopeDeliverables.some(
                      (s) =>
                        s === "Basic Package – LOD 200" ||
                        s === "Intermediate Package – LOD 300" ||
                        s === "Advanced Package – LOD 400/500",
                    )
                  }
                  className="w-full bg-[#1a1a2e] text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 text-sm sm:text-base"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Size / Complexity */}
          {currentStep === 4 && (
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a1a2e] mb-2 tracking-tight">
                Size / Complexity
              </h1>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-8 sm:mb-12">
                How big is your project?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {sizes.map((size, index) => (
                  <div
                    key={index}
                    onClick={() => handleSizeComplexitySelect(size.title)}
                    className={`cursor-pointer rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 transition-all duration-300 flex flex-col justify-start items-start text-left bg-white ${
                      selections.sizeComplexity === size.title
                        ? "border-[#3B82F6] shadow-xl shadow-blue-50 scale-[1.02]"
                        : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#1a1a2e] mb-2 sm:mb-3 leading-tight">
                      {size.title}
                    </h3>
                    <p className="text-xs sm:text-xs md:text-sm text-gray-500 leading-relaxed font-medium pr-2 sm:pr-4">
                      {size.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Style */}
          {currentStep === 5 && (
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a1a2e] mb-2 tracking-tight">
                Style / Standards / Regulations
              </h1>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-8 sm:mb-12">
                What standard does your project follow?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {styles.map((style, index) => (
                  <div
                    key={index}
                    onClick={() => handleStyleSelect(style.title)}
                    className={`cursor-pointer rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 transition-all duration-300 flex flex-col justify-start items-start text-left bg-white relative ${
                      selections.style === style.title
                        ? "border-[#3B82F6] shadow-xl shadow-blue-50 scale-[1.02]"
                        : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {/* Checkmark for selected style */}
                    {selections.style === style.title && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 rounded-full bg-[#3B82F6] flex items-center justify-center">
                          <CheckCircle2
                            size={20}
                            color="white"
                            fill="#3B82F6"
                          />
                        </div>
                      </div>
                    )}
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#1a1a2e] mb-2 sm:mb-3 leading-tight">
                      {style.title}
                    </h3>
                    <p className="text-xs sm:text-xs md:text-sm text-gray-500 leading-relaxed font-medium pr-2 sm:pr-4">
                      {style.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 sm:mt-12 lg:hidden mb-8">
                <button
                  onClick={() => {
                    console.log("All selections:", selections);
                  }}
                  disabled={!selections.style}
                  className="w-full bg-[#3B82F6] text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 text-sm sm:text-base"
                >
                  Complete
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Budget & Timeline */}
          {currentStep === 6 && (
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a1a2e] mb-2 tracking-tight">
                Budget
              </h1>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-8 sm:mb-12">
                What budget are you working with for this project?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12">
                {/* Minimum Budget */}
                <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-gray-100 bg-white">
                  <h3 className="text-sm sm:text-[15px] font-bold text-[#1a1a2e] mb-3 leading-tight">
                    Minimum Budget
                  </h3>
                  <p className="text-lg sm:text-xl font-bold text-[#3B82F6]">
                    ₦500,000
                  </p>
                </div>

                {/* Your Budget Input */}
                <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-gray-100 bg-white">
                  <h3 className="text-sm sm:text-[15px] font-bold text-[#1a1a2e] mb-3 leading-tight">
                    Your Budget
                  </h3>
                  <input
                    type="number"
                    placeholder="(₦) Type the amount"
                    value={selections.budget}
                    onChange={(e) =>
                      setSelections((prev) => ({
                        ...prev,
                        budget: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#3B82F6] focus:outline-none text-base text-gray-900 bg-white placeholder-gray-400 min-h-[44px] appearance-none"
                  />
                </div>
              </div>

              {/* Timeline Section */}
              <h2 className="text-xl sm:text-2xl font-black text-[#1a1a2e] mb-6">
                Timeline
              </h2>
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-6">
                What timeline are you working with for this project?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {/* One Week */}
                <div
                  onClick={() =>
                    setSelections((prev) => ({
                      ...prev,
                      timeline: "One Week",
                    }))
                  }
                  className={`cursor-pointer rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 transition-all duration-300 flex flex-col items-center justify-center text-center bg-white ${
                    selections.timeline === "One Week"
                      ? "border-[#3B82F6] shadow-xl shadow-blue-50"
                      : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  <Clock size={24} className="mb-2 text-[#3B82F6]" />
                  <p className="text-sm font-bold text-[#1a1a2e]">One Week</p>
                </div>

                {/* 1 Month */}
                <div
                  onClick={() =>
                    setSelections((prev) => ({
                      ...prev,
                      timeline: "1 Month",
                    }))
                  }
                  className={`cursor-pointer rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 transition-all duration-300 flex flex-col items-center justify-center text-center bg-white ${
                    selections.timeline === "1 Month"
                      ? "border-[#3B82F6] shadow-xl shadow-blue-50"
                      : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  <Zap size={24} className="mb-2 text-[#3B82F6]" />
                  <p className="text-sm font-bold text-[#1a1a2e]">1 Month</p>
                </div>

                {/* Custom Timeline */}
                <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-gray-100 bg-white flex flex-col items-center justify-center">
                  <Activity size={24} className="mb-2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Type timeline"
                    value={
                      selections.timeline !== "One Week" &&
                      selections.timeline !== "1 Month"
                        ? (selections.timeline || "")
                        : ""
                    }
                    onChange={(e) =>
                      setSelections((prev) => ({
                        ...prev,
                        timeline: e.target.value,
                      }))
                    }
                    className="w-full px-2 py-1 text-base text-center border-0 focus:outline-none placeholder-gray-400 bg-white text-gray-900 appearance-none"
                  />
                </div>
              </div>

              {/* Additional Information & Attached Files */}
              <div className="flex gap-4 mb-8">
                <button className="text-xs font-bold text-gray-600 pb-2 border-b-2 border-gray-300 hover:border-gray-400">
                  Additional Information
                </button>
                <button className="text-xs font-bold text-gray-600 pb-2 hover:border-b-2 hover:border-gray-300 flex items-center gap-1">
                  <Paperclip size={14} />
                  Attached
                </button>
              </div>

              <div className="mt-8 sm:mt-12 lg:hidden mb-8">
                <button
                  onClick={() => {
                    dispatch(updateSelections(selections));
                    dispatch(startFlow({ category: "BIM", lastPath: "/custom-design/engagement-model" }));
                    router.push("/custom-design/engagement-model");
                  }}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg active:scale-95 transition-all text-sm sm:text-base"
                >
                  Generate Estimate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-[40%] bg-[#F9FBFF] min-h-screen pt-16 sm:pt-20 md:pt-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-16 sm:pb-20 border-t lg:border-t-0 lg:border-l border-blue-50">
        <div className="max-w-sm mx-auto lg:mx-0 lg:sticky lg:top-28">
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
            Step {currentStep}
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1a1a2e] mb-8 sm:mb-12">
            Building Information
            <br />
            Modeling (BIM)
          </h2>

          <div className="flex flex-col gap-3 sm:gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted =
                (step.id === 1 && selections.serviceContext) ||
                (step.id === 2 && selections.projectType) ||
                (step.id === 3 && selections.scopeDeliverables.length > 0) ||
                (step.id === 4 && selections.sizeComplexity) ||
                (step.id === 5 && selections.style) ||
                (step.id === 6 && selections.budget && selections.timeline);

              return (
                <div
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-2xl transition-all cursor-pointer ${
                    step.id === currentStep
                      ? "bg-white shadow-lg shadow-gray-100 border border-white"
                      : isCompleted
                        ? "bg-green-50 border-green-200 shadow-sm hover:shadow-md"
                        : "bg-white/50 border border-transparent shadow-sm grayscale opacity-60"
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.id === currentStep
                        ? "bg-[#F9FBFF]"
                        : isCompleted
                          ? "bg-green-200"
                          : "bg-gray-100"
                    }`}
                  >
                    {isCompleted && step.id !== currentStep ? (
                      <span className="text-xs font-bold text-green-700">
                        ✓
                      </span>
                    ) : (
                      <>
                        <Icon
                          size={16}
                          className={`sm:block hidden ${
                            step.id === currentStep
                              ? "text-[#1a1a2e]"
                              : isCompleted
                                ? "text-green-700"
                                : "text-gray-400"
                          }`}
                        />
                        <Icon
                          size={14}
                          className={`sm:hidden block ${
                            step.id === currentStep
                              ? "text-[#1a1a2e]"
                              : isCompleted
                                ? "text-green-700"
                                : "text-gray-400"
                          }`}
                        />
                      </>
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      step.id === currentStep
                        ? "text-[#1a1a2e]"
                        : isCompleted
                          ? "text-green-700"
                          : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Summary Section */}
          {(currentStep === 5 || currentStep === 6) && selections.style && (
            <div className="mt-8 p-4 bg-white rounded-xl border border-green-100 shadow-sm">
              <p className="text-xs font-bold text-green-700 mb-3 uppercase tracking-wide">
                Selection Summary
              </p>
              <div className="space-y-2">
                {selections.serviceContext && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-700">
                        Service Context
                      </p>
                      <p className="text-xs text-gray-500">
                        {selections.serviceContext}
                      </p>
                    </div>
                  </div>
                )}
                {selections.projectType && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-700">
                        Project Type
                      </p>
                      <p className="text-xs text-gray-500">
                        {selections.projectType}
                      </p>
                    </div>
                  </div>
                )}
                {selections.scopeDeliverables.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-700">
                        Scope & Deliverables
                      </p>
                      <p className="text-xs text-gray-500">
                        {selections.scopeDeliverables.join(", ")}
                      </p>
                    </div>
                  </div>
                )}
                {selections.sizeComplexity && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-700">
                        Size / Complexity
                      </p>
                      <p className="text-xs text-gray-500">
                        {selections.sizeComplexity}
                      </p>
                    </div>
                  </div>
                )}
                {selections.style && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-700">Style</p>
                      <p className="text-xs text-gray-500">
                        {selections.style}
                      </p>
                    </div>
                  </div>
                )}
                {selections.budget && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-700">Budget</p>
                      <p className="text-xs text-gray-500">
                        ₦{selections.budget}
                      </p>
                    </div>
                  </div>
                )}
                {selections.timeline && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-700">
                        Timeline
                      </p>
                      <p className="text-xs text-gray-500">
                        {selections.timeline}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Desktop Buttons */}
          <div className="mt-12 sm:mt-16 hidden lg:flex flex-col gap-3">
            {currentStep === 3 ? (
              <button
                onClick={handleScopeNext}
                disabled={
                  !selections.scopeDeliverables.some(
                    (s) =>
                      s === "Basic Package – LOD 200" ||
                      s === "Intermediate Package – LOD 300" ||
                      s === "Advanced Package – LOD 400/500",
                  )
                }
                className="w-full bg-[#1a1a2e] text-white font-bold py-4 rounded-2xl shadow-xl shadow-gray-300 hover:bg-black hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
              >
                Next Step
              </button>
            ) : currentStep === 5 ? (
              <button
                onClick={() => setCurrentStep(6)}
                disabled={!selections.style}
                className="w-full bg-[#3B82F6] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-300 hover:bg-blue-700 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
              >
                Proceed to Budget
              </button>
            ) : currentStep === 6 ? (
              <button
                onClick={() => {
                  dispatch(updateSelections(selections));
                  dispatch(startFlow({ category: "BIM", lastPath: "/custom-design/engagement-model" }));
                  router.push("/custom-design/engagement-model");
                }}
                disabled={!selections.budget || !selections.timeline}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-2xl shadow-xl shadow-yellow-300 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
              >
                Generate Estimate
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && !selections.serviceContext) ||
                  (currentStep === 2 && !selections.projectType) ||
                  (currentStep === 4 && !selections.sizeComplexity)
                }
                className="w-full bg-[#1a1a2e] text-white font-bold py-4 rounded-2xl shadow-xl shadow-gray-300 hover:bg-black hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
              >
                Confirm Selection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
