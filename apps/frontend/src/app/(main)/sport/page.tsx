'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SportPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/products?category=sport');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
