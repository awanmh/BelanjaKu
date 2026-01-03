import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  cartCount: number;
  setCartCount: (count: number) => void;
  incrementCartCount: () => void;
  decrementCartCount: () => void;
  resetCartCount: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartCount: 0,
      
      setCartCount: (count: number) => set({ cartCount: count }),
      
      incrementCartCount: () => set((state) => ({ cartCount: state.cartCount + 1 })),
      
      decrementCartCount: () => set((state) => ({ 
        cartCount: Math.max(0, state.cartCount - 1) 
      })),
      
      resetCartCount: () => set({ cartCount: 0 }),
    }),
    {
      name: 'belanjaku-cart-storage',
    }
  )
);
