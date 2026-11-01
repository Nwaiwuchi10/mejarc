import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import CompanyContact from "../CompanyContact/CompanyContact";

export default function Footer() {
  return (
    <footer className="bg-[#2B2B2B] text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold tracking-wide">
              MEJ<span className="text-yellow-400">ARC</span>
            </h2>
            <p className="mt-1 text-sm font-semibold text-white">
              Mejarc Integrated Services Ltd.
            </p>

            <p className="mt-2 text-sm text-gray-300 max-w-sm">
              An online real estate investing platform
            </p>

            {/* Contact Card */}
            <CompanyContact theme="dark" className="mt-6" />
          </div>

          {/* About */}
          <FooterColumn
            title="ABOUT"
            links={["Who we are", "Contacts"]}
          />

          {/* Quick Links */}
          <FooterColumn
            title="QUICK LINKS"
            links={[
              { label: "Our Brochure", href: "/brochure.pdf", target: "_blank" },
              "Browse Marketplace",
              "Contacts",
              "Terms of Use",
              { label: "Policy Page", href: "/policy.pdf", target: "_blank" },
            ]}
          />



          {/* Socials */}
          <div>
            <h4 className="text-sm font-semibold mb-4">FOLLOW US</h4>
            <ul className="space-y-3 text-sm">
              <Social icon={<Facebook size={16} />} label="Facebook" />
              <Social icon={<Twitter size={16} />} label="Twitter" />
              <Social icon={<Instagram size={16} />} label="Instagram" />
              <Social icon={<Linkedin size={16} />} label="LinkedIn" />
              <Social icon={<Youtube size={16} />} label="YouTube" />
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 mt-12 pt-6 text-center text-sm text-gray-300">
          Copyright 2025 All rights Reserved. Mejarc Integrated Services Ltd.
        </div>
      </div>
    </footer>
  );
}

/* Reusable column */
type LinkItem = string | { label: string; href: string; target?: string };

function FooterColumn({ title, links }: { title: string; links: LinkItem[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-4">{title}</h4>
      <ul className="space-y-3 text-sm text-gray-300">
        {links.map((link, idx) => {
          if (typeof link === "string") {
            return (
              <li key={idx} className="hover:text-white transition cursor-pointer">
                {link}
              </li>
            );
          }
          return (
            <li key={idx} className="hover:text-white transition cursor-pointer">
              <a href={link.href} target={link.target} rel={link.target === "_blank" ? "noopener noreferrer" : undefined}>
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* Social item */
function Social({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-3 hover:text-white transition cursor-pointer">
      {icon}
      <span>{label}</span>
    </li>
  );
}
