"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import { logout, setAuth } from "@/src/store/authSlice";
import { isTokenExpired } from "@/src/Utils/jwt";
import Api from "@/src/Utils/Api";
import mejarclogo from "@/src/assests/images/mejarcnewlogo.png";
import { Search, Heart, ShoppingCart, Menu, X, ChevronDown, LayoutDashboard, User, ShoppingBag, Settings, LogOut, MessageSquare, Bell } from "lucide-react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Buy Plans", href: "/plans" },
    { name: "Custom Design", href: "/custom-design" },
    { name: "Contact us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
];

interface CustomerHeaderProps {
    onOpenMenu?: () => void;
}

const CustomerHeader = ({ onOpenMenu }: CustomerHeaderProps) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifUnreadCount, setNotifUnreadCount] = useState(0);

    const auth = useSelector((state: RootState) => state.auth);
    const cart = useSelector((state: RootState) => state.cart);
    const customDesign = useSelector((state: RootState) => state.customDesign);
    const dispatch = useDispatch();

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);

        // ... (rest of the hydration logic if needed, but I'll add the chat fetch here)
        
        if (auth.userToken) {
            // Fetch Chat Unread Count
            Api.get('/chat/inbox')
                .then((res) => {
                    const count = res.data.reduce((acc: number, conv: any) => acc + (conv.unreadCount || 0), 0);
                    setUnreadCount(count);
                })
                .catch((err) => console.error("Error fetching inbox:", err));

            // Fetch Notifications Unread Count
            Api.get('/notification/unread-count')
                .then((res) => {
                    setNotifUnreadCount(typeof res.data === 'number' ? res.data : (res.data?.count || 0));
                })
                .catch((err) => console.error("Error fetching notification count:", err));
        }
    }, [auth.userToken, dispatch]);

    useEffect(() => {
        setHasMounted(true);

        // Hydrate custom design state from localStorage if needed
        if (typeof window !== "undefined") {
            const savedFlow = localStorage.getItem("customDesignFlow");
            if (savedFlow && !customDesign.isFlowActive) {
                // dispatching startFlow with saved data could be complex here
            }
        }

        // Immediate hydration fallback if Redux is empty
        const token = auth.userToken || (typeof window !== "undefined" ? localStorage.getItem("userToken") : null);
        const userId = auth.userId || (typeof window !== "undefined" ? localStorage.getItem("userId") : null);
        const userJson = typeof window !== "undefined" ? localStorage.getItem("user") : null;
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

    const token = auth.userToken || (hasMounted && typeof window !== "undefined" ? localStorage.getItem("userToken") : null);
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
                        href="/messages"
                        className="rounded-full p-2 bg-[#F5F5F5] border border-gray-300 hover:bg-gray-200 transition relative"
                        title="Messages"
                    >
                        <MessageSquare size={16} className="text-black" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white pulse">
                                {unreadCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        href="/notifications"
                        className="rounded-full p-2 bg-[#F5F5F5] border border-gray-300 hover:bg-gray-200 transition relative"
                        title="Notifications"
                    >
                        <Bell size={16} className="text-black" />
                        {notifUnreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white pulse">
                                {notifUnreadCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        href={customDesign.lastPath || "/custom-design"}
                        className="rounded-full p-2 bg-[#F5F5F5] border border-gray-300 hover:bg-gray-200 transition relative"
                        title="Custom Design Dashboard"
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
                                        Customer
                                    </span>
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Settings</p>
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

                                    {auth.isAgent && (
                                        <Link
                                            href="/vendor"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <User size={16} />
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

                {/* Mobile Menu Button - Now with Premium FAB Design */}
                <button 
                  className="md:hidden bg-yellow-400 text-black p-3.5 rounded-2xl shadow-xl hover:bg-yellow-500 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center border-none cursor-pointer group" 
                  onClick={onOpenMenu}
                  aria-label="Open Navigation Menu"
                >
                    <Menu size={22} className="group-hover:rotate-12 transition-transform" />
                    <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 text-[10px] font-bold uppercase tracking-widest">
                        Menu
                    </span>
                </button>
            </nav>
        </header>
    );
};

export default CustomerHeader;
