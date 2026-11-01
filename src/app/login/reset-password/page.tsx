import { Suspense } from "react";
import ResetPasswordPage from "@/src/Screens/ResetPassword/ResetPassword";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default Page;

// import ResetPasswordPage from "@/src/Screens/ResetPassword/ResetPassword";

// const page = () => {
//   return (
//     <div>
//       <ResetPasswordPage />
//     </div>
//   );
// };

// export default page;
