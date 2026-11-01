import BankAccountManagement from "@/src/VendorScreens/VendorWallet/components/BankAccountManagement";

export default function BankAccountsPage() {
  return (
    <div className="p-8 bg-[#f5f6fa] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Bank Account Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Add and manage your bank accounts for withdrawals
          </p>
        </div>
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
          <BankAccountManagement />
        </div>
      </div>
    </div>
  );
}
