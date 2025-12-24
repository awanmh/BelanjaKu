import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/image/categories/image_register.png')", // Gambar sepatu/workshop gelap
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
      </div>

      {/* Content Wrapper (Z-Index tinggi agar di atas background) */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* Logo BelanjaKu */}
        <Link href="/" className="mb-8">
          <h1 className="text-5xl font-serif font-bold text-white tracking-tight drop-shadow-lg">
            BelanjaKu
          </h1>
        </Link>

        {/* Navigation Tabs (Masuk / Daftar) */}
        <div className="flex gap-8 mb-6 text-lg font-medium">
           {/* Kita akan menggunakan usePathname di komponen client child untuk styling active state, 
               tapi untuk layout server sederhana ini, kita biarkan link biasa dulu.
               Styling aktif akan lebih mudah diatur di dalam page masing-masing atau komponen client nav.
           */}
        </div>

        {/* Main Card Content */}
        {children}
      </div>
    </div>
  );
}