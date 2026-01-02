"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getTotalPrice } =
    useCartStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-12 text-center">Loading cart...</div>;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <ShoppingBag className="w-16 h-16 text-gray-300" />
        </div>
        <h1 className="text-2xl font-serif font-bold mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-500 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link href="/products">
          <Button
            variant="primary"
            className="h-12 px-8 uppercase tracking-widest text-xs"
          >
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* CART ITEMS */}
        <div className="flex-1 space-y-6">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b text-sm font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b pb-6"
            >
              {/* Product Info */}
              <div className="col-span-1 md:col-span-6 flex gap-4">
                <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden shrink-0">
                  <img
                    src={
                      item.imageUrl ||
                      item.images?.[0] ||
                      "https://placehold.co/100x100?text=No+Img"
                    }
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 uppercase mt-1">
                    {item.category} • {item.type}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-xs mt-2 flex items-center hover:underline"
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Remove
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex md:hidden justify-between items-center w-full mt-2">
                <span className="text-gray-500 text-sm">Price</span>
                <span className="font-medium">{formatRupiah(item.price)}</span>
              </div>
              <div className="hidden md:block col-span-2 text-center font-medium">
                {formatRupiah(item.price)}
              </div>

              {/* Quantity */}
              <div className="flex justify-between md:justify-center items-center col-span-1 md:col-span-2 mt-2 md:mt-0">
                <span className="md:hidden text-gray-500 text-sm">Qty</span>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 hover:bg-gray-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 hover:bg-gray-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between md:justify-end items-center col-span-1 md:col-span-2 mt-2 md:mt-0 font-bold">
                <span className="md:hidden text-gray-500 text-sm">
                  Subtotal
                </span>
                {formatRupiah(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="w-full lg:w-96">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatRupiah(getTotalPrice())}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600">Calculated at Checkout</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>{formatRupiah(getTotalPrice())}</span>
            </div>

            <Button
              variant="primary"
              className="w-full h-12 uppercase tracking-widest text-xs font-bold"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </Button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
