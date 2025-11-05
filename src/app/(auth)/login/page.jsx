"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { getBaseUrl } from "@/lib/getBaseUrl";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Login failed");
      router.push("/dashboard");
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow-xl p-8 space-y-6" style={{ backgroundColor: '#010101' }}>
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#EDB508' }}>
              <Lock className="w-8 h-8" style={{ color: '#010101' }} />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: '#FAFAF7' }}>Welcome back</h1>
            <p style={{ color: '#999' }}>Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="border rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: '#2a1a1a', borderColor: '#dc2626' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
              <p className="text-sm" style={{ color: '#fca5a5' }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: '#FAFAF7' }}>
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#666' }} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all"
                  style={{ 
                    backgroundColor: '#1a1a1a', 
                    borderColor: '#333',
                    color: '#FAFAF7'
                  }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#EDB508'}
                  onBlur={(e) => e.target.style.borderColor = '#333'}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: '#FAFAF7' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#666' }} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all"
                  style={{ 
                    backgroundColor: '#1a1a1a', 
                    borderColor: '#333',
                    color: '#FAFAF7'
                  }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#EDB508'}
                  onBlur={(e) => e.target.style.borderColor = '#333'}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ 
                backgroundColor: '#EDB508',
                color: '#010101'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#d9a307'}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#EDB508')}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center pt-4 border-t" style={{ borderColor: '#333' }}>
            <p style={{ color: '#999' }}>
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold transition-colors" style={{ color: '#EDB508' }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}