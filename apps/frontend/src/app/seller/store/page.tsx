'use client';

import { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { useUserStore } from '@/store/user.store';

export default function SellerStorePage() {
    const user = useUserStore((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        storeName: '',
        storeAddress: '',
        storePhoneNumber: '',
    });

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string>('');
    const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
    const [backgroundImagePreview, setBackgroundImagePreview] = useState<string>('');

    useEffect(() => {
        fetchStoreData();
    }, []);

    const fetchStoreData = async () => {
        try {
            setIsFetching(true);
            // Fetch seller profile/store data
            const res = await api.get('/sellers/profile');
            if (res.data.success && res.data.data) {
                const seller = res.data.data;
                setFormData({
                    storeName: seller.storeName || '',
                    storeAddress: seller.storeAddress || '',
                    storePhoneNumber: seller.storePhoneNumber || '',
                });

                // Set existing images if available
                if (seller.profileImageUrl) {
                    setProfileImagePreview(seller.profileImageUrl);
                }
                if (seller.backgroundImageUrl) {
                    setBackgroundImagePreview(seller.backgroundImageUrl);
                }
            }
        } catch (err: any) {
            console.error('Failed to fetch store data:', err);
            // If no seller profile exists yet, keep form empty
        } finally {
            setIsFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBackgroundImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('storeName', formData.storeName);
            formDataToSend.append('storeAddress', formData.storeAddress);
            formDataToSend.append('storePhoneNumber', formData.storePhoneNumber);

            if (profileImage) {
                formDataToSend.append('profileImage', profileImage);
            }

            if (backgroundImage) {
                formDataToSend.append('backgroundImage', backgroundImage);
            }

            const res = await api.put('/sellers/profile', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                setSuccess('Informasi toko berhasil diperbarui');
                setTimeout(() => setSuccess(''), 3000);
                // Refresh data to get new image URLs from server
                fetchStoreData();
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal memperbarui informasi toko');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Pengaturan Toko</h1>
                <p className="text-gray-600 mt-1">Kelola informasi toko Anda</p>
            </div>

            {/* Store Info Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Informasi Toko</h2>
                    <p className="text-sm text-gray-600 mt-1">Update detail toko yang akan ditampilkan kepada pembeli</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

                    {/* Profile & Background Images */}
                    <div className="space-y-6">
                        {/* Background Image */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Background Toko</label>
                            <div className="relative">
                                {/* Background Preview */}
                                <div className="w-full h-48 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                                    {backgroundImagePreview ? (
                                        <img
                                            src={backgroundImagePreview}
                                            alt="Store Background"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">Klik untuk upload background</p>
                                                <p className="text-xs text-gray-400 mt-1">Rekomendasi: 1200x400px (Max 5MB)</p>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="backgroundImage"
                                        accept="image/*"
                                        onChange={handleBackgroundImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Profile Image */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Logo/Profile Toko</label>
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            id="profileImage"
                                            accept="image/*"
                                            onChange={handleProfileImageChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="profileImage" className="cursor-pointer">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">Klik untuk upload logo toko</p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG (Rekomendasi: 300x300px, Max 5MB)</p>
                                        </label>
                                    </div>
                                </div>
                                {profileImagePreview && (
                                    <div className="w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                                        <img
                                            src={profileImagePreview}
                                            alt="Store Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Store Name */}
                    <div className="space-y-2">
                        <label htmlFor="storeName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Store className="w-4 h-4" />
                            Nama Toko <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="storeName"
                            name="storeName"
                            type="text"
                            value={formData.storeName}
                            onChange={handleChange}
                            placeholder="Contoh: Toko Sepatu Premium"
                            required
                            className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black"
                        />
                        <p className="text-xs text-gray-500">Nama toko akan ditampilkan di semua produk Anda</p>
                    </div>

                    {/* Store Address */}
                    <div className="space-y-2">
                        <label htmlFor="storeAddress" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Alamat Toko <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="storeAddress"
                            name="storeAddress"
                            value={formData.storeAddress}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Masukkan alamat lengkap toko Anda"
                            required
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Store Phone */}
                    <div className="space-y-2">
                        <label htmlFor="storePhoneNumber" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Nomor Telepon <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="storePhoneNumber"
                            name="storePhoneNumber"
                            type="tel"
                            value={formData.storePhoneNumber}
                            onChange={handleChange}
                            placeholder="08123456789"
                            required
                            className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black"
                        />
                        <p className="text-xs text-gray-500">Nomor yang dapat dihubungi oleh pembeli</p>
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

            {/* Additional Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Tips Mengisi Informasi Toko</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Gunakan nama toko yang mudah diingat dan mencerminkan brand Anda</li>
                    <li>• Alamat toko harus lengkap untuk memudahkan pengiriman</li>
                    <li>• Pastikan nomor telepon aktif dan dapat dihubungi</li>
                    <li>• Informasi yang akurat akan meningkatkan kepercayaan pembeli</li>
                </ul>
            </div>
        </div>
    );
}
