import { useState } from 'react';
import { User, Mail, Send } from 'lucide-react';

export default function ReferralForm({ onSubmit }) {
  const [refereeName, setRefereeName] = useState('');
  const [refereeEmail, setRefereeEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit?.({ refereeName, refereeEmail });
      setRefereeName('');
      setRefereeEmail('');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#010101] mb-2">
          Submit a Referral
        </h2>
        <p className="text-gray-600 text-sm">
          Share the opportunity with someone you know
        </p>
      </div>

      <div className="space-y-5">
        {/* Name Input */}
        <div>
          <label 
            htmlFor="refereeName" 
            className="block text-sm font-medium text-[#010101] mb-2"
          >
            Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              id="refereeName" 
              type="text"
              value={refereeName} 
              onChange={(e) => setRefereeName(e.target.value)} 
              required 
              placeholder="Enter full name"
              className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#EDB508] focus:border-[#EDB508] transition-all outline-none text-[#010101] placeholder-gray-400"
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label 
            htmlFor="refereeEmail" 
            className="block text-sm font-medium text-[#010101] mb-2"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              id="refereeEmail" 
              type="email" 
              value={refereeEmail} 
              onChange={(e) => setRefereeEmail(e.target.value)} 
              required 
              placeholder="email@example.com"
              className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#EDB508] focus:border-[#EDB508] transition-all outline-none text-[#010101] placeholder-gray-400"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="w-full bg-[#EDB508] hover:bg-[#D9A307] disabled:bg-gray-300 disabled:cursor-not-allowed text-[#010101] font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group shadow-sm hover:shadow-md"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-[#010101] border-t-transparent rounded-full animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Referral</span>
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}