"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    retypePassword: "",
    fullName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- 1. Validasi Input ---
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Semua field harus diisi.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    // Regex: Huruf Besar, Huruf Kecil, Angka
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password harus mengandung minimal 1 Huruf Besar, 1 Huruf Kecil, dan 1 Angka.");
      return;
    }

    if (formData.password !== formData.retypePassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setIsLoading(true);

    try {
      // Kirim ke Backend
      const res = await api.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      if (res.data.success) {
<<<<<<< HEAD
        // Cek domain untuk pesan sukses yang lebih personal
=======
        // Cek domain untuk pesan sukses yang lebih personal (Kosmetik UI)
>>>>>>> 49b30cf
        let roleMsg = "User";
        if (formData.email.includes("@admin.belanjaku.com")) roleMsg = "Admin";
        if (formData.email.includes("@seller.belanjaku.com")) roleMsg = "Seller";

        alert(`Registrasi ${roleMsg} berhasil! Silakan login untuk masuk ke dashboard.`);
        
        // Arahkan ke Login Page
        router.push("/auth/login");
      }
    } catch (err: any) {
      console.error("Register Error:", err);
<<<<<<< HEAD
      // Logic Error Handling
=======
      // Logic Error Handling (Sama seperti sebelumnya)
>>>>>>> 49b30cf
      if (err.response) {
        const { status, data } = err.response;
        if (status === 409) {
          setError("Email sudah terdaftar. Silakan login.");
        } else if (status === 422 || status === 400) {
           if (data.errors && Array.isArray(data.errors)) {
            const msgs = data.errors.map((e: any) => (typeof e === 'object' ? Object.values(e)[0] : e)).join(", ");
            setError(msgs);
           } else {
             setError(data.message || "Data tidak valid.");
           }
        } else {
          setError(data.message || "Terjadi kesalahan server.");
        }
      } else if (err.request) {
        setError("Gagal terhubung ke server.");
      } else {
        setError("Terjadi kesalahan aplikasi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-8 mb-8 text-lg font-medium z-10 relative">
        <Link href="/auth/login" className="text-white/60 hover:text-white transition-colors pb-1 tracking-wide">
          Masuk
        </Link>
        <span className="text-white font-bold border-b-2 border-white pb-1 cursor-default tracking-wide">
          Daftar
        </span>
      </div>

      <div className="w-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-xs font-medium text-center animate-pulse">
              {error}
            </div>
          )}

          {/* Form Inputs (Sama persis seperti sebelumnya) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
            <Input 
              type="email" 
              placeholder="nama@email.com / nama@admin.belanjaku.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:ring-black h-11"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 karakter (Huruf Besar, Kecil, Angka)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:ring-black h-11 pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Ulangi Password</label>
            <div className="relative">
              <Input
                type={showRetypePassword ? "text" : "password"}
                placeholder="Ulangi Password"
                value={formData.retypePassword}
                onChange={(e) => setFormData({ ...formData, retypePassword: e.target.value })}
                required
                className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:ring-black h-11 pr-10"
              />
              <button type="button" onClick={() => setShowRetypePassword(!showRetypePassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showRetypePassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

<<<<<<< HEAD
          {/* Full Name Input */}
=======
>>>>>>> 49b30cf
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Nama Lengkap</label>
            <Input
              type="text"
              placeholder="Nama Lengkap"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:ring-black h-11"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white h-12 font-bold uppercase tracking-widest text-xs shadow-lg" disabled={isLoading}>
              {isLoading ? <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /><span>Memproses...</span></div> : "Daftar Sekarang"}
            </Button>
          </div>
        </form>
<<<<<<< HEAD

        {/* Social Login Divider (DIPERBAIKI: SVG FIXED) */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-semibold">
              <span className="bg-white px-3 text-gray-400">
                Atau daftar dengan
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            {/* Google Button */}
            <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group">
              <svg
                className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>

            {/* Facebook Button */}
            <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group">
            <svg
                className="w-5 h-5 text-[#1877F2] fill-current opacity-70 group-hover:opacity-100 transition-opacity"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>
        </div>
=======
        {/* Social Login Section (Biarkan sama) */}
>>>>>>> 49b30cf
      </div>
    </>
  );
}