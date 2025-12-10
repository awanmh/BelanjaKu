'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface SubCategory {
  name: string;
  image: string;
  link: string;
}

interface CategoryLandingPageProps {
  categoryName: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  subCategories: SubCategory[];
}

export default function CategoryLandingPage({
  categoryName,
  heroImage,
  heroTitle,
  heroSubtitle,
  subCategories,
}: CategoryLandingPageProps) {
  return (
    <div className="bg-white min-h-screen pb-20 text-black">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-gray-100 overflow-hidden group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: `url('${heroImage}')` }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 uppercase tracking-wider drop-shadow-md">
            {heroTitle}
          </h1>
          <p className="text-lg md:text-xl font-light mb-8 max-w-2xl drop-shadow-sm">
            {heroSubtitle}
          </p>
          <Button className="bg-white text-black hover:bg-black hover:text-white transition-colors rounded-none px-10 py-4 uppercase tracking-widest text-sm font-bold">
            Shop Now
          </Button>
        </div>
      </div>



      {/* Placeholder for Product Grid (New Arrivals) */}
      <div className="container mx-auto px-4 py-12 border-t border-gray-100">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-black uppercase tracking-wide">New Arrivals</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">Koleksi terbaru untuk {categoryName}</p>
          </div>
          <Link href={`/products?category=${categoryName.toLowerCase()}`} className="text-xs font-bold uppercase tracking-widest underline decoration-1 underline-offset-4 hover:text-gray-600">
            Lihat Semua
          </Link>
        </div>
        
        {/* Grid of 4 items (Placeholder) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="group cursor-pointer">
               <div className="bg-gray-100 aspect-[3/4] mb-4 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400&auto=format&fit=crop"
                    alt="Product" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x600/png?text=Product';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <Button className="w-full bg-white text-black hover:bg-black hover:text-white text-xs uppercase tracking-widest">Add to Bag</Button>
                  </div>
               </div>
               <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Brand Name</p>
               <h3 className="text-sm font-medium text-black font-serif">Product Name {i}</h3>
               <p className="text-sm font-bold mt-1">Rp 299.000</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
