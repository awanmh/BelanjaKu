'use client';

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
      setLoading(true);
      const res = await api.get('/cart');

      if (res.data.status === 'success' || res.data.success) {
        const rawItems = res.data.data?.items || [];

        // --- DEBUGGING TAHAP 2 ---
        console.log("Total Item dari Backend:", rawItems.length);
        if (rawItems.length > 0) {
          console.log("🔍 Cek Item Pertama:", rawItems[0]);
          console.log("❓ Apakah ada object product?:", rawItems[0].product);
        }
        // -------------------------

        // Filter: Hanya ambil item yang punya data product valid
        const validItems = rawItems.filter((item: any) => item && item.product);

        console.log("✅ Item Valid setelah filter:", validItems);

        setCartItems(validItems);

        const totalItems = validItems.reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0
        );
        setCartCount(totalItems);
      }
    } catch (error: any) {
      console.error("Error:", error);
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
    return cartItems.reduce((sum, item) => {
      // Safety check: jika product tidak ada, lewati
      if (!item.product) return sum;
      return sum + (item.product.price * item.quantity);
    }, 0);
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
      </div>
    );
  }

  return (
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
              // Safety Check: Jangan render jika produk null
              if (!item.product) return null;

              const imageUrl = item.product.imageUrl && item.product.imageUrl.startsWith('http')
                ? item.product.imageUrl
                : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/${item.product.imageUrl || ''}`;

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
        </div>
      </div>
    </div>
  );
}
