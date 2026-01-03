"use client";

import { Button } from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";
import { Star } from "lucide-react";
import Link from "next/link";

// Data Mock Aksesoris (No Change)
const accessories = [
  {
    id: "acc-1",
    brand: "GEOFFMAX",
    name: "Makoto SS 16 Black",
    price: 84550,
    originalPrice: 200000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
    discount: 57,
    isNew: false,
  },
  {
    id: "acc-2",
    brand: "GOZEAL",
    name: "Gozeal Shirt Boxy Daisy",
    price: 319000,
    originalPrice: 400000,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
    discount: 0,
    isNew: true,
  },
  {
    id: "acc-3",
    brand: "BRODO",
    name: "Bigger Trucker Hat All Black",
    price: 95580,
    originalPrice: 180000,
    rating: 4.0,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
    discount: 46,
    isNew: false,
  },
  {
    id: "acc-4",
    brand: "GOZEAL",
    name: "Gozeal Shirt Vanesh",
    price: 149000,
    originalPrice: 400000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
    discount: 63,
    isNew: false,
  },
  {
    id: "acc-5",
    brand: "GEOFFMAX",
    name: "Griever SS 16 Black",
    price: 94050,
    originalPrice: 200000,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    discount: 52,
    isNew: false,
  },
];

export default function AccessoriesShowcase() {
  return (
    <section className="container mx-auto px-4 py-16 border-t border-black/5">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
            Lengkapi Gayamu
          </h2>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-wide">
            Aksesoris & Apparel Terbaik dari Brand Lokal
          </p>
        </div>

        <Link href="/products?category=accessories">
          <Button
            variant="outline"
            className="
              hidden md:flex border-black text-black 
              hover:bg-black hover:text-white 
              rounded-none text-xs uppercase tracking-widest
            "
          >
            Lihat Semua
          </Button>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
        {accessories.map((item) => (
          <Link
            key={item.id}
            href={`/products/mock-${item.id}`}
            className="
              group bg-white rounded-2xl p-4 
              border border-black/10 
              shadow-sm 
              transition-all duration-500 
              hover:shadow-2xl hover:-translate-y-2
              relative flex flex-col cursor-pointer block
            "
          >
            {/* Brand + Badge */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-semibold tracking-wider text-gray-900 uppercase">
                {item.brand}
              </span>

              {item.discount > 0 ? (
                <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-sm font-semibold">
                  {item.discount}%
                </span>
              ) : (
                item.isNew && (
                  <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-sm font-semibold">
                    NEW
                  </span>
                )
              )}
            </div>

            {/* Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50">
              <img
                src={item.image}
                alt={item.name}
                className="
                  w-full h-full object-cover 
                  transition-transform duration-700 
                  group-hover:scale-110
                "
              />
            </div>

            {/* Details */}
            <h3 className="font-semibold text-black text-sm leading-tight mb-2 line-clamp-2 min-h-[2.6rem]">
              {item.name}
            </h3>

            {/* Price */}
            <div className="mb-3">
              <div className="text-black font-bold text-lg">
                {formatRupiah(item.price)}
              </div>

              {item.originalPrice > item.price && (
                <div className="text-gray-400 text-[11px] line-through">
                  {formatRupiah(item.originalPrice)}
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-5">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-700 font-medium">
                {item.rating}
              </span>
            </div>

            {/* Button */}
            <Button
              className="
                w-full rounded-full bg-black text-white 
                hover:bg-gray-900 text-xs font-bold py-5 
                opacity-0 group-hover:opacity-100 
                translate-y-2 group-hover:translate-y-0 
                shadow-lg shadow-gray-200
                transition-all duration-500 mt-auto
              "
            >
              Beli Sekarang
            </Button>
          </Link>
        ))}
      </div>

      {/* Mobile View All Button */}
      <div className="mt-10 text-center md:hidden">
        <Link href="/products?category=accessories">
          <Button
            variant="outline"
            className="w-full border-black text-black text-xs uppercase tracking-widest rounded-none"
          >
            Lihat Semua
          </Button>
        </Link>
      </div>
    </section>
  );
}
