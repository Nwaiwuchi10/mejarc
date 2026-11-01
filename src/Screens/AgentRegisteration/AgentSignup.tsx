"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  ChevronDown,
  Check,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import img1 from "../../assests/images/agentsignup.png";
import bgimage from "../../assests/images/bgagent.png";
import Api from "@/src/Utils/Api";

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

export default function AgentSignupPage() {
  const router = useRouter();

  // ===== FORM STATE =====
  const [step, setStep] = useState<"signup" | "profile" | "bio" | "kyc">(
    "signup",
  );

  // Account Signup State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);
  const agentIdRef = useRef<string | null>(null);

  // Profile State
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [preferredTitle, setPreferredTitle] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [specialization, setSpecialization] = useState<string[]>([]);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [bio, setBio] = useState("");

  const TITLES_REQUIRING_LICENSE = ["Architect", "Structural Engineer"];

  // KYC State
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [architectCert, setArchitectCert] = useState<File | null>(null);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  const [modal, setModal] = useState<{
    type: "success" | "error";
    title?: string;
    message: string;
    buttonText?: string;
  } | null>(null);
  const handleSignups = () => {
    setStep("profile");
  };
  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
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

      const userResponse = await Api.post("/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newUserId = userResponse.data.id;
      setUserId(newUserId);
      userIdRef.current = newUserId;

      // Initialize agent record
      const agentResponse = await Api.post(`/agent/initialize/${newUserId}`);
      setAgentId(agentResponse.data.id);
      agentIdRef.current = agentResponse.data.id;

      // On success, move to profile step
      setStep("profile");
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

  const handleProfileSubmit = async () => {
    if (!yearsOfExperience || !preferredTitle || specialization.length === 0) {
      setModal({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    if (
      TITLES_REQUIRING_LICENSE.includes(preferredTitle) &&
      !licenseNumber.trim()
    ) {
      setModal({
        type: "error",
        message: `A license number is required for ${preferredTitle}.`,
      });
      return;
    }

    setLoading(true);

    try {
      // Wait briefly for user/agent ids to be available to avoid sending undefined
      const waitFor = async (
        getVal: () => string | null | undefined,
        timeout = 1500,
      ) => {
        const start = Date.now();
        while (!getVal() && Date.now() - start < timeout) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((res) => setTimeout(res, 100));
        }
        return getVal();
      };

      const idToUse =
        (await waitFor(() => userIdRef.current ?? userId)) ||
        (await waitFor(() => agentIdRef.current ?? agentId));
      if (!idToUse) {
        setModal({
          type: "error",
          message:
            "Unable to determine account id. Please retry after a moment.",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append(
        "dto",
        JSON.stringify({
          yearsOfExperience: parseInt(yearsOfExperience),
          preferredTitle,
          ...(TITLES_REQUIRING_LICENSE.includes(preferredTitle) && {
            licenseNumber,
          }),
          specialization,
          portfolioLink,
          phoneNumber,
        }),
      );

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await Api.post(`/agent/${idToUse}/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStep("bio");
    } catch (e: any) {
      setModal({
        type: "error",
        message:
          e?.response?.data?.message ||
          "Profile submission failed. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBioSubmit = async () => {
    if (!bio) {
      setModal({
        type: "error",
        message: "Please enter your bio.",
      });
      return;
    }

    setLoading(true);

    try {
      await Api.patch(`/agent/${agentId}/bio`, {
        bio,
      });

      setStep("kyc");
    } catch (e: any) {
      setModal({
        type: "error",
        message:
          e?.response?.data?.message ||
          "Bio submission failed. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKYCSubmit = async () => {
    if (
      !idType ||
      !idNumber ||
      !bankName ||
      !accountNumber ||
      !accountHolderName
    ) {
      setModal({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    setLoading(true);

    try {
      // Ensure agent id is available before submitting KYC (initialization can be slightly delayed)
      const waitForAgent = async (timeout = 2000) => {
        const start = Date.now();
        while (
          !agentIdRef.current &&
          !agentId &&
          Date.now() - start < timeout
        ) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((res) => setTimeout(res, 100));
        }
        return agentIdRef.current ?? agentId;
      };

      const resolvedAgentId = await waitForAgent();
      if (!resolvedAgentId) {
        setModal({
          type: "error",
          message: "Agent not ready yet. Please retry after a moment.",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append(
        "dto",
        JSON.stringify({
          idType,
          idNumber,
          bankName,
          accountNumber,
          accountHolderName,
        }),
      );

      if (idDocument) {
        formData.append("idDocument", idDocument);
      }
      if (architectCert) {
        formData.append("architectCert", architectCert);
      }

      await Api.post(`/agent/${resolvedAgentId}/kyc`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setModal({
        type: "success",
        title: "Processing Application",
        message:
          "Your request has been submitted successfully. Our administrative team will review your application and provide approval shortly. You will be notified once the process is complete.",
        buttonText: "Return to Login",
      });
      setTimeout(() => router.push("/login"), 5000);
    } catch (e: any) {
      setModal({
        type: "error",
        message:
          e?.response?.data?.message ||
          "KYC submission failed. Please try again later.",
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
        {/* <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" /> */}

        <div
          className={`relative w-full ${step === "bio" ? "max-w-[800px]" : "max-w-[1050px]"} bg-white rounded-[40px] shadow-2xl overflow-hidden grid grid-cols-1 ${step === "bio" ? "" : "lg:grid-cols-[1fr_1.2fr]"} transition-all duration-500`}
        >
          {/* LEFT SIDE: FORM SECTIONS */}
          <div
            className={`w-full h-full flex flex-col justify-center px-8 sm:px-12 md:px-16 py-12 lg:py-16 overflow-y-auto ${step === "bio" ? "items-center" : ""}`}
          >
            {step === "signup" && (
              <div className="max-w-[500px] w-full mx-auto flex flex-col h-full">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Sign Up
                  </h1>
                  <p className="text-gray-900 text-base">
                    Create a Free MEJARC Account
                  </p>
                </div>

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

                  <button
                    disabled={loading}
                    onClick={handleSignup}
                    className="cursor-pointer w-full mt-4 bg-[#FFC700] hover:bg-[#E5B300] active:scale-[0.99] transition-all text-black font-bold text-lg py-4 rounded-xl shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating account..." : "Continue"}
                  </button>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                    <button className="flex items-center gap-2 text-gray-900 hover:text-black transition-colors font-medium">
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
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
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
            )}

            {step === "profile" && (
              <ProfileSection
                yearsOfExperience={yearsOfExperience}
                setYearsOfExperience={setYearsOfExperience}
                preferredTitle={preferredTitle}
                setPreferredTitle={(title: string) => {
                  setPreferredTitle(title);
                  setLicenseNumber("");
                }}
                licenseNumber={licenseNumber}
                setLicenseNumber={setLicenseNumber}
                specialization={specialization}
                setSpecialization={setSpecialization}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                portfolioLink={portfolioLink}
                setPortfolioLink={setPortfolioLink}
                profilePicture={profilePicture}
                setProfilePicture={setProfilePicture}
                loading={loading}
                onContinue={handleProfileSubmit}
              />
            )}

            {step === "bio" && (
              <BioSection
                bio={bio}
                setBio={setBio}
                loading={loading}
                onSave={handleBioSubmit}
                onBack={() => setStep("profile")}
              />
            )}

            {step === "kyc" && (
              <KYCSection
                idType={idType}
                setIdType={setIdType}
                idNumber={idNumber}
                setIdNumber={setIdNumber}
                idDocument={idDocument}
                setIdDocument={setIdDocument}
                architectCert={architectCert}
                setArchitectCert={setArchitectCert}
                bankName={bankName}
                setBankName={setBankName}
                accountNumber={accountNumber}
                setAccountNumber={setAccountNumber}
                accountHolderName={accountHolderName}
                setAccountHolderName={setAccountHolderName}
                loading={loading}
                onSubmit={handleKYCSubmit}
              />
            )}
          </div>

          {/* RIGHT SIDE: IMAGE */}
          {step !== "bio" && (
            <div className="hidden lg:block w-full h-full relative p-3">
              <div className="relative w-full h-full rounded-[32px] overflow-hidden">
                <Image
                  src={img1}
                  alt="Modern House"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          )}
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
      </div>
    </>
  );
}

// --- SUB-COMPONENTS ---

const BioSection = ({ bio, setBio, onSave, onBack, loading }: any) => {
  return (
    <div className="max-w-[600px] w-full mx-auto flex flex-col h-full relative">
      <button
        onClick={onBack}
        className="absolute right-0 top-0 w-8 h-8 flex items-center justify-center rounded-full border border-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        title="Go Back"
      >
        <span className="text-xl">×</span>
      </button>

      <div className="mb-6 text-center pt-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Bio</h1>
        <p className="text-gray-900 text-sm max-w-[400px] mx-auto leading-relaxed">
          Short description of background, design philosophy, notable projects.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="relative flex-1 min-h-[300px]">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Text Here"
            className="w-full h-full p-6 bg-white border border-gray-100 rounded-[20px] shadow-sm outline-none text-gray-900 resize-none font-sans text-sm placeholder:text-gray-400"
          />
        </div>

        <div className="flex justify-end pb-4">
          <button
            disabled={loading}
            onClick={onSave}
            className="bg-[#FFC700] hover:bg-[#E5B300] text-black font-bold px-12 py-3 rounded-lg shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const PROFESSIONAL_TITLES = [
  { label: "Architect", requiresLicense: true },
  { label: "Structural Engineer", requiresLicense: true },
  { label: "MEP Engineer", requiresLicense: false },
  { label: "Architectural Designer", requiresLicense: false },
  { label: "BIM Modeller", requiresLicense: false },
  { label: "Landscape Architect", requiresLicense: false },
  { label: "Product Designer", requiresLicense: false },
];

function ProfileSection({
  yearsOfExperience,
  setYearsOfExperience,
  preferredTitle,
  setPreferredTitle,
  licenseNumber,
  setLicenseNumber,
  specialization,
  setSpecialization,
  phoneNumber,
  setPhoneNumber,
  portfolioLink,
  setPortfolioLink,
  profilePicture,
  setProfilePicture,
  loading,
  onContinue,
}: any) {
  const [isSpecOpen, setIsSpecOpen] = useState(false);
  const specOptions = [
    "Residential",
    "Commercial",
    "Landscape",
    "Urban Planning",
    "Product Design",
  ];

  const selectedTitleObj = PROFESSIONAL_TITLES.find(
    (t) => t.label === preferredTitle,
  );
  const requiresLicense = selectedTitleObj?.requiresLicense ?? false;

  const toggleSpecialization = (spec: string) => {
    if (specialization.includes(spec)) {
      setSpecialization(specialization.filter((s: string) => s !== spec));
    } else {
      setSpecialization([...specialization, spec]);
    }
  };

  return (
    <div className="max-w-[500px] w-full mx-auto flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Profile</h1>
        <p className="text-gray-900 text-base">
          Tell us more about your expertise
        </p>
      </div>

      <div className="flex-1 space-y-5">
        {/* Years of Experience Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-900 ml-1">
            Years of Experience
          </label>
          <div className="relative">
            <select
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              className="w-full bg-gray-50 border border-transparent focus:border-gray-300 focus:bg-white text-gray-900 rounded-xl px-4 py-3.5 outline-none appearance-none cursor-pointer"
            >
              <option value="">Select Experience</option>
              {[...Array(21)].map((_, i) => (
                <option key={i} value={i}>
                  {i === 20
                    ? "20+ years"
                    : `${i} ${i === 1 ? "year" : "years"}`}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
        </div>

        {/* Preferred Title Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-900 ml-1">
            Preferred Title
          </label>
          <div className="relative">
            <select
              value={preferredTitle}
              onChange={(e) => setPreferredTitle(e.target.value)}
              className="w-full bg-gray-50 border border-transparent focus:border-gray-300 focus:bg-white text-gray-900 rounded-xl px-4 py-3.5 outline-none appearance-none cursor-pointer"
            >
              <option value="">Select Professional Title</option>
              {PROFESSIONAL_TITLES.map((t) => (
                <option key={t.label} value={t.label}>
                  {t.label}
                  {t.requiresLicense ? " (Requires a License)" : ""}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
        </div>

        {/* Conditional License Number Field */}
        {requiresLicense && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-900 ml-1">
              License Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your professional license number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full bg-amber-50 border border-amber-200 focus:border-amber-400 focus:bg-white text-gray-900 rounded-xl px-4 py-3.5 transition-all outline-none placeholder:text-gray-400"
              />
            </div>
            <p className="text-xs text-amber-600 ml-1">
              Required for licensed professionals. Enter your official
              registration number.
            </p>
          </div>
        )}

        {/* Custom Specialization Multi-select */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-sm font-semibold text-gray-900 ml-1">
            Specialization
          </label>
          <div
            onClick={() => setIsSpecOpen(!isSpecOpen)}
            className="w-full bg-gray-50 border border-transparent focus:border-gray-300 bg-white text-gray-900 rounded-xl px-4 py-3.5 flex justify-between items-center cursor-pointer min-h-[52px]"
          >
            <span
              className={
                specialization.length
                  ? "text-gray-900 text-sm"
                  : "text-gray-400 text-sm"
              }
            >
              {specialization.length
                ? specialization.join(", ")
                : "Select Specialization"}
            </span>
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform ${isSpecOpen ? "rotate-180" : ""}`}
            />
          </div>

          {isSpecOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 p-2 space-y-1">
              <div className="p-2 text-xs font-bold text-gray-900">Select</div>
              {specOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => toggleSpecialization(opt)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${specialization.includes(opt) ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}
                  >
                    {specialization.includes(opt) && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>
                  <span className="text-gray-700 font-medium">{opt}</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-100">
                <input
                  placeholder="Enter Specialization"
                  className="w-full px-3 py-2 text-sm outline-none border border-gray-100 rounded-lg bg-gray-50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val && !specialization.includes(val)) {
                        toggleSpecialization(val);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <InputField
          label="Phone Number"
          type="tel"
          placeholder="+1 234 567 8900"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <InputField
          label="Portfolio Link / Social Link"
          placeholder="https://..."
          value={portfolioLink}
          onChange={(e) => setPortfolioLink(e.target.value)}
        />

        {/* Profile Picture Upload */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <span className="text-sm font-medium text-gray-900">
              Profile Picture / Logo
            </span>
            <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload size={18} />
              <span className="text-sm font-semibold">Upload File</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                accept="image/*"
              />
            </label>
          </div>

          {profilePicture && (
            <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-200 relative">
                  <Image
                    src={URL.createObjectURL(profilePicture)}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">
                    {profilePicture.name}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {(profilePicture.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <button
                onClick={() => setProfilePicture(null)}
                className="p-1.5 hover:bg-red-50 text-red-500 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <button
          disabled={loading}
          onClick={onContinue}
          className="cursor-pointer w-full mt-4 bg-[#FFC700] hover:bg-[#E5B300] active:scale-[0.99] transition-all text-black font-bold text-lg py-4 rounded-xl shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

function KYCSection({
  idType,
  setIdType,
  idNumber,
  setIdNumber,
  setIdDocument,
  setArchitectCert,
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  accountHolderName,
  setAccountHolderName,
  idDocument,
  architectCert,
  loading,
  onSubmit,
}: any) {
  return (
    <div className="max-w-[500px] w-full mx-auto flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          KYC Verification
        </h1>
        <p className="text-gray-900 text-base">
          Security and verification details
        </p>
      </div>

      <div className="flex-1 space-y-5">
        {/* ID Type Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-900 ml-1">
            ID Type
          </label>
          <div className="relative">
            <select
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
              className="w-full bg-gray-50 border border-transparent focus:border-gray-300 focus:bg-white text-gray-900 rounded-xl px-4 py-3.5 outline-none appearance-none cursor-pointer"
            >
              <option value="">Select ID Type</option>
              <option value="Nin">NIN</option>
              <option value="Passport">International Passport</option>
              <option value="DriversLicense">Driver's License</option>
              <option value="VotersCard">Voter's Card</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
        </div>

        <InputField
          label="ID Number"
          placeholder="Enter identity number"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
        />

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <span className="text-sm font-medium text-gray-900">
                Upload ID Document
              </span>
              <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload size={18} />
                <span className="text-sm font-semibold">Upload File</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setIdDocument(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            {idDocument && (
              <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  {idDocument.type.startsWith("image/") ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-200 relative">
                      <Image
                        src={URL.createObjectURL(idDocument)}
                        alt="ID Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded text-blue-500">
                      <FileText size={18} />
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">
                      {idDocument.name}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {(idDocument.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIdDocument(null)}
                  className="p-1.5 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-left">
              <span className="text-sm font-medium text-gray-900 pr-2 leading-tight">
                Architect Registration Certificate / License
              </span>
              <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors whitespace-nowrap">
                <Upload size={18} />
                <span className="text-sm font-semibold">Upload File</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setArchitectCert(e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>
            {architectCert && (
              <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  {architectCert.type.startsWith("image/") ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-200 relative">
                      <Image
                        src={URL.createObjectURL(architectCert)}
                        alt="Cert Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded text-blue-500">
                      <FileText size={18} />
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">
                      {architectCert.name}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {(architectCert.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setArchitectCert(null)}
                  className="p-1.5 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-[#FFC700]" />
            Bank Account Details
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
              label="Bank Name"
              placeholder="e.g. Zenith"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
            <InputField
              label="Account Number"
              placeholder="0123456789"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
          <InputField
            label="Account Holder Name"
            placeholder="John Smith"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          onClick={onSubmit}
          className="cursor-pointer w-full mt-4 bg-[#FFC700] hover:bg-[#E5B300] active:scale-[0.99] transition-all text-black font-bold text-lg py-4 rounded-xl shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
