"use client";

import React from "react";
import { CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = "Payment Successful!",
  message = "Your transaction has been approved and your order is being processed. Check your email for delivery details.",
  buttonText = "View My Orders",
}: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md p-10 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-green-500" />
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50"
            >
              <X size={20} />
            </button>

            <div className="mb-8 p-6 bg-green-50 rounded-full text-green-500 shadow-inner">
              <CheckCircle2 size={64} strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-black text-[#1a1a2e] mb-4">{title}</h2>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10 max-w-[280px]">
              {message}
            </p>

            <button
              onClick={onClose}
              className="w-full bg-[#1a1a2e] text-white font-extrabold py-5 rounded-2xl shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98]"
            >
              {buttonText}
            </button>
            
            <p className="mt-6 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
               Mejarc Tech Solutions
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
