"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import SelectionMethodModal from "@/src/components/Modals/SelectionMethodModal";

import frame1 from "../../assests/images/custom11.png";
import frame2 from "../../assests/images/custom22.png";
import frame3 from "../../assests/images/custom33.png";
import frame4 from "../../assests/images/custom4.png";
import frame5 from "../../assests/images/custom5.png";
import frame6 from "../../assests/images/custom6.png";
import frame7 from "../../assests/images/custom7.png";
import frame8 from "../../assests/images/custom8.png";

export default function ImageOverlayedGrid() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const images = [
    {
      src: frame1,
      title: "Building Guide",
      subtitle: "Planning outdoor spaces and gardens",
      isLandscape: true,
    },
    {
      src: frame2,
      title: "Product Design",
      subtitle: "Creating and developing new products",
      isInterior: true,
    },
    {
      src: frame3,
      title: "3D Rendering & Visualization",
      subtitle: "Making realistic 3D images of designs",
      is3DRendering: true,
    },
    {
      src: frame4,
      title: "2D Architectural Drawings",
      subtitle: "Floor plans and building layouts",
      is2DArchitectural: true,
    },
    {
      src: frame5,
      title: "Building Information Modeling",
      subtitle: "Digital models showing full building details",
      isBIM: true,
    },
    {
      src: frame6,
      title: "Product Design",
      subtitle: "Planning and styling indoor spaces",
      isInterior2: true,
    },
    {
      src: frame7,
      title: "Mechanical & Electrical Drawings",
      subtitle: "Technical layout for building systems",
      isMechanicalElectrical: true,
    },
    {
      src: frame8,
      title: "Structural Engineering Drawings",
      subtitle: "Designs that keep buildings safe and strong",
      isStructural: true,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            tabIndex={0}
            onClick={() => {
              const categoryToSelect = img.isLandscape
                ? "Building Guide"
                : img.isInterior
                  ? "Product Design"
                  : img.isInterior2
                    ? "Product Design 2"
                    : img.is3DRendering
                      ? "3D Rendering & Visualization"
                      : img.is2DArchitectural
                        ? "2D Architectural Drawings"
                        : img.isBIM
                          ? "Building Information Modeling"
                          : img.isStructural
                            ? "Structural Engineering Drawings"
                            : img.isMechanicalElectrical
                              ? "Mechanical & Electrical Drawings"
                              : img.title;
              router.push(`/custom-design/inquiry?category=${encodeURIComponent(categoryToSelect)}`);
            }}
            className="
              group relative h-[260px] overflow-hidden rounded-xl cursor-pointer
              focus:outline-none
            "
          >
            {/* Image */}
            <Image
              src={img.src}
              alt={img.title}
              fill
              className="object-cover transition-transform duration-500
                       group-hover:scale-105
                       group-focus-within:scale-105"
              sizes="(max-width: 640px) 100vw,
                   (max-width: 1024px) 50vw,
                   25vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Text */}
            <div
              className="
              absolute bottom-4 left-4 right-4 text-white
              transition-all duration-300

              group-hover:bottom-8
              group-focus-within:bottom-8
              group-active:bottom-8
            "
            >
              <h3 className="text-sm font-semibold">{img.title}</h3>

              <p
                className="
                text-xs mt-1
                opacity-0 translate-y-2
                transition-all duration-300

                group-hover:opacity-100 group-hover:translate-y-0
                group-focus-within:opacity-100 group-focus-within:translate-y-0
                group-active:opacity-100 group-active:translate-y-0
              "
              >
                {img.subtitle}
              </p>
            </div>

            {/* Icon */}
            <div
              className="
              absolute top-4 right-4
              w-9 h-9 rounded-full
              bg-yellow-400
              flex items-center justify-center

              opacity-0 scale-90
              transition-all duration-300

              group-hover:opacity-100 group-hover:scale-100
              group-focus-within:opacity-100 group-focus-within:scale-100
              group-active:opacity-100 group-active:scale-100

              hover:bg-[#f5f5f5]
              active:bg-[#f5f5f5]
            "
            >
              <ArrowRight className="w-4 h-4 text-black" />
            </div>
          </div>
        ))}
      </div>
      <SelectionMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCategory={selectedCategory}
      />
    </>
  );
}
