'use client';

import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation'; // 1. Import useRouter

const accessories = [
  {
    id: 'acc-1',
    brand: 'GEOFFMAX',
    name: 'Makoto SS 16 Black',
    price: 84550,
    originalPrice: 200000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
    discount: 57,
    isNew: false
  },
  {
    id: 'acc-2',
    brand: 'GOZEAL',
    name: 'Gozeal Shirt Boxy Daisy',
    price: 319000,
    originalPrice: 400000,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    discount: 0,
    isNew: true
  },
  {
    id: 'acc-3',
    brand: 'BRODO',
    name: 'Bigger Trucker Hat All Black',
    price: 95580,
    originalPrice: 180000,
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
    discount: 46,
    isNew: false
  },
  {
    id: 'acc-4',
    brand: 'GOZEAL',
    name: 'Gozeal Shirt Vanesh',
    price: 149000,
    originalPrice: 400000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    discount: 63,
    isNew: false
  },
  {
    id: 'acc-5',
    brand: 'GEOFFMAX',
    name: 'Griever SS 16 Black',
    price: 94050,
    originalPrice: 200000,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
    discount: 52,
    isNew: false
  }
];

export default function AccessoriesShowcase() {
  const router = useRouter(); // 2. Inisialisasi router

  // Fungsi navigasi
  const handleNavigate = () => {
    router.push('/products?category=accessories');
  };

  return (
    <section className="container mx-auto px-4 py-16 border-t border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10">
        <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
            Lengkapi Gayamu
            </h2>
            <p className="text-gray-500 text-sm tracking-wide uppercase">
            Aksesoris & Apparel Terbaik dari Brand Lokal
            </p>
        </div>
        
        {/* FIX: Ganti <Link><Button>...</Button></Link> dengan Button onClick */}
        <Button 
            variant="outline" 
            className="hidden md:flex rounded-none border-black text-black hover:bg-black hover:text-white text-xs uppercase tracking-widest"
            onClick={handleNavigate}
        >
            Lihat Semua
        </Button>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {accessories.map((item) => (
          <div 
            key={item.id} 
            // Card bisa diklik untuk ke detail produk (misal)
            onClick={() => router.push(`/products/mock-${item.id}`)}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col group relative cursor-pointer"
          >
            {/* Brand Header */}
            <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-800">
                    {item.brand}
                </span>
                {item.discount > 0 ? (
                     <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {item.discount}%
                     </span>
                ) : item.isNew && (
                    <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        NEW
                     </span>
                )}
            </div>

            {/* Image */}
            <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">
                    {item.name}
                </h3>

                {/* Price */}
                <div className="mt-1 mb-2">
                    <div className="text-red-600 font-bold text-lg">
                        {formatRupiah(item.price)}
                    </div>
                    {item.originalPrice > item.price && (
                        <div className="text-gray-400 text-[10px] line-through decoration-gray-400">
                            {formatRupiah(item.originalPrice)}
                        </div>
                    )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium text-gray-700">{item.rating}</span>
                </div>

                {/* Button */}
                {/* Button ini ada di dalam div onClick parent, pastikan stopPropagation jika ingin aksi beda */}
                <Button 
                    className="w-full rounded-full bg-black text-white hover:bg-gray-800 text-xs font-bold py-5 mt-auto shadow-lg shadow-gray-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    onClick={(e) => {
                        e.stopPropagation(); // Mencegah klik tembus ke card parent
                        router.push(`/products/mock-${item.id}`); // Aksi beli
                    }}
                >
                    Beli Sekarang
                </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View All Button */}
      <div className="mt-8 text-center md:hidden">
        {/* FIX: Ganti <Link><Button>...</Button></Link> dengan Button onClick */}
        <Button 
            variant="outline" 
            className="w-full rounded-none border-black text-black text-xs uppercase tracking-widest"
            onClick={handleNavigate}
        >
            Lihat Semua
        </Button>
      </div>
    </section>
  );
}