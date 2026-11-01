"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import { logout } from "@/src/store/authSlice";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  MessageSquare,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  X,
  Home,
  ShoppingBag,
  Palette,
  Mail,
  HelpCircle as FaqIcon,
  LogOut,
  User as UserIcon,
  ShoppingCart,
  Search,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Buy Plans", href: "/plans", icon: ShoppingBag },
  { name: "Custom Design", href: "/custom-design", icon: Palette },
  { name: "Contact us", href: "/contact", icon: Mail },
  { name: "FAQ", href: "/faq", icon: FaqIcon },
];

const sidebarLinks = [
  { label: "My Orders", icon: LayoutDashboard, href: "/orders" },
  // { label: "My Projects", icon: BriefcaseBusiness, href: "/projects" },
  // { label: "Messages", icon: MessageSquare, href: "/messages" },
  // { label: "Payments Methods", icon: CreditCard, href: "/payments" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
  { label: "Notification Settings", icon: Settings, href: "/notifications/settings" },
  { label: "Profile Settings", icon: UserIcon, href: "/settings" },
];

interface CustomerSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CustomerSidebar({ isOpen, onClose }: CustomerSidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("userToken");
    localStorage.removeItem("agentToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("agentId");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-all duration-300 pointer-events-auto"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:z-0 lg:bg-white lg:border lg:border-gray-100 lg:rounded-xl lg:shadow-none lg:h-fit lg:sticky lg:top-[100px] flex flex-col
        ${isCollapsed ? 'lg:w-[80px]' : 'lg:w-[260px]'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Header with Close Button */}
        <div className="lg:hidden flex items-center justify-between p-6 pb-4 border-b border-gray-50">
          <span className="font-bold text-gray-900 tracking-tight">Navigation</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex items-center px-6 py-3 border-b border-gray-50" style={{ justifyContent: isCollapsed ? 'center' : 'flex-end' }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
          >
            {isCollapsed ? <PanelRightClose size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {/* Mobile Only: Global Navigation */}
          <div className="lg:hidden mb-8">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Main Menu</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                  >
                    <link.icon size={18} className="text-gray-400" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard specific links */}
          <div className="mb-6">
            <h3 className="lg:hidden text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Dashboard</h3>
            <nav>
              <ul className="list-none p-0 m-0 flex flex-col gap-1">
                {sidebarLinks.map(({ label, icon: Icon, href }: { label: string; icon: any; href: string }) => {
                  const isActive = pathname === href;
                  return (
                    <li key={label}>
                      <Link
                        href={href}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isCollapsed ? "justify-center" : ""
                          } ${isActive
                            ? "bg-[#FFFBEB] text-[#111827] border-l-4 border-yellow-400"
                            : "text-gray-500 hover:bg-[#FFFBEB] hover:text-[#111827]"
                          }`}
                        title={isCollapsed ? label : undefined}
                      >
                        <Icon size={18} className={isActive ? "text-[#111827]" : "text-gray-400"} />
                        {!isCollapsed && <span>{label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {!isCollapsed && (
            <div className="bg-[#FFFBEB] rounded-xl p-5 text-center flex flex-col items-center gap-2 relative mt-8">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black absolute -top-5 shadow-sm">
                <HelpCircle size={20} />
              </div>
              <h4 className="mt-4 text-sm font-bold text-[#111827]">Help Center</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Have a question? send us a message!
              </p>
              <button className="w-full bg-yellow-400 border-none rounded-lg py-2.5 text-xs font-bold text-black cursor-pointer mt-2 hover:bg-yellow-500 transition-colors">
                Go to help center
              </button>
            </div>
          )}
        </div>

        {/* Mobile Only: Profile and Actions */}
        <div className="lg:hidden p-6 pt-4 border-t border-gray-50 bg-gray-50/50">
          {auth.user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {auth.user?.profilePics ? (
                  <Image
                    src={auth.user.profilePics}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-black border-2 border-white shadow-sm">
                    {(auth.user?.firstName?.[0] || "") + (auth.user?.lastName?.[0] || "")}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-gray-900 truncate">
                    {(auth.user?.firstName || "") + " " + (auth.user?.lastName || "")}
                  </span>
                  <span className="text-[10px] text-gray-500 truncate uppercase tracking-wider">Customer</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-bold border-none cursor-pointer"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="flex items-center justify-center py-2.5 rounded-lg bg-gray-100 text-gray-900 text-sm font-bold transition hover:bg-gray-200"
                onClick={onClose}
              >
                Login
              </Link>
              <Link
                href="/chooseAccountType"
                className="flex items-center justify-center py-2.5 rounded-lg bg-yellow-400 text-black text-sm font-bold transition hover:bg-yellow-500 shadow-sm"
                onClick={onClose}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
