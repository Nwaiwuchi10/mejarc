"use client";

import { useEffect } from "react";
import { Bell, X, XCircle } from "lucide-react";

interface CustomModalProps {
  type: "success" | "error";
  title?: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

export default function CustomModal({
  type,
  title,
  message,
  buttonText,
  onClose,
}: CustomModalProps) {
  // Auto close after 10s? Or keep it open since it has an "Acknowledged" button? 
  // The design implies a user action. I'll increase the timeout or remove it if it's "Acknowledged".
  // I'll keep a generous timeout just in case.
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  // Default values to match the design if not provided
  const displayTitle = title || (isSuccess ? "Account Verification" : "Error");
  const displayButtonText = buttonText || (isSuccess ? "Acknowledged" : "Close");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-50 p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[420px] relative p-8 text-center animate-in fade-in zoom-in duration-200">

        {/* Icon Container */}
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <div className="relative">
              {/* Simulated Bell Ring Effect */}
              <Bell size={48} className="text-black" strokeWidth={1.5} />

              {/* Cyan "Ring" curves - decorative SVG or absolute elements */}
              <div className="absolute -top-1 -right-3 text-[#00E0FF]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 2a8 8 0 0 1 5.66 13.66" />
                </svg>
              </div>
              <div className="absolute -top-1 -left-3 text-[#00E0FF] transform scale-x-[-1]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 2a8 8 0 0 1 5.66 13.66" />
                </svg>
              </div>
            </div>
          ) : (
            <XCircle size={56} className="text-red-500" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#333] mb-4">
          {displayTitle}
        </h2>

        {/* Message */}
        <p className="text-gray-500 text-[15px] leading-relaxed mb-8 px-2">
          {message}
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className={`w-full py-3.5 rounded-full font-semibold text-white transition-all shadow-md active:scale-95 ${isSuccess
              ? "bg-[#3B82F6] hover:bg-blue-600 shadow-blue-200"
              : "bg-red-500 hover:bg-red-600 shadow-red-200"
            }`}
        >
          {displayButtonText}
        </button>

      </div>
    </div>
  );
}
