"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import HeroBanner from "@/components/home/HeroBanner";
import FlashSale from "@/components/home/FlashSale";
import CategorySection from "@/components/home/CategorySection";
import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products?limit=8");
        if (res.data.success) {
          const productData = Array.isArray(res.data.data)
            ? res.data.data
            : res.data.data.rows;
          setProducts(productData);
        }
      } catch (error) {
        console.error("Gagal mengambil produk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen pb-20 text-black selection:bg-black selection:text-white">
      {/* Hero Banner */}
      <HeroBanner />

      {/* FLASH SALE */}
      <div className="bg-white border-y border-gray-200/60">
        <FlashSale />
      </div>

      {/* CATEGORY SECTION */}
      <div className="bg-white border-t border-gray-100">
        <CategorySection />
      </div>

      {/* NEW ARRIVALS */}
      <section className="container mx-auto px-4 pt-12 pb-8 text-center border-t border-gray-100">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-black">
          New Arrivals
        </h2>
        <p className="text-gray-500 tracking-widest text-xs uppercase">
          Koleksi Terbaru Minggu Ini
        </p>
      </section>

      {/* PRODUCT GRID */}
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-200/50 animate-pulse rounded-md"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* VIEW ALL BUTTON */}
        <div className="mt-16 text-center">
          <Link href="/products">
            <Button
              variant="outline"
              className="rounded-none px-10 py-6 border-black text-black hover:bg-black hover:text-white uppercase tracking-widest text-xs transition-all"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
