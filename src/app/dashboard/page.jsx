"use client";

import { useEffect, useState } from "react";
import { User, Award, MapPin, Phone, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import QuickRulesCard from "../components/QuickRulesCard";
import { getBaseUrl } from "@/lib/getBaseUrl";


export default function DashboardPage() {
  const [me, setMe] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [landlordName, setLandlordName] = useState("");
  const [landlordPhone, setLandlordPhone] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [conflict, setConflict] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [winnerInfo, setWinnerInfo] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const baseUrl = getBaseUrl();
      try {
        const meRes = await fetch(`${baseUrl}/api/auth/me`, { cache: "no-store", credentials: 'include' });
        if (!meRes.ok) throw new Error("Failed to load user");
        const meJson = await meRes.json();
        if (!mounted) return;
        setMe(meJson.user);

        const refRes = await fetch(`${baseUrl}/api/referrals`, { cache: "no-store", credentials: 'include' });
        if (!refRes.ok) throw new Error("Failed to load referrals");
        const refJson = await refRes.json();
        if (!mounted) return;
        setReferrals(refJson.referrals || []);
      } catch (e) {
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // periodic refresh to keep referrals in sync with admin updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const baseUrl = getBaseUrl();
        const refRes = await fetch(`${baseUrl}/api/referrals`, { cache: "no-store", credentials: 'include' });
        if (!refRes.ok) return;
        const refJson = await refRes.json();
        setReferrals(refJson.referrals || []);
      } catch {}
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // load latest lottery winner for dashboard message
  useEffect(() => {
    (async () => {
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/lottery/latest`, { cache: 'no-store', credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json();
        setWinnerInfo(json.draw || null);
      } catch {}
    })();
  }, []);

  // real-time phone check
  useEffect(() => {
    const controller = new AbortController();
    setConflict(null);
    if (!landlordPhone) return () => controller.abort();
    const t = setTimeout(async () => {
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/referrals/check?phone=${encodeURIComponent(landlordPhone)}`, { signal: controller.signal, cache: 'no-store', credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json();
        if (json.status === 'blacklisted') setConflict({ type: 'blacklist', data: json.blacklist });
        else if (json.status === 'wiyorent') setConflict({ type: 'wiyorent', data: json.wiyorent });
        else if (json.status === 'duplicate') setConflict({ type: 'duplicate', data: json.referral });
      } catch {}
    }, 400);
    return () => { clearTimeout(t); controller.abort(); };
  }, [landlordPhone]);

  async function submitReferral(e) {
    e.preventDefault();
    setSubmitting(true);
    // Clear all previous messages
    setError("");
    setSuccessMsg("");
    setConflict(null);
    
    // Updated phone validation: 07[8-9]XXXXXXX (must start with 078 or 079)
    const phoneOk = /^07[89]\d{7}$/.test(landlordPhone.trim());
    if (!phoneOk) {
      setSubmitting(false);
      setError("Please enter a valid phone number starting with 078 or 079 (e.g., 0781234567).");
      return;
    }
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/referrals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landlordName, landlordPhone, location }),
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.conflict) {
          if (json.conflict.type === 'blacklist') setConflict({ type: 'blacklist', data: json.conflict.blacklist });
          else if (json.conflict.type === 'wiyorent') setConflict({ type: 'wiyorent', data: json.conflict.wiyorent });
          else setConflict({ type: 'duplicate', data: json.conflict.referral });
        } else {
          throw new Error(json.message || "Oops! Something went wrong. Please try submitting again.");
        }
        return;
      }
      setReferrals((prev) => [json.referral, ...prev]);
      setSuccessMsg("Your referral has been submitted successfully and is pending verification.");
      setLandlordName("");
      setLandlordPhone("");
      setLocation("");
    } catch (e) {
      setError(e.message || "Oops! Something went wrong. Please try submitting again.");
    } finally {
      setSubmitting(false);
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF7] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Image src="/WiyoRent_logo.svg" alt="WiyoRent Logo" width={56} height={56} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#010101]">WiyoRent Student Referral Portal</h1>
        </div>

        {loading ? (
          <div className="text-center py-16 text-[#010101]">
            <div className="w-12 h-12 border-4 border-[#EDB508] border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
            <p className="text-lg text-black">Loading...</p>
          </div>
        ) : (
          me ? (
            <>
            {/* Lottery feedback - top of dashboard */}
            {winnerInfo && me && (
              <section className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200">
                {((typeof winnerInfo.winningUser === 'string' ? winnerInfo.winningUser : winnerInfo.winningUser?._id) === me._id) ? (
                  <div className="text-green-900 bg-green-50 border border-green-200 rounded-lg p-4 text-center text-lg font-semibold">
                    🎉 Congratulations! You're the winner of the latest WiyoRent Lottery!
                  </div>
                ) : (
                  <div className="text-[#010101] bg-amber-50 border border-amber-200 rounded-lg p-4 text-center text-lg">
                    Thanks for participating! Keep referring landlords for more chances to win.
                  </div>
                )}
              </section>
            )}

            {/* Welcome Card */}
            <section className="bg-[#010101] rounded-2xl p-8 mb-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#EDB508] flex items-center justify-center">
                  <User className="w-6 h-6 text-[#010101]" />
                </div>
                <h2 className="text-3xl font-semibold text-[#FAFAF7]">
                  Welcome{me?.name ? `, ${me.name}` : ""}
                </h2>
              </div>
              
              <div className="flex items-center gap-3 bg-[#EDB508] px-6 py-4 rounded-xl w-fit">
                <Award className="w-6 h-6 text-[#010101]" />
                <div>
                  <p className="text-sm text-[#010101] opacity-80">
                    Your Tickets
                  </p>
                  <p className="text-3xl font-bold text-[#010101] leading-none">
                    {me?.tickets ?? 0}
                  </p>
                </div>
              </div>
            </section>


            {/* Submit Referral Form */}
            <section className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-200">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-semibold text-[#010101] mb-6">
                  Submit a Referral
                </h3>
              </div>
              
              <form onSubmit={submitReferral} className="max-w-2xl mx-auto">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-[#010101] mb-2">
                    Landlord Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:border-[#EDB508] focus:outline-none transition-colors text-black"
                      value={landlordName} 
                      onChange={(e) => setLandlordName(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-[#010101] mb-2" htmlFor="landlordPhone">
                    Landlord Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      id="landlordPhone"
                      name="landlordPhone"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:border-[#EDB508] focus:outline-none transition-colors text-black"
                      value={landlordPhone} 
                      onChange={(e) => setLandlordPhone(e.target.value)} 
                      placeholder="e.g., 0781234567"
                      required 
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#010101] mb-2">
                    Location <span className="text-gray-500">(optional)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:border-[#EDB508] focus:outline-none transition-colors text-black"
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)} 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting || (conflict && conflict.type)}
                  className="w-full px-6 py-3.5 bg-[#EDB508] hover:bg-[#D9A307] text-[#010101] rounded-lg text-base font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Referral"}
                </button>

                {conflict && !error && (
                  <div className={`mt-3 rounded-lg p-3 text-sm ${
                    conflict.type === 'blacklist' 
                      ? 'bg-red-100 border border-red-300 text-red-800' 
                      : conflict.type === 'wiyorent' 
                      ? 'bg-blue-100 border border-blue-300 text-blue-800' 
                      : 'bg-yellow-100 border border-yellow-300 text-yellow-800'
                  }`}>
                    {conflict.type === 'blacklist' ? (
                      <div>
                        This number is not eligible for submission.
                        {conflict.data?.reason ? ` Reason: ${conflict.data.reason}` : ''}
                      </div>
                    ) : conflict.type === 'wiyorent' ? (
                      <div>
                        This number is already a registered landlord.
                      </div>
                    ) : (
                      <div>
                        This number was already submitted and is {conflict.data?.status || 'processed'}.
                      </div>
                    )}
                  </div>
                )}
              </form>

              {/* Success/Error messages directly below the form, inside the card */}
              <div className="max-w-2xl mx-auto mt-4">
                {error && (
                  <div className="bg-red-100 border border-red-300 rounded-xl p-4 text-red-800">
                    {error}
                  </div>
                )}
                {successMsg && (
                  <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-green-800">
                    {successMsg}
                  </div>
                )}
              </div>
            </section>

            {/* Referrals List */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-semibold text-[#010101] mb-6">
                Your Referrals
              </h3>
              
              {!referrals.length ? (
                <div className="text-center py-12 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No referrals yet.</p>
                  <p className="text-sm">Submit your first referral to get started!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {referrals.map((r) => (
                    <div 
                      key={r._id}
                      className="border border-gray-200 rounded-xl p-5 bg-[#FAFAF7] hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-gray-500" />
                          <span className="text-lg font-semibold text-[#010101]">
                            {r.landlordName}
                          </span>
                        </div>
                        
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium ${getStatusColor(r.status)}`}>
                          {getStatusIcon(r.status)}
                          {r.status === 'verified' ? 'Verified' : r.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </div>
                      </div>

                      <div className={`flex flex-col gap-2 ${r.status === "rejected" && r.rejectionReason ? "mb-3" : ""}`}>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 text-sm">
                            {r.landlordPhone}
                          </span>
                        </div>
                        
                        {r.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 text-sm">
                              {r.location}
                            </span>
                          </div>
                        )}
                      </div>

                      {r.status === "rejected" && r.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-100 rounded-md text-sm text-red-800">
                          <strong>Rejection reason:</strong> {r.rejectionReason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Quick Rules */}
            <div className="my-8 max-w-2xl mx-auto space-y-4">
              <QuickRulesCard />
              <div className="text-center">
                <Link
                  href="/rules"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all border-2 border-[#EDB508] text-[#EDB508] hover:bg-[#EDB508] hover:text-[#010101]"
                >
                  View Full Guidelines
                </Link>
              </div>
            </div>
            
            </>
          ) : (
            <section className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-200 text-center">
              <h3 className="text-2xl font-semibold text-[#010101] mb-4">Please login to submit a referral</h3>
              <a
                href="/login?next=%2Fdashboard&msg=Please%20login%20to%20submit%20a%20referral"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
                style={{ backgroundColor: '#EDB508', color: '#010101' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d9a307')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EDB508')}
              >
                Login
              </a>
            </section>
          )
        )}
      </div>
    </main>
  );
}