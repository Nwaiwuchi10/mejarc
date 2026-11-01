"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import CustomerSidebar from "./CustomerSidebar";
import CustomerHeader from "./CustomHeader";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pathname = usePathname();

  const getBreadcrumb = () => {
    if (!pathname) return "Dashboard";
    if (pathname.includes("/orders")) return "My Orders";
    // if (pathname.includes("/projects")) return "My Projects";
    // if (pathname.includes("/messages")) return "Messages";
    if (pathname.includes("/notifications")) return "Notifications";
    if (pathname.includes("/settings")) return "Profile Settings";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF8]">
      <CustomerHeader onOpenMenu={() => setIsSidebarOpen(true)} />

      <main className="flex-1 pt-24 pb-16 lg:pt-28">
        <div className="max-w-[1280px] mx-auto px-5 w-full">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <span>Home</span>
            <span className="text-gray-300">/</span>
            <span className="text-[#111827] font-medium">{getBreadcrumb()}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <CustomerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 min-w-0 w-full">
              {children}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
