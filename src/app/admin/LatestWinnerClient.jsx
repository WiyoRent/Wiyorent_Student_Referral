"use client";

import { useEffect, useState } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function LatestWinnerClient() {
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const baseUrl = getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/api/lottery/latest`, { cache: 'no-store' });
      if (!res.ok) return;
      const json = await res.json();
      setLatest(json.draw || null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    load();
    const id = setInterval(() => { if (mounted) load(); }, 5000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-black">Loading latest winner...</div>
    );
  }

  if (!latest) {
    return (
      <div className="p-6 text-black">No draws have been made yet.</div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-[#FAFAF7] border-2 border-[#010101] rounded-lg p-6">
        <h3 className="text-xl font-bold text-[#010101] mb-4">Latest Winner</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-semibold">{latest.winningUser?.name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold">{latest.winningUser?.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-semibold">{latest.winningUser?.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tickets</p>
            <p className="font-semibold">{latest.winningUser?.tickets ?? '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


