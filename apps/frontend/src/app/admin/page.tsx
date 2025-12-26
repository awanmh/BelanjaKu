'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/types/auth';
import { Product } from '@/types/product';
import { Order } from '@/types/order';
import { formatRupiah } from '@/lib/utils';
import { getStatusColor, formatDate } from '@/lib/dashboard';
import StatCard from '@/components/dashboard/StatCard';
import {
    Users,
    Package,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

interface DashboardStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all data in parallel
                const [usersRes, productsRes, ordersRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/products'),
                    api.get('/orders')
                ]);

                // Process users data
                const users = usersRes.data.data?.rows || usersRes.data.data || [];
                const totalUsers = Array.isArray(users) ? users.length : 0;

                // Get recent users (last 5)
                const sortedUsers = Array.isArray(users)
                    ? [...users].sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    ).slice(0, 5)
                    : [];
                setRecentUsers(sortedUsers);

                // Process products data
                const products = productsRes.data.data?.rows || productsRes.data.data || [];
                const totalProducts = Array.isArray(products) ? products.length : 0;

                // Process orders data
                const orders = ordersRes.data.data || [];
                const totalOrders = Array.isArray(orders) ? orders.length : 0;

                // Calculate total revenue
                const totalRevenue = Array.isArray(orders)
                    ? orders.reduce((sum: number, order: Order) => sum + (order.totalAmount || 0), 0)
                    : 0;

                // Get recent orders (last 10)
                const sortedOrders = Array.isArray(orders)
                    ? [...orders].sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    ).slice(0, 10)
                    : [];
                setRecentOrders(sortedOrders);

                setStats({
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    totalRevenue
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-gray-600 mt-1">Overview sistem BelanjaKu</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-100"
                    loading={loading}
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    iconColor="text-purple-600"
                    iconBgColor="bg-purple-100"
                    loading={loading}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                    loading={loading}
                />
                <StatCard
                    title="Total Revenue"
                    value={stats.totalRevenue}
                    icon={DollarSign}
                    iconColor="text-yellow-600"
                    iconBgColor="bg-yellow-100"
                    format="currency"
                    loading={loading}
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                            <ShoppingBag className="text-gray-400" size={20} />
                        </div>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="animate-pulse flex gap-3">
                                        <div className="h-16 bg-gray-200 rounded flex-1"></div>
                                    </div>
                                ))}
                            </div>
                        ) : recentOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <AlertCircle className="mx-auto text-gray-400 mb-2" size={48} />
                                <p className="text-gray-500">Belum ada pesanan</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-mono text-gray-600">
                                                #{order.id.slice(0, 8)}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="font-bold text-gray-900">
                                            {formatRupiah(order.totalAmount)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
                            <Users className="text-gray-400" size={20} />
                        </div>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="animate-pulse flex gap-3">
                                        <div className="h-16 bg-gray-200 rounded flex-1"></div>
                                    </div>
                                ))}
                            </div>
                        ) : recentUsers.length === 0 ? (
                            <div className="text-center py-8">
                                <AlertCircle className="mx-auto text-gray-400 mb-2" size={48} />
                                <p className="text-gray-500">Belum ada user</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900">
                                                    {user.fullName}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium
                                                ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                    user.role === 'seller' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-blue-100 text-blue-800'}
                                            `}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Joined {formatDate(user.createdAt)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp size={32} />
                    <h2 className="text-2xl font-bold">System Performance</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-blue-100 text-sm">Average Order Value</p>
                        <p className="text-2xl font-bold mt-1">
                            {stats.totalOrders > 0
                                ? formatRupiah(stats.totalRevenue / stats.totalOrders)
                                : formatRupiah(0)
                            }
                        </p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm">Products per Seller</p>
                        <p className="text-2xl font-bold mt-1">
                            {stats.totalUsers > 0
                                ? (stats.totalProducts / stats.totalUsers).toFixed(1)
                                : '0'
                            }
                        </p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm">Active Status</p>
                        <p className="text-2xl font-bold mt-1">
                            {stats.totalOrders > 0 || stats.totalUsers > 0
                                ? '🟢 Operational'
                                : '🟡 Starting'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
