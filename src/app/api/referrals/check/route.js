import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Blacklist from '@/models/Blacklist';
import Referral from '@/models/Referral';
import WiyoRentLandlord from '@/models/WiyoRentLandlord';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  if (!phone) return NextResponse.json({ message: 'phone required' }, { status: 400 });

  await dbConnect();
  const blacklisted = await Blacklist.findOne({ phoneNumber: phone }).lean();
  if (blacklisted) return NextResponse.json({ status: 'blacklisted', blacklist: blacklisted });

  const wiyorent = await WiyoRentLandlord.findOne({ phoneNumber: phone }).lean();
  if (wiyorent) return NextResponse.json({ status: 'wiyorent', wiyorent });

  const referral = await Referral.findOne({ landlordPhone: phone }).lean();
  if (referral) return NextResponse.json({ status: 'duplicate', referral });

  return NextResponse.json({ status: 'available' });
}


