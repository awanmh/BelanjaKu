'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { Order } from '@/types/order';
import { formatRupiah } from '@/lib/utils';
import { getStatusColor, formatDate } from '@/lib/dashboard';
import StatCard from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import {
    Package,
    ShoppingBag,
    Plus,
    DollarSign,
    TrendingUp,
    AlertCircle,
    Edit,
    Trash2,
    Eye
} from 'lucide-react';

interface SellerStats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
}

export default function SellerDashboardPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<SellerStats>({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    api.get('/products/my-products'),
                    api.get('/orders/seller/my-orders')
                ]);

                let productList: Product[] = [];
                if (productsRes.data.success) {
                    const pData = productsRes.data.data;
                    productList = Array.isArray(pData) ? pData : pData.rows || [];
                    setProducts(productList);
                }

                let orderList: Order[] = [];
                if (ordersRes.data.success) {
                    orderList = ordersRes.data.data || [];
                    setOrders(orderList);
                }

                // Calculate stats
                const totalRevenue = orderList.reduce((sum, order) => sum + order.totalAmount, 0);
                const pendingOrders = orderList.filter(order =>
                    order.status === 'pending' || order.status === 'processing'
                ).length;

                setStats({
                    totalProducts: productList.length,
                    totalOrders: orderList.length,
                    totalRevenue,
                    pendingOrders
                });
            } catch (error) {
                console.error('Failed to fetch seller data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddProduct = () => {
        router.push('/seller/products/new');
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
                    <p className="text-gray-600 mt-1">Kelola toko dan produk Anda</p>
                </div>
                <Button
                    onClick={handleAddProduct}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                    <Plus size={18} />
                    Tambah Produk
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Produk"
                    value={stats.totalProducts}
                    icon={Package}
                    iconColor="text-purple-600"
                    iconBgColor="bg-purple-100"
                    loading={loading}
                />
                <StatCard
                    title="Total Pesanan"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-100"
                    loading={loading}
                />
                <StatCard
                    title="Total Pendapatan"
                    value={stats.totalRevenue}
                    icon={DollarSign}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                    format="currency"
                    loading={loading}
                />
                <StatCard
                    title="Pesanan Pending"
                    value={stats.pendingOrders}
                    icon={AlertCircle}
                    iconColor="text-yellow-600"
                    iconBgColor="bg-yellow-100"
                    loading={loading}
                />
            </div>

            {/* Performance Summary */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp size={32} />
                    <h2 className="text-2xl font-bold">Performa Toko</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-purple-100 text-sm">Rata-rata Nilai Pesanan</p>
                        <p className="text-2xl font-bold mt-1">
                            {stats.totalOrders > 0
                                ? formatRupiah(stats.totalRevenue / stats.totalOrders)
                                : formatRupiah(0)
                            }
                        </p>
                    </div>
                    <div>
                        <p className="text-purple-100 text-sm">Completion Rate</p>
                        <p className="text-2xl font-bold mt-1">
                            {stats.totalOrders > 0
                                ? `${((orders.filter(o => o.status === 'completed' || o.status === 'delivered').length / stats.totalOrders) * 100).toFixed(1)}%`
                                : '0%'
                            }
                        </p>
                    </div>
                    <div>
                        <p className="text-purple-100 text-sm">Status Toko</p>
                        <p className="text-2xl font-bold mt-1">
                            {stats.totalProducts > 0 ? '🟢 Aktif' : '🟡 Perlu Produk'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Products Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                Produk Saya ({products.length})
                            </h2>
                            <Package className="text-gray-400" size={20} />
                        </div>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="animate-pulse flex gap-3">
                                        <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="mx-auto text-gray-400 mb-2" size={48} />
                                <p className="text-gray-500 mb-4">Belum ada produk</p>
                                <Button
                                    onClick={handleAddProduct}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Tambah Produk Pertama
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {products.slice(0, 5).map(product => (
                                    <div
                                        key={product.id}
                                        className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 truncate">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {formatRupiah(product.price)}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Stok: {product.stock}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {products.length > 5 && (
                                    <Button
                                        onClick={() => router.push('/seller/products')}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    >
                                        Lihat Semua Produk ({products.length})
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                Pesanan Masuk ({orders.length})
                            </h2>
                            <ShoppingBag className="text-gray-400" size={20} />
                        </div>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-20 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-8">
                                <ShoppingBag className="mx-auto text-gray-400 mb-2" size={48} />
                                <p className="text-gray-500">Belum ada pesanan masuk</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {orders.slice(0, 5).map(order => (
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
                                {orders.length > 5 && (
                                    <Button
                                        onClick={() => router.push('/seller/orders')}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    >
                                        Lihat Semua Pesanan ({orders.length})
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
