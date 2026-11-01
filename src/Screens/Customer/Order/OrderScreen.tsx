"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2, LayoutDashboard, ShoppingBag, ChevronRight, Armchair, Table, Bed, Check, X, Maximize } from "lucide-react";
import Api from "@/src/Utils/Api";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import OrderDetailsModal from "@/src/components/Modals/OrderDetailsModal";
import { COMPANY_CONTACT_INFO } from "@/src/components/CompanyContact/CompanyContact";
interface Product {
  id: string;
  title: string;
  category: string;
  productImage: string[];
  description: string;
  price: string;
  numBedrooms?: string;
  numBathrooms?: string;
  numFloors?: string;
  area?: string;
  designStyle?: string;
  fileType?: string;
  drawingSet?: string[];
  addOns?: string[];
  architecturalPlan?: string[];
  structuralPlan?: string[];
  electricalPlan?: string[];
  mechanicalPlan?: string[];
}

interface OrderItem {
  id: string;
  productId: string;
  totalQuantity: number;
  totalPrice: string;
  product: Product;
}

interface Order {
  id: string;
  userId: string;
  grandTotal: string;
  createdAt: string;
  orderItems: OrderItem[];
  isPaid: boolean;
}

interface MarketProduct {
  id?: string;
  _id?: string;
  title?: string;
  productName?: string;
  price: number;
  productImage: string[];
  category: string;
  numBedrooms?: string | number;
  numBathrooms?: string | number;
  numFloors?: string | number;
  area?: string;
}

const tabs = ["All", "Building Plan", "Product Design", "Building Guides"];

