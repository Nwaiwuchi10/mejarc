import Image from "next/image";
import Link from "next/link";
import laptop from "../../assests/images/laptop.png";
import floorPlan from "../../assests/images/Untitled-7 2.png";
import housePlan from "../../assests/images/Untitled-7 1.png";
import iconbed from "../../assests/images/bed.png";
import iconedit from "../../assests/images/edit.png";
import iconchart from "../../assests/images/house.png";
// import click from "../../assests/images/click 1.png";
export default function CompareAndCustomDesign() {
  return (
    <section className="w-full bg-white px-4 py-12 lg:px-20 space-y-20">
      {/* Compare Plans Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Text */}
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-black">
            Compare Plans Side by Side
          </h2>
          <p className="text-gray-600 max-w-md">
            Not sure which plan to choose? Pick up to{" "}
            <span className="text-blue-500">4 building</span> plans and see them
            compared instantly on one view. Everything shows up in a clean
            comparison table, so you can easily spot the differences and pick
            the plan that feels just right for you.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md">
            {["Bedrooms", "Bathrooms", "Total Area", "Cost", "Ratings"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 border border-blue-400 bg-blue-50 rounded-lg px-4 py-2 text-blue-600"
                >
                  <span className="w-4 h-4 rounded-full border border-blue-400 flex items-center justify-center text-xs">
                    ✓
                  </span>
                  <span className="text-sm">{item}</span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden">
          {/* PUT IMAGE: /public/images/compare-laptop.png */}
          <Image
            src={laptop}
            alt="Compare plans preview"
            fill
            className="object-cover"
            priority
          />
          <Link
            href="/plans"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-blue-600 px-6 py-2 rounded-full shadow flex items-center gap-2 hover:bg-gray-100 transition"
          >
            <span className="text-lg">⇄</span>
            Compare Now
          </Link>
        </div>
      </div>

      {/* Custom Design Section */}
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
          <Link
            href="/custom-design"
            className="bg-black text-white px-6 py-3 rounded-lg inline-block text-center hover:bg-gray-900 transition"
          >
            Try Custom Design →
          </Link>
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
    </section>
  );
}
