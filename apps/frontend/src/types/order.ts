export type OrderStatus = 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'completed';

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    product?: {
        name: string;
        imageUrl: string;
    };
}

export interface Order {
    id: string;
    userId: string;
    totalAmount: number;
    shippingAddress: string;
    status: OrderStatus;
    promotionId?: string | null;
    discountAmount?: number;
    createdAt: string;
    updatedAt: string;
    items?: OrderItem[];
}

export interface CartItem {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    product?: {
        name: string;
        price: number;
        imageUrl: string;
        stock: number;
    };
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}
