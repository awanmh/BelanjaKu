'use client';

<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils';
import { Zap, Star } from 'lucide-react';
import api from '@/lib/api';

interface FlashSaleProduct {
  id: string;
  brand: string;
  article: string;
>>>>>>> frontend-role
  price: number;
  originalPrice: number;
  discount: number;
  imageUrl: string;
<<<<<<< HEAD
  seller: {
    fullName: string;
  };
=======
  seller: { fullName: string };
>>>>>>> frontend-role
  rating: string;
  sold: number;
  totalStock: number;
}

<<<<<<< HEAD
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
=======
export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 42, seconds: 3 });
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // TIMER
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) return prev;

        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };

        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // MOCK
  const generateMockProducts = (): FlashSaleProduct[] => {
    return [
      { id: 'm1', brand: 'COMPASS', article: 'Velocity Black', price: 789000, originalPrice: 1099000, discount: 28, imageUrl: 'https://images.unsplash.com/photo-1560769629-975e13f0c470?q=80&w=800&auto=format&fit=crop', seller: { fullName: 'Official Store' }, rating: '4.8', sold: 85, totalStock: 100 },
      { id: 'm2', brand: 'VENTELA', article: 'Ethnic Low Black', price: 187350, originalPrice: 249000, discount: 25, imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop', seller: { fullName: 'Ventela Official' }, rating: '5.0', sold: 40, totalStock: 50 },
      { id: 'm3', brand: 'GEOFFMAX', article: 'Go Walk Flex', price: 671440, originalPrice: 1199000, discount: 44, imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop', seller: { fullName: 'Geoff Max' }, rating: '4.7', sold: 92, totalStock: 100 },
      { id: 'm4', brand: 'Adidas', article: 'Samba OG White', price: 2200000, originalPrice: 2500000, discount: 12, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop', seller: { fullName: 'Sneaker Head' }, rating: '4.9', sold: 15, totalStock: 30 },
    ];
  };

  // FETCH API
  useEffect(() => {
    const fetchFlashSale = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products?limit=4');
        const data = res?.data?.data ?? res?.data;
        const rawProducts = Array.isArray(data) ? data : (data?.rows ?? []);

        if (!rawProducts || rawProducts.length === 0) {
          setProducts(generateMockProducts());
          return;
        }

        const flashSaleData: FlashSaleProduct[] = rawProducts.map((p: any) => {
          const priceNum = Number(p.price ?? p.discountedPrice ?? 0) || 0;

          const discountNum = p.discount ? Number(p.discount) : undefined;
          const discount = discountNum ?? [20, 35, 50, 60][Math.floor(Math.random() * 4)];

          const originalPrice = Number(p.originalPrice ?? (priceNum / (1 - discount / 100))) || priceNum;
          const imageUrl = p.imageUrl ?? p.image ?? (p.images?.[0]) ?? '';

          const brand = p.brand ?? p.merk ?? p.name ?? 'STORE';
          const article = p.article ?? p.title ?? '';

          const sold = Number(p.sold ?? Math.floor(Math.random() * 80) + 10);
          const totalStock = Number(p.totalStock ?? 100);

          return {
            id: String(p.id ?? p._id ?? Math.random().toString(36).slice(2, 9)),
            brand,
            article,
            price: priceNum,
            originalPrice,
            discount,
            imageUrl,
            seller: p.seller ?? { fullName: 'Official Store' },
            rating: (p.rating ? String(Number(p.rating).toFixed(1)) : (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1)),
            sold,
            totalStock,
          };
        });

        setProducts(flashSaleData);
      } catch (error) {
        console.error('API Error:', error);
        setProducts(generateMockProducts());
>>>>>>> frontend-role
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSale();
  }, []);

<<<<<<< HEAD
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
=======
  return (
    <section className="container mx-auto px-4 py-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500 animate-pulse" />
          <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Flash Sale</h2>
        </div>

        {/* TIMER */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-4 flex items-center gap-6">
          <span className="text-sm text-gray-500 font-medium">Berakhir dalam:</span>

          <div className="flex items-center gap-3">
            {['hours', 'minutes', 'seconds'].map((unit, idx) => (
              <div key={unit} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="bg-black text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                    {String(timeLeft[unit as keyof typeof timeLeft]).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                    {unit === 'hours' ? 'Jam' : unit === 'minutes' ? 'Menit' : 'Detik'}
                  </span>
                </div>

                {idx < 2 && <span className="font-bold text-2xl text-gray-300 mb-4">:</span>}
>>>>>>> frontend-role
              </div>
            ))}
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
=======
      {/* PRODUCT GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
>>>>>>> frontend-role
            <div key={i} className="h-[450px] bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
<<<<<<< HEAD
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
=======
          {products.map((item) => {
            const progressPercent = Math.min(100, Math.round((item.sold / Math.max(1, item.totalStock)) * 100));

            const imgSrc =
              item.imageUrl && item.imageUrl.startsWith('http')
                ? item.imageUrl
                : item.imageUrl
                ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? ''}/${item.imageUrl}`
                : 'https://placehold.co/400x400/png?text=Product';

            return (
              <Link key={item.id} href={`/products/${item.id}`}>
                <div
                  className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col relative overflow-hidden group cursor-pointer"
                >
                  {/* Seller */}
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    {item.seller?.fullName || item.brand}
                  </p>

                  {/* IMAGE */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
                    <img
                      src={imgSrc}
                      alt={`${item.brand} ${item.article}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/png?text=Product';
                      }}
                    />

                    {/* DISCOUNT BADGE */}
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-md">
                      {item.discount}% OFF
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 flex flex-col">
                    {/* Brand */}
                    <h3 className="font-bold text-gray-900 text-lg leading-snug mb-1 line-clamp-2 min-h-3.5rem">
                      {item.brand}
                    </h3>

                    {/* Article (FIXED) */}
                    <p className="text-gray-600 text-sm mb-1 line-clamp-1">
                      {item.article}
                    </p>

                    {/* PRICE */}
                    <div className="mt-1 mb-3">
                      <div className="text-red-600 font-black text-xl">{formatRupiah(item.price)}</div>

                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <span className="line-through decoration-gray-400">
                          {formatRupiah(item.originalPrice)}
                        </span>
                      </div>
                    </div>

                    {/* RATING */}
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-3">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      {item.rating}
                      <span className="text-gray-400 font-normal ml-1">(50+)</span>
                    </div>

                    {/* PROGRESS */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1.5">
                        <span>Terjual {item.sold}</span>
                        <span className="text-red-500">Segera Habis!</span>
                      </div>

                      <div
                        className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progressPercent}
                      >
                        <div
                          className="bg-red-600 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* BUTTON */}
                    <Button
                      type="button"
                      className="w-full rounded-full bg-black text-white hover:bg-gray-800 text-sm font-bold py-6 shadow-lg mt-auto tracking-wide"
                    >
                      Beli Sekarang
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })}
>>>>>>> frontend-role
        </div>
      )}
    </section>
  );
}
