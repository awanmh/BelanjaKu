"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { Filter } from "lucide-react";

function ProductList() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGender, setActiveGender] = useState(
    searchParams.get("gender") || ""
  );
  const [activeType, setActiveType] = useState(searchParams.get("type") || "");
  const router = useRouter();

  // Sync state with URL
  useEffect(() => {
    setActiveGender(searchParams.get("gender") || "");
    setActiveType(searchParams.get("type") || "");
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeGender) params.append("gender", activeGender); // Note: Backend might need specific mapping
        // Backend text search usually handles "men" "women" if mapped to category
        // If backend has specific categoryId, we might need a mapping here or backend handles string.
        // Assuming backend search/filter matches these strings or we send `category` param.
        // Let's assume we pass query params as is for now.

        // Mapping 'gender' to 'category' if backend expects 'category'
        if (activeGender) params.append("category", activeGender);

        // Search query
        const search = searchParams.get("search");
        if (search) params.append("search", search);

        // Types
        if (activeType) params.append("type", activeType);

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(
            Array.isArray(res.data.data) ? res.data.data : res.data.data.rows
          );
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeGender, activeType, searchParams]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* FILTERS SIDEBAR */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </h3>

            <div className="mb-6">
              <h4 className="font-medium mb-3 text-sm uppercase tracking-wider text-gray-500">
                Gender
              </h4>
              <div className="space-y-2">
                {["women", "men", "kids"].map((g) => (
                  <label
                    key={g}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={activeGender === g}
                      onChange={() =>
                        updateFilter("gender", activeGender === g ? "" : g)
                      }
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="capitalize text-sm">{g}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-sm uppercase tracking-wider text-gray-500">
                Type
              </h4>
              <div className="space-y-2">
                {["sport", "casual", "formal"].map((t) => (
                  <label
                    key={t}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={activeType === t}
                      onChange={() =>
                        updateFilter("type", activeType === t ? "" : t)
                      }
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="capitalize text-sm">{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <main className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-serif font-bold">
              {activeGender
                ? `${
                    activeGender.charAt(0).toUpperCase() + activeGender.slice(1)
                  }'s Collection`
                : "All Products"}
              {searchParams.get("search") &&
                ` - Search: "${searchParams.get("search")}"`}
            </h1>
            <span className="text-gray-500 text-sm">
              {products.length} Products
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-gray-100 animate-pulse rounded"
                ></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded">
              <p className="text-gray-500">
                No products found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/products")}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading filters...</div>}
    >
      <ProductList />
    </Suspense>
  );
}
