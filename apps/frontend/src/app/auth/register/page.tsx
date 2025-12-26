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
        // Cek domain untuk pesan sukses yang lebih personal (Kosmetik UI)
        let roleMsg = "User";
        if (formData.email.includes("@admin.belanjaku.com")) roleMsg = "Admin";
        if (formData.email.includes("@seller.belanjaku.com")) roleMsg = "Seller";

        alert(`Registrasi ${roleMsg} berhasil! Silakan login untuk masuk ke dashboard.`);
        
        // Arahkan ke Login Page
        router.push("/auth/login");
      }
    } catch (err: any) {
      console.error("Register Error:", err);
      // Logic Error Handling (Sama seperti sebelumnya)
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
        {/* Social Login Section (Biarkan sama) */}
      </div>
    </>
  );
}