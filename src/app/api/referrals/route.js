import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import Referral from '@/models/Referral';
import Blacklist from '@/models/Blacklist';
import WiyoRentLandlord from '@/models/WiyoRentLandlord';
import Setting from '@/models/Setting';

// GET /api/referrals - Get user's referrals
export async function GET(request) {
  const user = verifyToken(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await dbConnect();


  const referrals = await Referral.find({ userId: user.id }).sort({ createdAt: -1 });


  console.log(referrals, '***********');

  return NextResponse.json({ referrals });

  
}

// POST /api/referrals - Submit new referral
export async function POST(request) {
  const user = verifyToken(request);
  if (!user) return NextResponse.json({ message: 'Please login to submit a referral.' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { landlordName, landlordPhone, location } = body || {};
  if (!landlordName || !landlordPhone) {
    return NextResponse.json({ message: 'Missing landlordName or landlordPhone' }, { status: 400 });
  }
  // validate phone format: +2507XXXXXXXX or 07XXXXXXXX
  const phoneOk = /^(\+2507\d{8}|07\d{8})$/.test(String(landlordPhone).trim());
  if (!phoneOk) {
    return NextResponse.json({ message: 'Invalid phone format. Use +2507XXXXXXXX or 07XXXXXXXX.' }, { status: 400 });
  }

  await dbConnect();

  // Check submissions toggle
  const settings = await Setting.findOne({}).lean();
  if (settings && settings.submissionEnabled === false) {
    return NextResponse.json({ message: 'Submission of new landlords is currently closed.' }, { status: 403 });
  }

  // Block if blacklisted
  const blacklisted = await Blacklist.findOne({ phoneNumber: landlordPhone }).lean();
  if (blacklisted) {
    return NextResponse.json({ 
      message: 'This number is blacklisted', 
      conflict: { type: 'blacklist', blacklist: blacklisted }
    }, { status: 409 });
  }

  // Block if already a WiyoRent landlord
  const existingWiyo = await WiyoRentLandlord.findOne({ phoneNumber: landlordPhone }).lean();
  if (existingWiyo) {
    return NextResponse.json({
      message: 'This number is already registered as a WiyoRent landlord.',
      conflict: { type: 'wiyorent', wiyorent: existingWiyo }
    }, { status: 409 });
  }

  // Prevent duplicate referrals by phone number
  const duplicate = await Referral.findOne({ landlordPhone }).lean();
  if (duplicate) {
    return NextResponse.json({ 
      message: 'Referral already exists for this number', 
      conflict: { type: 'duplicate', referral: duplicate }
    }, { status: 409 });
  }

  const referral = await Referral.create({
    userId: user.id,
    landlordName,
    landlordPhone,
    location: location || '',
    status: 'pending',
  });

  return NextResponse.json({ referral }, { status: 201 });
}


