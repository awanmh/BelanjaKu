"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { formatRupiah } from "@/lib/utils";
import { CheckCircle2, CreditCard, Truck, MapPin } from "lucide-react";
import api from "@/lib/api";
import { useCartStore } from "@/store/cart.store";

interface CartItem {
  id: string;
  quantity: number;
  size: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    seller: {
      fullName: string;
    };
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const setCartCount = useCartStore((state) => state.setCartCount);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      if (res.data.success) {
        const items = res.data.data.items || [];
        setCartItems(items);
        if (items.length === 0) {
          router.push("/cart");
        }
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const total = calculateTotal();
  const shipping = 0;

  const handlePlaceOrder = async () => {
    if (!formData.address || !formData.city || !formData.phone) {
      alert("Mohon lengkapi alamat pengiriman");
      setStep(1);
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create Order
      const shippingAddress = `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city}, ${formData.zip}. Telp: ${formData.phone}`;

      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress,
      };

      const res = await api.post("/orders", orderPayload);

      if (res.data.success) {
        // 2. Clear Cart
        await api.delete("/cart");
        setCartCount(0);

        // 3. Redirect
        router.push("/checkout/success");
      }
    } catch (error: any) {
      console.error("Order failed:", error);
      alert(error.response?.data?.message || "Gagal membuat pesanan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>

            <div
              className={`flex flex-col items-center gap-2 bg-gray-50 px-2 ${
                step >= 1 ? "text-black" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  step >= 1
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                1
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">
                Pengiriman
              </span>
            </div>

            <div
              className={`flex flex-col items-center gap-2 bg-gray-50 px-2 ${
                step >= 2 ? "text-black" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  step >= 2
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                2
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">
                Pembayaran
              </span>
            </div>

            <div
              className={`flex flex-col items-center gap-2 bg-gray-50 px-2 ${
                step >= 3 ? "text-black" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  step >= 3
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                3
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">
                Selesai
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Left: Form */}
          <div className="flex-1">
            {step === 1 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <MapPin className="w-5 h-5" />
                  <h2 className="text-lg font-bold uppercase tracking-wide">
                    Alamat Pengiriman
                  </h2>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nama Depan</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nama Belakang</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      placeholder="08123456789"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Input
                      id="address"
                      placeholder="Jl. Jendral Sudirman No. 1"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Kota / Kabupaten</Label>
                      <Input
                        id="city"
                        placeholder="Jakarta Selatan"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">Kode Pos</Label>
                      <Input
                        id="zip"
                        placeholder="12190"
                        value={formData.zip}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full bg-black text-white h-12 uppercase tracking-widest font-bold hover:bg-gray-800"
                    >
                      Lanjut ke Pembayaran
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <CreditCard className="w-5 h-5" />
                  <h2 className="text-lg font-bold uppercase tracking-wide">
                    Metode Pembayaran
                  </h2>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:border-black transition-colors bg-gray-50 border-black">
                    <div className="w-4 h-4 rounded-full border border-gray-400 bg-black"></div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">
                        Transfer Bank (Virtual Account)
                      </p>
                      <p className="text-xs text-gray-500">
                        BCA, Mandiri, BNI, BRI
                      </p>
                    </div>
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  </div>
                  {/* ... other payment methods ... */}
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 uppercase tracking-widest font-bold border-gray-300"
                  >
                    Kembali
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="flex-2 bg-black text-white h-12 uppercase tracking-widest font-bold hover:bg-gray-800"
                  >
                    {submitting ? "Memproses..." : "Buat Pesanan"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Ringkasan Pesanan</h3>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const imageUrl = item.product.imageUrl.startsWith("http")
                    ? item.product.imageUrl
                    : `${process.env.NEXT_PUBLIC_API_URL?.replace(
                        "/api/v1",
                        ""
                      )}/${item.product.imageUrl}`;
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={imageUrl}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-500">
                          {item.product.seller?.fullName || "Seller"}
                        </p>
                        <p className="text-sm font-medium line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-bold mt-1">
                          {formatRupiah(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatRupiah(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pengiriman</span>
                  <span>
                    {shipping === 0 ? "Gratis" : formatRupiah(shipping)}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-black">
                  <span>Total</span>
                  <span>{formatRupiah(total + shipping)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
