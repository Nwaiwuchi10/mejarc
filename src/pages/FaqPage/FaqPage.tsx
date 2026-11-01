"use client";
import dynamic from "next/dynamic";
import FaqHero from "./FaqHero";
import FaqSection from "./FaqQuestion";

const Navbar = dynamic(() => import("@/src/components/Navbar/Navbar"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/src/components/Footer/Footer"), {
  ssr: false,
});

const FaqPage = () => {
  return (
    <div>
      <Navbar />
      <main className="mt-12">
        <FaqHero />
      </main>
      <main className="w-full bg-[whitesmoke]">
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default FaqPage;
