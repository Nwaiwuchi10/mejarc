"use client";
import dynamic from "next/dynamic";
import ContactHero from "./ContactHero";
import ContactCards from "./ContactCard";
import ContactFormSection from "./ContactForm";

const Navbar = dynamic(() => import("@/src/components/Navbar/Navbar"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/src/components/Footer/Footer"), {
  ssr: false,
});

const ContactPage = () => {
  return (
    <div>
      <Navbar />
      <main className="mt-12">
        <ContactHero />
      </main>
      <main className="w-full bg-[whitesmoke]">
        <ContactCards />
        <ContactFormSection />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
