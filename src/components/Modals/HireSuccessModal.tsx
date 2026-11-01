"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

interface HireSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HireSuccessModal({ isOpen, onClose }: HireSuccessModalProps) {
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
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md p-10 flex flex-col items-center text-center z-10"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Success!</h3>
            <p className="text-sm font-bold text-gray-500 leading-relaxed max-w-[280px]">
              Your message has been sent to the professional, they will review your request and respond shortly
            </p>

            <button
              onClick={onClose}
              className="mt-10 w-full bg-[#1a1a2e] text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] hover:bg-black"
            >
              Done
            </button>

            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
