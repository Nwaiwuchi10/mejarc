"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ArrowLeft, Search, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import ProductCard from "./components/ProductCard";
import { RootState } from "@/src/store/store";
import Api from "@/src/Utils/Api";


export default function VendorProducts() {
    const auth = useSelector((state: RootState) => state.auth);
    const agentId = auth.agentId || (typeof window !== "undefined" ? localStorage.getItem("agentId") : null);

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);

    const fetchProducts = useCallback(async (currentPage: number, searchTerm: string) => {
        if (!agentId) return;

        setLoading(true);
        try {
            const response = await Api.get(`/marketproduct/agent/${agentId}`, {
                params: {
                    page: currentPage,
                    limit: limit,
                    search: searchTerm || undefined
                }
            });

            if (response.data) {
                setProducts(response.data.data);
                setTotalPages(response.data.meta.totalPages);
                setTotal(response.data.meta.total);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [agentId, limit]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts(page, search);
        }, 500); // Debounce search

        return () => clearTimeout(timer);
    }, [page, search, fetchProducts]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(prev => prev + 1);
    };

    // Dummy metrics as requested
    const dummyMetrics = {
        views: 48,
        purchases: 9,
        earnings: "767,441"
    };

    return (
        <div className="p-4 md:p-8 bg-[#f5f6fa] min-h-screen">
            {/* Page Header Title */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-[#1a1a2e]">My Product Marketplace</h1>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Link
                        href="/vendor"
                        className="flex items-center justify-center w-10 h-10 bg-[#FFC700] rounded-full hover:bg-[#e5b300] transition-colors flex-shrink-0"
                    >
                        <ArrowLeft size={20} className="text-[#1a1a2e]" />
                    </Link>

                    <div className="relative flex-1 sm:w-64 md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full pl-12 pr-4 py-2.5 bg-white border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC700] transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="w-full sm:w-auto sm:ml-auto">
                    <Link
                        href="/vendor/products/upload"
                        className="w-full sm:w-auto bg-[#FFC700] hover:bg-[#e5b300] text-[#1a1a2e] font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Upload Product
                    </Link>
                </div>
            </div>

            {/* Products Count and Info */}
            {!loading && products.length > 0 && (
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-gray-500 font-medium">
                        Showing <span className="text-[#1a1a2e] font-bold">{products.length}</span> of <span className="text-[#1a1a2e] font-bold">{total}</span> products
                    </p>
                </div>
            )}

            {/* Products Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-[#FFC700] animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Loading your products...</p>
                </div>
            ) : products.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                productId={product.productId}
                                image={product.productImage?.[0] || ""}
                                title={product.title}
                                stats={{
                                    bathrooms: product.numBathrooms || "0",
                                    area: product.area,
                                    size: product.size || "0",
                                    floors: product.numFloors || "0",
                                    bedrooms: product.numBedrooms
                                }}
                                metrics={dummyMetrics}
                                price={product.price}
                                category={product.category}
                                status={product.status}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={page === 1}
                                className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <ChevronLeft size={20} className="text-[#1a1a2e]" />
                            </button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === p
                                            ? "bg-[#FFC700] text-[#1a1a2e] shadow-md"
                                            : "bg-white text-gray-400 hover:text-[#1a1a2e]"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                                className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <ChevronRight size={20} className="text-[#1a1a2e]" />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-[24px] p-12 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Search size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">No products found</h3>
                    <p className="text-gray-500 max-w-xs mb-8">
                        {search
                            ? `We couldn't find any products matching "${search}". Try a different search term.`
                            : "You haven't uploaded any products yet. Get started by clicking the upload button above."}
                    </p>
                    {!search && (
                        <Link
                            href="/vendor/products/upload"
                            className="bg-[#FFC700] hover:bg-[#e5b300] text-[#1a1a2e] font-bold py-3 px-8 rounded-xl transition-colors shadow-sm"
                        >
                            Upload First Product
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
