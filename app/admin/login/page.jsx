"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/admin/login", { email, password });
      
      if (response.data.success) {
        toast.success("Login successful");
        router.push("/admin");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "AUTHENTICATION_ERROR: INVALID_CREDENTIALS"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full min-h-screen">
      {/* Background Layer with "Kinetic Monolith" treatment */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10 opacity-80" />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6aQF1NF8_nJivj0lz-nQUmXn0iB8W4iB2Rv2S_957RtUlC-eQN32EXn0SarN_OKCRyiXQfnMJSoUmb8qmhoLjfXZ4uvkPWyY0sjaI6_6khmAeeDlsGlTmTK1Fr1RX_L66XEh7zrKJ_ykygPgaveH_eY9oKPFVn9gTFPljLrBCilGSuiqhNMBHI9cW8apYDBq7dVQgD19emyrBbrsAMxGN77763JmsSZNn7lPfGqchCBRIwF-jhhGMLvFo5gisSBWG0NNnksQK6EU"
          alt="Sleek black supercar in a high-end garage"
          fill
          className="object-cover grayscale-[0.4] brightness-[0.3]"
          unoptimized
        />
      </div>

      {/* Main Content Shell */}
      <main className="relative z-20 flex flex-col items-center justify-center p-6 sm:p-8 w-full">
        {/* Branding Identity */}
        <div className="mb-12 text-center">
          <h1 className="font-headline font-black text-4xl sm:text-5xl tracking-[0.2em] text-on-surface uppercase mb-2">
            BLACK BULLET
          </h1>
          <div className="flex items-center justify-center gap-4">
            <span className="h-[1px] w-8 bg-primary" />
            <p className="font-label text-xs sm:text-sm tracking-[0.15em] text-on-surface-variant uppercase">
              Performance Control Panel
            </p>
            <span className="h-[1px] w-8 bg-primary" />
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md bg-surface/70 backdrop-blur-xl border border-outline-variant/10 p-8 sm:p-12 relative overflow-hidden shadow-[0_0_40px_rgba(255,143,115,0.08)]">
          {/* Subtle accent glow */}
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
          <form onSubmit={handleLogin} className="space-y-8">
            {/* Email Field */}
            <div className="space-y-3">
              <label
                className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block"
                htmlFor="email"
              >
                Identity / Email
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="text"
                  placeholder="ADMIN@BLACKBULLET.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-surface-container-highest border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 text-on-surface p-4 transition-all duration-300 placeholder:text-outline/50 disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label
                  className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant"
                  htmlFor="password"
                >
                  Access Code / Password
                </label>
              </div>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-surface-container-highest border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 text-on-surface p-4 pr-12 transition-all duration-300 placeholder:text-outline/50 disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  disabled={loading}
                  className="w-4 h-4 bg-surface-container-highest border-outline-variant rounded-none text-primary focus:ring-0 focus:ring-offset-0 transition-all disabled:opacity-50"
                />
                <span className="ml-3 font-label text-[10px] uppercase tracking-widest text-on-surface-variant group-hover:text-on-surface transition-colors">
                  Remember Node
                </span>
              </label>
              <Link
                href="#"
                className="font-label text-[10px] uppercase tracking-widest text-primary/80 hover:text-primary transition-colors"
              >
                Reset Access
              </Link>
            </div>

            {/* Primary Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-primary to-primary-dim py-5 font-headline font-bold text-on-primary-fixed uppercase tracking-widest text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {!loading && (
                <span className="material-symbols-outlined text-lg">
                  terminal
                </span>
              )}
              <span>{loading ? "Authenticating..." : "Initialize Dashboard"}</span>
              {loading && (
                <div className="w-4 h-4 border-2 border-on-primary-fixed border-t-transparent rounded-full animate-spin" />
              )}
            </button>

            {/* Status Message */}
            {error && (
              <div className="bg-error-container/20 p-4 border-l-2 border-error animate-pulse">
                <p className="text-error text-xs font-label tracking-wide">
                  {error}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Secondary Footer Link */}
        <Link href="/" className="mt-10 group flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary transition-colors">
            arrow_back
          </span>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-on-surface transition-all">
            Terminate & Return to Main Site
          </span>
        </Link>
      </main>

      {/* Footer Content */}
      <footer className="absolute bottom-0 w-full py-6 flex flex-col md:flex-row justify-between items-center px-8 border-t border-outline-variant/15 z-30 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span className="text-white font-headline font-bold text-xs tracking-widest uppercase">
            BLACK BULLET GARAGE
          </span>
        </div>
        <p className="font-headline text-[10px] uppercase tracking-widest text-on-surface-variant">
          © 2024 BLACK BULLET GARAGE PERFORMANCE. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link
            href="#"
            className="font-headline text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            Support
          </Link>
          <Link
            href="#"
            className="font-headline text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
