"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Api from "@/src/Utils/Api";
import { useDispatch } from "react-redux";
import { setAuth } from "@/src/store/authSlice";
import LoadingSpinner from "@/src/components/Loading/LoadingSpinner";
import CustomModal from "@/src/components/Message/Message";
import { useSearchParams } from "next/navigation";
import bgimage from "../../assests/images/bgSignup.png";

export default function VerifyLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams!.get("email") || "";

  const [verificationToken, setVerificationToken] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [modal, setModal] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleVerify = async () => {
    if (!verificationToken) {
      setModal({ type: "error", message: "Enter verification code." });
      return;
    }

    setLoading(true);

    try {
      const res = await Api.post("/user/verify-login-token", {
        email,
        verificationToken,
      });

      // Save tokens and user info for app
      // (we already obtained `dispatch` above; calling hooks inside
      // event handlers is invalid and was triggering an error that
      // made the request appear to "fail" although the network call
      // succeeded.)
      const userToken = res.data.userToken ?? res.data.token ?? null;
      const agentToken = res.data.agentToken ?? null;
      const userId =
        res.data.userId ?? (res.data.user && res.data.user.id) ?? null;
      const agentId = res.data.agentId ?? null;
      const isAgent = !!(agentToken || agentId || res.data.isAgent);
      const isAgentApproved = !!res.data.isAgentApproved;

      try {
        if (userToken) localStorage.setItem("userToken", userToken);
        if (agentToken) localStorage.setItem("agentToken", agentToken);
        if (userId) localStorage.setItem("userId", userId);
        if (agentId) localStorage.setItem("agentId", agentId);
        localStorage.setItem("isAgentApproved", isAgentApproved ? "true" : "false");
        if (res.data.user)
          localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (_) { }

      dispatch(
        setAuth({
          userToken,
          agentToken,
          userId,
          agentId,
          isAgent,
          isAgentApproved,
          user: res.data.user ?? null,
        }),
      );

      setModal({ type: "success", message: "Login successful!" });

      setTimeout(() => {
        // Redirect based on agent status
        if (isAgent) {
          router.push("/vendor");
        } else {
          router.push("/");
        }
      }, 800);
    } catch (e: any) {
      // log the error so we can see what happened when debugging
      console.error("verification error", e);
      setModal({
        type: "error",
        message: e?.response?.data?.message || "Verification failed.",
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
        {/* <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" /> */}
        {/* <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6"> */}
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Email Verification</h2>
          <p className="text-gray-900 mb-6 text-sm">
            Enter the verification code sent to <strong>{email}</strong>
          </p>

          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={verificationToken}
            onChange={(e) => setVerificationToken(e.target.value.toUpperCase())}
            className="w-full bg-gray-50 border rounded-xl px-4 py-3 mb-6 outline-none focus:border-gray-300 text-gray-900 placeholder:text-gray-400"
          />

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-[#FFC700] hover:bg-[#E5B300] text-black font-bold py-3 rounded-xl"
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </button>
        </div>
        {/* </div> */}
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
