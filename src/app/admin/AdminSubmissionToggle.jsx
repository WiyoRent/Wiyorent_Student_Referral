"use client";

import { useEffect, useState } from 'react';
import { Settings, CheckCircle, XCircle } from 'lucide-react';
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function AdminSubmissionToggle() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/admin/settings`, { cache: 'no-store' });
        const json = await res.json();
        if (!mounted) return;
        if (res.ok) setEnabled(!!json.settings?.submissionEnabled);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function toggle() {
    setSaving(true);
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionEnabled: !enabled })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed');
      setEnabled(!!json.settings?.submissionEnabled);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#FAFAF7] rounded-lg flex items-center justify-center border border-gray-200">
          <Settings className="w-5 h-5 text-[#010101]" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#010101]">
            Submission Control
          </h3>
          <p className="text-gray-600 text-sm">
            Enable or disable new referrals
          </p>
        </div>
      </div>
      
      {/* Toggle Control */}
      <div className="flex items-center justify-between p-4 bg-[#FAFAF7] rounded-xl border border-gray-200">
        <div className="flex items-center gap-3">
          {enabled ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
          <div>
            <p className="font-semibold text-black">
              {loading ? 'Loading...' : enabled ? 'Enabled' : 'Disabled'}
            </p>
            <p className="text-gray-600 text-sm">
              {enabled ? 'Users can submit referrals' : 'Submissions are blocked'}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={toggle}
          disabled={loading || saving}
          className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#EDB508] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            enabled ? 'bg-green-500 border-green-600' : 'bg-gray-300 border-gray-400'
          }`}
          role="switch"
          aria-checked={enabled}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              enabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          >
            {saving && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-[#010101] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </span>
        </button>
      </div>

      {/* Status Message */}
      <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
        enabled 
          ? 'bg-green-50 text-green-800 border border-green-200' 
          : 'bg-red-50 text-red-800 border border-red-200'
      }`}>
        {enabled 
          ? '✓ Submission system is active' 
          : '✗ Submission system is paused'}
      </div>
    </div>
  );
}