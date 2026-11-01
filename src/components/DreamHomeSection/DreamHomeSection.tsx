"use client";

import Image from "next/image";
import Link from "next/link";

import hundredPlus from "../../assests/images/100+.png"; // <-- customized image
import { DreamHomesImageGrid } from "./ImageGrid";
import line from "../../assests/images/Line1.png";

export default function DreamHomesSection() {
  return (
    <section className="bg-[whitesmoke] w-full">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Made on Majarc */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left – 100+ as image */}
          <div className="relative w-[220px] sm:w-[260px] md:w-[300px] h-[120px] sm:h-[140px] md:h-[160px]">
            <Image
              src={hundredPlus}
              alt="100+ Dream Homes"
              fill
              className="object-contain"
            />
          </div>

          {/* Right – Text + CTA */}
          <div>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Image src={line} alt="line" className="w-6 h-auto" />
              <span className="uppercase tracking-widest text-sm text-gray-500 font-semibold">
                OVER 100
              </span>
            </p>

            <h2 className="text-3xl mb-6 md:text-4xl font-bold text-gray-900 leading-snug">
              Dream Homes Brought to Life
            </h2>
            <p className="text-gray-700 mb-6 max-w-xl leading-relaxed">
              We’ve helped thousands of families turn their ideas into stunning
              homes. From the first sketch to the final build, our architects
              and plans have made it possible for over 50 homeowners to
              create spaces they truly love. Your dream home could be next.
            </p>

            <Link
              href="/plans"
              className="bg-yellow-400 hover:bg-yellow-500 transition text-black font-medium font-lighter px-6 py-3 rounded-md inline-block text-center"
            >
              Browse House Plans
            </Link>
          </div>
        </div>

        <p className="mt-22 mb-10 text-[#4A4A4A] font-poppins text-4xl font-light md:text-4xl">
          Made on Majarc
        </p>
        {/* image grid */}
        {/* image grid */}
        <DreamHomesImageGrid />
        {/* Content Row */}
      </div>

      {/* ===================== */}
      {/* SECTION 2 – SHOWCASE */}
      {/* ===================== */}
    </section>
  );
}
