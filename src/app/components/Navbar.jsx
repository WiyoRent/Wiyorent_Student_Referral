import { Menu, X, Home, LayoutDashboard, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/auth/me`, { cache: 'no-store', credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json();
        setUser(json.user || null);
      } catch {}
    })();
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin", label: "Admin", icon: Shield },
  ];

  return (
    <nav className="bg-[#010101] border-b-2 border-[#EDB508]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/WiyoRent_logo.svg" alt="WiyoRent Logo" width={40} height={40} />
              <span className="text-[#FAFAF7] font-semibold text-lg hidden sm:block">WiyoRent</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Home */}
            <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#FAFAF7] hover:bg-[#EDB508] hover:text-[#010101] transition-all duration-200 font-medium group">
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </Link>
            {/* Dashboard */}
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#FAFAF7] hover:bg-[#EDB508] hover:text-[#010101] transition-all duration-200 font-medium group">
              <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Dashboard</span>
            </Link>
            {/* Admin - only admins */}
            {user?.role === 'admin' && (
              <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#FAFAF7] hover:bg-[#EDB508] hover:text-[#010101] transition-all duration-200 font-medium group">
                <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#FAFAF7] hover:bg-[#EDB508] hover:text-[#010101] transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[#010101] border-t border-[#EDB508]/20">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {/* Home */}
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#FAFAF7] hover:bg-[#EDB508] hover:text-[#010101] transition-all duration-200 font-medium group" onClick={() => setIsOpen(false)}>
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </Link>
            {/* Dashboard */}
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#FAFAF7] hover:bg-[#EDB508] hover:text-[#010101] transition-all duration-200 font-medium group" onClick={() => setIsOpen(false)}>
              <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Dashboard</span>
            </Link>
            {/* Admin - only admins */}
            {user?.role === 'admin' && (
              <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#FAFAF7] hover:bg-[#EDB508] hover:text-[#010101] transition-all duration-200 font-medium group" onClick={() => setIsOpen(false)}>
                <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}