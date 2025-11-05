"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FileText, ChevronDown, ChevronUp } from "lucide-react";

export  function AccordionSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-[#1a1a1a]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#222] transition-colors"
      >
        <h2 className="text-lg md:text-xl font-bold text-[#FAFAF7]">
          {title}
        </h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[#EDB508]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#EDB508]" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 pb-4 text-[#FAFAF7]">
          {children}
        </div>
      )}
    </div>
  );
}

export default function RulesPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF7] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-[#010101] text-[#FAFAF7] hover:bg-[#EDB508] hover:text-[#010101]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="bg-[#010101] rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Image src="/WiyoRent_logo.svg" alt="WiyoRent Logo" width={60} height={60} priority />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="w-6 h-6 text-[#EDB508]" />
              <h1 className="text-2xl md:text-3xl font-bold text-[#FAFAF7]">
                Rules & Guidelines
              </h1>
            </div>
            <p className="text-sm md:text-base text-gray-400">
              WiyoRent Student Referral Program
            </p>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-[#EDB508] rounded-xl p-6 mb-6 shadow-lg">
          <h3 className="text-xl font-bold text-[#010101] mb-3">Quick Summary</h3>
          <ul className="space-y-2 text-[#010101] text-sm md:text-base">
            <li className="flex items-start gap-2">
              <span className="font-bold">🎫</span>
              <span><strong>1 verified referral = 1 lottery ticket</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">🏆</span>
              <span><strong>Grand Prize: RWF 150,000</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">🏠</span>
              <span>Only <strong>furnished Kigali houses</strong> (max RWF 250,000/bedroom)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span>More verified referrals = <strong>higher chances</strong></span>
            </li>
          </ul>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-3 mb-6">
          <AccordionSection title="1. Eligibility" defaultOpen={true}>
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>Anyone can participate — no student registration required.</li>
              <li>Provide accurate details (name, email, phone, university if applicable).</li>
              <li>Submit only through the official platform.</li>
            </ul>
          </AccordionSection>

          <AccordionSection title="2. Referral Requirements">
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>Properties must be in <strong className="text-[#EDB508]">Kigali</strong> and <strong className="text-[#EDB508]">furnished</strong>.</li>
              <li>Max rent: <strong className="text-blue-400">RWF 250,000/bedroom</strong> (2-bed = max 500,000).</li>
              <li>Provide valid landlord phone number.</li>
              <li>No duplicate submissions — one landlord per property.</li>
            </ul>
          </AccordionSection>

          <AccordionSection title="3. Verification & Status">
            <div className="space-y-3 text-sm">
              <p className="font-semibold">Submission statuses:</p>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Pending:</strong> Awaiting verification.</li>
                <li><strong className="text-green-400">Verified:</strong> Counts as lottery entry.</li>
                <li><strong className="text-red-400">Rejected:</strong> Does not meet requirements.</li>
                <li><strong className="text-red-400">Blacklisted:</strong> Auto-rejected numbers.</li>
              </ul>
              <div className="p-3 rounded-lg bg-[#010101] border-l-4 border-[#EDB508] mt-3">
                <strong>Transparency:</strong> You'll be notified if a number is blacklisted, verified, or already submitted.
              </div>
            </div>
          </AccordionSection>

          <AccordionSection title="4. Lottery Model">
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li><strong className="text-[#EDB508]">1 verified landlord = 1 ticket</strong></li>
              <li>More tickets = higher winning chances.</li>
              <li>Minimum 1 verified referral to be eligible.</li>
              <li>Prize: <strong className="text-[#EDB508]">RWF 150,000</strong></li>
              <li>Winners notified on dashboard.</li>
            </ul>
          </AccordionSection>

          <AccordionSection title="5. Rewards & Payment">
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>Tickets credited after verification.</li>
              <li>Transparent mobile money or direct payout.</li>
              <li>No additional commitments required.</li>
            </ul>
          </AccordionSection>

          <AccordionSection title="6. Fair Use & Conduct">
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>No fake submissions — leads to <strong className="text-red-400">disqualification</strong>.</li>
              <li>Admin can reject non-compliant submissions.</li>
              <li>Cannot submit blacklisted numbers.</li>
              <li>Promote ethically through campus and social networks.</li>
            </ul>
          </AccordionSection>

          <AccordionSection title="7. Winning Strategies">
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>Target landlords with multiple furnished units.</li>
              <li>Track referrals in your dashboard.</li>
              <li>Ensure accurate landlord information.</li>
              <li>More verified referrals = more winning chances!</li>
            </ul>
          </AccordionSection>
        </div>

        {/* Transparency Notice */}
        <div className="bg-[#EDB508] rounded-xl p-5 mb-6 shadow-lg">
          <h3 className="text-lg font-bold text-[#010101] mb-2">🔒 Transparency Notice</h3>
          <p className="text-sm text-[#010101] font-medium">
            Full transparency: You'll be informed if a number is blacklisted, verified, or already submitted by another user.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-semibold text-center transition-all bg-[#010101] text-[#FAFAF7] hover:bg-[#EDB508] hover:text-[#010101]"
          >
            Return to Home
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg font-semibold text-center transition-all border-2 border-[#EDB508] text-[#EDB508] hover:bg-[#EDB508] hover:text-[#010101]"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}