'use client';

import Link from 'next/link';
import { Search, User, Heart, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function Navbar() {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Top Section: Logo, Search, Icons */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="shrink-0">
                <h1 className="text-3xl font-serif font-bold text-black tracking-tight">BelanjaKu</h1>
            </Link>

            {/* Search Bar - Pill Shape Panjang */}
            <div className="hidden md:block flex-1 max-w-2xl relative group">
                <Input 
                    placeholder="Cari produk, merek, atau kategori..." 
                    className="w-full h-11 rounded-full bg-gray-50 border border-gray-200 pl-5 pr-12 text-gray-700 focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gray-800 hover:bg-black rounded-full transition text-white">
                    <Search className="w-4 h-4" />
                </button>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-6">
                {/* FIX: Link ke halaman /auth/login */}
                <Link href="/auth/login" className="flex flex-col items-center group">
                    <User className="w-6 h-6 text-gray-600 group-hover:text-black transition" />
                    <span className="text-[10px] font-medium text-gray-500 mt-1 group-hover:text-black transition">Masuk / Daftar</span>
                </Link>
                
                <button className="flex flex-col items-center group">
                    <Heart className="w-6 h-6 text-gray-600 group-hover:text-black transition" />
                    <span className="text-[10px] font-medium text-gray-500 mt-1 group-hover:text-black transition">Wishlist</span>
                </button>
                
                <Link href="/cart" className="flex flex-col items-center group relative">
                    <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-black transition" />
                    <span className="absolute -top-1 right-0 bg-black text-white text-[9px] h-4 w-4 flex items-center justify-center rounded-full">2</span>
                    <span className="text-[10px] font-medium text-gray-500 mt-1 group-hover:text-black transition">Tas</span>
                </Link>
            </div>
        </div>
      </div>

      {/* Bottom Section: Categories (Sub-nav) */}
      <div className="container mx-auto px-4">
        <nav className="flex justify-center gap-8 h-12 items-center text-sm font-medium text-gray-600 uppercase tracking-wider overflow-x-auto no-scrollbar">
            {['Wanita', 'Pria', 'Sport', 'Anak'].map((item) => (
                <Link 
                    key={item} 
                    href={`/${item.toLowerCase()}`} 
                    className={`hover:text-black hover:border-b-2 hover:border-black transition-colors py-3`}
                >
                    {item}
                </Link>
            ))}
        </nav>
      </div>
    </header>
  );
}