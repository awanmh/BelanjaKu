'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { useUserStore } from '@/store/user.store';

export default function AdminSettingsPage() {
    const user = useUserStore((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                fullName: user.fullName || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await api.put('/users/profile', profileData);

            if (res.data.success) {
                setSuccess('Profile berhasil diperbarui');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal memperbarui profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        // Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Password baru dan konfirmasi password tidak cocok');
            setIsLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password baru minimal 6 karakter');
            setIsLoading(false);
            return;
        }

        try {
            const res = await api.put('/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            if (res.data.success) {
                setSuccess('Password berhasil diubah');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal mengubah password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Pengaturan Admin</h1>
                <p className="text-gray-600 mt-1">Kelola informasi akun administrator dan keamanan Anda</p>
            </div>

            {/* Profile Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Informasi Profile</h2>
                    <p className="text-sm text-gray-600 mt-1">Update informasi personal Anda</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Full Name */}
                    <div className="space-y-2">
                        <label htmlFor="fullName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={profileData.fullName}
                            onChange={handleProfileChange}
                            placeholder="Masukkan nama lengkap"
                            required
                            className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            placeholder="email@example.com"
                            required
                            className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black"
                        />
                    </div>

                    {/* Role Badge */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-blue-900">Role:</span>
                            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase">
                                {user?.role || 'Admin'}
                            </span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-black hover:bg-gray-800 text-white px-8"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Menyimpan...</span>
                                </div>
                            ) : (
                                'Simpan Perubahan'
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Password Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Ubah Password</h2>
                    <p className="text-sm text-gray-600 mt-1">Pastikan password Anda kuat dan aman</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Password Saat Ini <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="Masukkan password saat ini"
                                required
                                className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Password Baru <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Masukkan password baru"
                                required
                                minLength={6}
                                className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">Password minimal 6 karakter</p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Konfirmasi Password Baru <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="Ketik ulang password baru"
                                required
                                className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-black hover:bg-gray-800 text-white px-8"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Mengubah...</span>
                                </div>
                            ) : (
                                'Ubah Password'
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Security Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-yellow-900 mb-2">Tips Keamanan Akun</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Gunakan password yang kuat dengan kombinasi huruf, angka, dan simbol</li>
                    <li>• Jangan gunakan password yang sama dengan akun lain</li>
                    <li>• Ubah password secara berkala untuk keamanan yang lebih baik</li>
                    <li>• Jangan membagikan password Anda kepada siapapun</li>
                </ul>
            </div>
        </div>
    );
}
