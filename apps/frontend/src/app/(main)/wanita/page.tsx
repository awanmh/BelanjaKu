import CategoryLandingPage from '@/components/category/CategoryLandingPage';

export default function WanitaPage() {
  const subCategories = [
    { name: 'Dress', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=500&auto=format&fit=crop', link: '/products?category=wanita&sub=dress' },
    { name: 'Atasan', image: 'https://images.unsplash.com/photo-1551163943-3f6a29e39426?q=80&w=500&auto=format&fit=crop', link: '/products?category=wanita&sub=atasan' },
    { name: 'Bawahan', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=500&auto=format&fit=crop', link: '/products?category=wanita&sub=bawahan' },
    { name: 'Tas', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500&auto=format&fit=crop', link: '/products?category=wanita&sub=tas' },
    { name: 'Sepatu', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=500&auto=format&fit=crop', link: '/products?category=wanita&sub=sepatu' },
    { name: 'Aksesoris', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=500&auto=format&fit=crop', link: '/products?category=wanita&sub=aksesoris' },
  ];

  return (
    <CategoryLandingPage
      categoryName="Wanita"
      heroTitle="New Season Trends"
      heroSubtitle="Temukan koleksi fashion wanita terbaru yang elegan dan stylish."
      heroImage="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
      subCategories={subCategories}
    />
  );
}
