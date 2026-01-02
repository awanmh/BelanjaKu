"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart.store";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    addToCart(product);
    // Optional: Add toast notification here
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 relative">
        {/* Image Container */}
        <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
          <img
            src={
              product.imageUrl ||
              product.images?.[0] ||
              "https://placehold.co/400x500?text=No+Image"
            }
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-md translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white"
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-black font-semibold mt-2">
            {formatRupiah(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
