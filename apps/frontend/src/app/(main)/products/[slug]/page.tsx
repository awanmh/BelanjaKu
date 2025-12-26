'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cart.store';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
  seller: {
    fullName: string;
  };
  category?: {
    name: string;
  };
}

const SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44'];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const incrementCartCount = useCartStore((state) => state.incrementCartCount);
  
  // Accordion states
  const [accordions, setAccordions] = useState({
    description: true,
    sizeGuide: false,
    shipping: false,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        if (res.data.success) {
          const productData = res.data.data;
          setProduct(productData);
          
          // Fetch related products from same category
          if (productData.categoryId) {
            try {
              const relatedRes = await api.get(`/products?limit=4&categoryId=${productData.categoryId}`);
              if (relatedRes.data.success) {
                const allProducts = Array.isArray(relatedRes.data.data) 
                  ? relatedRes.data.data 
                  : relatedRes.data.data.rows || [];
                
                // Filter out current product and take first 4
                const filtered = allProducts
                  .filter((p: Product) => p.id !== productId)
                  .slice(0, 4);
                setRelatedProducts(filtered);
              }
            } catch (error) {
              console.error('Failed to fetch related products:', error);
              // Continue without related products
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Silakan pilih ukuran terlebih dahulu');
      return;
    }

    setAddingToCart(true);
    try {
      await api.post('/cart', {
        productId: product!.id,
        size: selectedSize,
        quantity,
      });
      
      // Increment cart count by the quantity added
      for (let i = 0; i < quantity; i++) {
        incrementCartCount();
      }
      
      alert('Produk berhasil ditambahkan ke keranjang!');
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('Silakan login terlebih dahulu');
        router.push('/auth/login');
      } else {
        alert(error.response?.data?.message || 'Gagal menambahkan ke keranjang');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    setAddingToWishlist(true);
    try {
      await api.post('/wishlist', {
        productId: product!.id,
      });
      
      alert('Produk berhasil ditambahkan ke wishlist!');
      router.push('/wishlist');
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('Silakan login terlebih dahulu');
        router.push('/auth/login');
      } else if (error.response?.status === 400) {
        alert('Produk sudah ada di wishlist');
      } else {
        alert(error.response?.data?.message || 'Gagal menambahkan ke wishlist');
      }
    } finally {
      setAddingToWishlist(false);
    }
  };

  const toggleAccordion = (key: keyof typeof accordions) => {
    setAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const imageUrl = product.imageUrl.startsWith('http')
    ? product.imageUrl
    : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/${product.imageUrl}`;

  // Generate multiple thumbnails (for demo, we'll use same image with different filters)
  const thumbnails = [
    imageUrl,
    imageUrl,
    imageUrl,
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <span className="hover:text-black cursor-pointer" onClick={() => router.push('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-black cursor-pointer">{product.category?.name || 'Products'}</span>
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Product Images with Thumbnails */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={thumbnails[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/png?text=Product';
                }}
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-black' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={thumb}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/png?text=View';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                {product.seller?.fullName || 'Official Store'}
              </p>
              <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8) • 120 Reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-y border-gray-200 py-6">
              <div className="text-3xl font-bold text-black">
                {formatRupiah(product.price)}
              </div>
              <p className="text-sm text-gray-500 mt-1">Harga sudah termasuk PPN</p>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold uppercase tracking-wide">
                  Pilih Ukuran
                </label>
                <button 
                  onClick={() => toggleAccordion('sizeGuide')}
                  className="text-xs text-gray-500 underline hover:text-black"
                >
                  Panduan Ukuran
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {SHOE_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      aspect-square border-2 rounded-lg flex items-center justify-center
                      text-sm font-medium transition-all
                      ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
              {selectedSize && (
                <p className="text-xs text-green-600 mt-2">✓ Ukuran {selectedSize} tersedia</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm font-semibold uppercase tracking-wide mb-3 block">
                Jumlah
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:border-black transition"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:border-black transition"
                >
                  +
                </button>
                <span className="text-sm text-gray-500 ml-2">
                  ({product.stock} tersedia)
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize || addingToCart}
                className="w-full bg-black text-white hover:bg-gray-800 h-14 text-base font-semibold uppercase tracking-wide rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menambahkan...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Tambah ke Keranjang
                  </span>
                )}
              </Button>

              <Button
                onClick={handleAddToWishlist}
                disabled={addingToWishlist}
                variant="outline"
                className="w-full border-2 border-black text-black hover:bg-black hover:text-white h-14 text-base font-semibold uppercase tracking-wide rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToWishlist ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Menambahkan...
                  </span>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Simpan ke Wishlist
                  </>
                )}
              </Button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-gray-600" />
                <span>Gratis ongkir untuk pembelian di atas Rp500.000</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-gray-600" />
                <span>100% produk original</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="w-5 h-5 text-gray-600" />
                <span>Pengembalian mudah dalam 14 hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="mt-16 max-w-4xl">
          {/* Description Accordion */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleAccordion('description')}
              className="w-full py-6 flex items-center justify-between text-left hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-bold">Detail Produk</h2>
              {accordions.description ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {accordions.description && (
              <div className="pb-6 prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
            )}
          </div>

          {/* Size Guide Accordion */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleAccordion('sizeGuide')}
              className="w-full py-6 flex items-center justify-between text-left hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-bold">Panduan Ukuran</h2>
              {accordions.sizeGuide ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {accordions.sizeGuide && (
              <div className="pb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Ukuran</th>
                      <th className="px-4 py-2 text-left">Panjang Kaki (cm)</th>
                      <th className="px-4 py-2 text-left">EU</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b"><td className="px-4 py-2">38</td><td className="px-4 py-2">24.0</td><td className="px-4 py-2">38</td></tr>
                    <tr className="border-b"><td className="px-4 py-2">39</td><td className="px-4 py-2">25.0</td><td className="px-4 py-2">39</td></tr>
                    <tr className="border-b"><td className="px-4 py-2">40</td><td className="px-4 py-2">25.5</td><td className="px-4 py-2">40</td></tr>
                    <tr className="border-b"><td className="px-4 py-2">41</td><td className="px-4 py-2">26.5</td><td className="px-4 py-2">41</td></tr>
                    <tr className="border-b"><td className="px-4 py-2">42</td><td className="px-4 py-2">27.0</td><td className="px-4 py-2">42</td></tr>
                    <tr className="border-b"><td className="px-4 py-2">43</td><td className="px-4 py-2">28.0</td><td className="px-4 py-2">43</td></tr>
                    <tr className="border-b"><td className="px-4 py-2">44</td><td className="px-4 py-2">28.5</td><td className="px-4 py-2">44</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Shipping Accordion */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleAccordion('shipping')}
              className="w-full py-6 flex items-center justify-between text-left hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-bold">Pengiriman & Pengembalian</h2>
              {accordions.shipping ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {accordions.shipping && (
              <div className="pb-6 space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">Pengiriman</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Gratis ongkir untuk pembelian di atas Rp500.000</li>
                    <li>Estimasi pengiriman 2-5 hari kerja</li>
                    <li>Tersedia COD untuk area tertentu</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pengembalian</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Pengembalian gratis dalam 14 hari</li>
                    <li>Produk harus dalam kondisi original dengan tag</li>
                    <li>Refund diproses dalam 7-14 hari kerja</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products - "Kamu Mungkin Suka" */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8 text-center">Kamu Mungkin Suka</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => {
                const itemImageUrl = item.imageUrl.startsWith('http')
                  ? item.imageUrl
                  : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/${item.imageUrl}`;

                return (
                  <Link key={item.id} href={`/products/${item.id}`} className="group">
                    <div className="relative aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 mb-3">
                      <img
                        src={itemImageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x600/png?text=Product';
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {item.seller?.fullName || 'Official Store'}
                      </p>
                      <h3 className="text-sm font-medium text-black mb-2 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-base font-bold text-black">
                        {formatRupiah(item.price)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
