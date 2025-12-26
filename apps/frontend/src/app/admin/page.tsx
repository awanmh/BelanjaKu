'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/types/auth';
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
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

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
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          api.get('/users'),
          api.get('/products'),
          api.get('/orders')
        ]);

        const users = usersRes.data.data?.rows || usersRes.data.data || [];
        const products = productsRes.data.data?.rows || productsRes.data.data || [];
        const orders = ordersRes.data.data || [];

        // Hitung Revenue (Total Amount dari semua order)
        const revenue = Array.isArray(orders)
          ? orders.reduce((sum: number, order: Order) => sum + (Number(order.totalAmount) || 0), 0)
          : 0;

        setStats({
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalProducts: Array.isArray(products) ? products.length : 0,
          totalOrders: Array.isArray(orders) ? orders.length : 0,
          totalRevenue: revenue
        });

        // Sort Recent Users
        if (Array.isArray(users)) {
          setRecentUsers([...users].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).slice(0, 5));
        }

        // Sort Recent Orders
        if (Array.isArray(orders)) {
          setRecentOrders([...orders].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).slice(0, 5));
        }

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-500 mt-1">Monitoring seluruh aktivitas platform BelanjaKu</p>
        </div>
        <div className="flex gap-3">
             {/* Tombol aksi cepat jika diperlukan */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} iconColor="text-blue-600" iconBgColor="bg-blue-100" loading={loading} />
        <StatCard title="Total Products" value={stats.totalProducts} icon={Package} iconColor="text-purple-600" iconBgColor="bg-purple-100" loading={loading} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} iconColor="text-green-600" iconBgColor="bg-green-100" loading={loading} />
        <StatCard title="Total Revenue" value={stats.totalRevenue} icon={DollarSign} iconColor="text-yellow-600" iconBgColor="bg-yellow-100" format="currency" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (Lebar 2 Kolom) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Pesanan Terbaru</h2>
            <Link href="/admin/orders">
                <Button variant="ghost" size="sm" className="text-blue-600">Lihat Semua</Button>
            </Link>
          </div>
          <div className="p-0">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Memuat data...</div>
            ) : recentOrders.length === 0 ? (
               <div className="p-12 text-center text-gray-400">Belum ada pesanan masuk.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-600">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{formatRupiah(order.totalAmount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Users (Lebar 1 Kolom) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">User Baru</h2>
          </div>
          <div className="p-4 space-y-4">
             {loading ? (
                 <div className="text-center py-4">Loading...</div>
             ) : recentUsers.map((user) => (
               <div key={user.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                 </div>
                 <div className="flex-1">
                   <p className="font-medium text-gray-900 text-sm">{user.fullName}</p>
                   <p className="text-xs text-gray-500">{user.email}</p>
                 </div>
                 <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold ${
                    user.role === 'admin' ? 'bg-red-100 text-red-700' :
                    user.role === 'seller' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                 }`}>
                   {user.role}
                 </span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}