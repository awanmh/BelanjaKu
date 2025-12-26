export interface Product {
    id: string;
    name: string;
    description: string;
    price: number; // Decimal string from DB might need handling, but number usually works for JSON
    stock: number;
    imageUrl: string;
    sellerId: string;
    categoryId: string;
    lowStockThreshold?: number;

    // Logistics
    weight?: number;
    length?: number;
    width?: number;
    height?: number;

    // Stats
    averageRating: number;
    soldCount: number;

    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;

    // Relations
    seller?: {
        id: string;
        storeName: string;
    };
    category?: {
        id: string;
        name: string;
    };
}

export interface CreateProductInput {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    // Image handled separately/FormData
}
