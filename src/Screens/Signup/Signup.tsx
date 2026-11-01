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

// Reusable Input Component for cleaner code
const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  togglePassword,
  showPassword,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder: string;
  togglePassword?: () => void;
  showPassword?: boolean;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-900 ml-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-50 border border-transparent focus:border-gray-300 focus:bg-white text-gray-900 rounded-xl px-4 py-3.5 transition-all outline-none placeholder:text-gray-400"
      />
      {togglePassword && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  </div>
);

export default function SignupPage() {
  const router = useRouter();

  // ===== FORM STATE =====
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState<{
    type: "success" | "error";
    title?: string; // Added title
    message: string;
    buttonText?: string; // Added buttonText
  } | null>(null);

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password) {
      setModal({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    if (password.length < 6) {
      setModal({
        type: "error",
        message: "Password must be at least 6 characters.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setModal({
        type: "error",
        message: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "dto",
        JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
        }),
      );

      // If later you add profile image upload:
      // if (profileImage) {
      //   formData.append("imgFile", profileImage);
      // }

      await Api.post("/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setModal({
        type: "success",
        title: "Account Verification",
        message:
          "Thank you for completing your registration. Your account is now under review.",
        buttonText: "Acknowledged",
      });

      // Keep redirect or let user click acknowledged?
      // The design looks like a manual "Acknowledged" action.
      // But purely for flow, we usually redirect.
      // I'll keep the redirect but delay it a bit longer so they can read/click.
      setTimeout(() => router.push("/login"), 3000);
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message;
      setModal({
        type: "error",
        message: Array.isArray(errorMsg)
          ? errorMsg.join(", ")
          : (errorMsg || "Signup failed. Please try again later."),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="w-full min-h-screen flex items-center justify-center p-4 sm:p-8 bg-cover bg-center relative font-sans"
        style={{ backgroundImage: `url(${bgimage.src})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        {/* MAIN CARD CONTAINER */}
        {/* <div className="relative w-full max-w-[1200px] min-h-[450px] bg-white rounded-[40px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[2fr_3fr]"> */}
        <div className="relative w-full max-w-[1000px] bg-white rounded-[40px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
          {/* LEFT SIDE: FORM */}
          <div className="w-full h-full flex flex-col justify-center px-8 sm:px-12 md:px-16 py-12 lg:py-16 overflow-y-auto">
            <div className="max-w-[500px] w-full mx-auto flex flex-col h-full">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Sign Up
                </h1>
                <p className="text-gray-900 text-base">
                  Create a Free MEJARC Account
                </p>
              </div>

              {/* INPUTS CONTAINER */}
              <div className="flex-1 space-y-5">
                <InputField
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <InputField
                  label="Last Name"
                  placeholder="Smith"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />

                <InputField
                  label="Your Email"
                  type="email"
                  placeholder="johnsmith@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <InputField
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <InputField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  togglePassword={() => setShowPassword(!showPassword)}
                  showPassword={showPassword}
                />

                <InputField
                  label="Confirm Password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  togglePassword={() => setShowConfirm(!showConfirm)}
                  showPassword={showConfirm}
                />

                {/* SIGN UP BUTTON */}
                <button
                  disabled={loading}
                  onClick={handleSignup}
                  className="cursor-pointer w-full mt-4 bg-[#FFC700] hover:bg-[#E5B300] active:scale-[0.99] transition-all text-black font-bold text-lg py-4 rounded-xl shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating account..." : "Sign up"}
                </button>
              </div>

              {/* FOOTER: GOOGLE + LOGIN */}
              <div className="mt-8 pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                  {/* Google Sign Up (Visual Only based on request) */}
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Sign up with Google</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <span className="text-gray-900">
                      Already have an account?
                    </span>
                    <Link
                      href="/login"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: IMAGE */}
          <div className="hidden lg:block w-full h-full relative p-4">
            {/* The image container has rounded corners to match the card */}
            <div className="relative w-full h-full rounded-[22px] overflow-hidden">
              <Image
                src={img1}
                alt="Modern House"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Optional overlay gradient for text visibility if needed, though design looks clean */}
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <CustomModal
          type={modal.type}
          title={modal.title}
          message={modal.message}
          buttonText={modal.buttonText}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
