'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20 pt-16 pb-10 border-t border-gray-800">
      <div className="container mx-auto px-6">

        {/* TOP DESCRIPTION */}
        <div className="max-w-4xl mb-14">
          <h3 className="text-xl font-semibold mb-3">Sebagai Pusat Fashion Online di Indonesia</h3>
          <p className="text-gray-300 leading-relaxed">
            Kami menciptakan kemungkinan-kemungkinan gaya tanpa batas dengan cara memperluas jangkauan produk lokal. Kami menjadikan Anda sebagai pusatnya. 
            Bersama,<span className="font-semibold text-white"> BelanjaKu</span>.
          </p>
        </div>

        {/* GRID 4 KOLOM */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">

          {/* LAYANAN */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest">Layanan</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="#" className="hover:text-white">Bantuan</Link></li>
              <li><Link href="#" className="hover:text-white">Cara Pengembalian</Link></li>
              <li><Link href="#" className="hover:text-white">Product Index</Link></li>
              <li><Link href="#" className="hover:text-white">Promo Partner Kami</Link></li>
              <li><Link href="#" className="hover:text-white">Konfirmasi Transfer</Link></li>
              <li><Link href="#" className="hover:text-white">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* INFORMASI */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest">Tentang Kami</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Promosikan Brand Anda</Link></li>
              <li><Link href="#" className="hover:text-white">Pers / Media</Link></li>
              <li><Link href="#" className="hover:text-white">Karir</Link></li>
              <li><Link href="#" className="hover:text-white">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="hover:text-white">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* CUSTOMER SERVICE */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest">Layanan Pengaduan Konsumen</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>BelanjaKu Indonesia</li>
              <li>Email: <span className="text-white">customer@id.belanjaku.com</span></li>
              <li>Telepon: <span className="text-white">021-29490100</span></li>
              <li className="mt-4 font-semibold">Kementerian Perdagangan RI</li>
              <li>WhatsApp: <span className="text-white">+62 853 1111 1010</span></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest">
              Anda baru di BelanjaKu?
            </h4>
            <p className="text-gray-300 text-sm mb-4">
              Dapatkan berita mode terbaru dan peluncuran produk dengan subscribe newsletter kami.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="email"
                placeholder="Alamat email kamu"
                className="w-full px-3 py-2 bg-white text-black text-sm outline-none"
              />
              <button className="bg-white text-black px-4 py-2 font-bold text-xs tracking-widest hover:bg-gray-200">
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <button className="px-3 py-1 border border-white text-xs hover:bg-white hover:text-black transition">
                Wanita
              </button>
              <button className="px-3 py-1 border border-white text-xs hover:bg-white hover:text-black transition">
                Pria
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Dengan mendaftar, Anda menyetujui Kebijakan Privasi kami.
            </p>
          </div>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="mt-16 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2025 BELANJAKU – All Rights Reserved.</p>

          <div className="flex items-center gap-5 mt-4 md:mt-0">
            <Link href="#"><Image src="/icons/facebook.svg" alt="fb" width={22} height={22} /></Link>
            <Link href="#"><Image src="/icons/instagram.svg" alt="ig" width={22} height={22} /></Link>
            <Link href="#"><Image src="/icons/youtube.svg" alt="yt" width={22} height={22} /></Link>
            <Link href="#"><Image src="/icons/twitter.svg" alt="tw" width={22} height={22} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
