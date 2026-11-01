"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Package,
  FileText,
  Layers,
  Maximize2,
  Bed,
  Bath,
  Hash,
  CheckCircle2,
  Download
} from "lucide-react";
import Image from "next/image";

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
  billingInfo?: {
    city: string;
    email: string;
    phone: string;
    state: string;
    address: string;
    country: string;
    lastName: string;
    firstName: string;
    postalCode: string;
  };
}

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  const firstItem = order.orderItems?.[0];
  const product = firstItem?.product;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-[#F9FAF8] rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-gray-900">Order Details</h2>
                {order.isPaid && (
                  <span className="bg-green-100 text-green-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={10} /> Paid
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-gray-500">
                  Order ID: {order.id ? 'ORD-' + String(order.id).replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase() : 'N/A'}
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  Product ID: {product?.productId || (firstItem?.productId && !firstItem.productId.includes('-') && firstItem.productId.length < 12 ? firstItem.productId : 'PRD001')}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 transition-colors rounded-full hover:bg-gray-100 text-gray-400 hover:text-black"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Left Column: Product Info */}
              <div className="space-y-8">
                {/* Main Product Info */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={product?.productImage?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                      alt={product?.title || "Product Image"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-black text-gray-900 mb-2">{product?.title || "Product Title"}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    {product?.description || "Detailed description will appear here when available."}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Bed size={14} /> <span className="text-[10px] font-bold uppercase tracking-tighter">Rooms</span>
                      </div>
                      <p className="text-sm font-black text-gray-900">{product?.numBedrooms || "N/A"}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Bath size={14} /> <span className="text-[10px] font-bold uppercase tracking-tighter">Baths</span>
                      </div>
                      <p className="text-sm font-black text-gray-900">{product?.numBathrooms || "N/A"}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Layers size={14} /> <span className="text-[10px] font-bold uppercase tracking-tighter">Floors</span>
                      </div>
                      <p className="text-sm font-black text-gray-900">{product?.numFloors || "N/A"}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Maximize2 size={14} /> <span className="text-[10px] font-bold uppercase tracking-tighter">Area</span>
                      </div>
                      <p className="text-sm font-black text-gray-900">
                        {product?.area ? (product.area.toLowerCase().includes("sqm") || product.area.toLowerCase().includes("m²") ? product.area : `${product.area} sqm`) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
                    <div className="flex items-center gap-2 mb-4 text-amber-500">
                      <FileText size={18} />
                      <span className="text-xs font-black uppercase tracking-wider">Drawing Set</span>
                    </div>
                    <ul className="space-y-2">
                      {product?.drawingSet?.map((item, idx) => (
                        <li key={idx} className="text-sm font-bold text-gray-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-200" /> {item}
                        </li>
                      )) || <li className="text-sm text-gray-400 italic">No drawing set specified</li>}
                    </ul>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
                    <div className="flex items-center gap-2 mb-4 text-blue-500">
                      <Package size={18} />
                      <span className="text-xs font-black uppercase tracking-wider">Included Add-ons</span>
                    </div>
                    <ul className="space-y-2">
                      {product?.addOns?.map((item, idx) => (
                        <li key={idx} className="text-sm font-bold text-gray-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-200" /> {item}
                        </li>
                      )) || <li className="text-sm text-gray-400 italic">No add-ons included</li>}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Order & Billing */}
              <div className="space-y-8">
                {/* Billing Address */}
                <div className="bg-yellow-400 text-[#1a1a2e] rounded-3xl p-8 shadow-xl">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#1a1a2e]/40 mb-6 flex items-center gap-2">
                    <MapPin size={14} /> Shipping & Billing
                  </h4>

                  {order.billingInfo ? (
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
                          <Hash size={18} className="text-[#1a1a2e]/40" />
                        </div>
                        <div>
                          <p className="text-sm font-black">{order.billingInfo.firstName} {order.billingInfo.lastName}</p>
                          <p className="text-[10px] text-[#1a1a2e]/40 font-bold uppercase tracking-wider">Full Name</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
                          <Phone size={18} className="text-[#1a1a2e]/40" />
                        </div>
                        <div>
                          <p className="text-sm font-black">{order.billingInfo.phone || "No phone provided"}</p>
                          <p className="text-[10px] text-[#1a1a2e]/40 font-bold uppercase tracking-wider">Phone Number</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
                          <Mail size={18} className="text-[#1a1a2e]/40" />
                        </div>
                        <div>
                          <p className="text-sm font-black truncate max-w-[200px]">{order.billingInfo.email}</p>
                          <p className="text-[10px] text-[#1a1a2e]/40 font-bold uppercase tracking-wider">Email Address</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-black/10">
                        <p className="text-sm font-bold text-[#1a1a2e]/80 leading-relaxed">
                          {order.billingInfo.address}
                        </p>
                        <p className="text-[10px] font-black text-[#1a1a2e]/40 uppercase tracking-widest mt-1">
                          {order.billingInfo.city}, {order.billingInfo.state}, {order.billingInfo.country}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#1a1a2e]/40 text-sm italic py-10 text-center">No billing information found for this order.</p>
                  )}
                </div>

                {/* Payment Overview */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8">
                    Transaction Summary
                  </h4>

                  <div className="space-y-5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-bold flex items-center gap-2">
                        <Calendar size={14} /> Order Date
                      </span>
                      <span className="text-gray-900 font-black">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-bold flex items-center gap-2">
                        <CreditCard size={14} /> Base Amount
                      </span>
                      <span className="text-gray-900 font-black">
                        ₦{parseFloat(product?.price || "0").toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-100">
                      <span className="text-gray-900 font-black text-base">Grand Total</span>
                      <span className="text-2xl font-black text-gray-900">
                        ₦{parseFloat(order.grandTotal).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Download Actions */}
                {order.isPaid && (
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Available Deliverables</h4>
                      {(() => {
                        const parseUrls = (field: any): string[] => {
                          if (Array.isArray(field)) return field.filter(Boolean);
                          if (typeof field === 'string' && field.trim().length > 0) {
                            return field.includes(',') ? field.split(',').map((s: string) => s.trim()).filter(Boolean) : [field.trim()];
                          }
                          return [];
                        };
                        const allUrls = [
                          ...parseUrls(product?.architecturalPlan),
                          ...parseUrls(product?.structuralPlan),
                          ...parseUrls(product?.electricalPlan),
                          ...parseUrls(product?.mechanicalPlan),
                        ];
                        if (allUrls.length > 1) {
                          return (
                            <button
                              onClick={() => {
                                allUrls.forEach((url, idx) => {
                                  setTimeout(() => {
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.target = "_blank";
                                    link.download = url.split('/').pop() || `file-${idx + 1}`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }, idx * 600);
                                });
                              }}
                              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full flex items-center gap-1 transition"
                            >
                              <Download size={12} /> Download All ({allUrls.length})
                            </button>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {(() => {
                        const parseUrls = (field: any): string[] => {
                          if (Array.isArray(field)) return field.filter(Boolean);
                          if (typeof field === 'string' && field.trim().length > 0) {
                            return field.includes(',') ? field.split(',').map((s: string) => s.trim()).filter(Boolean) : [field.trim()];
                          }
                          return [];
                        };

                        const planCategories = [
                          { label: "Architectural Plan", files: parseUrls(product?.architecturalPlan), color: "bg-blue-50 text-blue-700 border-blue-200" },
                          { label: "Structural Plan", files: parseUrls(product?.structuralPlan), color: "bg-purple-50 text-purple-700 border-purple-200" },
                          { label: "Electrical Plan", files: parseUrls(product?.electricalPlan), color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                          { label: "Mechanical Plan", files: parseUrls(product?.mechanicalPlan), color: "bg-orange-50 text-orange-700 border-orange-200" },
                        ];

                        const totalFiles = planCategories.reduce((acc, cat) => acc + cat.files.length, 0);

                        if (totalFiles === 0) {
                          return (
                            <p className="text-xs text-gray-400 italic text-center py-2">No downloadable plans are uploaded for this product yet.</p>
                          );
                        }

                        return planCategories.map(cat => {
                          if (cat.files.length === 0) return null;
                          return (
                            <div key={cat.label} className="space-y-1.5 pt-1">
                              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">{cat.label}</span>
                              <div className="space-y-1.5">
                                {cat.files.map((url, i) => {
                                  const fileName = decodeURIComponent(url.split('/').pop()?.split('?')[0] || `${cat.label}-File-${i + 1}`);
                                  const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
                                  return (
                                    <div
                                      key={`${cat.label}-${i}`}
                                      className="w-full bg-gray-50 hover:bg-gray-100 p-3 rounded-xl border border-gray-100 flex items-center justify-between transition-all"
                                    >
                                      <div className="flex items-center gap-2 min-w-0 pr-3">
                                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border shrink-0 ${cat.color}`}>
                                          {ext}
                                        </span>
                                        <div className="min-w-0">
                                          <p className="text-xs font-bold text-gray-800 truncate">
                                            {cat.files.length > 1 ? `${cat.label} #${i + 1}` : cat.label}
                                          </p>
                                          <p className="text-[10px] text-gray-400 truncate">{fileName}</p>
                                        </div>
                                      </div>
                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        download={fileName}
                                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0 transition"
                                      >
                                        <Download size={13} className="text-blue-600" />
                                        <span>Download</span>
                                      </a>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
