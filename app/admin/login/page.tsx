"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, var(--color-ink) 0%, #2e1f10 100%)" }}
    >
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
              style={{ background: "linear-gradient(135deg, var(--color-amber), var(--color-amber-light))" }}
            >
              V
            </div>
            <span className="font-playfair font-semibold text-2xl text-white">LuxVilla</span>
          </Link>
          <h1 className="font-playfair text-2xl font-semibold text-white">Admin Login</h1>
          <p className="text-white/50 text-sm mt-1">Sign in to access the admin panel</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
                Email Address
              </label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@villa.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-1.5">
                Password
              </label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--color-danger)] p-3 rounded-lg badge-rejected">
                ⚠ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3.5 text-base mt-2"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

        </div>

        <p className="text-center mt-5 text-white/40 text-xs">
          <Link href="/" className="hover:text-white/70 transition-colors">← Back to LuxVilla</Link>
        </p>
      </div>
    </div>
  );
}
