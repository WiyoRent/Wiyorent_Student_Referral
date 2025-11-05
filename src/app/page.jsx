"use client"
import { useEffect, useState } from "react";
import { Home, LogIn, UserPlus, LayoutDashboard, Shield, Award, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import QuickRulesCard from "./components/QuickRulesCard";
import { getBaseUrl } from "@/lib/getBaseUrl";


export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/auth/me`, { cache: 'no-store', credentials: 'include' });
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      }
    })();
  }, []);
  const ctaHref = isLoggedIn ? "/dashboard" : "/login?next=%2Fdashboard&msg=Please%20login%20to%20submit%20a%20referral";
  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="w-full max-w-4xl">
        <div className="rounded-2xl shadow-xl p-12 space-y-8" style={{ backgroundColor: '#010101' }}>
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <Image src="/WiyoRent_logo.svg" alt="WiyoRent Logo" width={72} height={72} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#FAFAF7' }}>
              WiyoRent Student Referral Portal
            </h1>
            <p className="text-lg md:text-xl" style={{ color: '#999' }}>
              Submit landlord referrals, track status, and earn lottery tickets.
            </p>
          </div>

          {/* Primary CTA - above the fold */}
          <div className="flex justify-center">
            <Link 
              href={ctaHref}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold shadow-md transition-all"
              style={{ backgroundColor: '#EDB508', color: '#010101' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d9a307')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EDB508')}
            >
              <LayoutDashboard className="w-5 h-5" />
              Submit a Referral
            </Link>
          </div>

          {/* Quick Rules Card */}
          <div className="space-y-4">
            <QuickRulesCard className="mx-auto" />
            <div className="text-center">
              <Link
                href="/rules"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#EDB508',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  color: '#EDB508'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#EDB508';
                  e.target.style.color = '#010101';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#EDB508';
                }}
              >
                View Full Guidelines
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
            <div className="p-6 rounded-xl border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}>
              <Award className="w-8 h-8 mb-3" style={{ color: '#EDB508' }} />
              <h3 className="font-semibold mb-2" style={{ color: '#FAFAF7' }}>Earn Rewards</h3>
              <p className="text-sm" style={{ color: '#999' }}>Get lottery tickets for every successful referral</p>
            </div>
            <div className="p-6 rounded-xl border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}>
              <TrendingUp className="w-8 h-8 mb-3" style={{ color: '#EDB508' }} />
              <h3 className="font-semibold mb-2" style={{ color: '#FAFAF7' }}>Track Progress</h3>
              <p className="text-sm" style={{ color: '#999' }}>Monitor your referrals in real-time</p>
            </div>
            <div className="p-6 rounded-xl border" style={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}>
              <Users className="w-8 h-8 mb-3" style={{ color: '#EDB508' }} />
              <h3 className="font-semibold mb-2" style={{ color: '#FAFAF7' }}>Join Community</h3>
              <p className="text-sm" style={{ color: '#999' }}>Connect with other student referrers</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all border"
              style={{ 
                backgroundColor: 'transparent',
                borderColor: '#EDB508',
                color: '#EDB508'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#EDB508';
                e.target.style.color = '#010101';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#EDB508';
              }}
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
            
            <Link 
              href="/signup" 
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
              style={{ 
                backgroundColor: '#EDB508',
                color: '#010101'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#d9a307'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#EDB508'}
            >
              <UserPlus className="w-5 h-5" />
              Sign up
            </Link>
            
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all border"
              style={{ 
                backgroundColor: 'transparent',
                borderColor: '#333',
                color: '#FAFAF7'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = '#EDB508'}
              onMouseLeave={(e) => e.target.style.borderColor = '#333'}
            >
              <LayoutDashboard className="w-5 h-5" />
              Go to Dashboard
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t" style={{ borderColor: '#333' }}>
            <p style={{ color: '#999' }}>
              <Shield className="w-4 h-4 inline-block mr-2" style={{ color: '#EDB508' }} />
              Admin? Visit{" "}
              <Link 
                href="/admin" 
                className="font-semibold transition-colors"
                style={{ color: '#EDB508' }}
              >
                Admin dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}