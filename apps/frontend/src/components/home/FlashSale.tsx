'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, Star } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils';
import api from '@/lib/api';

// ================= TYPES =================
interface FlashSaleProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  imageUrl: string;
  seller: {
    fullName: string;
  };
  rating: string;
  sold: number;
  totalStock: number;
}

// ================= CONSTANTS =================
const INITIAL_TIME = {
  hours: 2,
  minutes: 42,
  seconds: 3,
};

const PLACEHOLDER_IMAGE =
  'https://placehold.co/400x600/png?text=Product';

// ================= COMPONENT =================
export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= TIMER =================
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ================= MOCK DATA =================
  const getMockProducts = (): FlashSaleProduct[] => [
    {
      id: 'fs1',
      name: 'Compass Velocity Black',
      price: 789000,
      originalPrice: 1099000,
      discount: 28,
      imageUrl: 'https://images.unsplash.com/photo-1560769629-975e13f0c470?q=80&w=600',
      seller: { fullName: 'Official Store' },
      rating: '4.8',
      sold: 85,
      totalStock: 100,
    },
    {
      id: 'fs2',
      name: 'Ventela Ethnic Low',
      price: 187350,
      originalPrice: 249000,
      discount: 25,
      imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=600',
      seller: { fullName: 'Ventela Official' },
      rating: '4.9',
      sold: 120,
      totalStock: 150,
    },
    {
      id: 'fs3',
      name: 'Geoff Max Go Walk',
      price: 671440,
      originalPrice: 1199000,
      discount: 44,
      imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=600',
      seller: { fullName: 'Geoff Max' },
      rating: '4.7',
      sold: 45,
      totalStock: 60,
    },
    {
      id: 'fs4',
      name: 'Brodo Signore Boots',
      price: 525000,
      originalPrice: 750000,
      discount: 30,
      imageUrl: 'https://images.unsplash.com/photo-1631233439639-8be596d5eb9c?q=80&w=600',
      seller: { fullName: 'Brodo' },
      rating: '4.6',
      sold: 30,
      totalStock: 50,
    },
  ];

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await api.get('/products?limit=4');

        let productList: any[] = [];

        if (res?.data?.data) {
          if (Array.isArray(res.data.data)) {
            productList = res.data.data;
          } else if (Array.isArray(res.data.data.rows)) {
            productList = res.data.data.rows;
          }
        }

        if (!productList.length) {
          setProducts(getMockProducts());
          return;
        }

        const mappedProducts: FlashSaleProduct[] = productList.map((p) => {
          const originalPrice = Number(p.price);
          const discount = [15, 20, 35, 50][Math.floor(Math.random() * 4)];
          const price = originalPrice - (originalPrice * discount) / 100;

          return {
            id: p.id,
            name: p.name,
            price,
            originalPrice,
            discount,
            imageUrl: p.imageUrl,
            seller: p.seller || { fullName: 'Official Store' },
            rating: (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
            sold: Math.floor(Math.random() * 50) + 10,
            totalStock: 100,
          };
        });

        setProducts(mappedProducts);
      } catch (error) {
        console.error('Flash sale error, using mock data:', error);
        setProducts(getMockProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSale();
  }, []);

  // ================= RENDER =================
  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500 animate-pulse" />
          <h2 className="text-4xl font-serif font-bold tracking-tight text-slate-900">
            Flash Sale
          </h2>
        </div>

        {/* Timer */}
        <div className="bg-white border rounded-xl p-4 flex items-center gap-6 shadow-sm">
          <span className="text-sm text-gray-500 font-medium">Berakhir dalam:</span>
          <div className="flex gap-3">
            {(['hours', 'minutes', 'seconds'] as const).map((unit, idx) => (
              <div key={unit} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold text-lg">
                    {String(timeLeft[unit]).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 uppercase">
                    {unit === 'hours' ? 'Jam' : unit === 'minutes' ? 'Menit' : 'Detik'}
                  </span>
                </div>
                {idx < 2 && <span className="text-2xl font-bold text-gray-300 mb-4">:</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[450px] bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border shadow-sm hover:shadow-xl transition-all flex flex-col"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                {item.seller.fullName}
              </p>

              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
                <img
                  src={item.imageUrl?.startsWith('http') ? item.imageUrl : PLACEHOLDER_IMAGE}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE)
                  }
                />
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl">
                  {item.discount}% OFF
                </span>
              </div>

              <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-2">
                {item.name}
              </h3>

              <div className="mb-3">
                <div className="text-red-600 font-black text-xl">
                  {formatRupiah(item.price)}
                </div>
                <span className="text-xs text-gray-400 line-through">
                  {formatRupiah(item.originalPrice)}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold mb-3">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                {item.rating}
              </div>

              <Button className="mt-auto rounded-full bg-black text-white py-6 font-bold">
                Beli Sekarang
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
