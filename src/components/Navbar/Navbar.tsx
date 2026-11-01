"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import { logout, setAuth } from "@/src/store/authSlice";
import { isTokenExpired } from "@/src/Utils/jwt";
import Api from "@/src/Utils/Api";
import mejarclogo from "../../assests/images/mejarcnewlogo.png";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  User,
  ShoppingBag,
  Settings,
  LogOut,
  LayoutDashboardIcon,
} from "lucide-react";
import loveIcon from "../.../../../assests/images/Vector.svg";
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Buy Plans", href: "/plans" },
  { name: "Custom Design", href: "/custom-design" },
  { name: "Contact us", href: "/contact" },
  { name: "FAQ", href: "/faq" },
];

interface NavbarProps {
  dashboardOnly?: boolean;
}

const Navbar = ({ dashboardOnly = false }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart);
  const customDesign = useSelector((state: RootState) => state.customDesign);
  const dispatch = useDispatch();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    // Hydrate custom design state from localStorage if needed
    if (typeof window !== "undefined") {
      const savedFlow = localStorage.getItem("customDesignFlow");
      if (savedFlow && !customDesign.isFlowActive) {
        // dispatching startFlow with saved data could be complex here,
        // but at least we have the lastPath
      }
    }

    // Immediate hydration fallback if Redux is empty
    const token =
      auth.userToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem("userToken")
        : null);
    const userId =
      auth.userId ||
      (typeof window !== "undefined" ? localStorage.getItem("userId") : null);
    const userJson =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const user = auth.user || (userJson ? JSON.parse(userJson) : null);

    if (token && !auth.userToken) {
      dispatch(setAuth({ userToken: token, userId, user }));
    }

    // Background user fetch if missing
    if (token && userId && !user) {
      Api.get(`/user/${userId}`)
        .then((res) => {
          dispatch(setAuth({ user: res.data }));
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch((err) => console.error("Navbar fetch error", err));
    }
  }, [auth.userToken, auth.userId, auth.user, dispatch]);

  // Save custom design flow to localStorage
  useEffect(() => {
    if (hasMounted && customDesign.isFlowActive) {
      localStorage.setItem("customDesignFlow", JSON.stringify(customDesign));
    }
  }, [customDesign, hasMounted]);

  const token =
    auth.userToken ||
    (hasMounted && typeof window !== "undefined"
      ? localStorage.getItem("userToken")
      : null);
  const isLoggedIn = Boolean(token);
  if (!hasMounted) return null; // Avoid hydration mismatch

  return (
    <header className="w-full  bg-white fixed top-0 left-0 z-50 font-plans ">
      <nav className="mx-auto font-plans flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={mejarclogo}
            alt="Mejarc Logo"
            width={140}
            height={40}
            className=""
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors ${link.name === "Home"
                    ? "text-gray-900"
                    : "text-gray-900 hover:text-gray-500"
                  }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <button className="rounded-full p-2 bg-[#F5F5F5] border border-gray-300 hover:bg-gray-200 transition">
            <Search size={16} className="text-black" />
          </button>

          <Link
            href={customDesign.lastPath || "/custom-design"}
            className="rounded-full p-2 bg-[#F5F5F5] border border-gray-300 hover:bg-gray-200 transition relative"
            title="Custom Design Cart"
          >
            <LayoutDashboard size={16} className="text-black" />
            {customDesign.isFlowActive && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                1
              </span>
            )}
          </Link>

          <Link
            href="/checkout"
            className="rounded-full p-2 bg-[#F5F5F5] border border-gray-300 hover:bg-gray-200 transition relative"
          >
            <ShoppingCart size={16} className="text-black" />
            {hasMounted && cart.items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                {cart.items.length}
              </span>
            )}
          </Link>

          {/* Auth actions */}
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                href="/chooseAccountType"
                className="rounded-md bg-yellow-400 px-5 py-2 text-sm font-lighter text-black transition hover:bg-yellow-500"
              >
                Sign up
              </Link>
            </>
          ) : (
            // Logged in
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
              >
                <div className="relative">
                  {auth.user?.profilePics ? (
                    <Image
                      src={auth.user.profilePics}
                      alt="avatar"
                      width={38}
                      height={38}
                      className="rounded-full object-cover border-2 border-yellow-400 p-0.5"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 flex items-center justify-center text-sm font-bold text-gray-800 shadow-sm">
                      {(auth.user?.firstName?.[0] || "") +
                        (auth.user?.lastName?.[0] || "")}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="hidden lg:flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                    {(auth.user?.firstName || "") +
                      " " +
                      (auth.user?.lastName || "")}
                  </span>
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    {auth.isAgent ? "Professional Agent" : "Customer"}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Account Settings
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

                  {/* <Link
                    href="/workspace"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-purple-50 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <LayoutDashboardIcon size={16} />
                    Project Workspace
                  </Link> */}

                  {auth.isAgent && (
                    <Link
                      href="/vendor"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LayoutDashboardIcon size={16} />
                      Vendor Dashboard
                    </Link>
                  )}

                  <div className="my-1 border-t border-gray-50"></div>

                  <button
                    onClick={() => {
                      dispatch(logout());
                      try {
                        localStorage.removeItem("userToken");
                        localStorage.removeItem("agentToken");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("agentId");
                        localStorage.removeItem("user");
                      } catch (_) { }
                      window.location.href = "/";
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden h-[100vh] border-t bg-white px-4 py-6">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="block text-sm font-medium text-gray-700 hover:text-gray-900"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-4">
            <button className="rounded-full p-2 hover:bg-gray-100">
              <Search size={18} />
            </button>
            <Link
              href={customDesign.lastPath || "/custom-design"}
              className="rounded-full p-2 hover:bg-gray-100 relative"
              onClick={() => setMenuOpen(false)}
            >
              <LayoutDashboard size={18} />
              {customDesign.isFlowActive && (
                <span className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                  1
                </span>
              )}
            </Link>
            <button
              className="rounded-full p-2 hover:bg-gray-100 relative"
              onClick={() => {
                setMenuOpen(false);
                window.location.href = "/checkout";
              }}
            >
              <ShoppingCart size={18} />
              {hasMounted && cart.items.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                  {cart.items.length}
                </span>
              )}
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center h-12 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/chooseAccountType"
                  className="w-full flex items-center justify-center h-12 rounded-xl bg-yellow-400 text-sm font-bold text-black transition-colors hover:bg-yellow-500"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {auth.user?.profilePics ? (
                    <Image
                      src={auth.user.profilePics}
                      alt="avatar"
                      width={48}
                      height={48}
                      className="rounded-full object-cover border-2 border-yellow-400"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center text-sm font-bold text-gray-800">
                      {(auth.user?.firstName?.[0] || "") +
                        (auth.user?.lastName?.[0] || "")}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">
                      {(auth.user?.firstName || "") +
                        " " +
                        (auth.user?.lastName || "")}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      {auth.isAgent
                        ? "Professional Profile"
                        : "Customer Profile"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Link
                    href="/"
                    className="flex items-center gap-3 p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="w-[18px] h-[18px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>

                  <Link
                    href="/orders"
                    className="flex items-center gap-3 p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  {auth.isAgent && (
                    <Link
                      href="/vendor"
                      className="flex items-center gap-3 p-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User size={18} />
                      Vendor Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      dispatch(logout());
                      localStorage.removeItem("userToken");
                      localStorage.removeItem("agentToken");
                      localStorage.removeItem("userId");
                      localStorage.removeItem("agentId");
                      localStorage.removeItem("user");
                      window.location.href = "/";
                    }}
                    className="flex items-center gap-3 p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
