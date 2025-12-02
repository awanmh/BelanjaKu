'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Heart, Share2, Star, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
  seller: {
    fullName: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.data);
          // Handle image URL
          const imgUrl = res.data.data.imageUrl.startsWith('http') 
            ? res.data.data.imageUrl 
            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/${res.data.data.imageUrl}`;
          setActiveImage(imgUrl);
        }
      } catch (error) {
        console.error('Gagal mengambil detail produk:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Produk tidak ditemukan</h1>
      </div>
    );
  }

  // Mock images for slider (since backend might only return one)
  const images = [
    activeImage,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop', // Mock 1
    'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=1000&auto=format&fit=crop', // Mock 2
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1000&auto=format&fit=crop', // Mock 3
  ];

  const sizes = ['37', '38', '39', '40', '41', '42', '43', '44', '45'];

  return (
    <div className="bg-white min-h-screen pb-20 pt-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 uppercase tracking-wide">
          Home / Wanita / Sepatu / <span className="text-black font-medium">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-3/5 flex gap-4">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-4 w-20 shrink-0">
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`aspect-square cursor-pointer border ${activeImage === img ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                  onMouseEnter={() => setActiveImage(img)}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1 bg-gray-50 aspect-[3/4] relative overflow-hidden group">
               <img 
                 src={activeImage} 
                 alt={product.name} 
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 cursor-zoom-in"
                 onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x800/png?text=No+Image'; }}
               />
               <div className="absolute top-4 right-4">
                 <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
                   <Share2 className="w-5 h-5" />
                 </button>
               </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-2/5">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-black mb-2">{product.name}</h1>
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">
                Dijual oleh <span className="text-black font-semibold">{product.seller?.fullName || 'Official Store'}</span>
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <p className="text-2xl font-bold text-black">{formatRupiah(Number(product.price))}</p>
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium text-black">4.8</span>
                  <span className="text-gray-400">(120 Ulasan)</span>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold uppercase tracking-widest">Pilih Ukuran</span>
                <button className="text-xs text-gray-500 underline">Panduan Ukuran</button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 flex items-center justify-center text-sm border transition-all
                      ${selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-200 hover:border-black text-black'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-xs text-green-600 mt-2">Ukuran {selectedSize} tersedia</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Link href="/cart" className="flex-1">
                <Button className="w-full bg-black text-white h-12 uppercase tracking-widest font-bold hover:bg-gray-800 rounded-none">
                  Tambahkan ke Tas
                </Button>
              </Link>
              <Button variant="outline" className="w-12 h-12 p-0 border-gray-300 rounded-none hover:border-black hover:text-black">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Delivery & Services */}
            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div className="flex gap-3">
                <Truck className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-bold">Gratis Ongkir</p>
                  <p className="text-xs text-gray-500">Untuk pembelian di atas Rp 500.000</p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-bold">100% Original</p>
                  <p className="text-xs text-gray-500">Barang terjamin keasliannya</p>
                </div>
              </div>
              <div className="flex gap-3">
                <RefreshCw className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-bold">15 Hari Pengembalian</p>
                  <p className="text-xs text-gray-500">Mudah dan tanpa biaya</p>
                </div>
              </div>
            </div>

            {/* Description Accordion (Simplified) */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Deskripsi Produk</h3>
              <div className="text-sm text-gray-600 leading-relaxed space-y-4">
                <p>{product.description || 'Tidak ada deskripsi produk.'}</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Material berkualitas tinggi</li>
                  <li>Desain trendy dan modern</li>
                  <li>Nyaman digunakan sehari-hari</li>
                  <li>Tahan lama dan awet</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
