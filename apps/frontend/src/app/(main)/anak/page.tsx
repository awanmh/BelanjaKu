import CategoryLandingPage from '@/components/category/CategoryLandingPage';

export default function AnakPage() {
  const subCategories = [
    { name: 'Anak Laki-laki', image: 'https://images.unsplash.com/photo-1519238263496-63439708bc0c?q=80&w=500&auto=format&fit=crop', link: '/products?category=anak&sub=laki-laki' },
    { name: 'Anak Perempuan', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=500&auto=format&fit=crop', link: '/products?category=anak&sub=perempuan' },
    { name: 'Bayi', image: 'https://images.unsplash.com/photo-1522771753035-0a153950c6f2?q=80&w=500&auto=format&fit=crop', link: '/products?category=anak&sub=bayi' },
    { name: 'Sepatu', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=500&auto=format&fit=crop', link: '/products?category=anak&sub=sepatu' },
    { name: 'Aksesoris', image: 'https://images.unsplash.com/photo-1611428813653-aa606c998586?q=80&w=500&auto=format&fit=crop', link: '/products?category=anak&sub=aksesoris' },
  ];

  return (
    <CategoryLandingPage
      categoryName="Anak"
      heroTitle="Kids Collection"
      heroSubtitle="Pakaian nyaman dan ceria untuk si kecil."
      heroImage="https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2069&auto=format&fit=crop"
      subCategories={subCategories}
    />
  );
}
