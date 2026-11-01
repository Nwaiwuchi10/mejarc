"use client";
import dynamic from "next/dynamic";
import BespokeDesignSection from "@/src/components/BeSpokeDesignSection/BeSpokeDesign";
import CompareAndCustomDesign from "@/src/components/CompareCustomDesign/CustomDesignSection";
import DreamHomesSection from "@/src/components/DreamHomeSection/DreamHomeSection";
import EstimateHero from "@/src/components/EstimateHero/EstimateHero";
import HeroSection from "@/src/components/HeroSection/Hero";
import MarqueeSection from "@/src/components/MarqueeSection/MarqueeSection";
import Testimonials from "@/src/components/Testmonials/Testimonials";
import TrendingProduct from "@/src/components/TrendingProduct/TrendingProduct";

const Navbar = dynamic(() => import("@/src/components/Navbar/Navbar"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/src/components/Footer/Footer"), {
  ssr: false,
});

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <TrendingProduct />
      <BespokeDesignSection />
      <CompareAndCustomDesign />
      <DreamHomesSection />
      <EstimateHero />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default HomePage;
