"use client";

import faqHero from "../../assests/images/faqhero.png";
const FaqHero = () => {
  return (
    <section
      className="relative w-full min-h-[45vh] sm:min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh]
             flex items-center justify-center
             bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${faqHero.src})`,
      }}
    >
      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black/50" /> */}

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-6xl px-4 font-oxygen">
        {/* Breadcrumb */}
        <div className="mb-4 text-left -mt-8">
          <p className="text-white text-sm sm:text-base">
            Home <span className="mx-1">/</span> Contact us
          </p>
        </div>

        {/* Centered Content */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-yellow-400 font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            FAQ
          </h1>

          <p
            className="mt-4 max-w-[520px]
                   text-sm sm:text-base md:text-lg
                   text-gray-200 leading-relaxed font-normal"
          >
            Find quick answers to common questions about Mejarc Design
            Ecosystem.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FaqHero;
