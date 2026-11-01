import VerifyLoginPage from "@/src/Screens/LoginVerification/LoginVerification";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyLoginPage />
    </Suspense>
  );
};

export default page;
