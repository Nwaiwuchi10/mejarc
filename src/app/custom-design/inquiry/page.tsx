"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, Phone, MapPin, Upload, X, ArrowLeft, Loader2 } from "lucide-react";
import Api from "@/src/Utils/Api";
import CustomModal from "@/src/components/Message/Message";
import { COMPANY_CONTACT_INFO } from "@/src/components/CompanyContact/CompanyContact";
const Navbar = dynamic(() => import("@/src/components/Navbar/Navbar"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/src/components/Footer/Footer"), {
  ssr: false,
});

function InquiryFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams ? searchParams.get("category") : null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: initialCategory || "Building Guide",
    message: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setFormData((prev) => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let selectedFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (files.length + selectedFiles.length > 10) {
        setModal({
          type: "error",
          message: "You can only upload a maximum of 10 pictures.",
        });
        return;
      }

      setFiles((prev) => [...prev, ...selectedFiles]);

      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });

    setPreviews((prev) => {
      const updated = [...prev];
      if (updated[index]) URL.revokeObjectURL(updated[index]);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setModal({ type: "error", message: "Please fill out all required fields." });
      return;
    }

    setLoading(true);

    try {
      // 1. Submit text inquiry to backend
      const inquiryText = `[Custom Design Request] Category: ${formData.category}. Message: ${formData.message}. Attached pictures count: ${files.length}`;
      await Api.post("/contact", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Custom Design: ${formData.category}`,
        message: inquiryText,
      });

      setModal({
        type: "success",
        message: "Your inquiry has been submitted! Redirecting you to Admin WhatsApp...",
      });

      // 2. Format WhatsApp Redirect Message
      const waText = `Hello, I would like to make a custom design inquiry. Here are my details:\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Category:* ${formData.category}\n*Message:* ${formData.message}\n\n[Includes ${files.length} attached images]`;
      const waUrl = `https://wa.me/${COMPANY_CONTACT_INFO.whatsapp1}?text=${encodeURIComponent(waText)}`;

      // 3. Clear states
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: initialCategory || "Building Guide",
        message: "",
      });
      setFiles([]);
      setPreviews([]);

      // 4. Open WhatsApp redirect
      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 1500);

    } catch (error: any) {
      setModal({
        type: "error",
        message: error.response?.data?.message || "Failed to submit custom inquiry. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[whitesmoke] flex flex-col">
      <Navbar />
      
      {modal && (
        <CustomModal
          type={modal.type}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}

      <main className="flex-1 mt-24 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Categories
          </button>

          {/* Form wrapper */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_1.2fr]">
            {/* Left banner */}
            <div className="bg-[#1a1a2e] text-white p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider block mb-2">
                  Customization
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 leading-tight">
                  Design Your Dream Home
                </h1>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Provide your project dimensions, details, and reference images. Our professional architects will tailor design plans perfectly matching your requirements.
                </p>
              </div>

              <div className="space-y-4 mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-full text-yellow-400">
                    <Phone size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">WhatsApp Admin</span>
                    <span className="text-xs font-medium">+44 7427 976350</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-full text-yellow-400">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">Support Email</span>
                    <span className="text-xs font-medium">mejehaarc@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right form controls */}
            <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-5">
              <h2 className="text-lg font-extrabold text-[#1a1a2e] mb-4">
                Mejarc Customer Inquiry Form
              </h2>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFC700] transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. john@example.com"
                    className="w-full text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFC700] transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Customer Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFC700] transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Design Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFC700] transition"
                >
                  <option value="Building Guide">Building Guide</option>
                  <option value="Product Design">Product Design</option>
                  <option value="3D Rendering & Visualization">3D Rendering & Visualization</option>
                  <option value="2D Architectural Drawings">2D Architectural Drawings</option>
                  <option value="Building Information Modeling">Building Information Modeling</option>
                  <option value="Structural Engineering Drawings">Structural Engineering Drawings</option>
                  <option value="Mechanical & Electrical Drawings">Mechanical & Electrical Drawings</option>
                </select>
              </div>

              {/* Upload pictures */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase block">Add Reference Pictures (Max 10)</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3.5 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
                >
                  <Upload size={16} /> Select Images ({files.length} Selected)
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  hidden
                  onChange={handleFileChange}
                  accept="image/*"
                />

                {previews.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {previews.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group">
                        <img src={src} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Message & Specifications *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="e.g. Dimensions of building site, desired rooms count..."
                  className="w-full text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#FFC700] transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full border border-transparent bg-yellow-400 text-black font-extrabold py-3.5 rounded-xl hover:bg-yellow-500 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Inquiry"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CustomInquiryPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen py-20 bg-[whitesmoke]">
        <Loader2 className="w-12 h-12 text-[#FFC700] animate-spin mb-4" />
        <span className="text-gray-500 font-medium">Loading form...</span>
      </div>
    }>
      <InquiryFormContent />
    </Suspense>
  );
}
