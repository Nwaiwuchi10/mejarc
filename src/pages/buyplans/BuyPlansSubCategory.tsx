"use client";
import image1 from "../../assests/images/Group 90.png";
import image2 from "../../assests/images/Group 91.png";
import image3 from "../../assests/images/Group 92.png";
import Image from "next/image";

const categories = [
  {
    title: "Building Plans",
    image: image1,
  },
  {
    title: "Product Design",
    image: image2,
  },
  {
    title: "Building Guides",
    image: image3,
  },
];

interface CategoryGridProps {
  selectedCategory: string | null;
  setSelectedCategory: (val: string | null) => void;
}

export default function CategoryGrid({ selectedCategory, setSelectedCategory }: CategoryGridProps) {
  const handleCategoryClick = (title: string) => {
    if (selectedCategory === title) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(title);
    }
  };

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((item, index) => {
          const isActive = selectedCategory === item.title;
          return (
            <div
              key={index}
              onClick={() => handleCategoryClick(item.title)}
              className={`group relative h-[180px] sm:h-[220px] lg:h-[260px] overflow-hidden rounded-2xl cursor-pointer border-4 transition-all duration-200 ${
                isActive ? "border-[#FFC700] scale-[1.02] shadow-lg" : "border-transparent"
              }`}
            >
              {/* Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />

              {/* Dark overlay & Title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                <h3 className="text-white text-lg font-bold tracking-wide">
                  {item.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
