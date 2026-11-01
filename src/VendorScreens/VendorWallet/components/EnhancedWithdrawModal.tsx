"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import Api from "@/src/Utils/Api";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import BankAccountManagement from "./BankAccountManagement";

interface EnhancedWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  balance: number;
}

interface BankAccount {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  status: string;
  isDefault: boolean;
  verifiedAt?: Date;
}

const presets = [20000, 50000, 100000, 150000, 250000, 500000];

type ModalStep = "verify_bank" | "withdrawal";

export default function EnhancedWithdrawModal({
  isOpen,
  onClose,
  onSuccess,
  balance,
}: EnhancedWithdrawModalProps) {
  const [step, setStep] = useState<ModalStep>("verify_bank");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [verifiedAccount, setVerifiedAccount] = useState<BankAccount | null>(
    null,
  );
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [rules, setRules] = useState<{
    mode: "AUTO" | "MANUAL";
    minWithdrawalAmount: number;
    maxWithdrawalAmount: number;
    autoApproveThreshold: number;
  }>({
    mode: "AUTO",
    minWithdrawalAmount: 1000,
    maxWithdrawalAmount: 5000000,
    autoApproveThreshold: 100000,
  });

  const auth = useSelector((state: RootState) => state.auth);
  const token = auth.agentToken || auth.userToken;

  // Fetch bank accounts & rules on modal open
  useEffect(() => {
    if (isOpen) {
      fetchBankAccounts();
      fetchRules();
    }
  }, [isOpen]);

  const fetchRules = async () => {
    try {
      const res = await Api.get("/wallet/rules");
      if (res.data) {
        setRules({
          mode: res.data.mode?.toUpperCase() === "MANUAL" ? "MANUAL" : "AUTO",
          minWithdrawalAmount: Number(res.data.minWithdrawalAmount || 1000),
          maxWithdrawalAmount: Number(res.data.maxWithdrawalAmount || 5000000),
          autoApproveThreshold: Number(res.data.autoApproveThreshold || 100000),
        });
      }
    } catch (err) {
      console.error("Failed to load withdrawal rules", err);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      setBankLoading(true);
      const res = await Api.get("/wallet/bank-account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBankAccounts(res.data || []);

      // Find verified account
      const verified = res.data?.find(
        (acc: BankAccount) => acc.status === "Verified",
      );
      setVerifiedAccount(verified || null);

      if (verified) {
        setStep("withdrawal");
      } else {
        setStep("verify_bank");
      }
    } catch (err) {
      console.error("Error fetching bank accounts:", err);
      setError("Failed to load bank accounts");
    } finally {
      setBankLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleWithdrawalSubmit = async () => {
    const numAmount = parseFloat(amount.replace(/,/g, ""));

    if (isNaN(numAmount) || numAmount < rules.minWithdrawalAmount) {
      setError(`Minimum withdrawal amount is ₦${rules.minWithdrawalAmount.toLocaleString()}`);
      return;
    }

    if (numAmount > rules.maxWithdrawalAmount) {
      setError(`Maximum withdrawal amount per request is ₦${rules.maxWithdrawalAmount.toLocaleString()}`);
      return;
    }

    if (numAmount > balance) {
      setError("Insufficient balance");
      return;
    }

    if (!verifiedAccount) {
      setError("No verified bank account found");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await Api.post(
        "/wallet/withdraw",
        {
          amount: numAmount,
          description,
          accountDetails: `${verifiedAccount.accountHolderName} - ${verifiedAccount.accountNumber} - ${verifiedAccount.bankName}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setDone(true);
      onSuccess();
      setTimeout(() => {
        onClose();
        setDone(false);
        setAmount("");
        setDescription("");
        setStep("verify_bank");
      }, 2500);
    } catch (err: any) {
      console.error("Withdrawal error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to process withdrawal. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#000000]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[600px] rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {bankLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-sm text-gray-400 font-medium">
              Loading bank accounts...
            </p>
          </div>
        ) : done ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a2e]">
              Withdrawal Submitted
            </h2>
            <p className="text-sm text-gray-500 max-w-[340px]">
              Your withdrawal of ₦{amount} has been submitted successfully.{" "}
              {rules.mode === "AUTO"
                ? "It will be automatically processed to your verified bank account."
                : "It has been queued for Admin review and manual disbursement to your verified bank account."}
            </p>
          </div>
        ) : step === "verify_bank" ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#1a1a2e]">
                  Bank Account Verification
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Verify your bank account to enable withdrawals
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 border border-gray-100 rounded-full hover:bg-gray-50 transition-colors"
              >
                <X size={20} className="text-[#1a1a2e]" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-semibold">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

                      {/* Bank Accounts List + Inline Management */}
            <div className="space-y-4 mb-8">
              <label className="text-sm font-bold text-[#1a1a2e] block">
                Your Bank Accounts
              </label>

              {bankAccounts.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                  <Landmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    No bank accounts yet
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    Add a bank account below to enable automatic withdrawals
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bankAccounts.map((account) => (
                    <div
                      key={account.id}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        account.status === "Verified"
                          ? "bg-green-50 border-green-200 hover:border-green-300"
                          : "bg-yellow-50 border-yellow-200 hover:border-yellow-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-sm text-[#1a1a2e]">
                              {account.accountHolderName}
                            </p>
                            {account.status === "Verified" && (
                              <ShieldCheck
                                size={14}
                                className="text-green-600"
                              />
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {account.accountNumber} • {account.bankName}
                          </p>
                          <p
                            className={`text-xs font-semibold mt-2 ${
                              account.status === "Verified"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {account.status}
                          </p>
                        </div>
                        {account.isDefault && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inline Bank Account Management */}
            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm font-bold text-[#1a1a2e] mb-4">Manage Bank Accounts</p>
              <BankAccountManagement onUpdate={fetchBankAccounts} />
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#1a1a2e]">
                  Withdraw Funds
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Only cleared funds can be withdrawn
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 border border-gray-100 rounded-full hover:bg-gray-50 transition-colors"
              >
                <X size={20} className="text-[#1a1a2e]" />
              </button>
            </div>

            {/* Bank Account Display */}
            {verifiedAccount && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} className="text-green-600" />
                  <p className="text-xs font-bold text-green-900">
                    Withdrawal Bank Account
                  </p>
                </div>
                <p className="text-sm font-bold text-[#1a1a2e]">
                  {verifiedAccount.accountHolderName}
                </p>
                <p className="text-xs text-gray-600">
                  {verifiedAccount.accountNumber} • {verifiedAccount.bankName}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-semibold">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Amount Input Section */}
            <div className="flex items-center gap-2 mb-8">
              <span className="text-3xl font-extrabold text-[#1a1a2e]">₦</span>
              <div className="flex-1 flex items-center">
                <div className="w-[3px] h-10 bg-blue-500 mr-2"></div>
                <input
                  type="text"
                  className="text-4xl font-bold text-[#1a1a2e] placeholder:text-gray-200 focus:outline-none w-full bg-transparent"
                  placeholder="00.00"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, "");
                    setAmount(val);
                  }}
                />
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {presets.map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className="py-3.5 bg-gray-50 rounded-xl text-sm font-bold text-gray-600 hover:bg-[#FFC700]/10 hover:text-[#1a1a2e] transition-all border border-transparent hover:border-[#FFC700]"
                >
                  ₦{val.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Descriptions */}
            <div className="mb-8">
              <label className="text-sm font-bold text-[#1a1a2e] mb-3 block">
                Description (Optional)
              </label>
              <textarea
                className="w-full h-20 p-4 rounded-[18px] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFC700]/50 text-xs text-gray-600 resize-none"
                placeholder="Add purpose of withdrawal..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Info Box */}
            <div className={`p-4 rounded-2xl mb-8 border ${
              rules.mode === "AUTO"
                ? "bg-blue-50 border-blue-100 text-blue-900"
                : "bg-amber-50 border-amber-100 text-amber-900"
            }`}>
              <p className="text-xs font-medium m-0 leading-relaxed">
                <span className="font-bold">
                  {rules.mode === "AUTO" ? "Automated Paystack Processing:" : "Manual Admin Disbursement:"}
                </span>{" "}
                {rules.mode === "AUTO"
                  ? `Withdrawals up to ₦${rules.autoApproveThreshold.toLocaleString()} are transferred automatically via Paystack. Larger amounts require Admin clearance.`
                  : "Your withdrawal request will be reviewed and disbursed manually by Admin directly to your verified bank account."}
                {" "}Allowed range: <strong>₦{rules.minWithdrawalAmount.toLocaleString()}</strong> – <strong>₦{rules.maxWithdrawalAmount.toLocaleString()}</strong>.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep("verify_bank")}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#1a1a2e] font-bold text-sm rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleWithdrawalSubmit}
                disabled={loading || !amount}
                className="flex-1 px-6 py-3 bg-[#FFC700] hover:bg-[#e5b300] disabled:bg-gray-100 disabled:text-gray-400 text-[#1a1a2e] font-extrabold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Withdrawal"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
