import { dbConnect } from "@/lib/dbConnect";
import Referral from "@/models/Referral";
import Blacklist from "@/models/Blacklist";
import User from "@/models/User";
import AdminSubmissionToggle from './AdminSubmissionToggle';
import AdminReferralsClient from "./referralsClient";
import LatestWinnerClient from "./LatestWinnerClient";

export const dynamic = 'force-dynamic';



export default async function AdminPage() {
  await dbConnect();
  const pending = await Referral.find({ status: { $in: ["pending", "rejected", "verified"] } })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate({ path: 'userId', select: 'name email phone university' })
    .lean();

  const [total, cntPending, verified, rejected, blacklisted] = await Promise.all([
    Referral.countDocuments({}),
    Referral.countDocuments({ status: 'pending' }),
    Referral.countDocuments({ status: 'verified' }),
    Referral.countDocuments({ status: 'rejected' }),
    Blacklist.countDocuments({}),
  ]);

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#010101] mb-3">
            Admin Dashboard
          </h1>
          <p className="text-[#010101]/70 text-lg">
            Moderate referrals below or navigate to Blacklist and Lottery pages.
          </p>
        </div>

        {/* Latest Winner */}
        <div className="bg-white border-2 border-[#010101] rounded-lg shadow-sm mb-8 text-black">
          <div className="border-b-2 border-[#010101] bg-[#FAFAF7] px-6 py-4">
            <h2 className="text-2xl font-bold text-[#010101]">Latest Winner</h2>
          </div>
          <LatestWinnerClient />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white border-2 border-[#010101] rounded-lg p-4">
            <p className="text-sm text-black">Total Submissions</p>
            <p className="text-2xl text-black font-bold">{total}</p>
          </div>
          <div className="bg-white border-2 border-[#010101] rounded-lg p-4">
            <p className="text-sm text-black">Pending</p>
            <p className="text-2xl text-black font-bold">{cntPending}</p>
          </div>
          <div className="bg-white border-2 border-[#010101] rounded-lg p-4">
            <p className="text-sm text-black">Verified</p>
            <p className="text-2xl text-black font-bold">{verified}</p>
          </div>
          <div className="bg-white border-2 border-[#010101] rounded-lg p-4">
            <p className="text-sm text-black">Rejected</p>
            <p className="text-2xl text-black font-bold">{rejected}</p>
          </div>
          <div className="bg-white border-2 border-[#010101] rounded-lg p-4">
            <p className="text-sm text-black">Blacklisted</p>
            <p className="text-2xl text-black font-bold">{blacklisted}</p>
          </div>
        </div>

        {/* Submission Toggle & Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <AdminSubmissionToggle />
          <a 
            href="/admin/blacklist"
            className="group relative overflow-hidden bg-white border-2 border-[#010101] rounded-lg p-6 hover:bg-[#010101] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#010101] group-hover:text-[#FAFAF7] transition-colors">
                  Blacklist Management
                </h3>
                <p className="text-black group-hover:text-[#FAFAF7]/80 mt-1 transition-colors">
                  Manage blocked users
                </p>
              </div>
              <svg 
                className="w-6 h-6 text-[#010101] group-hover:text-[#FAFAF7] transition-colors group-hover:translate-x-1 duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          <a 
            href="/admin/wiyorent-landlords"
            className="group relative overflow-hidden bg-white border-2 border-[#010101] rounded-lg p-6 hover:bg-[#010101] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#010101] group-hover:text-[#FAFAF7] transition-colors">
                  WiyoRent Landlords
                </h3>
                <p className="text-[#010101]/60 group-hover:text-[#FAFAF7]/80 mt-1 transition-colors">
                  Manage official landlord numbers
                </p>
              </div>
              <svg 
                className="w-6 h-6 text-[#010101] group-hover:text-[#FAFAF7] transition-colors group-hover:translate-x-1 duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          <a 
            href="/admin/schools"
            className="group relative overflow-hidden bg-white border-2 border-[#010101] rounded-lg p-6 hover:bg-[#010101] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#010101] group-hover:text-[#FAFAF7] transition-colors">
                  Schools Overview
                </h3>
                <p className="text-black group-hover:text-[#FAFAF7]/80 mt-1 transition-colors">
                  View schools and students
                </p>
              </div>
              <svg 
                className="w-6 h-6 text-[#010101] group-hover:text-[#FAFAF7] transition-colors group-hover:translate-x-1 duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          <a 
            href="/admin/lottery"
            className="group relative overflow-hidden bg-[#EDB508] border-2 border-[#010101] rounded-lg p-6 hover:bg-[#010101] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#010101] group-hover:text-[#FAFAF7] transition-colors">
                  Lottery System
                </h3>
                <p className="text-[#010101]/80 group-hover:text-[#FAFAF7]/80 mt-1 transition-colors">
                  Run and manage draws
                </p>
              </div>
              <svg 
                className="w-6 h-6 text-[#010101] group-hover:text-[#FAFAF7] transition-colors group-hover:translate-x-1 duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>

        {/* Referrals Section */}
        <div className="bg-white border-2 border-[#010101] rounded-lg shadow-sm">
          <div className="border-b-2 border-[#010101] bg-[#FAFAF7] px-6 py-4">
            <h2 className="text-2xl font-bold text-[#010101]">
              Referral Moderation
            </h2>
            <p className="text-black text-sm mt-1">
              Recent referrals awaiting review
            </p>
          </div>
          <div className="p-6">
            <AdminReferralsClient initialReferrals={JSON.parse(JSON.stringify(pending))} />
          </div>
        </div>
      </div>
    </main>
  );
}