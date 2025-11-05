"use client";


import { useEffect, useState } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function AdminLotteryPage() {
  const [error, setError] = useState("");
  const [qualified, setQualified] = useState([]);
  const [picking, setPicking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/admin/lottery/qualified`, { cache: 'no-store' });
        const json = await res.json();
        if (res.ok) setQualified(json.users || []);
        else setError(json.message || 'Failed to load');
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function pickWinner() {
    setPicking(true);
    setError("");
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/admin/lottery/pick-winner`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to pick winner');
      // refresh qualified list
      const q = await fetch(`${baseUrl}/api/admin/lottery/qualified`, { cache: 'no-store' });
      const qj = await q.json();
      if (q.ok) setQualified(qj.users || []);
    } catch (e) {
      setError(e.message || 'Failed to pick winner');
    } finally {
      setPicking(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#010101] mb-2">
            Lottery
          </h1>
          <p className="text-[#010101]/70 text-lg">
            Pick a winner and view qualified users
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg flex items-start gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Qualified Users + Pick Winner */}
        <section className="bg-white border-2 border-[#010101] rounded-lg shadow-sm mt-6 text-black">
          <div className="border-b-2 border-[#010101] bg-[#FAFAF7] px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#010101]">Qualified Users</h2>
            <button
              onClick={pickWinner}
              disabled={picking || !qualified.length}
              className="px-4 py-2 bg-[#EDB508] border-2 border-[#010101] rounded font-semibold disabled:opacity-50"
            >
              {picking ? 'Picking...' : 'Pick Winner'}
            </button>
          </div>
          <div className="p-6 overflow-x-auto">
            {loading ? (
              <div className="text-center py-8 text-black">Loading qualified users...</div>
            ) : !qualified.length ? (
              <div className="text-center py-8 text-black">No qualified users yet.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#010101]">
                    <th className="text-left py-3 px-4 text-sm font-bold uppercase">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-bold uppercase">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-bold uppercase">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-bold uppercase">Tickets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#010101]/10">
                  {qualified.map((u) => (
                    <tr key={u._id} className="hover:bg-[#FAFAF7]">
                      <td className="py-3 px-4">{u.name}</td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4">{u.phone || '-'}</td>
                      <td className="py-3 px-4 font-semibold">{u.tickets}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}