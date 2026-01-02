"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUserStore } from "@/store/user.store";
import api from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useUserStore();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    address: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulation of checkout API
      // const res = await api.post('/orders', { items, ...formData });

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network

      clearCart();
      router.push("/checkout/success");
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Form */}
        <div>
          <h2 className="font-bold text-lg mb-6 uppercase tracking-wider">
            Shipping Details
          </h2>
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <Input
                name="zip"
                placeholder="Postal Code"
                value={formData.zip}
                onChange={handleChange}
                required
              />
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-8 rounded-lg h-fit">
          <h2 className="font-bold text-lg mb-6 uppercase tracking-wider">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start text-sm"
              >
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-white rounded overflow-hidden">
                    <img
                      src={item.imageUrl || item.images?.[0]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatRupiah(getTotalPrice())}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
          </div>

          <div className="border-t border-black mt-4 pt-4 flex justify-between font-bold text-xl">
            <span>Total</span>
            <span>{formatRupiah(getTotalPrice())}</span>
          </div>

          <Button
            form="checkout-form"
            type="submit"
            variant="primary"
            className="w-full mt-6 h-12 bg-black hover:bg-gray-800 text-white font-bold"
            disabled={loading}
          >
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
