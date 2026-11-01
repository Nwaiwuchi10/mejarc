import React, { useState, useEffect } from "react";
import PlansDesignCard from "./PlansDesignCard";
import Api from "@/src/Utils/Api";
import { ChevronRight, Loader2 } from "lucide-react";

interface DesignGridProps {
  selectedCategory: string | null;
  filters: any;
}

export default function DesignGrid({ selectedCategory, filters }: DesignGridProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const fetchProducts = async (currentPage: number) => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory || filters.category || undefined;
      const apiParams: any = {
        page: currentPage,
        limit: limit,
        category: categoryParam,
        planType: filters.planType || undefined,
        buildingGuides: selectedCategory === "Building Guides" ? "true" : (filters.buildingGuides || undefined),
        numBedrooms: filters.numBedrooms || undefined,
        numBathrooms: filters.numBathrooms || undefined,
        numFloors: filters.numFloors || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        designStyle: filters.designStyle || undefined,
        search: filters.search || undefined,
      };

      const response = await Api.get("/marketproduct", {
        params: apiParams,
      });

      if (response.data) {
        setProducts(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, filters]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, selectedCategory, filters]);

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 3;

    for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
        pages.push(
            <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-10 h-10 border flex items-center justify-center text-sm font-medium transition-colors ${
                    page === i ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
            >
                {i}
            </button>
        );
    }

    if (totalPages > maxVisiblePages) {
        if (totalPages > maxVisiblePages + 1) {
            pages.push(
                <span key="ellipsis" className="w-10 h-10 flex items-center justify-center text-gray-400">
                    ...
                </span>
            );
        }
        pages.push(
            <button
                key={totalPages}
                onClick={() => setPage(totalPages)}
                className={`w-10 h-10 border flex items-center justify-center text-sm font-medium transition-colors ${
                    page === totalPages ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
            >
                {totalPages}
            </button>
        );
    }

    return (
        <div className="flex items-center gap-2 mt-12 justify-center">
            {pages}
            <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="w-10 h-10 border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
  };

  return (
    <div className="flex flex-col">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading designs...</p>
            </div>
        ) : products.length > 0 ? (
            <>
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <PlansDesignCard key={product.id} item={product} />
                    ))}
                </section>
                {totalPages > 1 && renderPagination()}
            </>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px] bg-white rounded-xl border border-gray-100 italic">
                <p className="text-gray-500">No designs found matching your criteria.</p>
            </div>
        )}
    </div>
  );
}
