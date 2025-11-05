import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import Referral from '@/models/Referral';
import User from '@/models/User';
import Blacklist from '@/models/Blacklist';

// PUT /api/admin/referrals - Update referral status
export async function PUT(request) {
  const admin = verifyToken(request);
  console.log(admin, '***********');
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const referralId = body?.referralId;
  const status = body?.status; // 'verified' | 'rejected'
  const reason = body?.reason || null;
  if (!referralId || !status) {
    return NextResponse.json({ message: 'Missing referralId or status' }, { status: 400 });
  }

  await dbConnect();
  const referral = await Referral.findById(referralId);
  if (!referral) return NextResponse.json({ message: 'Referral not found' }, { status: 404 });

  // disallow redundant transitions
  if (referral.status === 'verified' && status === 'verified') {
    return NextResponse.json({ message: 'Already verified' }, { status: 409 });
  }
  if (referral.status === 'rejected' && status === 'rejected') {
    return NextResponse.json({ message: 'Already rejected' }, { status: 409 });
  }

  referral.status = status;
  if (status === 'rejected') {
    referral.rejectionReason = reason || referral.rejectionReason || 'rejected';
  } else {
    referral.rejectionReason = undefined;
  }
  await referral.save();

  if (status === 'verified') {
    // Award a ticket to the referring user
    await User.findByIdAndUpdate(referral.userId, { $inc: { tickets: 1 } });
  } else if (status === 'rejected') {
    // Add to blacklist
    try {
      await Blacklist.findOneAndUpdate(
        { phoneNumber: referral.landlordPhone },
        { name: referral.landlordName, phoneNumber: referral.landlordPhone, reason: reason || 'rejected', rejectedBy: admin.id },
        { upsert: true, new: true }
      );
    } catch (_) {
      // ignore duplicate errors
    }
  }

  return NextResponse.json({ referral });
}


