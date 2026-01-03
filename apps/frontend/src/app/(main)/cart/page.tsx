'use client';

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> frontend-role
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cart.store';

interface CartItem {
  id: string;
  quantity: number;
  size: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
    seller: {
      fullName: string;
    };
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const setCartCount = useCartStore((state) => state.setCartCount);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      if (res.data.success) {
        const items = res.data.data.items || [];
        setCartItems(items);
        
        // Update cart count in store
        const totalItems = items.reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0
        );
        setCartCount(totalItems);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/auth/login');
      } else {
        console.error('Failed to fetch cart:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(cartId);
    try {
      await api.patch(`/cart/${cartId}`, { quantity: newQuantity });
      await fetchCart();
    } catch (error) {
      alert('Gagal update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartId: string) => {
    if (!confirm('Hapus produk dari keranjang?')) return;
    
    setUpdating(cartId);
    try {
      await api.delete(`/cart/${cartId}`);
      await fetchCart();
    } catch (error) {
      alert('Gagal menghapus produk');
    } finally {
      setUpdating(null);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const shippingCost = 0; // Free shipping
  const total = calculateTotal() + shippingCost;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold mb-2">Keranjang Kosong</h2>
          <p className="text-gray-500 mb-6">Belum ada produk di keranjang Anda</p>
          <Button onClick={() => router.push('/')} className="bg-black text-white hover:bg-gray-800">
            Mulai Belanja
          </Button>
        </div>
<<<<<<< HEAD
=======
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
>>>>>>> frontend-update
=======
>>>>>>> frontend-role
      </div>
    );
  }

  return (
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> frontend-role
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Keranjang Belanja</h1>
          <p className="text-gray-600">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const imageUrl = item.product.imageUrl.startsWith('http')
                ? item.product.imageUrl
                : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/${item.product.imageUrl}`;

              return (
                <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/png?text=Product';
                          }}
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            {item.product.seller?.fullName || 'Official Store'}
                          </p>
                          <Link href={`/products/${item.product.id}`}>
                            <h3 className="font-semibold text-black hover:underline line-clamp-1">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">Ukuran: {item.size}</p>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                          className="text-gray-400 hover:text-red-600 transition p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id || item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 transition disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id || item.quantity >= item.product.stock}
                            className="p-2 hover:bg-gray-100 transition disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-black">
                            {formatRupiah(item.product.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">
                              {formatRupiah(item.product.price)} / item
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Ringkasan Pesanan</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                  <span>{formatRupiah(calculateTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Ongkir</span>
                  <span className="text-green-600 font-semibold">GRATIS</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatRupiah(total)}</span>
                </div>
              </div>

              <Button
                onClick={() => router.push('/checkout')}
                className="w-full bg-black text-white hover:bg-gray-800 h-12 font-semibold uppercase tracking-wide rounded-lg mb-3"
              >
                <span className="flex items-center justify-center gap-2">
                  Checkout
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>

              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 hover:border-black hover:text-black h-12 font-semibold rounded-lg"
              >
                Lanjut Belanja
              </Button>

              {/* Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Gratis ongkir untuk semua pembelian
                </p>
              </div>
            </div>
          </div>
<<<<<<< HEAD
=======
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
>>>>>>> frontend-update
=======
>>>>>>> frontend-role
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
<<<<<<< HEAD
}
=======
}
>>>>>>> frontend-update
=======
}
>>>>>>> frontend-role
