"use client";
import Image from "next/image";
import line from "../../assests/images/Line1.png";
import ImageOverlayedGrid from "./ImageOverlayedGrid";

const CusomPhotoGrid = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <p className="flex items-center gap-2 text-sm text-gray-500 mt-4 mb-2">
          <Image src={line} alt="line" className="w-6 h-auto" />
          CHOOSE SERVICES
        </p>

        <h2 className="text-3xl font-bold text-gray-900">
          Select category to proceed
        </h2>
      </div>

      <div className="py-8">
        <ImageOverlayedGrid />
      </div>
    </div>
  );
};

export default CusomPhotoGrid;
