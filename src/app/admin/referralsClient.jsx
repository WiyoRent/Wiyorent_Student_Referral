"use client";

import { useState } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function AdminReferralsClient({ initialReferrals = [] }) {
  const [referrals, setReferrals] = useState(initialReferrals);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function updateStatus(referralId, status) {
    setBusyId(referralId);
    setError("");
    try {
      let reason;
      if (status === "rejected") {
        // simple prompt for reason; can be replaced with a modal later
        reason = window.prompt("Enter rejection reason (required):", "Not a landlord");
        if (!reason) throw new Error("Rejection reason is required");
      }
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/admin/referrals`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralId, status, reason }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Update failed");
      setReferrals((prev) => prev.map((r) => (r._id === referralId ? json.referral : r)));
    } catch (e) {
      setError(e.message || "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  const getStatusStyles = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
        return "bg-[#EDB508]/20 text-[#010101] border-[#EDB508]";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <section className="mt-4">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}
      
      {!referrals.length ? (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-[#FAFAF7] rounded-lg border-2 border-[#010101]/10">
            <svg className="w-16 h-16 mx-auto text-[#010101]/20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-black text-lg">No referrals found.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#010101]">
                <th className="text-left py-4 px-4 font-bold text-[#010101] text-sm uppercase tracking-wide">
                  Landlord
                </th>
                <th className="text-left py-4 px-4 font-bold text-[#010101] text-sm uppercase tracking-wide">
                  Landlord Phone Number
                </th>
                <th className="text-left py-4 px-4 font-bold text-[#010101] text-sm uppercase tracking-wide">
                  Location
                </th>
                <th className="text-left py-4 px-4 font-bold text-[#010101] text-sm uppercase tracking-wide">
                  Uploader
                </th>
                <th className="text-left py-4 px-4 font-bold text-[#010101] text-sm uppercase tracking-wide">
                  Uploader Email
                </th>
                <th className="text-left py-4 px-4 font-bold text-[#010101] text-sm uppercase tracking-wide">
                  Uploader Phone
                </th>
                <th className="text-left py-4 px-4 font-bold text-[#010101] text-sm uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left py-4 px-4 font-bold text-[#010101] text-sm uppercase tracking-wide">
                  Rejection Reason
                </th>
                <th className="text-left py-4 px-4 font-bold text-[#010101] text-sm uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#010101]/10">
              {referrals.map((r) => (
                <tr 
                  key={r._id} 
                  className="hover:bg-[#FAFAF7] transition-colors duration-150"
                >
                  <td className="py-4 px-4">
                    <span className="font-medium text-[#010101]">
                      {r.landlordName}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[#010101]/80 font-mono text-sm">
                      {r.landlordPhone}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[#010101]/70">
                      {r.location || "-"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[#010101]/90">
                      {r.userId?.name || '-'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[#010101]/80">
                      {r.userId?.email || '-'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[#010101]/80">
                      {r.userId?.phone || '-'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(r.status)} capitalize`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[#010101]/80 text-sm">
                      {r.status === 'rejected' ? (r.rejectionReason || '-') : '-'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateStatus(r._id, "verified")} 
                        disabled={busyId === r._id || r.status === 'verified'}
                        className="px-4 py-2 bg-white border-2 border-[#010101] text-[#010101] font-semibold rounded hover:bg-[#010101] hover:text-[#FAFAF7] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#010101] text-sm"
                      >
                        {busyId === r._id ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing
                          </span>
                        ) : (
                          r.status === 'verified' ? 'Verified' : 'Verify'
                        )}
                      </button>
                      <button 
                        onClick={() => updateStatus(r._id, "rejected")} 
                        disabled={busyId === r._id || r.status === 'rejected'}
                        className="px-4 py-2 bg-[#EDB508] border-2 border-[#010101] text-[#010101] font-semibold rounded hover:bg-[#010101] hover:text-[#FAFAF7] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#EDB508] disabled:hover:text-[#010101] text-sm"
                      >
                        {r.status === 'rejected' ? 'Rejected' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}