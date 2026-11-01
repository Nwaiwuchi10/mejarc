"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import BuyPlansHeroSection from "./BuyPlansHeroSection";
import CategoryGrid from "./BuyPlansSubCategory";
import DesignsPage from "./DesignPage";

const Navbar = dynamic(() => import("@/src/components/Navbar/Navbar"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/src/components/Footer/Footer"), {
  ssr: false,
});

const BuyPlansPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<any>({
    planType: "",
    buildingGuides: "",
    numBedrooms: "",
    numBathrooms: "",
    numFloors: "",
    area: "",
    minPrice: "",
    maxPrice: "",
    designStyle: "",
    search: "",
  });

  useEffect(() => {
    const maxPriceParam = searchParams?.get("maxPrice");
    if (maxPriceParam) {
      setFilters((prev: any) => ({ ...prev, maxPrice: maxPriceParam }));
    }
  }, [searchParams]);

  return (
    <div>
      <Navbar />
      <main className="mt-14">
        <BuyPlansHeroSection onSearch={(term) => setFilters((prev: any) => ({ ...prev, search: term }))} />
      </main>
      <main className="w-full bg-[whitesmoke]">
        <CategoryGrid selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </main>
      <main className="w-full bg-[whitesmoke]">
        <DesignsPage selectedCategory={selectedCategory} filters={filters} setFilters={setFilters} />
      </main>
      <Footer />
    </div>
  );
};

export default BuyPlansPage;
