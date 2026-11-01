"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import img1 from "../../assests/images/Maskgroup.png";
import bgimage from "../../assests/images/bgSignup.png";
import Api from "@/src/Utils/Api";
import LoadingSpinner from "@/src/components/Loading/LoadingSpinner";
import CustomModal from "@/src/components/Message/Message";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setModal({ type: "error", message: "Please fill in all fields." });
      return;
    }

    setLoading(true);

    try {
      const res = await Api.post("/user/login", {
        email,
        password,
      });

      setModal({
        type: "success",
        message: res.data.message,
      });

      // Redirect to verification page with email
      setTimeout(() => {
        router.push(`/login/verify?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (e: any) {
      setModal({
        type: "error",
        message:
          e?.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="w-full min-h-screen flex items-center justify-center p-4 sm:p-8 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgimage.src})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        <div className="relative w-full max-w-[1000px] bg-white rounded-[40px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
          {/* LEFT SIDE */}
          <div className="flex flex-col justify-center px-8 sm:px-12 md:px-16 py-12">
            <div className="max-w-[450px] mx-auto w-full">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Login</h1>
              <p className="text-gray-900 mb-8">Welcome back to MEJARC</p>

              {/* EMAIL */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="john@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 bg-gray-50 rounded-xl px-4 py-3 border focus:border-gray-300 outline-none text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-6 relative">
                <label className="text-sm font-semibold text-gray-900">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 bg-gray-50 rounded-xl px-4 py-3 border focus:border-gray-300 outline-none text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[42px] text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="cursor-pointer w-full bg-[#FFC700] hover:bg-[#E5B300] transition text-black font-bold text-lg py-4 rounded-xl"
              >
                {loading ? "Processing..." : "Login"}
              </button>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => router.push("/login/forgot-password")}
                  className="text-sm text-blue-600 cursor-pointer hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-900">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 font-semibold">
                  Sign up
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden lg:block relative p-4">
            <div className="relative w-full h-full rounded-[22px] overflow-hidden">
              <Image
                src={img1}
                alt="Modern House"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <CustomModal
          type={modal.type}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
