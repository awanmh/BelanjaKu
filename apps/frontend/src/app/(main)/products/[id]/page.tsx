"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart.store";
import { Product } from "@/types";
import { ShoppingCart, Truck, RotateCcw, ShieldCheck } from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  // Unwrap params using React.use() or await (Next.js 15)
  // Since it's a client component, we use `use` or just treat it as promise if passed from layout (but here it's page props).
  // Actually in Next.js 15, params is a Promise.
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
        // router.push('/404'); // Optional handling
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl || "https://placehold.co/600x800?text=No+Image"];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* IMAGE GALLERY */}
        <div className="space-y-4">
          <div className="aspect-3/4 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-24 shrink-0 border-2 rounded-md overflow-hidden ${
                    activeImage === idx ? "border-black" : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">
            {product.category} • {product.type}
          </p>

          <div className="text-2xl font-bold text-black mb-6">
            {formatRupiah(product.price)}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 border-b border-gray-100 pb-8">
            {product.description}
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => {
                  addToCart(product);
                  router.push("/cart");
                }}
                className="flex-1 h-12 bg-black text-white hover:bg-gray-800"
              >
                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-sm text-gray-500">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded">
                <Truck className="w-6 h-6 mb-2 text-black" />
                <span>Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded">
                <RotateCcw className="w-6 h-6 mb-2 text-black" />
                <span>30 Days Return</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded">
                <ShieldCheck className="w-6 h-6 mb-2 text-black" />
                <span>Secure Payment</span>
              </div>
            </div>

            {/* Meta */}
            <div className="pt-6 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Stock Available</span>
                <span className="font-medium">{product.stock} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">SKU</span>
                <span className="font-medium">{product.sku}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
