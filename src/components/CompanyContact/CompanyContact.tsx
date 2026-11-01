import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export const COMPANY_CONTACT_INFO = {
  address: "687 Adeola Hopewell Street, Victoria Island, Lagos.",
  phone: "0000 000 000",
  email: "support@mejarc.com",
  whatsapp1: "447427976350",
  whatsapp2: "2349112530958",
  socials: {
    facebook: "https://facebook.com/mejarc",
    twitter: "https://twitter.com/mejarc",
    instagram: "https://instagram.com/mejarc",
    linkedin: "https://linkedin.com/company/mejarc",
    youtube: "https://youtube.com/mejarc",
  }
};

interface CompanyContactProps {
  className?: string;
  theme?: "dark" | "light";
  showAddress?: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
}

export default function CompanyContact({
  className = "",
  theme = "dark",
  showAddress = true,
  showPhone = true,
  showEmail = true,
}: CompanyContactProps) {
  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-[#444] text-gray-200" : "bg-white text-gray-800 shadow-sm border border-gray-200";

  return (
    <div className={`rounded-xl p-4 space-y-3 text-sm ${bgClass} ${className}`}>
      {showAddress && (
        <div className="flex gap-3 items-start">
          <MapPin size={16} className="mt-0.5 shrink-0" />
          <span>
            {COMPANY_CONTACT_INFO.address.split(',').map((part, index, array) => (
              <React.Fragment key={index}>
                {part.trim()}{index < array.length - 1 ? ',' : ''}
                {index === 0 && <br />}
              </React.Fragment>
            ))}
          </span>
        </div>
      )}

      {showPhone && (
        <div className="flex gap-3 items-center">
          <Phone size={16} className="shrink-0" />
          <a href={`tel:${COMPANY_CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="hover:opacity-80 transition">
            {COMPANY_CONTACT_INFO.phone}
          </a>
        </div>
      )}

      {showEmail && (
        <div className="flex gap-3 items-center">
          <Mail size={16} className="shrink-0" />
          <a href={`mailto:${COMPANY_CONTACT_INFO.email}`} className="hover:opacity-80 transition">
            {COMPANY_CONTACT_INFO.email}
          </a>
        </div>
      )}
    </div>
  );
}
