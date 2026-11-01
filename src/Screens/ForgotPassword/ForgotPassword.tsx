"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import img1 from "../../assests/images/Maskgroup.png";
import bgimage from "../../assests/images/bgSignup.png";
import Api from "@/src/Utils/Api";
import LoadingSpinner from "@/src/components/Loading/LoadingSpinner";
import CustomModal from "@/src/components/Message/Message";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleForgot = async () => {
    if (!email) {
      setModal({ type: "error", message: "Please enter your email." });
      return;
    }

    setLoading(true);
    try {
      const res = await Api.post("/user/forgot-password", { email });

      setModal({ type: "success", message: res.data.message });

      // optionally redirect to a confirmation page or to reset page
      //   setTimeout(() => {
      //     router.push("/login/reset-password");
      //   }, 1600);
    } catch (e: any) {
      setModal({
        type: "error",
        message: e?.response?.data?.message || "Failed to send reset link.",
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
                Forgot your password?
              </h1>
              <p className="text-gray-900 mb-8">
                Enter your email address, we'll send you a verification code and
                further instructions to reset your password.
              </p>

              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-900">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="johnsmith@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 bg-gray-50 rounded-xl px-4 py-3 border focus:border-gray-300 outline-none text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <button
                onClick={handleForgot}
                disabled={loading}
                className="cursor-pointer w-full bg-[#FFC700] hover:bg-[#E5B300] transition text-black font-bold text-lg py-4 rounded-xl"
              >
                {loading ? "Sending..." : "Continue"}
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
