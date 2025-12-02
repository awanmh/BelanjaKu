'use client';

import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-black overflow-hidden group">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
        style={{ 
            // Menggunakan placeholder image fashion gelap yang mirip referensi
            backgroundImage: "url('https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop')" 
        }}
      >
        {/* Gradient Overlay agar teks terbaca */}
        {/* Updated from bg-gradient-to-t to bg-linear-to-t per lint suggestion */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content - Centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        {/* Brand Logo / Icon (Simulasi kotak merah di gambar Anda) */}
        <div className="w-16 h-16 bg-red-700 rounded-xl shadow-2xl shadow-red-900/50 flex items-center justify-center mb-8 animate-fade-in-up">
            <span className="text-white font-serif text-3xl font-bold">B</span>
        </div>

        <h2 className="text-white text-3xl md:text-5xl font-serif italic mb-4 tracking-wide max-w-3xl drop-shadow-lg">
          New Collection: <span className="not-italic font-sans font-bold">Urban Style</span>
        </h2>
        
        <p className="text-gray-300 text-sm md:text-base mb-8 max-w-xl font-light tracking-wider">
          BELANJAKU's NEW MOVE AGAINST COUNTERFEITS. AUTHENTIC STYLE ONLY.
        </p>

        <Button 
            className="rounded-full px-8 py-6 bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-xs uppercase tracking-widest"
        >
          Read More
        </Button>
      </div>

      {/* Slider Dots (Simulasi) */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-white/40 hover:bg-white cursor-pointer"></div>
        <div className="w-8 h-2 rounded-full bg-white cursor-pointer"></div> {/* Active */}
        <div className="w-2 h-2 rounded-full bg-white/40 hover:bg-white cursor-pointer"></div>
      </div>
    </div>
  );
}