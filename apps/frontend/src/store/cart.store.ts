import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  imageUrl: string;
  sellerName: string;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === newItem.id);

        if (existingItem) {
          // Jika produk sudah ada, tambah quantity (tapi jangan melebihi stok)
          const updatedQuantity = Math.min(
            existingItem.quantity + newItem.quantity,
            existingItem.maxStock
          );
          
          set({
            items: items.map((i) =>
              i.id === newItem.id ? { ...i, quantity: updatedQuantity } : i
            ),
          });
        } else {
          // Jika produk baru, masukkan ke array
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        const items = get().items;
        set({
          items: items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      
      totalPrice: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    }),
    {
      name: 'belanjaku-cart', // Simpan di LocalStorage dengan nama ini
      storage: createJSONStorage(() => localStorage),
    }
  )
);