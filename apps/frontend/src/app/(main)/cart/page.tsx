'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, Minus, Heart, ArrowRight } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

// Mock Cart Data
const initialCartItems = [
  {
    id: 1,
    name: 'Velocity Black',
    brand: 'COMPASS',
    price: 789000,
    size: '42',
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1560769629-975e13f0c470?q=80&w=400&auto=format&fit=crop',
    selected: true,
  },
  {
    id: 2,
    name: 'Ethnic Low Black',
    brand: 'VENTELA',
    price: 187350,
    size: '40',
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=400&auto=format&fit=crop',
    selected: true,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const toggleSelect = (id: number) => {
    setCartItems(items =>
      items.map(item => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const subtotal = cartItems
    .filter(item => item.selected)
    .reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const shipping = subtotal > 500000 ? 0 : 20000;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=600&auto=format&fit=crop" 
            alt="Empty Cart" 
            className="w-48 h-48 object-cover rounded-full mx-auto mb-6 opacity-50"
          />
          <h2 className="text-2xl font-bold mb-2">Tas Belanja Anda Kosong</h2>
          <p className="text-gray-500 mb-8">Sepertinya Anda belum menambahkan produk apapun.</p>
          <Link href="/">
            <Button className="bg-black text-white px-8 py-3 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-gray-800">
              Mulai Belanja
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-serif font-bold mb-8">Tas Belanja ({cartItems.length})</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4">
                {/* Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item.id)}
                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                  />
                </div>

                {/* Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{item.brand}</p>
                        <h3 className="font-medium text-black">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">Ukuran: {item.size}</p>
                      </div>
                      <p className="font-bold text-black">{formatRupiah(item.price)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-black transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-gray-50 text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Ringkasan Pesanan</h3>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pengiriman</span>
                  <span>{shipping === 0 ? 'Gratis' : formatRupiah(shipping)}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600 italic">Anda hemat ongkos kirim!</p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-black">
                  <span>Total</span>
                  <span>{formatRupiah(total)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-black text-white h-12 uppercase tracking-widest font-bold hover:bg-gray-800 rounded-none flex justify-between items-center px-6">
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <div className="mt-6 text-xs text-gray-500 text-center">
                <p>Kami menerima berbagai metode pembayaran</p>
                <div className="flex justify-center gap-2 mt-2 opacity-60">
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
