"use client";

import { useEffect, useState } from 'react';



export default function AdminBlacklistPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newReason, setNewReason] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", phoneNumber: "", reason: "" });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/admin/blacklist', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to load');
      setList(json.blacklist || []);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function removeEntry(id, phone) {
    setError("");
    try {
      const url = `/api/admin/blacklist?${id ? `id=${id}` : `phone=${encodeURIComponent(phone)}`}`;
      const res = await fetch(url, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Delete failed');
      setList((prev) => prev.filter((b) => b._id !== id));
    } catch (e) {
      setError(e.message || 'Delete failed');
    }
  }

  async function addEntry() {
    setError("");
    setAdding(true);
    try {
      if (!newPhone.trim()) throw new Error('Phone is required');
      const res = await fetch('/api/admin/blacklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: newPhone.trim(), reason: newReason || 'rejected', name: newName || '' })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Add failed');
      setList((prev) => [json.blacklist, ...prev]);
      setNewName(""); setNewPhone(""); setNewReason("");
    } catch (e) {
      setError(e.message || 'Add failed');
    } finally {
      setAdding(false);
    }
  }

  async function saveEdit(id) {
    setError("");
    try {
      const res = await fetch('/api/admin/blacklist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, phoneNumber: editValues.phoneNumber, reason: editValues.reason, name: editValues.name })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Update failed');
      setList((prev) => prev.map((b) => (b._id === id ? json.blacklist : b)));
      setEditingId(null);
    } catch (e) {
      setError(e.message || 'Update failed');
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-[#010101] mb-6">Blacklist</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-lg text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="p-8 text-center text-black">Loading...</div>
        ) : (
          <div className="bg-white border-2 border-[#010101] rounded-lg overflow-x-auto">
            <div className="p-4 border-b border-[#010101]/10 flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Name</label>
                <input className="border-2 border-[#010101] rounded px-2 py-1 text-black" value={newName} onChange={(e)=>setNewName(e.target.value)} placeholder="Optional" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Phone Number</label>
                <input className="border-2 border-[#010101] rounded px-2 py-1 text-black" value={newPhone} onChange={(e)=>setNewPhone(e.target.value)} placeholder="07XXXXXXXX" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Reason</label>
                <input className="border-2 border-[#010101] rounded px-2 py-1 text-black" value={newReason} onChange={(e)=>setNewReason(e.target.value)} placeholder="Reason" />
              </div>
              <button onClick={addEntry} disabled={adding} className="px-4 py-2 bg-[#EDB508] border-2 border-[#010101] rounded font-semibold disabled:opacity-50 text-[#010101]">{adding ? 'Adding...' : 'Add'}</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#010101]">
                  <th className="text-left py-3 px-4 text-sm font-bold uppercase text-black">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-bold uppercase text-black">Phone Number</th>
                  <th className="text-left py-3 px-4 text-sm font-bold uppercase text-black">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-bold uppercase text-black">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#010101]/10">
                {list.map((b) => (
                  <tr key={b._id} className="hover:bg-[#FAFAF7] text-black">
                    <td className="py-3 px-4 text-black">
                      {editingId === b._id ? (
                        <input className="border-2 border-[#010101] rounded px-2 py-1 w-full" value={editValues.name} onChange={(e)=>setEditValues((v)=>({ ...v, name: e.target.value }))} />
                      ) : (b.name || '-')}
                    </td>
                    <td className="py-3 px-4 font-mono text-black">
                      {editingId === b._id ? (
                        <input className="border-2 border-[#010101] rounded px-2 py-1 w-full" value={editValues.phoneNumber} onChange={(e)=>setEditValues((v)=>({ ...v, phoneNumber: e.target.value }))} />
                      ) : b.phoneNumber}
                    </td>
                    <td className="py-3 px-4 text-black">
                      {editingId === b._id ? (
                        <input className="border-2 border-[#010101] rounded px-2 py-1 w-full" value={editValues.reason} onChange={(e)=>setEditValues((v)=>({ ...v, reason: e.target.value }))} />
                      ) : b.reason}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === b._id ? (
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(b._id)} className="px-3 py-2 bg-white border-2 border-[#010101] text-[#010101] font-semibold rounded text-sm">Save</button>
                          <button onClick={() => setEditingId(null)} className="px-3 py-2 bg-white border-2 border-[#010101] text-[#010101] font-semibold rounded text-sm">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingId(b._id); setEditValues({ name: b.name || '', phoneNumber: b.phoneNumber, reason: b.reason || '' }); }} className="px-3 py-2 bg-white border-2 border-[#010101] text-[#010101] font-semibold rounded text-sm">Edit</button>
                          <button
                            onClick={() => removeEntry(b._id, b.phoneNumber)}
                            className="px-4 py-2 bg-white border-2 border-[#010101] text-[#010101] font-semibold rounded hover:bg-[#010101] hover:text-[#FAFAF7] transition-all duration-200 text-sm"
                          >
                            Unblacklist
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {!list.length && (
                  <tr>
                    <td colSpan={4} className="py-6 px-4 text-center text-black">No blacklisted numbers.</td>
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

