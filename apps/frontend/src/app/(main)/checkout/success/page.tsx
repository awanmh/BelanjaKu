'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center pb-20">
      <div className="container mx-auto px-4 text-center max-w-lg">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center animate-in zoom-in duration-500 shadow-xl">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-serif font-bold mb-4 text-black">Terima Kasih!</h1>
        <p className="text-gray-500 mb-2">Pesanan Anda berhasil dibuat.</p>
        <p className="text-sm text-gray-400 mb-8">Order ID: #BLK-2025-882910</p>

        <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
          <h3 className="font-bold text-sm uppercase tracking-wide mb-4 border-b border-gray-200 pb-2">Detail Pengiriman</h3>
          <p className="font-bold text-sm">John Doe</p>
          <p className="text-sm text-gray-600 mt-1">Jl. Jendral Sudirman No. 1, Jakarta Selatan, 12190</p>
          <p className="text-sm text-gray-600 mt-1">08123456789</p>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">Estimasi Pengiriman</p>
            <p className="font-bold text-sm text-black">3 - 5 Hari Kerja</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/profile">
            <Button variant="outline" className="w-full border-black text-black h-12 uppercase tracking-widest font-bold hover:bg-black hover:text-white">
              Lihat Pesanan Saya
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full bg-black text-white h-12 uppercase tracking-widest font-bold hover:bg-gray-800">
              Lanjut Belanja
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
