'use client';

import { useCartStore } from '@/store/cart.store';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  // Ambil state dan action dari Zustand Store
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const total = totalPrice();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Keranjang Belanjamu Kosong</h2>
        <p className="text-gray-500 mb-8">Sepertinya kamu belum menambahkan barang apapun.</p>
        <Link href="/">
          <Button className="rounded-full px-8 py-6 font-bold text-sm uppercase tracking-wider">
            Mulai Belanja
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">Keranjang Belanja</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* --- Cart Items List (Left) --- */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow bg-white">
              {/* Product Image */}
              <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.imageUrl.startsWith('http') ? item.imageUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/${item.imageUrl}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/png?text=Product';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-slate-900 text-base line-clamp-1">{item.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Penjual: {item.sellerName}</p>
                        </div>
                        <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-end mt-2">
                    <div className="text-red-600 font-bold text-lg">
                        {formatRupiah(item.price)}
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-200 rounded-full h-8 px-1">
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                </div>
              </div>
            </div>
          ))}

          <Button 
            variant="ghost" 
            className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs uppercase tracking-wider font-bold pl-0"
            onClick={clearCart}
          >
            Hapus Semua
          </Button>
        </div>

        {/* --- Summary / Checkout Box (Right) --- */}
        <div className="lg:w-96">
            <div className="bg-gray-50 p-6 rounded-2xl sticky top-24 border border-gray-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Ringkasan Pesanan</h3>
                
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Total Harga ({items.reduce((a,b)=>a+b.quantity,0)} barang)</span>
                        <span>{formatRupiah(total)}</span>
                    </div>
                    {/* Bisa ditambah diskon, ongkir, dll nanti */}
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Diskon</span>
                        <span className="text-green-600">- Rp 0</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-8 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total Belanja</span>
                    <span className="font-bold text-xl text-slate-900">{formatRupiah(total)}</span>
                </div>

                <Link href="/checkout">
                    <Button className="w-full rounded-full bg-black text-white hover:bg-gray-800 h-12 font-bold text-sm uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                        Checkout <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>

                <p className="text-[10px] text-gray-400 text-center mt-4 leading-relaxed">
                    Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan layanan BelanjaKu.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}