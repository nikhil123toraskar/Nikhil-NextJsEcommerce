"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type Category = {
  _id: string;
  slug: string;
  name?: string;
  media?: {
    mainMedia?: {
      image?: {
        url?: string;
      };
    };
  };
};

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative px-4">
      <button
        type="button"
        onClick={() => handleScroll("left")}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center h-12 w-12 rounded-full bg-white/90 text-gray-800 shadow-lg hover:bg-white"
        aria-label="Scroll categories left"
      >
        <span className="text-2xl">‹</span>
      </button>

      <button
        type="button"
        onClick={() => handleScroll("right")}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center h-12 w-12 rounded-full bg-white/90 text-gray-800 shadow-lg hover:bg-white"
        aria-label="Scroll categories right"
      >
        <span className="text-2xl">›</span>
      </button>

      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-hide scroll-smooth pb-6"
      >
        <div className="flex gap-8 md:gap-8">
          {categories.map((item) => (
            <Link
              key={item._id}
              href={`/list?cat=${item.slug}`}
              className="flex-shrink-0 sm:w-1/2 lg:w-1/5"
            >
              <div className="relative bg-no-repeat bg-center bg-contain bg-slate-100 shadow-md shadow-gray-500 w-full min-w-60 block lg:w-full h-96 max-h-120 sm:max-w-96">
                <Image
                  src={item.media?.mainMedia?.image?.url || "cat.png"}
                  alt={item.name || "Category"}
                  fill
                  className="object-cover"
                />
              </div>
              <h1 className="mt-4 font-semibold text-cl tracking-wide">{item.name}</h1>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
