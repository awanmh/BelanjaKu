'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import api from '@/lib/api';

interface SizeVariant {
    size: string;
    stock: number;
}

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        sku: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([]);
    const [newSize, setNewSize] = useState('35');
    const [newStock, setNewStock] = useState('0');

    const availableSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddSize = () => {
        // Check if size already exists
        if (sizeVariants.some(v => v.size === newSize)) {
            setError('Ukuran ini sudah ditambahkan');
            return;
        }

        const stockNum = parseInt(newStock);
        if (isNaN(stockNum) || stockNum < 0) {
            setError('Stok harus berupa angka positif');
            return;
        }

        setSizeVariants([...sizeVariants, { size: newSize, stock: stockNum }]);
        setNewStock('0');
        setError('');
    };

    const handleRemoveSize = (sizeToRemove: string) => {
        setSizeVariants(sizeVariants.filter(v => v.size !== sizeToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validation
        if (sizeVariants.length === 0) {
            setError('Tambahkan minimal satu ukuran dengan stok');
            setIsLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('sku', formData.sku);

            // Calculate total stock from all variants
            const totalStock = sizeVariants.reduce((sum, v) => sum + v.stock, 0);
            formDataToSend.append('stock', totalStock.toString());

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            // Build variants array
            const variants = sizeVariants.map(variant => ({
                sku: `${formData.sku}-${variant.size}`,
                price: parseFloat(formData.price),
                stock: variant.stock,
                attributes: { size: variant.size },
            }));

            formDataToSend.append('variants', JSON.stringify(variants));

            const res = await api.post('/products', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                router.push('/seller/products');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal menambahkan produk');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/seller/products">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Kembali
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Tambah Produk Baru</h1>
                    <p className="text-gray-600 mt-1">Lengkapi form di bawah untuk menambahkan produk</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Product Image */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Gambar Produk</label>
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="image" className="cursor-pointer">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Klik untuk upload gambar</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (Max 5MB)</p>
                                    </label>
                                </div>
                            </div>
                            {imagePreview && (
                                <div className="w-32 h-32 border border-gray-200 rounded-lg overflow-hidden">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Name */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                            Nama Produk <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Contoh: Sepatu Nike Air Max"
                            required
                            className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black"
                        />
                    </div>

                    {/* SKU */}
                    <div className="space-y-2">
                        <label htmlFor="sku" className="text-sm font-semibold text-gray-700">
                            SKU <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="sku"
                            name="sku"
                            type="text"
                            value={formData.sku}
                            onChange={handleChange}
                            placeholder="Contoh: NIKE-AM-001"
                            required
                            className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black"
                        />
                        <p className="text-xs text-gray-500">SKU akan otomatis ditambahkan dengan ukuran (misal: NIKE-AM-001-35)</p>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-semibold text-gray-700">
                            Kategori <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                        >
                            <option value="">Pilih Kategori</option>
                            <option value="Wanita">Wanita</option>
                            <option value="Pria">Pria</option>
                            <option value="Sport">Sport</option>
                            <option value="Anak">Anak</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-semibold text-gray-700">
                            Deskripsi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Deskripsikan produk Anda..."
                            required
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <label htmlFor="price" className="text-sm font-semibold text-gray-700">
                            Harga (Rp) <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0"
                            required
                            min="0"
                            className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black"
                        />
                    </div>

                    {/* Size Variants Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Ukuran & Stok</h3>
                            <p className="text-sm text-gray-600 mt-1">Tambahkan ukuran sepatu dan stok untuk masing-masing ukuran</p>
                        </div>

                        {/* Add Size Form */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Ukuran</label>
                                    <select
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black outline-none"
                                    >
                                        {availableSizes.map(size => (
                                            <option key={size} value={size}>Size {size}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Stok</label>
                                    <Input
                                        type="number"
                                        value={newStock}
                                        onChange={(e) => setNewStock(e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        className="bg-white border-gray-300 focus:border-black"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleAddSize}
                                    className="bg-black hover:bg-gray-800 text-white gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Tambah
                                </Button>
                            </div>
                        </div>

                        {/* Size Variants Table */}
                        {sizeVariants.length > 0 && (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ukuran</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stok</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SKU</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {sizeVariants
                                            .sort((a, b) => parseInt(a.size) - parseInt(b.size))
                                            .map((variant) => (
                                                <tr key={variant.size} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Size {variant.size}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{variant.stock} unit</td>
                                                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">{formData.sku}-{variant.size}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveSize(variant.size)}
                                                            className="text-red-600 hover:text-red-800 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 border-t border-gray-200">
                                        <tr>
                                            <td className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
                                            <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                                {sizeVariants.reduce((sum, v) => sum + v.stock, 0)} unit
                                            </td>
                                            <td className="px-4 py-3"></td>
                                            <td className="px-4 py-3"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}

                        {sizeVariants.length === 0 && (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <p className="text-sm text-gray-500">Belum ada ukuran ditambahkan. Gunakan form di atas untuk menambahkan ukuran.</p>
                            </div>
                        )}
                    </div>

                    {/* Submit Buttons */}
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
                                'Simpan Produk'
                            )}
                        </Button>
                        <Link href="/seller/products">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
