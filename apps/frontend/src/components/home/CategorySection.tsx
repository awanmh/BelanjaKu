"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const categories = [
  {
    id: "women",
    name: "Wanita",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
    param: "gender",
  },
  {
    id: "men",
    name: "Pria",
    image:
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop",
    param: "gender",
  },
  {
    id: "kids",
    name: "Anak",
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=800&auto=format&fit=crop",
    param: "gender",
  },
  {
    id: "sport",
    name: "Sport",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
    param: "type",
  },
];

export default function CategorySection() {
  return (
    <section className="container mx-auto px-4 py-14">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
          Pilih Kategori
        </h2>
        <p className="text-gray-500 mt-1 text-sm md:text-base">
          Temukan produk sesuai kebutuhanmu
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?${cat.param}=${cat.id}`}
            className="
              group flex flex-col rounded-2xl overflow-hidden 
              bg-white border border-black/10 
              shadow-sm transition-all duration-500 
              hover:-translate-y-1 hover:shadow-xl hover:border-black/20
            "
          >
            {/* Image */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="
                  object-cover object-center 
                  transition-transform duration-700 
                  group-hover:scale-110
                "
              />
            </div>

            {/* Label */}
            <div
              className="
              flex items-center justify-between 
              px-5 py-4 bg-white border-t border-black/10
            "
            >
              <span className="font-semibold text-black text-sm md:text-lg tracking-wide">
                {cat.name}
              </span>
              <ChevronRight className="w-5 h-5 text-black transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
