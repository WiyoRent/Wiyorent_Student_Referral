import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import Referral from '@/models/Referral';
import Blacklist from '@/models/Blacklist';

export async function GET(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  await dbConnect();

  const [total, pending, verified, rejected, blacklisted] = await Promise.all([
    Referral.countDocuments({}),
    Referral.countDocuments({ status: 'pending' }),
    Referral.countDocuments({ status: 'verified' }),
    Referral.countDocuments({ status: 'rejected' }),
    Blacklist.countDocuments({}),
  ]);

  return NextResponse.json({
    referrals: { total, pending, verified, rejected },
    blacklist: { total: blacklisted },
  });
}


