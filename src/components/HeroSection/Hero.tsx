"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import hero from "../../assests/images/hero.png";

const HeroSection = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/plans?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/plans");
    }
  };

  return (
    <section
      className="
  relative 
  min-h-[120vh]        /* phones */
  sm:min-h-[120vh]     /* tablets & up */
  flex 
  items-center 
  bg-cover 
  bg-center
"
      style={{
        backgroundImage: `url(${hero.src})`,
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl px-6 lg:px-12">
        <div className="max-w-2xl text-white">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-6">
            Premium design solutions,
            <br />
            powered by trusted expertise.
          </h1>

          {/* Search Input */}
          <div className="relative mb-6">
            <div className="flex items-center bg-white border border-white rounded-md shadow-sm px-2 py-1">
              {/* Left Icon */}
              <span className="pl-3 text-gray-400">
                <Search size={18} />
              </span>

              {/* Input */}
              <input
                type="text"
                placeholder="Search plans (e.g., 3-bedroom duplex, kitchen design)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-3 py-4 text-sm text-gray-700 outline-none bg-transparent"
              />

              {/* Right Icon Box */}
              <button
                onClick={handleSearch}
                className="
        ml-2
        h-[48px]
        w-[48px]
        bg-[#FAC902]
        flex
        items-center
        justify-center
        rounded-md
        shrink-0
      "
              >
                <Search size={18} className="text-black" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { label: "Browse Designs", href: "/plans" },
              { label: "Post a Project Brief", href: "/custom-design" },
              { label: "Get a Custom Design", href: "/custom-design" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="
        flex items-center gap-2
       bg-white/30 backdrop-blur-md
       text-white
        px-4 py-3
        rounded-md
        text-sm font-medium
        border-2 border-white
        hover:bg-gray-200 hover:text-black
        transition
      "
              >
                {label}
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>

          {/* Footer Text */}
          <p className="text-lg text-gray-200">
            This feature will be{" "}
            <span className="font-semibold">AI Powered</span> and{" "}
            <span>Get a Bespoke Design</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