export default function OrderScreen() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendingProducts, setTrendingProducts] = useState<MarketProduct[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingPage, setTrendingPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [showAddOnsModal, setShowAddOnsModal] = useState(false);
  const [targetPaidOrder, setTargetPaidOrder] = useState<Order | null>(null);
  const [selectedAddOn, setSelectedAddOn] = useState<string | null>(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [referencePics, setReferencePics] = useState<File[]>([]);
  const [inquiryUploading, setInquiryUploading] = useState(false);
  const referencePicsRef = useRef<HTMLInputElement>(null);

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.user) {
      setInquiryName(`${auth.user.firstName || ""} ${auth.user.lastName || ""}`.trim());
      setInquiryEmail(auth.user.email || "");
      setInquiryPhone((auth.user as any).phone || (auth.user as any).phoneNumber || "");
    }
  }, [auth.user]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.userId || !auth.userToken) return;

      try {
        setLoading(true);
        const response = await Api.get("/order/pag/all/user", {
          params: { page: 1 },
          headers: {
            Authorization: `Bearer ${auth.userToken}`
          }
        });
        const orderData = Array.isArray(response.data) ? response.data : response.data.data || [];
        setOrders(orderData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth.userId, auth.userToken]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const paidOrder = orders.find(o => o.isPaid);
      if (paidOrder) {
        setTargetPaidOrder(paidOrder);
        const timer = setTimeout(() => {
          const alreadyShown = sessionStorage.getItem(`addOnsModalShown-${paidOrder.id}`);
          if (!alreadyShown) {
            setShowAddOnsModal(true);
            sessionStorage.setItem(`addOnsModalShown-${paidOrder.id}`, "true");
          }
        }, 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [orders]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setTrendingLoading(true);
        const response = await Api.get("/marketproduct", {
          params: { page: trendingPage, limit: 10 },
          headers: {
            Authorization: `Bearer ${auth.userToken}`
          }
        });
        if (response.data && response.data.data) {
          // Display only 3 items as requested
          const newProducts = response.data.data.slice(0, 3);
          if (newProducts.length > 0) {
            setTrendingProducts(newProducts);
          } else if (trendingPage > 1) {
            // Reset to page 1 if no more products
            setTrendingPage(1);
          }
        }
      } catch (error: any) {
        console.error("Error fetching trending products:", error);
      } finally {
        setTrendingLoading(false);
      }
    };

    fetchTrending();
  }, [trendingPage]);

  const handleDownloadDeliverables = async (order: Order) => {
    const product = order.orderItems?.[0]?.product;
    if (!product) return;

    const parseUrls = (field: any): string[] => {
      if (Array.isArray(field)) return field.filter(Boolean);
      if (typeof field === 'string' && field.trim().length > 0) {
        return field.includes(',') ? field.split(',').map((s: string) => s.trim()).filter(Boolean) : [field.trim()];
      }
      return [];
    };

    const urls = [
      ...parseUrls(product.architecturalPlan),
      ...parseUrls(product.structuralPlan),
      ...parseUrls(product.electricalPlan),
      ...parseUrls(product.mechanicalPlan),
    ];

    if (urls.length === 0) {
      alert("No downloadable files available for this product yet.");
      return;
    }

    // Trigger individual downloads with a small delay to avoid browser blocking
    urls.forEach((url, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = url;
        link.target = "_blank";
        // Extract filename from URL or use a default
        const fileName = url.split('/').pop() || `deliverable-${index + 1}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 800);
    });
  };

  const submitInquiry = async () => {
    if (!inquiryName || !inquiryEmail || !inquiryPhone || !inquiryMessage) {
      alert("Please fill in all details.");
      return;
    }

    setInquiryUploading(true);
    try {
      const data = new FormData();
      data.append("name", inquiryName);
      data.append("email", inquiryEmail);
      data.append("phone", inquiryPhone);
      data.append("subject", `Add-On Request: ${selectedAddOn} for Order #${targetPaidOrder?.id}`);

      const firstProduct = targetPaidOrder?.orderItems?.[0]?.product;
      const messageBody = `Add-On Selected: ${selectedAddOn}

Order Reference: ${targetPaidOrder?.id}
Order Date: ${new Date(targetPaidOrder?.createdAt || "").toLocaleDateString()}
Order Grand Total: ₦${parseFloat(targetPaidOrder?.grandTotal || "0").toLocaleString()}

Product Title: ${firstProduct?.title}
Product Price: ₦${parseFloat(firstProduct?.price || "0").toLocaleString()}
Product Category: ${firstProduct?.category}

User Note:
${inquiryMessage}`;

      data.append("message", messageBody);
      referencePics.forEach(file => data.append("images", file));

      // Post inquiry to backend contact route
      await Api.post("/contact", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      // Redirect to WhatsApp
      const encodedMsg = encodeURIComponent(
        `Hello, I would like to request an Add-On: *${selectedAddOn}* for my order *#${targetPaidOrder?.id}*.\n\n` +
        `*Order Details*:\n` +
        `- Plan Name: ${firstProduct?.title}\n` +
        `- Order Date: ${new Date(targetPaidOrder?.createdAt || "").toLocaleDateString()}\n` +
        `- Total: ₦${parseFloat(targetPaidOrder?.grandTotal || "0").toLocaleString()}\n\n` +
        `*My Specifications*:\n${inquiryMessage}\n\n` +
        `Please assist me in processing this request.`
      );
      const whatsappUrl = `https://wa.me/${COMPANY_CONTACT_INFO.whatsapp1}?text=${encodedMsg}`;
      window.open(whatsappUrl, "_blank");

      // Reset states
      setShowInquiryForm(false);
      setInquiryMessage("");
      setReferencePics([]);
    } catch (err) {
      console.error(err);
      alert("Failed to submit request.");
    } finally {
      setInquiryUploading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const items = order.orderItems || [];

    const matchesTab = activeTab === "All" || items.some(item => {
      const category = (item.product?.category || "Building Plan").toLowerCase().trim();
      const tabLower = activeTab.toLowerCase().trim();

      if (tabLower === "building plan") {
        return (
          category.includes("building") ||
          category.includes("plan") ||
          category.includes("residential") ||
          category.includes("commercial")
        );
      }
      if (tabLower === "product design") {
        return category.includes("product") || category.includes("design");
      }
      if (tabLower === "building guides") {
        return category.includes("guide");
      }
      return (
        category === tabLower ||
        category.replace(/s$/, "") === tabLower.replace(/s$/, "")
      );
    });

    const matchesSearch =
      (order.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      items.some(item => {
        const title = (item.product?.title || "").toLowerCase();
        const category = (item.product?.category || "").toLowerCase();
        return title.includes(searchQuery.toLowerCase()) || category.includes(searchQuery.toLowerCase());
      });

    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header: Tabs and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeTab === tab
                ? "bg-yellow-400 text-black shadow-sm"
                : "text-gray-500 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full md:max-w-[360px] shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by plan name, category"
            className="border-none bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
            <Loader2 className="animate-spin text-yellow-500" size={32} />
            <span className="text-sm font-medium">Loading orders...</span>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => {
            const firstItem = order.orderItems?.[0];
            const product = firstItem?.product;

            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col lg:flex-row p-6 lg:p-8 gap-8">
                  {/* Product Image */}
                  <div className="relative w-full lg:w-[280px] aspect-[4/3] flex-shrink-0">
                    {product?.productImage?.[0] ? (
                      <Image
                        src={product.productImage[0]}
                        alt={product.title || "Order"}
                        fill
                        className="object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-xl border border-gray-100">
                        <LayoutDashboard size={40} className="text-gray-200" />
                      </div>
                    )}
                  </div>

                  {/* Info and Actions */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          Product ID: {product?.productId || "BLP001"}
                        </span>
                        <span className="text-[11px] font-mono font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          Order ID: {order.orderNumber || (order.id ? 'ORD-' + String(order.id).replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase() : 'ORD-COMPLETED')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {product?.title || "Unknown Product"}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                        {product?.description || "No description available for this order."}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                      <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <span className="text-gray-400">Quantity: </span>
                        <span className="text-gray-900 font-bold">{firstItem?.totalQuantity || 1}</span>
                      </div>
                      {product?.area && (
                        <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          <span className="text-gray-400">Area: </span>
                          <span className="text-gray-900 font-bold">
                            {product.area.toLowerCase().includes("sqm") || product.area.toLowerCase().includes("m²") ? product.area : `${product.area} sqm`}
                          </span>
                        </div>
                      )}
                      <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <span className="text-gray-400">Status: </span>
                        <span className={`font-bold ${order.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 justify-center w-full lg:w-[200px]">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="w-full py-3 bg-yellow-400 rounded-xl text-sm font-bold text-black hover:bg-yellow-500 transition-colors shadow-sm"
                    >
                      View Details
                    </button>
                    {order.isPaid && (
                      <button 
                        onClick={() => handleDownloadDeliverables(order)}
                        className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Download Deliverables
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setTargetPaidOrder(order);
                        setSelectedAddOn("General Custom Extension");
                        setShowInquiryForm(true);
                      }}
                      className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Request Add-on
                    </button>
                  </div>
                </div>

                {/* Order Info Footer */}
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 lg:px-8">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-gray-900">{product?.category || "Building Plan"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="text-gray-900 font-bold text-base">₦{parseFloat(order.grandTotal || "0").toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 px-8 bg-white border border-gray-100 border-dashed rounded-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <ShoppingBag size={32} />
            </div>
            <div>
              <p className="text-gray-900 font-bold">No orders found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search query.</p>
            </div>
          </div>
        )}
      </div>

      {/* Explore Section */}
      <div className="mt-8 relative">
        <h3 className="text-2xl font-bold mb-8 text-[#111827]">
          Explore your interests
        </h3>

        <div className="flex items-center gap-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            {trendingLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((product) => {
                const productId = product.id || product._id || "";
                const productTitle = product.title || product.productName || "Building Plan";

                return (
                  <div key={productId || Math.random()} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <Link href={`/plans/${productId}`} className="block relative aspect-[4/3] rounded-xl overflow-hidden mb-4 group cursor-pointer">
                        <Image
                          src={product.productImage?.[0] || ""}
                          alt={productTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-[10px] font-bold text-gray-600 shadow-sm">
                          {product.category || "Building Plan"}
                        </div>
                      </Link>

                      <Link href={`/plans/${productId}`}>
                        <h4 className="text-sm font-bold text-gray-900 mb-4 line-clamp-1 hover:text-yellow-600 transition-colors">
                          {productTitle}
                        </h4>
                      </Link>

                      <div className="flex text-gray-800 flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-[10px] font-medium text-gray-400">
                        {product.numBedrooms ? (
                          <div className="flex items-center gap-1.5">
                            <Bed size={14} className="text-gray-500" />
                            <span>{product.numBedrooms} Beds</span>
                          </div>
                        ) : null}
                        {product.numBathrooms ? (
                          <div className="flex items-center gap-1.5">
                            <Table size={14} className="text-gray-500" />
                            <span>{product.numBathrooms} Baths</span>
                          </div>
                        ) : null}
                        {product.area ? (
                          <div className="flex items-center gap-1.5">
                            <Maximize size={14} className="text-gray-500" />
                            <span>{product.area.toLowerCase().includes("sqm") || product.area.toLowerCase().includes("m²") ? product.area : `${product.area} sqm`}</span>
                          </div>
                        ) : null}
                        {!product.numBedrooms && !product.numBathrooms && !product.area && (
                          <div className="flex items-center gap-1.5">
                            <Armchair size={14} className="text-gray-500" />
                            <span>Featured Plan</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
                      <Link
                        href={`/plans/${productId}`}
                        className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-lg text-[10px] font-bold text-black hover:bg-yellow-500 transition-colors shadow-sm"
                      >
                        View details <ChevronRight size={14} />
                      </Link>
                      <span className="text-sm font-bold text-gray-900">
                        ₦{product.price ? product.price.toLocaleString() : "0"}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                No trending products available
              </div>
            )}
          </div>

          {/* Pagination Arrow */}
          <button
            onClick={() => setTrendingPage(prev => prev + 1)}
            disabled={trendingLoading}
            className={`hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#1A335E] rounded-full items-center justify-center text-white shadow-xl hover:scale-110 transition-transform z-10 ${trendingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* Add Ons Timed Pop Modal */}
      {showAddOnsModal && targetPaidOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowAddOnsModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all animate-none"
            >
              <X size={18} />
            </button>
            <div className="text-center mb-6">
              <span className="inline-flex px-3 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-extrabold tracking-wider uppercase rounded-full mb-4">🚀 Enhancement</span>
              <h3 className="text-xl font-extrabold text-[#1a1a2e]">Enhance Your Building Plan</h3>
              <p className="text-xs text-gray-500 mt-2">Get professional design extensions customized for your plan: <strong className="text-gray-700">{targetPaidOrder.orderItems?.[0]?.product?.title}</strong>.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {["Construction Plans", "MEP Drawings", "3D Rendering", "Adaptability Services"].map(addon => (
                <button
                  key={addon}
                  onClick={() => {
                    setSelectedAddOn(addon);
                    setShowAddOnsModal(false);
                    setShowInquiryForm(true);
                  }}
                  className="w-full p-4 text-left border border-gray-100 rounded-2xl hover:border-yellow-400 hover:bg-yellow-50/10 transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold text-[#1a1a2e]">{addon}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Customize and adapt to your preferences.</p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-black transition-all">
                    <ChevronRight size={14} />
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={() => setShowAddOnsModal(false)} className="text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors">
                No thanks, I'll review later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Form Modal */}
      {showInquiryForm && targetPaidOrder && selectedAddOn && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[28px] max-w-2xl w-full p-8 shadow-2xl relative my-8">
            <button 
              onClick={() => setShowInquiryForm(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-[#1a1a2e]">Request Add-on: {selectedAddOn}</h3>
              <p className="text-xs text-gray-500 mt-1">Submit your specifications and reference pictures. We will save your request and redirect you to WhatsApp admin Nedu Mejarc.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-[10px] text-gray-600">
                <div>
                  <p><strong>Order ID:</strong> #{targetPaidOrder.id}</p>
                  <p className="mt-1"><strong>Plan Name:</strong> {targetPaidOrder.orderItems?.[0]?.product?.title}</p>
                </div>
                <div>
                  <p><strong>Total Paid:</strong> ₦{parseFloat(targetPaidOrder.grandTotal || "0").toLocaleString()}</p>
                  <p className="mt-1"><strong>Add-on chosen:</strong> {selectedAddOn}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Your Name</label>
                  <input
                    type="text"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FFC700] text-xs font-semibold"
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Your Email</label>
                  <input
                    type="email"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FFC700] text-xs font-semibold"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FFC700] text-xs font-semibold"
                  placeholder="WhatsApp or mobile number"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Custom Notes / Specifications</label>
                <textarea
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FFC700] text-xs font-semibold leading-relaxed"
                  placeholder="Provide brief customization or adaptation instructions..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase block">Reference Pictures (Optional, max 10)</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => referencePicsRef.current?.click()}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[10px] font-bold rounded-xl transition-all"
                  >
                    Upload Images
                  </button>
                  <span className="text-[10px] text-gray-400 font-semibold">{referencePics.length} files chosen</span>
                  <input
                    type="file"
                    ref={referencePicsRef}
                    multiple
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      if (e.target.files) {
                        const arr = Array.from(e.target.files);
                        setReferencePics(prev => [...prev, ...arr].slice(0, 10));
                      }
                    }}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowInquiryForm(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitInquiry}
                  disabled={inquiryUploading}
                  className="flex-1 py-3 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-gray-300 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {inquiryUploading ? <Loader2 size={14} className="animate-spin text-white" /> : "Submit & Open WhatsApp"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
