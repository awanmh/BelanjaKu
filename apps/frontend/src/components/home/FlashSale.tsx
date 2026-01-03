'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils';
import { Zap, Star } from 'lucide-react';
import api from '@/lib/api';

// Tipe data simulasi untuk tampilan Flash Sale
interface FlashSaleProduct {
  id: string;
  name: string;
  price: number;         
  originalPrice: number; 
  discount: number;      
  imageUrl: string;
  seller: { fullName: string };
  rating: string;
  sold: number;          
  totalStock: number;    
}

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 42, seconds: 3 });
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Timer Mundur
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev; 
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fungsi untuk menghasilkan data mock jika API gagal
  const getMockProducts = (): FlashSaleProduct[] => [
      {
          id: 'fs1', name: 'Compass Velocity Black', price: 789000, originalPrice: 1099000, discount: 28,
          imageUrl: 'https://images.unsplash.com/photo-1560769629-975e13f0c470?q=80&w=600', seller: { fullName: 'Official Store' }, rating: '4.8', sold: 85, totalStock: 100
      },
      {
          id: 'fs2', name: 'Ventela Ethnic Low', price: 187350, originalPrice: 249000, discount: 25,
          imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=600', seller: { fullName: 'Ventela Official' }, rating: '4.9', sold: 120, totalStock: 150
      },
      {
          id: 'fs3', name: 'Geoff Max Go Walk', price: 671440, originalPrice: 1199000, discount: 44,
          imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=600', seller: { fullName: 'Geoff Max' }, rating: '4.7', sold: 45, totalStock: 60
      },
      {
          id: 'fs4', name: 'Brodo Signore Boots', price: 525000, originalPrice: 750000, discount: 30,
          imageUrl: 'https://images.unsplash.com/photo-1631233439639-8be596d5eb9c?q=80&w=600', seller: { fullName: 'Brodo' }, rating: '4.6', sold: 30, totalStock: 50
      }
  ];

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        // Coba panggil API
        const res = await api.get('/products?limit=4');
        
        // Cek struktur response dengan teliti
        let productList = [];
        if (res.data && res.data.data) {
            if (Array.isArray(res.data.data)) {
                productList = res.data.data;
            } else if (res.data.data.rows && Array.isArray(res.data.data.rows)) {
                productList = res.data.data.rows;
            }
        }

        if (productList.length > 0) {
            // Transformasi data API ke format Flash Sale
            const flashSaleData = productList.map((p: any) => {
                const originalPrice = Number(p.price);
                const discount = [15, 20, 35, 50][Math.floor(Math.random() * 4)]; 
                const discountedPrice = originalPrice - (originalPrice * (discount / 100));
                
                return {
                    id: p.id,
                    name: p.name,
                    price: discountedPrice,
                    originalPrice: originalPrice,
                    discount: discount,
                    imageUrl: p.imageUrl,
                    seller: p.seller || { fullName: 'Official Store' },
                    rating: (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1),
                    sold: Math.floor(Math.random() * 50) + 10,
                    totalStock: 100
                };
            });
            setProducts(flashSaleData);
        } else {
            // Jika API kosong, pakai mock
            setProducts(getMockProducts());
        }
      } catch (error) {
        console.error("Gagal memuat flash sale (menggunakan data mock):", error);
        setProducts(getMockProducts());
      } finally {
        setLoading(false);
      }
    };
    fetchFlashSale();
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500 animate-pulse" />
                <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Flash Sale</h2>
            </div>
            
            {/* Timer Box */}
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
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Product Grid */}
        {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                 {[1,2,3,4].map(i => <div key={i} className="h-[450px] bg-gray-100 rounded-2xl animate-pulse" />)}
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col group relative overflow-hidden">
                        
                        {/* Brand Name */}
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 truncate">
                            {item.seller?.fullName}
                        </p>

                        {/* Image Area */}
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
                             <img 
                                src={item.imageUrl.startsWith('http') ? item.imageUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/${item.imageUrl}`} 
                                alt={item.name}
                                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/png?text=Product"; }}
                             />
                             {/* Discount Badge */}
                             <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-md z-10">
                                {Math.round(item.discount)}% OFF
                             </span>
                        </div>


                        <div className="flex-1 flex flex-col">
                            <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 line-clamp-2 min-h-2.5rem">
                                {item.name}
                            </h3>
                            
                            {/* Price Section */}
                            <div className="mt-1 mb-3">
                                <div className="text-red-600 font-black text-xl">
                                    {formatRupiah(item.price)}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                    <span className="line-through decoration-gray-400">{formatRupiah(item.originalPrice)}</span>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-3">
                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> 
                                {item.rating} 
                                <span className="text-gray-400 font-normal ml-1">(25)</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1.5">
                                    <span>Terjual {item.sold}</span>
                                    <span className="text-red-500">Segera Habis!</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-linear-to-r from-red-500 to-red-600 h-full rounded-full" 
                                        style={{ width: `${(item.sold / item.totalStock) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button className="w-full rounded-full bg-black text-white hover:bg-gray-800 text-sm font-bold py-6 shadow-lg shadow-gray-200 mt-auto tracking-wide">
                                Beli Sekarang
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </section>
  );
}
    </section>
  );
}