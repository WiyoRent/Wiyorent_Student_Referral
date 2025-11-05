"use client";

import { useEffect, useState } from 'react';


export default function AdminWiyoRentLandlordsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/admin/wiyorent-landlords', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to load');
      setList(json.landlords || []);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function addEntry(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch('/api/admin/wiyorent-landlords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landlordName, phoneNumber })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to add');
      setList((prev) => [json.landlord, ...prev]);
      setLandlordName('');
      setPhoneNumber('');
    } catch (e) {
      setError(e.message || 'Failed to add');
    } finally {
      setSubmitting(false);
    }
  }

  async function removeEntry(id, phone) {
    setError("");
    try {
      const url = `/api/admin/wiyorent-landlords?${id ? `id=${id}` : `phone=${encodeURIComponent(phone)}`}`;
      const res = await fetch(url, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Delete failed');
      setList((prev) => prev.filter((b) => b._id !== id));
    } catch (e) {
      setError(e.message || 'Delete failed');
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-[#010101] mb-6">WiyoRent Landlords</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-lg text-red-700">{error}</div>
        )}

        <section className="bg-white border-2 border-[#010101] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">Add Landlord</h2>
          <form onSubmit={addEntry} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-black">
            <input
              className="px-4 py-2 border-2 border-[#010101] rounded"
              placeholder="Landlord Name"
              value={landlordName}
              onChange={(e) => setLandlordName(e.target.value)}
              required
            />
            <input
              className="px-4 py-2 border-2 border-[#010101] rounded"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <button
              className="px-4 py-2 bg-[#EDB508] border-2 border-[#010101] rounded font-semibold"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add'}
            </button>
          </form>
        </section>

        {loading ? (
          <div className="p-8 text-center text-black">Loading...</div>
        ) : (
          <div className="bg-white border-2 border-[#010101] rounded-lg overflow-x-auto">
            <table className="w-full text-black">
              <thead>
                <tr className="border-b-2 border-[#010101]">
                  <th className="text-left py-3 px-4 text-sm font-bold uppercase">Landlord</th>
                  <th className="text-left py-3 px-4 text-sm font-bold uppercase">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-bold uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#010101]/10">
                {list.map((b) => (
                  <tr key={b._id} className="hover:bg-[#FAFAF7]">
                    <td className="py-3 px-4">{b.landlordName}</td>
                    <td className="py-3 px-4 font-mono">{b.phoneNumber}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => removeEntry(b._id, b.phoneNumber)}
                        className="px-4 py-2 bg-white border-2 border-[#010101] text-[#010101] font-semibold rounded hover:bg-[#010101] hover:text-[#FAFAF7] transition-all duration-200 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {!list.length && (
                  <tr>
                    <td colSpan={3} className="py-6 px-4 text-center text-black">No landlords.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}


