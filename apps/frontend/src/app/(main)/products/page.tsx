'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import HeroBanner from '@/components/home/HeroBanner';
import FlashSale from '@/components/home/FlashSale';
import TopBrands from '@/components/home/TopBrands';
import AccessoriesShowcase from '@/components/home/AccessoriesShowcase';
import CategorySection from '@/components/home/CategorySection';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  seller: {
    fullName: string;
  };
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products?limit=8&offset=4');
        if (res.data.success) {
          const productData = Array.isArray(res.data.data)
            ? res.data.data
            : res.data.data.rows;

          setProducts(productData);
        }
      } catch (error) {
        console.error('Gagal mengambil produk:', error);
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

      {/* TOP BRANDS */}
      <div className="bg-white">
        <TopBrands />
      </div>

      {/* CATEGORY SECTION */}
      <div className="bg-white border-t border-gray-100">
        <CategorySection />
      </div>

      {/* ACCESSORIES */}
      <div className="bg-white">
        <AccessoriesShowcase />
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
              <div key={product.id} className="group cursor-pointer flex flex-col">
                {/* IMAGE */}
                <div
                  className="relative w-full overflow-hidden rounded-md bg-gray-50 border border-gray-200"
                  style={{ aspectRatio: '3 / 4' }}
                >
                  <img
                    src={
                      product.imageUrl.startsWith('http')
                        ? product.imageUrl
                        : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/${product.imageUrl}`
                    }
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/400x600/png?text=No+Image';
                    }}
                  />

                  {/* Hover "Beli" Button */}
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-all duration-300">
                    <Button className="w-full rounded-none bg-black text-white h-12 font-medium tracking-wide uppercase hover:bg-gray-900">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Beli
                    </Button>
                  </div>

                  <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                    New
                  </span>
                </div>

                {/* PRODUCT INFO */}
                <div className="text-center mt-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 truncate">
                    {product.seller?.fullName || 'Official Store'}
                  </p>

                  <h3 className="text-sm font-medium text-black mb-2 line-clamp-1 font-serif">
                    {product.name}
                  </h3>

                  <p className="text-lg font-bold text-black">
                    {formatRupiah(Number(product.price))}
                  </p>
                </div>
              </div>
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
