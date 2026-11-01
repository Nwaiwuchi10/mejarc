"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import img1 from "../../assests/images/Maskgroup.png";
import bgimage from "../../assests/images/bgSignup.png";
import Api from "@/src/Utils/Api";

import CustomModal from "@/src/components/Message/Message";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  //   const preToken = searchParams?.get("token") || "";

  //   const [token, setToken] = useState(preToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  // const [token, setToken] = useState("");

  const [token, setToken] = useState("");

  useEffect(() => {
    if (!searchParams) return;

    const paramToken = searchParams.get("token") || "";
    setToken(paramToken);
  }, [searchParams]);

  const handleReset = async () => {
    if (!token || !password || !confirmPassword) {
      setModal({ type: "error", message: "Please fill in all fields." });
      return;
    }

    if (password !== confirmPassword) {
      setModal({ type: "error", message: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const res = await Api.post("/user/reset-password", {
        token,
        newPassword: password,
      });

      setModal({
        type: "success",
        message: res.data.message || "Password reset successfully.",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1400);
    } catch (e: any) {
      setModal({
        type: "error",
        message: e?.response?.data?.message || "Reset failed.",
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
          <div className="flex flex-col justify-center px-8 sm:px-12 md:px-16 py-12">
            <div className="max-w-[450px] mx-auto w-full">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-900 mb-8">
                Enter the verification code we sent to your email to continue.
              </p>

              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-900">
                  Enter Code
                </label>
                <input
                  type="text"
                  placeholder="Enter token or code"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full mt-1 bg-gray-50 rounded-xl px-4 py-3 border focus:border-gray-300 outline-none text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="mb-5 relative">
                <label className="text-sm font-semibold text-gray-900">
                  New Password
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="mb-5 relative">
                <label className="text-sm font-semibold text-gray-900">
                  Confirm Password
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 bg-gray-50 rounded-xl px-4 py-3 border focus:border-gray-300 outline-none text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-[42px] text-gray-400"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                onClick={handleReset}
                disabled={loading}
                className="cursor-pointer w-full bg-[#FFC700] hover:bg-[#E5B300] transition text-black font-bold text-lg py-4 rounded-xl"
              >
                {loading ? "Processing..." : "Continue"}
              </button>

              <div className="mt-6 text-sm text-gray-900">
                Remembered your password?{" "}
                <a href="/login" className="text-blue-600 font-semibold">
                  Login
                </a>
              </div>
            </div>
          </div>

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
