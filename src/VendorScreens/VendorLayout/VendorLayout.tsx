"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import { logout } from "@/src/store/authSlice";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ShoppingBag,
  Wallet,
  Bell,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  LogOut,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";
import "./VendorLayout.css";
import logo from "../../assests/images/mejarcnewlogo.png";
import { isTokenExpired } from "@/src/Utils/jwt";
import PendingApproval from "./PendingApproval";

interface VendorLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/vendor" },
  // { label: "Workspace", icon: BriefcaseBusiness, href: "/vendor/workspace" },
  { label: "Products", icon: ShoppingBag, href: "/vendor/products" },
  { label: "Wallets", icon: Wallet, href: "/vendor/wallets" },
  { label: "Notifications", icon: Bell, href: "/vendor/notifications" },
  { label: "Settings", icon: Settings, href: "/vendor/settings" },
];

export default function VendorLayout({ children }: VendorLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!auth.agentId) {
      router.push("/");
      return;
    }
  }, [auth.agentId, router]);

  // If the agent is not approved, render the PendingApproval view instead of the layout
  if (auth.agentId && !auth.isAgentApproved) {
    return <PendingApproval />;
  }

  // Click outside to close profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    dispatch(logout());
    try {
      localStorage.removeItem("userToken");
      localStorage.removeItem("agentToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("agentId");
      localStorage.removeItem("user");
    } catch (_) { }
    window.location.href = "/";
  };

  return (
    <div className="vendor-layout">
      {/* ── Mobile hamburger ── */}
      <button
        className="vendor-layout__hamburger"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <X size={22} color="#1a1a2e" />
        ) : (
          <Menu size={22} color="#1a1a2e" />
        )}
      </button>

      {/* ── Backdrop overlay (mobile) ── */}
      <div
        className={`vendor-layout__overlay${sidebarOpen ? " visible" : ""}`}
        onClick={closeSidebar}
      />

      {/* ── Sidebar ── */}
      <aside className={`vendor-sidebar${sidebarOpen ? " open" : ""}${isCollapsed ? " collapsed" : ""}`}>
        {/* Logo and Collapse Toggle */}
        <div className="vendor-sidebar__logo" style={{ justifyContent: isCollapsed ? 'center' : 'space-between' }}>
          {!isCollapsed && (
            <Link href="/">
              <Image src={logo} alt="Logo" width={100} height={40} />
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            {isCollapsed ? <PanelRightClose size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="vendor-sidebar__nav">
            {navItems.map(({ label, icon: Icon, href }) => {
              const isActive =
                href === "/vendor"
                  ? pathname === "/vendor"
                  : pathname?.startsWith(href) === true;
              return (
                <li key={label}>
                  <Link
                    href={href}
                    className={`vendor-sidebar__nav-item${isActive ? " active" : ""}`}
                    onClick={closeSidebar}
                    title={isCollapsed ? label : undefined}
                  >
                    <Icon className="nav-icon" size={20} />
                    {!isCollapsed && label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Help Center */}
        {!isCollapsed && (
          <div className="vendor-sidebar__help">
            <div className="vendor-sidebar__help-icon-wrap">
              <HelpCircle size={22} />
            </div>
            <h4>Help Center</h4>
            <p>Have a question? send us a message!</p>
            <button className="vendor-sidebar__help-btn">
              Go to help center
            </button>
          </div>
        )}
      </aside>

      {/* ── Main content ── */}
      <main className={`vendor-layout__content${isCollapsed ? " collapsed" : ""}`}>
        {/* ── Topbar ── */}
        <header className="vd__topbar">
          <div className="vd__topbar-greeting">
            <h1>
              {pathname === "/vendor" || !pathname
                ? `Welcome, ${auth.user?.firstName ?? ""} ${auth.user?.lastName ?? ""}`
                : navItems.find((item) => item.href !== "/vendor" && pathname?.startsWith(item.href))?.label || "Welcome"}
            </h1>
          </div>
          <div className="vd__topbar-right">
            {/* Bell */}
            <div className="vd__topbar-bell">
              <Bell size={22} />
              <span className="vd__topbar-bell-dot" />
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="vd__topbar-user flex items-center gap-3 px-3 py-1.5 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-gray-100 transition-all outline-none"
              >
                {auth.user?.profilePics ? (
                  <div className="vd__topbar-avatar w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400 p-0.5">
                    <Image
                      src={auth.user.profilePics}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="vd__topbar-avatar w-10 h-10 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 flex items-center justify-center text-sm font-bold text-gray-800 shadow-sm">
                    {(auth.user?.firstName?.[0] || "") +
                      (auth.user?.lastName?.[0] || "")}
                  </div>
                )}
                <div className="vd__topbar-user-info flex flex-col items-start leading-tight">
                  <span className="vd__topbar-user-name text-sm font-bold text-gray-900">
                    {(auth.user?.firstName ?? "") +
                      " " +
                      (auth.user?.lastName ?? "")}
                  </span>
                  <span className="vd__topbar-user-role text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    {auth.isAgent ? "Professional Agent" : "Member"}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 ml-1 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2.5 border-b border-gray-50 mb-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Agent Account
                    </p>
                  </div>

                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    onClick={() => setProfileOpen(false)}
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>

                  <Link
                    href="/orders"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    onClick={() => setProfileOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>

                  <Link
                    href="/vendor"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    onClick={() => setProfileOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    Vendor Dashboard
                  </Link>

                  <div className="my-1 border-t border-gray-50"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
