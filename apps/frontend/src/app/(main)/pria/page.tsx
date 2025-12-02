import CategoryLandingPage from '@/components/category/CategoryLandingPage';

export default function PriaPage() {
  const subCategories = [
    { name: 'Kemeja', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=500&auto=format&fit=crop', link: '/products?category=pria&sub=kemeja' },
    { name: 'Kaos', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500&auto=format&fit=crop', link: '/products?category=pria&sub=kaos' },
    { name: 'Celana', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=500&auto=format&fit=crop', link: '/products?category=pria&sub=celana' },
    { name: 'Jaket', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=500&auto=format&fit=crop', link: '/products?category=pria&sub=jaket' },
    { name: 'Sepatu', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=500&auto=format&fit=crop', link: '/products?category=pria&sub=sepatu' },
    { name: 'Tas', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop', link: '/products?category=pria&sub=tas' },
  ];

  return (
    <CategoryLandingPage
      categoryName="Pria"
      heroTitle="Men's Essential"
      heroSubtitle="Gaya maskulin modern untuk setiap kesempatan."
      heroImage="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop"
      subCategories={subCategories}
    />
  );
}
