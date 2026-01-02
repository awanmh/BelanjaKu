"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-green-100 p-6 rounded-full mb-6 animate-bounce">
        <CheckCircle className="w-16 h-16 text-green-600" />
      </div>

      <h1 className="text-3xl font-serif font-bold mb-4">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-500 max-w-md mb-8">
        Thank you for your purchase. We have received your order and currently
        processing it. You will receive an email confirmation shortly.
      </p>

      <div className="flex gap-4">
        <Link href="/">
          <Button
            variant="outline"
            className="px-8 border-black text-black hover:bg-black hover:text-white uppercase tracking-widest text-xs"
          >
            Back to Home
          </Button>
        </Link>
        <Link href="/products">
          <Button
            variant="primary"
            className="px-8 uppercase tracking-widest text-xs"
          >
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
