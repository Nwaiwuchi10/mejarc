import { motion } from "framer-motion";
import Image from "next/image";
import frame1 from "../../assests/images/Frame 40136.png";
import frame2 from "../../assests/images/Frame 40138.png";
import frame3 from "../../assests/images/Frame 40141.png";
import frame4 from "../../assests/images/jh.jpeg";
import frame5 from "../../assests/images/Frame 40142.png";
import frame6 from "../../assests/images/Frame 40143.png";
import frame7 from "../../assests/images/Frame 40139.png";
import frame8 from "../../assests/images/Frame 40144.png";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function DreamHomesImageGrid() {
  const images = [
    {
      src: frame1,
      type: "tall",
      text: "Bungalow",
      subText: "Single-story homes withsimple, functional layouts",
      priority: true,
    },
    {
      src: frame2,
      type: "short",
      text: "Townhouse",
      subText: "Compact yet stylist multi-level homes for urban living",
    },
    {
      src: frame3,
      type: "tall",
      text: "Bungalow",
      subText: "Single-story homes withsimple, functional layouts",
    },
    {
      src: frame4,
      type: "short",
      text: "Townhouse",
      subText: "Compact yet stylist multi-level homes for urban living",
    },
    {
      src: frame5,
      type: "short",
      text: "Townhouse",
      subText: "Compact yet stylist multi-level homes for urban living",
    },

    // 👇 image 6 (needs to move UP slightly)
    {
      src: frame6,
      type: "tall",
      text: "Bungalow",
      subText: "Single-story homes withsimple, functional layouts",
      lift: true,
    },

    {
      src: frame7,
      type: "short",
      text: "Townhouse",
      subText: "Compact yet stylist multi-level homes for urban living",
    },

    // 👇 image 8 (needs to move UP slightly)
    {
      src: frame8,
      type: "tall",
      text: "Bungalow",
      subText: "Single-story homes withsimple, functional layouts",
      lift: true,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ staggerChildren: 0.08 }}
      className="grid grid-cols-1 sm:grid-cols-2 cursor-pointer lg:grid-cols-4 gap-4 mb-20"
    >
      {images.map((img, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          className={`
            group relative rounded-xl overflow-hidden
            ${img.type === "tall"
              ? "h-[clamp(280px,32vw,360px)]"
              : "h-[clamp(160px,20vw,200px)]"
            }
            ${img.lift ? "lg:-mt-40" : ""}
          `}
        >
          {/* Image */}
          <Image
            src={img.src}
            alt={img.text || "Modern Home Design"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={img.priority}
            loading={img.priority ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw,
                   (max-width: 1024px) 50vw,
                   25vw"
          />

          {/* Hover Overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
          <div
            className="
  absolute inset-0
  bg-gradient-to-t from-black/60 via-black/20 to-transparent
  opacity-0
  group-hover:opacity-100
  group-focus:opacity-100
  group-active:opacity-100
  transition-opacity duration-300
"
          />

          {/* Dynamic Hover Text */}
          {img.text && (
            // <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <div
              className="
  absolute bottom-4 left-4 right-4 text-white
  opacity-0 translate-y-2
  group-hover:opacity-100 group-hover:translate-y-0
  group-focus:opacity-100 group-focus:translate-y-0
  group-active:opacity-100 group-active:translate-y-0
  transition-all duration-300
"
            >
              <h2 className="text-sm font-medium">{img.text}</h2>
              <p className="text-sm font-medium mt-1">{img.subText}</p>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
