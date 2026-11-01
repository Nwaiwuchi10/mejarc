"use client";

import DesignGrid from "./DesignGrid";
import FilterSidebar from "./FilterSidebar";

interface DesignsPageProps {
  selectedCategory: string | null;
  filters: any;
  setFilters: (val: any) => void;
}

export default function DesignsPage({ selectedCategory, filters, setFilters }: DesignsPageProps) {
  return (
    <main className="bg-[whitesmoke] min-h-screen px-4 md:px-8 py-10 ">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 pb-8">
        {/* Filters */}
        <FilterSidebar filters={filters} setFilters={setFilters} />

        {/* Cards */}
        <DesignGrid selectedCategory={selectedCategory} filters={filters} />
      </div>
    </main>
  );
}
