import BuyPlansPage from "@/src/pages/buyplans/BuyPlansPage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
      </div>
    }>
      <BuyPlansPage />
    </Suspense>
  );
};

export default page;
