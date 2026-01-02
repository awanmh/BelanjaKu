export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string; // 'men', 'women', 'kids'
  type: string; // 'sport', 'casual', 'formal'
  imageUrl: string;
  images: string[];
  sku: string;
  weight?: number;
  createdAt: string;
  updatedAt: string;
  SearchVector?: any;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "user" | "seller" | "admin";
  isVerified: boolean;
}

export interface Order {
  id: string;
  userId: string;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  totalAmount: number;
  items: CartItem[];
  shippingAddress: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
