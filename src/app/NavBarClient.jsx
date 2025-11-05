"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, LayoutDashboard, Shield, Menu, X } from "lucide-react";
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

  return (
    <nav className="border-b border-[#333] bg-[#010101] px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/WiyoRent_logo.svg" alt="WiyoRent Logo" width={80} height={40} priority />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-gray-400 hover:bg-[#1a1a1a] hover:text-[#FAFAF7]"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-gray-400 hover:bg-[#1a1a1a] hover:text-[#FAFAF7]"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          
          {user?.role === 'admin' && (
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-gray-400 hover:bg-[#1a1a1a] hover:text-[#EDB508]"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-[#1a1a1a] hover:text-[#FAFAF7] transition-all"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#333] space-y-1">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-gray-400 hover:bg-[#1a1a1a] hover:text-[#FAFAF7]"
            onClick={() => setIsOpen(false)}
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-gray-400 hover:bg-[#1a1a1a] hover:text-[#FAFAF7]"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          
          {user?.role === 'admin' && (
            <Link 
              href="/admin" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-gray-400 hover:bg-[#1a1a1a] hover:text-[#EDB508]"
              onClick={() => setIsOpen(false)}
            >
              <Shield className="w-5 h-5" />
              Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}