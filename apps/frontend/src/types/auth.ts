export type UserRole = 'user' | 'seller' | 'admin';

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    phoneNumber?: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterResponse {
    token: string;
    user: User;
}
