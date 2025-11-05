import Link from "next/link";

export const metadata = {
  title: "Not Authorized | WiyoRent Student Referral Portal",
  description: "You do not have permission to access this page.",
};

export default function NotAuthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAFAF7] p-6">
      <div className="max-w-md w-full bg-white border-2 border-[#010101] rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-[#010101] mb-3">Not Authorized</h1>
        <p className="text-[#010101]/70 mb-6">You do not have permission to access this page.</p>
        <Link href="/" className="inline-block px-5 py-2 bg-[#EDB508] border-2 border-[#010101] rounded font-semibold text-[#010101]">
          Go Home
        </Link>
      </div>
    </main>
  );
}


