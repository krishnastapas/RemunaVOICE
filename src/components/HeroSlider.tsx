"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const slides = [
  { img: "/images/banner1.png" },
  // { img: "/images/cookiesBanner.png" },
];

export default function HeroSlider() {
  return (
    <div className="relative w-full overflow-hidden">
      {slides.map((slide, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 2, duration: 1 }}
        >
          <Image
            src={slide.img}
            alt="banner"
            width={1920} // give a large width for scaling
            height={1080} // actual aspect ratio of your banner
            className="w-full h-auto"
            priority
          />
        </motion.div>
      ))}
    </div>
  );
}
