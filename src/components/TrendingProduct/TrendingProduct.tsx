"use client";

import { ArrowRight, Heart, Quote, Star, BedDouble, Bath, Maximize, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Api from "@/src/Utils/Api";

import tpix from "../../assests/images/text-width .png";
import loveIcon from "../../assests/images/Vector.svg";
import line from "../../assests/images/Line1.png";

export default function TrendingProduct() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await Api.get("/marketproduct", {
          params: { page: 1, limit: 10 }
        });
        if (response.data && response.data.data) {
          // Display only 3 items as requested
          setProducts(response.data.data.slice(0, 3));
        }
      } catch (error: any) {
        if (error.code === "ERR_NETWORK") {
          console.warn("API Server is unreachable. Please check your backend connection.");
        } else {
          console.error("Error fetching trending products:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <section className="relative w-full">
      {/* Background Layers */}
      <div className="absolute top-0 left-0 w-full min-h-[45vh] bg-[whitesmoke] z-0" />
      <div
        className="
    absolute top-[45vh] left-0 w-full bottom-0
    bg-[#2B2B2B] z-0
  "
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Image src={line} alt="line" className="w-6 h-auto" />
              Featured
            </p>

            <h2 className="text-3xl font-bold text-gray-900">
              Trending Products
            </h2>
          </div>

          <Link
            href="/plans"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Explore All <ArrowRight size={18} />
          </Link>
        </div>

        {/* Product Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-20 mb-20">
            <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {products.map((item, idx) => (
              <HoverCard key={item.id || idx} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20 mb-20 text-gray-500 italic">
            No trending products available at the moment.
          </div>
        )}

        {/* Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 text-white">
          <div>
            <h3 className="text-2xl font-bold">Nedu</h3>
            <p className="text-gray-400">Founder, Majarc Integrated Service</p>
          </div>

          <div className="max-w-xl">
            <Quote className="mb-4 text-gray-400" size={32} />
            <p className="text-gray-300 leading-relaxed">
              Our business is a digital marketplace where people can buy ready
              made house plans or connect with professional architects for
              custom designs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Hover Card ---------------- */

function HoverCard({ item }: any) {
  const [hovered, setHovered] = useState(false);

  // Format price
  const formattedPrice = typeof item.price === 'number'
    ? `₦${item.price.toLocaleString()}`
    : item.price?.toString().startsWith('₦') ? item.price : `₦${item.price}`;

  const mainImage = item.productImage?.[0] || "";
  const hoverImage = item.productImage?.[1] || mainImage;

  return (
    <div
      className="bg-white  overflow-hidden shadow-lg flex-1 transition-transform hover:-translate-y-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-64 w-full">
        {/* Heart icon */}
        <button
          className="absolute top-4 right-4 z-10 
                     w-7 h-7 rounded-full 
                     border border-gray-300 
                     bg-whitesmoke flex items-center justify-center
                     hover:bg-gray-100 transition"
        >
          {" "}
          <Image
            src={loveIcon}
            alt="Love"
            width={16}
            height={16}
          />
        </button>
        {mainImage && (
          <Image
            src={hovered ? hoverImage : mainImage}
            alt={item.title}
            fill
            className="object-cover transition-all duration-500"
            unoptimized={true}
          />
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold text-black">{item.title}</h4>

          <div className="flex items-center gap-1">
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
            <BedDouble size={16} /> {item.numBedrooms || 0}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={16} /> {item.numBathrooms || 0}
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={16} />
            {item.area ? (item.area.toLowerCase().includes("sqm") || item.area.toLowerCase().includes("m²") ? item.area : `${item.area} sqm`) : (item.size ? `${item.size} sqm` : "N/A")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <Link
            href={`/plans/${item._id || item.id}`}
            className="bg-yellow-400 text-black px-16 py-2 rounded-md text-sm font-medium hover:bg-yellow-500 inline-block text-center"
          >
            Buy Now
          </Link>
          <span className="font-semibold text-black">{formattedPrice}</span>
        </div>
      </div>
    </div>
  );
}
