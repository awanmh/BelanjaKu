"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useUserStore } from "@/store/user.store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", formData);

      if (res.data.success) {
        const { user, tokens } = res.data.data;

        // Simpan ke zustand + localStorage
        login(user, tokens.accessToken);
        localStorage.setItem("accessToken", tokens.accessToken);

        // --- LOGIKA REDIRECT PINTAR ---
        if (user.role === "admin") {
          router.push("/admin");
        } else if (user.role === "seller") {
          router.push("/seller/dashboard");
        } else if (user.role === "user") {
          router.push("/");
        } else {
          // fallback cek domain email jika role tidak ada
          if (user.email.includes("@admin.belanjaku.com")) {
            router.push("/admin");
          } else if (user.email.includes("@seller.belanjaku.com")) {
            router.push("/seller/dashboard");
          } else {
            router.push("/");
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const validationErrors = err.response.data.errors
          .map((e: any) => {
            if (typeof e === "object" && !e.msg) {
              return Object.values(e).join(", ");
            }
            return e.msg;
          })
          .filter(Boolean)
          .join(", ");
        setError(validationErrors);
      } else {
        setError(
          err.response?.data?.message ||
            "Gagal masuk. Periksa email dan password Anda."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
  };

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex gap-8 mb-8 text-lg font-medium z-10 relative">
        <span className="text-white font-bold border-b-2 border-white pb-1 cursor-default tracking-wide">
          Masuk
        </span>
        <Link
          href="/auth/register"
          className="text-white/60 hover:text-white transition-colors pb-1 tracking-wide"
        >
          Daftar
        </Link>
      </div>

      {/* Card Container */}
      <div className="w-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-xs font-medium text-center animate-pulse">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              Email
            </label>
            <Input
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleChangeEmail}
              required
              className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:ring-black h-11 transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                Password
              </label>
              <a
                href="#"
                className="text-[11px] text-gray-400 hover:text-black transition-colors"
              >
                Lupa Password?
              </a>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleChangePassword}
                required
                className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:ring-black h-11 pr-10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white h-12 font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : (
                "Masuk Sekarang"
              )}
            </Button>
          </div>
        </form>

        {/* Social Login */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-semibold">
              <span className="bg-white px-3 text-gray-400">
                Atau masuk dengan
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group">
              {/* Google Icon */}
              <svg className="w-5 h-5 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92..." />
              </svg>
            </button>
            <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group">
              {/* Facebook Icon */}
              <svg className="w-5 h-5 text-[#1877F2] fill-current opacity-70 group-hover:opacity-100" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s..." />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}