"use client";

import Image from "next/image";

import floorPlan from "../../assests/images/Untitled-7 2.png";
import housePlan from "../../assests/images/Untitled-7 1.png";
import iconbed from "../../assests/images/bed.png";
import iconedit from "../../assests/images/edit.png";
import iconchart from "../../assests/images/house.png";
const CustomeDesignero = () => {
  return (
    <div>
      <div className="bg-[#fff3ec] rounded-3xl p-8 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <p className="uppercase tracking-wide text-sm text-gray-500">
            <span className="font-semibold text-black">MEJARC</span> custom
            design.
          </p>
          <h3 className="text-3xl text-black sm:text-4xl font-light">
            Make an incredible custom design{" "}
            <span className="font-mono text-blue-500">in minutes</span>
          </h3>
          <p className="text-gray-600 max-w-md">
            Your idea, our design. Get a plan made just for you.
          </p>
          <button className="bg-black text-white px-6 py-3 rounded-lg">
            Select Category →
          </button>
        </div>

        {/* Right Images */}
        <div className="grid grid-cols-2 gap-6 items-center">
          <div className="relative w-full h-[200px] rounded-xl overflow-hidden bg-gray-200">
            {/* PUT IMAGE: /public/images/floorplan.png */}
            <Image
              src={floorPlan}
              alt="Floor plan"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative w-full h-[260px] rounded-2xl overflow-hidden bg-gray-200">
            {/* PUT IMAGE: /public/images/house-3d.png */}
            <Image
              src={housePlan}
              alt="3D house render"
              fill
              className="object-cover"
            />
          </div>

          <div className="col-span-2 flex gap-4">
            {[iconbed, iconedit, iconchart].map((src, idx) => (
              <div
                key={idx}
                className="w-12 h-12 bg-white rounded-xl shadow flex items-center justify-center"
              >
                {/* PUT IMAGE: icon files in /public/images */}
                <Image src={src} alt="Feature icon" width={64} height={18} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomeDesignero;
