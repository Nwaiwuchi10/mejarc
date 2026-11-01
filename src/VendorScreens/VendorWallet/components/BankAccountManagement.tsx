"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  Check,
  Landmark,
} from "lucide-react";
import Api from "@/src/Utils/Api";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";

interface BankAccount {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  status: string;
  isDefault: boolean;
  verifiedAt?: Date;
  createdAt: Date;
}

interface Bank {
  code: string;
  name: string;
  longname: string;
}

export default function BankAccountManagement({ onUpdate }: { onUpdate?: () => void } = {}) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    bankCode: "",
    bankName: "",
  });

  const [verifyFormData, setVerifyFormData] = useState({
    accountNumber: "",
    bankCode: "",
  });

  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const auth = useSelector((state: RootState) => state.auth);
  const token = auth.agentToken || auth.userToken;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accountsRes, banksRes] = await Promise.all([
        Api.get("/wallet/bank-account", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        Api.get("/wallet/banks"),
      ]);

      setBankAccounts(accountsRes.data || []);
      
      // Filter duplicate banks by code to prevent duplicate key errors
      const uniqueBanks = (banksRes.data || []).reduce((acc: Bank[], current: Bank) => {
        const x = acc.find(item => item.code === current.code);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      setBanks(uniqueBanks);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("Failed to load bank accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterBank = async () => {
    if (!formData.accountHolderName.trim()) {
      setError("Account holder name is required");
      return;
    }
    if (formData.accountNumber.length !== 10) {
      setError("Account number must be 10 digits");
      return;
    }
    if (!formData.bankCode) {
      setError("Please select a bank");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await Api.post("/wallet/bank-account/register", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Bank account registered successfully! Please verify it.");
      setFormData({
        accountHolderName: "",
        accountNumber: "",
        bankCode: "",
        bankName: "",
      });
      setShowModal(false);

      // Refresh accounts list
      await fetchData();
      onUpdate?.();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to register bank account",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyBank = async (bankAccountId: string) => {
    const account = bankAccounts.find((acc) => acc.id === bankAccountId);
    if (!account) return;

    try {
      setSubmitting(true);
      setError(null);
      setVerifyingId(bankAccountId);

      await Api.post(
        `/wallet/bank-account/verify/${bankAccountId}`,
        {
          accountNumber: account.accountNumber,
          bankCode: account.bankCode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSuccess("Bank account verified successfully!");
      await fetchData();
      onUpdate?.();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify bank account");
    } finally {
      setSubmitting(false);
      setVerifyingId(null);
    }
  };

  const handleSetDefault = async (bankAccountId: string) => {
    try {
      setSubmitting(true);
      setError(null);

      await Api.patch(
        `/wallet/bank-account/default/${bankAccountId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSuccess("Default bank account updated!");
      await fetchData();
      onUpdate?.();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to set default bank account",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBank = async (bankAccountId: string) => {
    if (!confirm("Are you sure you want to delete this bank account?")) return;

    try {
      setSubmitting(true);
      setError(null);

      await Api.delete(`/wallet/bank-account/${bankAccountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Bank account deleted successfully!");
      await fetchData();
      onUpdate?.();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete bank account");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-sm text-gray-400">Loading bank accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e]">Bank Accounts</h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage your bank accounts for withdrawals
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          Add Bank Account
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-xs font-semibold">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3 text-green-600 text-xs font-semibold">
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}

      {/* Bank Accounts List */}
      {bankAccounts.length === 0 ? (
        <div className="p-8 bg-gray-50 border border-gray-100 rounded-lg text-center">
          <Landmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-sm font-semibold text-gray-600 mb-2">
            No bank accounts yet
          </p>
          <p className="text-xs text-gray-400">
            Add a bank account to enable automatic withdrawals
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              className={`p-5 rounded-lg border-2 transition-all ${
                account.status === "Verified"
                  ? "bg-green-50 border-green-200"
                  : account.status === "Rejected"
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-sm text-[#1a1a2e]">
                      {account.accountHolderName}
                    </h3>
                    {account.status === "Verified" && (
                      <Check
                        size={16}
                        className="text-green-600 bg-green-100 rounded-full p-0.5"
                      />
                    )}
                    {account.isDefault && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Account: {account.accountNumber}
                  </p>
                  <p className="text-xs text-gray-600 mb-3">
                    Bank: {account.bankName}
                  </p>
                  <p
                    className={`text-xs font-semibold ${
                      account.status === "Verified"
                        ? "text-green-600"
                        : account.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    Status: {account.status}
                  </p>
                </div>

                <div className="flex gap-2">
                  {account.status === "Pending" && (
                    <button
                      onClick={() => handleVerifyBank(account.id)}
                      disabled={submitting || verifyingId === account.id}
                      className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors flex items-center gap-1"
                    >
                      {verifyingId === account.id ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify"
                      )}
                    </button>
                  )}
                  {account.status === "Verified" && !account.isDefault && (
                    <button
                      onClick={() => handleSetDefault(account.id)}
                      disabled={submitting}
                      className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded hover:bg-gray-600 disabled:bg-gray-300 transition-colors"
                    >
                      Set Default
                    </button>
                  )}
                  {!account.isDefault && (
                    <button
                      onClick={() => handleDeleteBank(account.id)}
                      disabled={submitting}
                      className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 disabled:bg-gray-300 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Bank Account Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">
              Add New Bank Account
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-[#1a1a2e] mb-2">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accountHolderName: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a1a2e] mb-2">
                  Bank *
                </label>
                <select
                  value={formData.bankCode}
                  onChange={(e) => {
                    const selected = banks.find(
                      (b) => b.code === e.target.value,
                    );
                    setFormData({
                      ...formData,
                      bankCode: e.target.value,
                      bankName: selected?.name || "",
                    });
                  }}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a bank</option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1a1a2e] mb-2">
                  Account Number (10 digits) *
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    if (val.length <= 10) {
                      setFormData({
                        ...formData,
                        accountNumber: val,
                      });
                    }
                  }}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0000000000"
                  maxLength={10}
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900 font-medium">
                  <span className="font-bold">Important:</span> Your account
                  will be verified against the bank's records. Make sure the
                  details are correct.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterBank}
                disabled={
                  submitting ||
                  !formData.accountHolderName ||
                  !formData.bankCode ||
                  formData.accountNumber.length !== 10
                }
                className="flex-1 px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
