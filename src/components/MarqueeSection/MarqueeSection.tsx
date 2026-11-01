"use client";

import star from "../../assests/images/Star.png";
import Image from "next/image";

const MarqueeSection = () => {
  return (
    <section className="w-full h-[10vh] bg-[#FAC902] overflow-hidden flex items-center">
      {/* Marquee Track */}
      <div className="flex whitespace-nowrap animate-marquee-slow">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center gap-3 mx-10">
            {/* Badge Icon (White Only) */}
            <Image
              src={star}
              alt="Badge Icon"
              width={42}
              height={42}
              className="text-white"
            />

            {/* Text */}
            <h2 className="text-black font-medium text-base sm:text-lg lg:text-xl tracking-wide">
              CUSTOMIZE YOUR OWN HOUSE PLAN NOW
            </h2>
          </div>
        ))}

        {/* Duplicate for seamless loop */}
        {[1, 2, 3].map((item) => (
          <div
            key={`duplicate-${item}`}
            className="flex items-center gap-3 mx-10"
          >
            <Image
              src={star}
              alt="Badge Icon"
              width={42}
              height={42}
              className="text-white"
            />

            <h2 className="text-black font-medium text-base sm:text-lg lg:text-xl tracking-wide">
              CUSTOMIZE YOUR OWN HOUSE PLAN NOW
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarqueeSection;
