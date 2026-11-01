"use client";

import Image from "next/image";
import Link from "next/link";
import spoke1 from "../../assests/images/Search-cuate 1.png";
import spoke2 from "../../assests/images/Choose-rafiki 1.png";
import spoke3 from "../../assests/images/Hello-bro 1.png";
import line from "../../assests/images/Line1.png";

export default function BespokeDesignSection() {
  return (
    <section className="w-full bg-[whitesmoke] py-20 px-6">
      <div className="max-w-7xl py-8 mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* LEFT TEXT BLOCK */}
        <div
          className="
  flex flex-col
  justify-center items-center
  lg:justify-center lg:items-start
  space-y-6
  h-full
  text-center lg:text-left
"
        >
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Image src={line} alt="line" className="w-6 h-auto" />
            <span className="uppercase tracking-widest text-sm text-gray-500 font-semibold">
              How It Works
            </span>
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Your Journey <br /> Made Easy
          </h2>

          <Link
            href="/custom-design"
            className="bg-yellow-400 hover:bg-yellow-500 transition text-black font-lighter px-6 py-3 rounded-md shadow-md inline-block text-center"
          >
            Get A Bespoke Design
          </Link>
        </div>

        {/* CARD 1 */}
        <div className="flex flex-col items-center  space-y-5">
          <div className="w-full h-[230px] relative">
            <Image
              src={spoke1}
              alt="Browse Plans"
              fill
              className="object-contain"
            />
          </div>

          <h3 className="text-lg font-lighter text-gray-900 lg:self-start lg:text-left">
            Browse Plans
          </h3>

          <p className="text-gray-700 text-sm leading-relaxed max-w-xs">
            Your Dream Home, Ready in 5 minutes. Skip months of waiting.
            Download your professionally designed, ready starter packs and start
            your building journey today.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="flex flex-col items-center  space-y-5">
          <div className="w-full h-[230px] relative">
            <Image
              src={spoke2}
              alt="Compare Options Side-by-Side"
              fill
              className="object-contain"
            />
          </div>

          <h3 className="text-lg font-lighter text-gray-900 lg:self-start lg:text-left">
            Compare Options Side-by-Side
          </h3>

          <p className="text-gray-700 text-sm leading-relaxed max-w-xs">
            Easily compare different designs, costs, and features to find the
            perfect fit for your dream home.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="flex flex-col items-center  space-y-5">
          <div className="w-full h-[230px] relative">
            <Image
              src={spoke3}
              alt="Consult with Experts"
              fill
              className="object-contain"
            />
          </div>

          <h3 className="text-lg font-lighter text-gray-900 lg:self-start lg:text-left">
            Consult with Experts
          </h3>

          <p className="text-gray-700 text-sm leading-relaxed max-w-xs">
            Get personalized guidance from trusted architects and builders to
            refine your ideas and make informed decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
