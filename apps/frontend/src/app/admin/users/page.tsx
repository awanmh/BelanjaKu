'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/types/auth';
import { formatDate } from '@/lib/dashboard';
import { Users, Search, Filter, Trash2, Edit2, X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'seller' | 'admin'>('all');

    // State untuk Edit Modal
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            const userData = response.data.data?.rows || response.data.data || [];
            setUsers(Array.isArray(userData) ? userData : []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- FITUR DELETE USER ---
    const handleDelete = async (userId: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.')) return;

        try {
            await api.delete(`/users/${userId}`);
            // Update state lokal biar ga perlu refresh page
            setUsers(users.filter(user => user.id !== userId));
            alert('User berhasil dihapus');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Gagal menghapus user');
        }
    };

    // --- FITUR EDIT USER ---
    const handleEditClick = (user: User) => {
        setEditingUser({ ...user }); // Copy object agar tidak merubah state langsung
        setIsEditOpen(true);
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setActionLoading(true);
        try {
            // Panggil API Update (Pastikan backend sudah ada route PUT /users/:id)
            const res = await api.put(`/users/${editingUser.id}`, {
                fullName: editingUser.fullName,
                role: editingUser.role,
                isVerified: editingUser.isVerified
            });

            // Update di list lokal
            setUsers(users.map(u => (u.id === editingUser.id ? { ...u, ...editingUser } : u)));
            
            setIsEditOpen(false);
            alert('Data user berhasil diperbarui!');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Gagal mengupdate user');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6 relative">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-1">Kelola semua user, edit role, dan hapus akun.</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                            type="text"
                            placeholder="Cari berdasarkan nama atau email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-gray-600" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as any)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="all">Semua Role</option>
                            <option value="user">User</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <Loader2 className="animate-spin h-8 w-8 mx-auto text-blue-600" />
                        <p className="mt-4 text-gray-600">Loading users...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-8 text-center">
                        <Users className="mx-auto text-gray-400 mb-2" size={48} />
                        <p className="text-gray-500">Tidak ada user ditemukan</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                    user.role === 'seller' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-blue-100 text-blue-800'}
                                            `}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                                            `}>
                                                {user.isVerified ? 'Verified' : 'Unverified'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEditClick(user)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- MODAL EDIT USER --- */}
            {isEditOpen && editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Edit User</h3>
                            <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read Only)</label>
                                <Input value={editingUser.email} disabled className="bg-gray-100 cursor-not-allowed" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <Input 
                                    value={editingUser.fullName} 
                                    onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select 
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value="user">User</option>
                                    <option value="seller">Seller</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                                <select 
                                    value={editingUser.isVerified ? "true" : "false"}
                                    onChange={(e) => setEditingUser({...editingUser, isVerified: e.target.value === "true"})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value="true">Verified</option>
                                    <option value="false">Unverified</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-800" disabled={actionLoading}>
                                    {actionLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}