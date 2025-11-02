"use client";
import Image from "next/image";

const products = [
  { id: 1, name: "Atta Gur Cookies (250g)", price: 100, originalPrice: 120, img: "/images/cookies4.png" },
  { id: 2, name: "Atta Gur Cookies (150g)", price: 70, originalPrice: 90, img: "/images/cookies3.png" },
  // { id: 3, name: "Balusai", price: 199, originalPrice: 399, img: "/images/img2.png" },
  // { id: 4, name: "Khaja", price: 349, originalPrice: 499, img: "/images/img3.png" },
  // { id: 5, name: "3 in 1 prasad", price: 349, originalPrice: 499, img: "/images/mix1.png" },
  // { id: 6, name: "4 in 1 prasad", price: 349, originalPrice: 499, img: "/images/mix2.png" },
  // { id: 7, name: "5 in 1 prasad", price: 349, originalPrice: 499, img: "/images/mix3.png" },
];

export default function ProductGrid() {
  return (
    <section id="products" className="py-16 px-8 bg-[#F7F5E9]">
      <h2 className="text-3xl font-bold text-center text-[#4B1F1F] mb-10">
        Our Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {products.map((p) => (
          <div
            key={p.id}
            className="border-2 border-[#4B1F1F] rounded-2xl overflow-hidden bg-[#F7F5E9] flex flex-col"
          >
            {/* Image with Sale Badge */}
            <div className="relative w-full h-80">
              <Image
                src={p.img}
                alt={p.name}
                fill
                className="object-cover"
                priority
              />
              <span className="absolute bottom-3 left-3 bg-[#6A1F33] text-white text-sm px-3 py-1 rounded-full">
                Sale
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center p-5">
              <h3 className="text-xl font-serif font-semibold text-[#4B1F1F] mt-3">
                {p.name}
              </h3>

              {/* Price */}
              <div className="mt-2 flex items-center space-x-3">
                <span className="text-gray-400 line-through text-base">
                  ₹{p.originalPrice}
                </span>
                <span className="text-xl font-bold text-[#4B1F1F]">
                  ₹{p.price}.00
                </span>
              </div>

              {/* Order Now Button */}
              <button className="mt-5 w-full border-2 border-[#4B1F1F] text-[#4B1F1F] py-3 rounded-full font-medium hover:bg-[#4B1F1F] hover:text-white transition-all">
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
