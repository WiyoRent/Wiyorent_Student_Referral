"use client";

import { Info, Trophy, Sparkles } from "lucide-react";
import { referralRulesConfig } from "@/lib/rulesConfig";

export default function QuickRulesCard({ className = "" }) {
  const { title, prizeLabel, prizeAmount, points } = referralRulesConfig;
  
  return (
    <section
      className={`rounded-2xl shadow-lg border border-[#333] p-6 sm:p-7 ${className}`}
      style={{ backgroundColor: "#010101" }}
      aria-labelledby="quick-rules-title"
    >
      {/* Header with Info Icon */}
      <div className="flex items-center gap-2 mb-6">
        <Info className="w-5 h-5 text-[#EDB508]" aria-hidden="true" />
        <h3 id="quick-rules-title" className="text-lg sm:text-xl font-semibold text-[#FAFAF7]">
          {title}
        </h3>
      </div>

      {/* Grand Prize Indicator */}
      <div className="relative mb-6 overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#EDB508]/20 via-[#EDB508]/30 to-[#EDB508]/20 animate-pulse rounded-2xl blur-xl" />
        
        {/* Main prize badge */}
        <div className="relative bg-gradient-to-br from-[#EDB508] via-[#F5C842] to-[#EDB508] p-1 rounded-2xl shadow-2xl">
          <div className="bg-[#010101] rounded-xl px-6 py-4 sm:py-5">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {/* Trophy Icon */}
              <div className="relative">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-[#EDB508] animate-bounce" style={{ animationDuration: '2s' }} />
                <Sparkles className="w-4 h-4 text-[#EDB508] absolute -top-1 -right-1 animate-pulse" />
              </div>
              
              {/* Prize Text */}
              <div className="text-center sm:text-left">
                <div className="text-[#EDB508] text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">
                  {prizeLabel}
                </div>
                <div className="text-[#FAFAF7] text-3xl sm:text-4xl font-black tracking-tight">
                  {prizeAmount}
                </div>
              </div>

              {/* Decorative sparkle */}
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#EDB508] hidden sm:block animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>

        {/* Shine effect overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine pointer-events-none rounded-2xl"
          style={{
            animation: 'shine 3s ease-in-out infinite'
          }}
        />
      </div>

      {/* Rules List */}
      <ul className="space-y-3">
        {points.map((p, idx) => {
          // Detect key phrases and add visual indicators
          const hasTicket = p.toLowerCase().includes('ticket');
          const hasVerified = p.toLowerCase().includes('verified');
          const hasMaxRent = p.toLowerCase().includes('maximum') || p.toLowerCase().includes('rwf 250');
          const hasBlacklist = p.toLowerCase().includes('blacklist') || p.toLowerCase().includes('duplicate');
          const hasWinner = p.toLowerCase().includes('winner') || p.toLowerCase().includes('randomly');
          const hasKigali = p.toLowerCase().includes('kigali') || p.toLowerCase().includes('furnished');
          
          return (
            <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[#FAFAF7]">
              {/* Visual indicator icons */}
              <span className="flex-shrink-0 mt-0.5">
                {hasTicket && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#EDB508]/20 text-[#EDB508]">
                    🎫
                  </span>
                )}
                {hasVerified && !hasTicket && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20 text-green-400">
                    ✓
                  </span>
                )}
                {hasMaxRent && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400">
                    💰
                  </span>
                )}
                {hasBlacklist && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-400">
                    ⛔
                  </span>
                )}
                {hasWinner && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 text-purple-400">
                    🎲
                  </span>
                )}
                {hasKigali && !hasMaxRent && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#EDB508]/20 text-[#EDB508]">
                    🏠
                  </span>
                )}
                {!hasTicket && !hasVerified && !hasMaxRent && !hasBlacklist && !hasWinner && !hasKigali && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-500/20 text-gray-400">
                    •
                  </span>
                )}
              </span>
              
              {/* Rule text with highlighted keywords */}
              <span className="flex-1">
                {p.split(/(\bverified\b|\bticket\b|\bRWF 250,000\b|\bblacklisted\b|\bduplicate\b|\bWinners\b|\brandomly\b|\bKigali\b|\bfurnished\b)/gi).map((part, i) => {
                  const lower = part.toLowerCase();
                  if (lower === 'verified' || lower === 'ticket') {
                    return <strong key={i} className="text-[#EDB508] font-semibold">{part}</strong>;
                  }
                  if (lower === 'rwf 250,000') {
                    return <strong key={i} className="text-blue-400 font-semibold">{part}</strong>;
                  }
                  if (lower === 'blacklisted' || lower === 'duplicate') {
                    return <strong key={i} className="text-red-400 font-semibold">{part}</strong>;
                  }
                  if (lower === 'winners' || lower === 'randomly') {
                    return <strong key={i} className="text-purple-400 font-semibold">{part}</strong>;
                  }
                  if (lower === 'kigali' || lower === 'furnished') {
                    return <strong key={i} className="text-[#EDB508] font-semibold">{part}</strong>;
                  }
                  return part;
                })}
              </span>
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
      `}</style>
    </section>
  );
}