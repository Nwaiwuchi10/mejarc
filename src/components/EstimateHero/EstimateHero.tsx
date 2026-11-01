import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import estimatePix from "../../assests/images/Rectangle 87.png";
import { Calculator } from "lucide-react";

export default function EstimateHero() {
  const [budget, setBudget] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!budget) {
      router.push("/plans");
      return;
    }
    router.push(`/plans?maxPrice=${budget}`);
  };

  return (
    <section className="relative w-full min-h-[85vh] flex items-center">
      {/* Background Image */}
      <Image
        src={estimatePix}
        alt="Building plan estimation"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl text-white">
          <h1 className="font-poppins font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight">
            Estimate your building
            <br />
            cost in seconds
          </h1>

          <p className="mt-4 text-gray-200 text-sm sm:text-base max-w-lg">
            Enter your details below to see an estimated construction cost
            range.{" "}
            <span className="font-semibold">Quick, Simple, & Reliable.</span>
          </p>

          {/* Estimate Card */}
          <div className="mt-8 bg-[#FFE5D8] rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* White Input Group */}
              <div className="flex w-full flex-1 bg-white rounded-lg overflow-hidden border border-gray-200">
                <input
                  type="number"
                  placeholder="Enter your rough estimate budget (₦)"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full h-12 px-4 text-gray-700 focus:outline-none focus:ring-0 text-sm font-semibold"
                />
              </div>

              {/* Button */}
              <button
                onClick={handleSearch}
                className="w-full sm:w-auto h-12 px-6 bg-[#FFC107] text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 transition"
              >
                Get Estimate
                <span className="text-lg">
                  <Calculator size={18} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
