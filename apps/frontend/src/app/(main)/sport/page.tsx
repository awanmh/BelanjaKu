import CategoryLandingPage from '@/components/category/CategoryLandingPage';

export default function SportPage() {
  const subCategories = [
    { name: 'Pria', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=500&auto=format&fit=crop', link: '/products?category=sport&sub=pria' },
    { name: 'Wanita', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=500&auto=format&fit=crop', link: '/products?category=sport&sub=wanita' },
    { name: 'Sepatu', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop', link: '/products?category=sport&sub=sepatu' },
    { name: 'Peralatan', image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=500&auto=format&fit=crop', link: '/products?category=sport&sub=peralatan' },
    { name: 'Aksesoris', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=500&auto=format&fit=crop', link: '/products?category=sport&sub=aksesoris' },
  ];

  return (
    <CategoryLandingPage
      categoryName="Sport"
      heroTitle="Active & Sport"
      heroSubtitle="Performa maksimal dengan perlengkapan olahraga terbaik."
      heroImage="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
      subCategories={subCategories}
    />
  );
}
