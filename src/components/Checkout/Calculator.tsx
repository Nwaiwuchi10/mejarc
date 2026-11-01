"use client";

import React, { useState } from "react";
// import Image from "react-bootstrap/Image"; 

type Category = "Basic" | "Standard" | "Luxury";

interface CostItems {
  [key: string]: {
    [key in Category]: number;
  };
}

const costData: CostItems = {
  Substructure: { Basic: 55174, Standard: 75000, Luxury: 120000 },
  Superstructure: { Basic: 27587, Standard: 45000, Luxury: 85000 },
  Roof: { Basic: 135174, Standard: 180000, Luxury: 350000 },
  Doors: { Basic: 33498.5, Standard: 55000, Luxury: 110000 },
  Windows: { Basic: 17734.5, Standard: 30000, Luxury: 65000 },
  Finishes: { Basic: 15201, Standard: 25000, Luxury: 55000 },
  Decorations: { Basic: 58270.5, Standard: 85000, Luxury: 150000 },
  "Plumbing Installations": { Basic: 10134, Standard: 20000, Luxury: 45000 },
  "Electrical Installations": { Basic: 15201, Standard: 25000, Luxury: 55000 },
};

export default function Calculator() {
  const [activeCategory, setActiveCategory] = useState<Category>("Standard");

  const calculateTotal = () => {
    return Object.values(costData).reduce((sum, item) => sum + item[activeCategory], 0);
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm w-full max-w-5xl mx-auto my-10">
      <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">Construction Cost Calculator</h2>

      {/* Tabs */}
      <div className="flex bg-[#F9FAFB] p-1.5 rounded-xl mb-10 overflow-hidden">
        {["Basic", "Standard", "Luxury"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as Category)}
            className={`flex-1 py-4 text-sm font-bold rounded-lg transition-all ${
              activeCategory === cat
                ? "bg-[#3B82F6] text-white shadow-md shadow-blue-100"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Cost List */}
        <div className="flex-1 w-full space-y-5">
          <div className="flex justify-between text-base font-bold text-[#1a1a2e] pb-2 border-b border-gray-50">
            <span>Item</span>
            <span>Cost Estimates</span>
          </div>
          {Object.entries(costData).map(([item, values]) => (
            <div key={item} className="flex items-center justify-between group">
              <span className="text-sm font-medium text-gray-600 flex-1 relative bg-white pr-2 z-10">
                {item}
                <span className="absolute bottom-[4px] left-0 right-0 h-[1px] border-b border-dotted border-gray-300 -z-10 w-full" />
              </span>
              <span className="text-sm font-bold text-[#1a1a2e] pl-2 bg-white z-10">
                ₦ {values[activeCategory].toLocaleString()}
              </span>
            </div>
          ))}
          <div className="pt-8 mt-4 border-t-2 border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-xl font-extrabold text-[#1a1a2e]">Total</span>
              <span className="text-2xl font-black text-[#1a1a2e]">
                ₦{calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Illustration (Simulated with simple SVG/CSS for now as per design) */}
        <div className="flex-1 flex justify-center relative">
            {/* Using a placeholder SVG or illustration style derived from description */}
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
              {/* Illustration Components (Simplified) */}
              <div className="absolute inset-0 bg-[#F9FAFB] rounded-full scale-90 -z-10" />
              <div className="relative z-10 w-64 h-80 bg-[#FFD700] rounded-2xl shadow-xl flex flex-col p-4">
                <div className="w-full h-16 bg-white rounded-lg mb-4 flex items-center justify-end px-4">
                  <span className="text-2xl font-mono text-gray-400">1234.45</span>
                </div>
                <div className="grid grid-cols-3 gap-2 flex-1">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-[#1a1a2e] rounded-md opacity-80" />
                  ))}
                  <div className="bg-[#1a1a2e] rounded-md opacity-80" />
                  <div className="bg-[#1a1a2e] rounded-md opacity-80" />
                  <div className="bg-white/20 rounded-md" />
                </div>
              </div>
              
              {/* Floating Elements (Visual Polish) */}
              <div className="absolute top-0 right-0 w-12 h-12 text-gray-200"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg></div>
              <div className="absolute bottom-10 left-0 w-8 h-8 text-gray-200 rotate-45"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg></div>
              <div className="absolute top-1/4 left-0 w-16 h-16 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-sm">
                 <span className="text-yellow-500 text-xl font-bold">?</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
