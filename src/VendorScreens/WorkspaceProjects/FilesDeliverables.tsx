"use client";

import React, { useRef, useState } from "react";
import { Download, FileText, FileCode, FileArchive, ImageIcon, Loader2, Upload, Trash2 } from "lucide-react";

interface FilesProps {
  files: any[];
  projectId: string;
  onRefresh: () => void;
  showMessage: (type: "success" | "error", message: string, title?: string) => void;
}

export default function FilesDeliverables({ files, projectId, onRefresh, showMessage }: FilesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const token = localStorage.getItem("agentToken") || localStorage.getItem("userToken");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("isDeliverable", "true");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/custom-design/${projectId}/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload file");

      showMessage("success", "File uploaded successfully!");
      onRefresh();
    } catch (err: any) {
      showMessage("error", err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const getFileGraphic = (type: string, url?: string) => {
    const typeUpper = type.toUpperCase();
    
    if (typeUpper === "PDF") {
      return (
        <div className="w-[120px] h-[140px] bg-[#FFF1F0] rounded-lg relative flex items-center justify-center border border-red-50 flex-col gap-2 group-hover:scale-105 transition-transform">
          <FileText size={48} className="text-red-500" />
          <span className="bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">PDF</span>
        </div>
      );
    }
    
    if (["CAD", "DWG", "DXF"].includes(typeUpper)) {
      return (
        <div className="w-[120px] h-[140px] bg-[#F0F5FF] rounded-lg relative flex flex-col items-center justify-center gap-2 border border-blue-50 group-hover:scale-105 transition-transform">
          <FileCode size={48} className="text-blue-500" />
          <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">{typeUpper}</span>
        </div>
      );
    }

    if (["PSD", "AI", "FIG"].includes(typeUpper)) {
      return (
        <div className="w-[120px] h-[140px] bg-[#F9F0FF] rounded-lg relative flex items-center justify-center border border-purple-50 group-hover:scale-105 transition-transform">
          <div className="flex flex-col items-center gap-2">
            <ImageIcon size={48} className="text-purple-500" />
            <span className="bg-purple-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">{typeUpper}</span>
          </div>
        </div>
      );
    }

    if (["ZIP", "RAR", "7Z"].includes(typeUpper)) {
      return (
        <div className="w-[120px] h-[140px] bg-[#F6FFED] rounded-lg relative flex items-center justify-center border border-green-50 group-hover:scale-105 transition-transform">
          <div className="flex flex-col items-center gap-2">
             <FileArchive size={48} className="text-green-500" />
             <span className="bg-green-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">Archive</span>
          </div>
        </div>
      );
    }

    if (["JPG", "PNG", "JPEG", "WEBP"].includes(typeUpper)) {
      return (
        <div className="w-[120px] h-[140px] rounded-lg relative flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
          <img 
            src={url || "https://images.unsplash.com/photo-1627389955805-7d417992850b?auto=format&fit=crop&w=400"} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm py-1 flex justify-center">
            <span className="text-white text-[9px] font-bold uppercase">{typeUpper}</span>
          </div>
        </div>
      );
    }

    // Default icon for other types
    return (
      <div className="w-[120px] h-[140px] bg-gray-50 rounded-lg relative flex flex-col items-center justify-center gap-2 border border-gray-200 group-hover:scale-105 transition-transform">
        <FileText size={48} className="text-gray-400" />
        <span className="bg-gray-400 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">{typeUpper || "FILE"}</span>
      </div>
    );
  };

  return (
    <div className="w-full bg-white h-full p-8 max-w-5xl shadow-sm rounded-md border border-gray-100">
      
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 className="text-[15px] font-bold text-gray-800">Files & Deliverables</h2>
          <p className="text-xs text-gray-400 mt-1">Upload and manage project assets</p>
        </div>
        
        <div className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
          />
          <button 
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#FFC700] hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2.5 rounded text-[13px] transition-all flex items-center gap-2 shadow-sm active:scale-95"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Upload Deliverable
          </button>
        </div>
      </div>

      {/* Grid of File Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {!files || files.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
               <FileText size={32} className="text-gray-200" />
            </div>
            <p className="text-sm italic">No files uploaded yet.</p>
          </div>
        ) : (
          files.map((file) => (
            <div key={file.id} className="group border border-gray-100 rounded-xl p-4 hover:shadow-xl hover:border-blue-100 transition-all bg-white relative">
              {/* Top Meta */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {file.isDeliverable ? "Deliverable" : "Asset"}
                </span>
                <span className="text-[10px] text-gray-300 font-medium">{new Date(file.createdAt).toLocaleDateString()}</span>
              </div>
              
              {/* Center Graphic */}
              <div className="flex justify-center mb-6">
                {getFileGraphic(file.fileType, file.fileUrl)}
              </div>
              
              {/* Bottom Details */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[13px] font-bold text-gray-700 truncate pr-2" title={file.fileName}>
                  {file.fileName}
                </h4>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                  <a 
                    href={file.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-[11px] font-bold transition-colors"
                  >
                    <Download size={14} />
                    Download
                  </a>
                  {/* Cosmetic Delete for design match */}
                  <button 
                    disabled
                    className="p-1.5 text-gray-300 cursor-not-allowed"
                    title="Deletion not enabled"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
    </div>
  );
}
