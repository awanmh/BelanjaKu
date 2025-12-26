'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
    seller: {
      fullName: string;
    };
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      if (res.data.success) {
        setWishlistItems(res.data.data || []);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/auth/login');
      } else {
        console.error('Failed to fetch wishlist:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId: string) => {
    if (!confirm('Hapus produk dari wishlist?')) return;

    setRemoving(wishlistId);
    try {
      await api.delete(`/wishlist/${wishlistId}`);
      await fetchWishlist();
    } catch (error) {
      alert('Gagal menghapus produk');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Heart className="w-24 h-24 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold mb-2">Wishlist Kosong</h2>
          <p className="text-gray-500 mb-6">Belum ada produk favorit Anda</p>
          <Button onClick={() => router.push('/')} className="bg-black text-white hover:bg-gray-800">
            Mulai Belanja
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wishlist Saya</h1>
          <p className="text-gray-600">{wishlistItems.length} produk favorit</p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const imageUrl = item.product.imageUrl.startsWith('http')
              ? item.product.imageUrl
              : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/${item.product.imageUrl}`;

            return (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 group relative">
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  disabled={removing === item.id}
                  className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                </button>

                {/* Product Image */}
                <Link href={`/products/${item.product.id}`}>
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x600/png?text=Product';
                      }}
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {item.product.seller?.fullName || 'Official Store'}
                  </p>
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-semibold text-black hover:underline line-clamp-2 mb-2 min-h-[2.5rem]">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-black mb-3">
                    {formatRupiah(item.product.price)}
                  </p>

                  {/* Add to Cart Button */}
                  <Link href={`/products/${item.product.id}`}>
                    <Button className="w-full bg-black text-white hover:bg-gray-800 h-10 text-sm font-semibold rounded-lg">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Beli Sekarang
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
