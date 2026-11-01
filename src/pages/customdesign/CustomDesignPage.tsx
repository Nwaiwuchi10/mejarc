"use client";
import dynamic from "next/dynamic";
import CustomeDesignero from "./CustomeDesignero";
import CusomPhotoGrid from "./CusomPhotoGrid";

const Navbar = dynamic(() => import("@/src/components/Navbar/Navbar"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/src/components/Footer/Footer"), {
  ssr: false,
});

const CustomDesignPage = () => {
  return (
    <div>
      <Navbar />
      <main className="mt-14">
        <CustomeDesignero />
      </main>
      <main className="w-full bg-[whitesmoke]">
        <CusomPhotoGrid />
      </main>
      <Footer />
    </div>
  );
};

export default CustomDesignPage;
