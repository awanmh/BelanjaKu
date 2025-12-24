'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Filter } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  seller: {
    fullName: string;
  };
}

function ProductList() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const subCategory = searchParams.get('sub');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build query string
        let query = '/products?limit=20';
        if (category) query += `&category=${category}`;
        // Note: Backend might not support 'sub' yet, but we can send it or filter client side if needed.
        
        const res = await api.get(query);
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
  }, [category, subCategory]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Breadcrumb / Title */}
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-serif font-bold capitalize">
          {category ? `${category} ${subCategory ? `/ ${subCategory}` : ''}` : 'All Products'}
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          {products.length} products found
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters (Static for now) */}
        <div className="w-full md:w-64 shrink-0 hidden md:block">
          <div className="border-b border-gray-100 pb-6 mb-6">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-widest">Kategori</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/wanita" className={`hover:text-black ${category === 'wanita' ? 'font-bold text-black' : ''}`}>Wanita</Link></li>
              <li><Link href="/pria" className={`hover:text-black ${category === 'pria' ? 'font-bold text-black' : ''}`}>Pria</Link></li>
              <li><Link href="/anak" className={`hover:text-black ${category === 'anak' ? 'font-bold text-black' : ''}`}>Anak</Link></li>
              <li><Link href="/sport" className={`hover:text-black ${category === 'sport' ? 'font-bold text-black' : ''}`}>Sport</Link></li>
            </ul>
          </div>
          <div className="border-b border-gray-100 pb-6 mb-6">
             <h3 className="font-bold mb-4 text-sm uppercase tracking-widest">Harga</h3>
             <div className="flex items-center gap-2 text-sm mb-2">
                <input type="checkbox" className="rounded border-gray-300" /> <span>Di bawah Rp 100rb</span>
             </div>
             <div className="flex items-center gap-2 text-sm mb-2">
                <input type="checkbox" className="rounded border-gray-300" /> <span>Rp 100rb - Rp 300rb</span>
             </div>
             <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" /> <span>Di atas Rp 300rb</span>
             </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-6">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 uppercase text-xs tracking-widest h-12">
                    <Filter className="w-4 h-4" /> Filter & Sort
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-80 bg-gray-100 animate-pulse"></div>
                ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
                {products.map((product) => (
                    <div key={product.id} className="group cursor-pointer flex flex-col">
                        <Link href={`/products/${product.id}`}>
                            <div className="relative w-full overflow-hidden bg-gray-50 border border-gray-100 aspect-[3/4]">
                                <img
                                src={product.imageUrl.startsWith('http') ? product.imageUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/${product.imageUrl}`}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x600/png?text=No+Image'; }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-all duration-300">
                                    <Button className="w-full rounded-none bg-black text-white h-10 font-medium uppercase hover:bg-gray-900 text-xs tracking-widest">
                                        Add to Bag
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1 truncate">{product.seller?.fullName || 'Brand'}</p>
                                <h3 className="text-sm font-medium text-black mb-1 line-clamp-1 font-serif">{product.name}</h3>
                                <p className="text-sm font-bold text-black">{formatRupiah(Number(product.price))}</p>
                            </div>
                        </Link>
                    </div>
                ))}
                </div>
            )}
            
            {products.length === 0 && !loading && (
                <div className="text-center py-20">
                    <p className="text-gray-500">Tidak ada produk ditemukan.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductList />
        </Suspense>
    )
}
