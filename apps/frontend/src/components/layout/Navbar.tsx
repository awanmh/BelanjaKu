'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, Heart, ShoppingCart, Store } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useCartStore } from '@/store/cart.store';
import { useUserStore } from '@/store/user.store';
import api from '@/lib/api';

export default function Navbar() {
  const router = useRouter();
  const cartCount = useCartStore((state) => state.cartCount);
  const setCartCount = useCartStore((state) => state.setCartCount);
  const user = useUserStore((state) => state.user);

  // Fetch cart count when component mounts and user is logged in
  useEffect(() => {
    const fetchCartCount = async () => {
      if (user) {
        try {
          const res = await api.get('/cart');
          if (res.data.success && res.data.data.items) {
            const totalItems = res.data.data.items.reduce(
              (sum: number, item: any) => sum + item.quantity,
              0
            );
            setCartCount(totalItems);
          }
        } catch (error) {
          console.error('Failed to fetch cart count:', error);
        }
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [user, setCartCount]);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] transition-all">
      {/* Announcement Bar */}
      <div className="bg-black text-white text-[10px] md:text-xs font-medium tracking-widest text-center py-2 uppercase">
        Gratis Ongkir Seluruh Indonesia • Jaminan Produk Original 100%
      </div>

      {/* Top Section: Logo, Search, Icons */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <h1 className="text-3xl font-serif font-bold text-black tracking-tight">BelanjaKu</h1>
          </Link>

          {/* Search Bar - Modern Boxy Style */}
          <div className="hidden md:block flex-1 max-w-2xl relative group">
            <Input
              placeholder="Apa yang sedang Anda cari?"
              className="w-full h-11 rounded-none bg-gray-50 border border-transparent focus:bg-white focus:border-black pl-4 pr-12 text-gray-900 placeholder:text-gray-400 focus:ring-0 transition-all duration-300"
            />
            <button className="absolute right-0 top-0 h-11 w-12 flex items-center justify-center bg-transparent group-focus-within:bg-black group-focus-within:text-white text-gray-500 transition-colors duration-300">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6">
            {/* Seller Mode Button - Only visible for sellers */}
            {user?.role === 'seller' && (
              <button
                onClick={() => router.push('/seller/dashboard')}
                className="flex flex-col items-center group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Store className="w-5 h-5 text-white" />
                <span className="text-[10px] font-bold text-white mt-0.5 tracking-wide">Masuk sebagai Seller</span>
              </button>
            )}

            {/* FIX: Link ke halaman /auth/login */}
            <Link href="/auth/login" className="flex flex-col items-center group">
              <User className="w-6 h-6 text-gray-600 group-hover:text-black transition" />
              <span className="text-[10px] font-medium text-gray-500 mt-1 group-hover:text-black transition">Masuk / Daftar</span>
            </Link>

            <Link href="/wishlist" className="flex flex-col items-center group">
              <Heart className="w-6 h-6 text-gray-600 group-hover:text-black transition" />
              <span className="text-[10px] font-medium text-gray-500 mt-1 group-hover:text-black transition">Wishlist</span>
            </Link>

            <Link href="/cart" className="flex flex-col items-center group relative">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-black transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-gray-500 mt-1 group-hover:text-black transition">Keranjang</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Categories (Sub-nav) */}
      <div className="container mx-auto px-4">
        <nav className="flex justify-center gap-8 md:gap-12 h-14 items-center text-xs md:text-sm font-medium text-gray-500 uppercase tracking-widest overflow-x-auto no-scrollbar">
          {['Wanita', 'Pria', 'Sport', 'Anak'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className={`hover:text-black hover:border-b-2 hover:border-black transition-all duration-300 py-4 border-b-2 border-transparent`}
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}