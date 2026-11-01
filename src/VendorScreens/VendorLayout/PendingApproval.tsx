"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { logout } from "@/src/store/authSlice";
import { Clock, ShieldAlert, LogOut, CheckCircle, RefreshCw } from "lucide-react";
import logo from "../../assests/images/mejarcnewlogo.png";
import { COMPANY_CONTACT_INFO } from "@/src/components/CompanyContact/CompanyContact";
export default function PendingApproval() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    try {
      localStorage.removeItem("userToken");
      localStorage.removeItem("agentToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("agentId");
      localStorage.removeItem("isAgentApproved");
      localStorage.removeItem("user");
    } catch (_) {}
    window.location.href = "/";
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fd] flex flex-col items-center justify-between p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Decorative gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FFC700]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1a1a2e]/5 blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full max-w-6xl flex justify-between items-center z-10">
        <Image src={logo} alt="Mejarc Logo" width={110} height={44} className="object-contain" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-600 font-semibold text-sm rounded-xl transition-all hover:bg-red-50/50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-2xl bg-white border border-[#e6e8f2] shadow-xl rounded-[32px] p-8 md:p-12 text-center my-8 z-10 relative">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FFC700]/10 text-[#a37f00] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <Clock size={14} />
          Application Under Review
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1a2e] mb-4 leading-tight">
          Your Professional Agent Profile is <span className="text-[#FFC700]">Pending Approval</span>
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed max-w-lg mx-auto">
          Thank you for joining the Mejarc professional agent program! Our compliance team is currently reviewing your KYC documents and professional certifications.
        </p>

        {/* Informational Panel */}
        <div className="bg-[#1a1a2e]/5 border border-[#1a1a2e]/10 rounded-2xl p-6 text-left mb-8 max-w-xl mx-auto">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FFC700]/10 flex items-center justify-center text-[#FFC700] flex-shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a2e] text-sm md:text-base mb-1">Estimated Review Timeline</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                The verification process typically takes between <strong className="text-[#1a1a2e]">1 to 7 working days</strong>. Once approved, you will get complete access to the vendor dashboard to post products, view workspace, and manage payouts.
              </p>
            </div>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto mb-10 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
              ✓
            </div>
            <span className="text-xs font-bold text-gray-500 mt-2">Registration</span>
          </div>

          {/* Line 1 */}
          <div className="absolute top-4 left-[20%] right-[55%] h-[2px] bg-green-500 z-0" />

          {/* Step 2 */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
              ✓
            </div>
            <span className="text-xs font-bold text-gray-500 mt-2">KYC Submitted</span>
          </div>

          {/* Line 2 */}
          <div className="absolute top-4 left-[50%] right-[20%] h-[2px] bg-gray-200 z-0" />

          {/* Step 3 */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-[#FFC700] text-[#1a1a2e] flex items-center justify-center font-bold text-sm shadow-md animate-bounce">
              3
            </div>
            <span className="text-xs font-bold text-[#1a1a2e] mt-2">Compliance Review</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 bg-[#FFC700] hover:bg-[#FFC700]/90 text-[#1a1a2e] font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <RefreshCw size={16} />
            Check Status
          </button>
          <a
            href={`mailto:${COMPANY_CONTACT_INFO.email}`}
            className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm px-6 py-3 rounded-xl transition-all"
          >
            Contact Support
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl text-center text-xs text-gray-400 z-10">
        &copy; {new Date().getFullYear()} Mejarc Integrated Services Ltd. All rights reserved. Professional Agent Portal.
      </footer>
    </div>
  );
}
