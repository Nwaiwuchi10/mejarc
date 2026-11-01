"use client";

import Calculator from "@/src/components/Checkout/Calculator";
import dynamic from "next/dynamic";
import React from "react";

const Navbar = dynamic(() => import("@/src/components/Navbar/Navbar"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/src/components/Footer/Footer"), {
  ssr: false,
});

const EstimatePage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-24 pb-12 px-4 md:px-8">
        <Calculator />
      </main>
      <Footer />
    </div>
  );
};

export default EstimatePage;
