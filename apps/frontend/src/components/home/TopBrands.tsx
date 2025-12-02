'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const brands = [
  {
    id: 'compass',
    name: 'Compass',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop',
    description: 'New Move Against Counterfeits',
    link: '/products?brand=compass'
  },
  {
    id: 'ventela',
    name: 'Ventela',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
    description: 'Live with Pride',
    link: '/products?brand=ventela'
  },
  {
    id: 'geoffmax',
    name: 'Geoff Max',
    image: 'https://images.unsplash.com/photo-1560769629-975e13f0c470?q=80&w=800&auto=format&fit=crop',
    description: 'Ready to Kick',
    link: '/products?brand=geoffmax'
  }
];

export default function TopBrands() {
  return (
    <section className="container mx-auto px-4 py-16">
      
      {/* Section Title */}
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
          Brand Lokal Terpopuler
        </h2>
        <div className="h-[3px] w-28 bg-black mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {brands.map((brand) => (
          <Link
            href={brand.link}
            key={brand.id}
            className="
              group relative h-[460px] rounded-3xl overflow-hidden 
              shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer
            "
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={brand.image}
                alt={brand.name}
                className="
                  w-full h-full object-cover 
                  transition-transform duration-1400ms 
                  group-hover:scale-110 group-hover:rotate-1
                "
              />
              {/* Soft Cinematic Overlay */}
              <div className="
                absolute inset-0 
                bg-linear-to-t from-black/60 via-black/20 to-transparent
                group-hover:bg-black/40
                transition-all duration-500
              "></div>
            </div>

            {/* Logo & Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">

              {/* Brand Logos */}
              <div className="transition-all duration-500 group-hover:-translate-y-4">
                {brand.id === 'compass' && (
                  <h3 className="text-[52px] font-black tracking-wide text-white drop-shadow-lg uppercase">
                    COMPASS
                  </h3>
                )}

                {brand.id === 'ventela' && (
                  <h3 className="text-[50px] font-black text-white tracking-tight drop-shadow-md">
                    ventela<span className="text-white">®</span>
                  </h3>
                )}

                {brand.id === 'geoffmax' && (
                  <h3 className="
                    text-[48px] font-extrabold uppercase italic text-white 
                    drop-shadow-[4px_4px_0_#000]
                    leading-none
                  ">
                    GEOFF<br/>MAX
                  </h3>
                )}
              </div>

              {/* Hover Description & Button */}
              <div className="
                absolute bottom-10 
                opacity-0 translate-y-4 
                group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-700 ease-out
              ">
                <p className="text-white font-medium text-lg mb-4 drop-shadow-md">
                  {brand.description}
                </p>

                <Button
                  className="
                    rounded-full bg-white text-black 
                    hover:bg-gray-200 
                    px-10 py-5 font-bold text-xs tracking-widest
                  "
                >
                  Shop Now
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
