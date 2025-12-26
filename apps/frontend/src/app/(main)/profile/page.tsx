'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { User as UserIcon, Package, MapPin, LogOut } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import api from '@/lib/api';
import { useUserStore } from '@/store/user.store';
import { Order } from '@/types/order';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('orders');

  const orders = [
    {
      id: '#BLK-2025-882910',
      date: '03 Des 2025',
      status: 'Proses',
      total: 976350,
      items: [
        { name: 'Compass Velocity Black', image: 'https://images.unsplash.com/photo-1560769629-975e13f0c470?q=80&w=200' },
        { name: 'Ventela Ethnic Low Black', image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=200' }
      ]
    },
    {
      id: '#BLK-2024-110293',
      date: '15 Nov 2024',
      status: 'Selesai',
      total: 450000,
      items: [
        { name: 'Geoff Max Go Walk', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=200' }
      ]
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-serif font-bold mb-8">Akun Saya</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=John+Doe&background=000&color=fff" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg">John Doe</h3>
                <p className="text-xs text-gray-500">john.doe@example.com</p>
              </div>

              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <Package className="w-4 h-4" />
                  Pesanan Saya
                </button>
                <button
                  onClick={() => setActiveTab('address')}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'address' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <MapPin className="w-4 h-4" />
                  Alamat Tersimpan
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <UserIcon className="w-4 h-4" />
                  Edit Profil
                </button>
                <button className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wide mb-4">Riwayat Pesanan</h2>

                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 pb-4 border-b border-gray-100 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-sm">{order.id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total Pesanan</p>
                        <p className="font-bold">{formatRupiah(order.total)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button variant="outline" className="text-xs uppercase tracking-widest font-bold border-black text-black hover:bg-black hover:text-white">
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'address' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold uppercase tracking-wide">Alamat Saya</h2>
                  <Button className="bg-black text-white text-xs uppercase tracking-widest font-bold">Tambah Alamat</Button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 relative hover:border-black transition-colors">
                  <div className="absolute top-4 right-4 bg-gray-100 text-xs font-bold px-2 py-1 rounded">Utama</div>
                  <h3 className="font-bold mb-1">Rumah</h3>
                  <p className="font-bold text-sm mb-2">John Doe</p>
                  <p className="text-sm text-gray-600 mb-1">08123456789</p>
                  <p className="text-sm text-gray-600 max-w-md">Jl. Jendral Sudirman No. 1, Senayan, Kebayoran Baru, Jakarta Selatan, DKI Jakarta, 12190</p>

                  <div className="mt-4 flex gap-3">
                    <button className="text-xs font-bold text-black underline">Ubah</button>
                    <button className="text-xs font-bold text-red-600 underline">Hapus</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold uppercase tracking-wide mb-6">Edit Profil</h2>
                <form className="space-y-4 max-w-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-500">Nama Depan</label>
                      <input type="text" defaultValue="John" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-500">Nama Belakang</label>
                      <input type="text" defaultValue="Doe" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Email</label>
                    <input type="email" defaultValue="john.doe@example.com" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black outline-none bg-gray-50" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Nomor Telepon</label>
                    <input type="tel" defaultValue="08123456789" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black outline-none" />
                  </div>
                  <div className="pt-4">
                    <Button className="bg-black text-white h-10 px-6 uppercase tracking-widest font-bold text-xs">Simpan Perubahan</Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
