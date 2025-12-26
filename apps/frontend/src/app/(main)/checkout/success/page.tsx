'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Pesanan Berhasil!</h1>
        <p className="text-gray-600 mb-8">
          Terima kasih telah berbelanja. Pesanan Anda akan segera kami proses.
        </p>
        <div className="space-y-3">
          <Link href="/profile/orders" className="block w-full">
            <Button className="w-full bg-black text-white hover:bg-gray-800">
              Lihat Pesanan Saya
            </Button>
          </Link>
          <Link href="/" className="block w-full">
            <Button variant="outline" className="w-full">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
