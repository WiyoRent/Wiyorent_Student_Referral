import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import WiyoRentLandlord from '@/models/WiyoRentLandlord';

export async function GET(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  await dbConnect();
  const list = await WiyoRentLandlord.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ landlords: list });
}

export async function POST(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const body = await request.json().catch(() => null);
  const landlordName = body?.landlordName;
  const phoneNumber = body?.phoneNumber;
  if (!landlordName || !phoneNumber) return NextResponse.json({ message: 'Missing landlordName or phoneNumber' }, { status: 400 });
  await dbConnect();
  const created = await WiyoRentLandlord.findOneAndUpdate(
    { phoneNumber },
    { landlordName, phoneNumber, addedBy: admin.id },
    { upsert: true, new: true }
  );
  return NextResponse.json({ landlord: created }, { status: 201 });
}

export async function PUT(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const body = await request.json().catch(() => null);
  const id = body?._id;
  if (!id) return NextResponse.json({ message: 'Missing _id' }, { status: 400 });
  const update = {};
  if (body?.landlordName) update.landlordName = body.landlordName;
  if (body?.phoneNumber) update.phoneNumber = body.phoneNumber;
  const updated = await WiyoRentLandlord.findByIdAndUpdate(id, update, { new: true });
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ landlord: updated });
}

export async function DELETE(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const phone = searchParams.get('phone');
  if (!id && !phone) return NextResponse.json({ message: 'Provide id or phone' }, { status: 400 });
  await dbConnect();
  const res = await WiyoRentLandlord.deleteOne(id ? { _id: id } : { phoneNumber: phone });
  if (res.deletedCount === 0) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}


