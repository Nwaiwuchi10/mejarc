"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

const accordionItems = [
  "Plan Type",
  "Product Category",
  "Number of Bedrooms",
  "Number of Bathrooms",
  "Number of Floors",
  "Prices",
  "Design Style",
];

interface FilterSidebarProps {
  filters: any;
  setFilters: (val: any) => void;
}

export default function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const [open, setOpen] = useState<string | null>(null);

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      planType: "",
      category: "",
      buildingGuides: "",
      numBedrooms: "",
      numBathrooms: "",
      numFloors: "",
      area: "",
      minPrice: "",
      maxPrice: "",
      designStyle: "",
    });
  };

  return (
    <aside className="bg-white rounded-xl shadow-sm p-4 max-h-fit">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-black">
          <SlidersHorizontal size={16} />
          Filters
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-black bg-[#0000000D] border hover:bg-gray-100 transition px-3 py-1 rounded-md font-semibold cursor-pointer"
        >
          Reset
        </button>
      </div>

      <div className="space-y-3">
        {accordionItems.map((item) => {
          const isOpen = open === item;

          return (
            <div
              key={item}
              className="border bg-[#0000000D] rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? null : item)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-black"
              >
                {item}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500">
                  {isOpen ? (
                    <ChevronUp size={14} className="text-black" />
                  ) : (
                    <ChevronDown size={14} className="text-black" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-gray-700 bg-white border-t border-gray-100 space-y-3">
                  {item === "Plan Type" && (
                    <div className="space-y-2 pt-1">
                      {["Residential", "Commercial", "Industrial"].map((t) => (
                        <label key={t} className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                          <input
                            type="radio"
                            name="planType"
                            checked={filters.planType === t}
                            onChange={() => handleFilterChange("planType", t)}
                            className="accent-black"
                          />
                          {t}
                        </label>
                      ))}
                    </div>
                  )}

                  {item === "Product Category" && (
                    <div className="space-y-2 pt-1">
                      {["Building Plan", "Product Design", "Building Guide"].map((c) => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                          <input
                            type="radio"
                            name="category"
                            checked={filters.category === c}
                            onChange={() => handleFilterChange("category", c)}
                            className="accent-black"
                          />
                          {c}
                        </label>
                      ))}
                    </div>
                  )}

                  {item === "Number of Bedrooms" && (
                    <select
                      value={filters.numBedrooms}
                      onChange={(e) => handleFilterChange("numBedrooms", e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none"
                    >
                      <option value="">Select Bedroom count</option>
                      {["1-Bedroom", "2-Bedroom", "3-Bedroom", "4-Bedroom", "5-Bedroom"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  )}

                  {item === "Number of Bathrooms" && (
                    <select
                      value={filters.numBathrooms}
                      onChange={(e) => handleFilterChange("numBathrooms", e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none"
                    >
                      <option value="">Select Bathroom count</option>
                      {["1-Bathroom", "2-Bathroom", "3-Bathroom", "4-Bathroom"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  )}

                  {item === "Number of Floors" && (
                    <select
                      value={filters.numFloors}
                      onChange={(e) => handleFilterChange("numFloors", e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none"
                    >
                      <option value="">Select floor count</option>
                      {["1", "2", "3", "4"].map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  )}

                  {item === "Prices" && (
                    <div className="space-y-2 pt-1">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min Price (₦)"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                          className="w-1/2 p-2 border border-gray-200 rounded-lg text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Max Price (₦)"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                          className="w-1/2 p-2 border border-gray-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {item === "Design Style" && (
                    <div className="space-y-2 pt-1">
                      {["Modern", "Contemporary", "Traditional", "Minimalist"].map((style) => (
                        <label key={style} className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                          <input
                            type="radio"
                            name="designStyle"
                            checked={filters.designStyle === style}
                            onChange={() => handleFilterChange("designStyle", style)}
                            className="accent-black"
                          />
                          {style}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
