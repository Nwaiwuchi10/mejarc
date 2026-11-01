"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import tpix from "../../assests/images/text-width .png";
import { Star, BedDouble, Bath, Heart, Maximize } from "lucide-react";

export default function PlansDesignCard({ item }: any) {
  if (!item) return null;
  const [hovered, setHovered] = useState(false);

  const mainImage = item.productImage?.[0] || "";
  const hoverImage = item.productImage?.[1] || mainImage;
  const formattedPrice = typeof item.price === 'number' ? `₦${item.price.toLocaleString()}` : item.price;

  return (
    <div
      className="bg-white shadow-lg rounded-xl flex-1
             transition-transform duration-300 hover:-translate-y-2 h-full flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image wrapper with padding to reveal white bg */}
      <div className="relative p-3">
        <div className="relative h-60 w-full overflow-hidden rounded-lg">
          {/* Subtitle pill */}
          <button
            className="absolute top-3 right-3 z-10
                   inline-flex items-center justify-center
                   rounded-md border border-transparent
                   bg-white px-3 py-1 text-xs font-medium
                   hover:border-black/10 transition"
          >
            {item.category || "Building Plan"}
          </button>

          <Image
            src={hovered ? hoverImage : mainImage}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            unoptimized={true}
          />
        </div>
      </div>

      {/* Card content */}
      <div className="p-6 pt-3 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1 gap-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono font-bold text-blue-600 tracking-wide">
              {item.productId || "BLP001"}
            </span>
            <h4 className="text-base font-semibold text-black line-clamp-1">{item.title}</h4>
            {item.agent?.businessName || item.agent?.user?.firstName ? (
              <span className="text-[11px] text-gray-500 font-medium">
                Vendor: {item.agent?.businessName || `${item.agent?.user?.firstName || ''} ${item.agent?.user?.lastName || ''}`.trim()}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500 flex flex-wrap gap-4 mb-4">
          <span className="flex items-center gap-1">
            <BedDouble size={16} /> {item.numBedrooms || 0} Bedroom
          </span>
          <span className="flex items-center gap-1">
            <Bath size={16} /> {item.numBathrooms || 0} Bathroom
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={16} /> {item.area ? (item.area.toLowerCase().includes("sqm") || item.area.toLowerCase().includes("m²") ? item.area : `${item.area} sqm`) : (item.size ? `${item.size} sqm` : "N/A")}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <Link href={`/plans/${item.id}`} className="bg-yellow-400 text-black px-6 py-2 rounded-md text-sm font-medium hover:bg-yellow-500 flex items-center gap-2">
            View details <span>→</span>
          </Link>
          <span className="font-semibold text-black">{formattedPrice}</span>
        </div>
      </div>
    </div>
  );
}
