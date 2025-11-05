import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import Blacklist from '@/models/Blacklist';

// POST /api/admin/blacklist - Add rejected number
export async function POST(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const phoneNumber = body?.phoneNumber;
  const name = body?.name || '';
  const reason = body?.reason || 'rejected';
  if (!phoneNumber) {
    return NextResponse.json({ message: 'Missing phoneNumber' }, { status: 400 });
  }

  await dbConnect();
  const entry = await Blacklist.findOneAndUpdate(
    { phoneNumber },
    { name, phoneNumber, reason, rejectedBy: admin.id },
    { upsert: true, new: true }
  );
  return NextResponse.json({ blacklist: entry }, { status: 201 });
}

// GET /api/admin/blacklist - List all blacklisted numbers
export async function GET(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  await dbConnect();
  const list = await Blacklist.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ blacklist: list });
}

// PUT /api/admin/blacklist - Update number or reason
export async function PUT(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const id = body?._id;
  const phoneNumber = body?.phoneNumber;
  const reason = body?.reason;
  const name = body?.name;
  if (!id && !phoneNumber) {
    return NextResponse.json({ message: 'Provide _id or phoneNumber' }, { status: 400 });
  }

  await dbConnect();
  const filter = id ? { _id: id } : { phoneNumber };
  const update = {};
  if (phoneNumber) update.phoneNumber = phoneNumber;
  if (reason) update.reason = reason;
  if (typeof name === 'string') update.name = name;
  update.rejectedBy = admin.id;

  const updated = await Blacklist.findOneAndUpdate(filter, update, { new: true });
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ blacklist: updated });
}

// DELETE /api/admin/blacklist - Delete by _id or phoneNumber
export async function DELETE(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const phone = searchParams.get('phone');
  if (!id && !phone) {
    return NextResponse.json({ message: 'Provide id or phone' }, { status: 400 });
  }

  await dbConnect();
  const res = await Blacklist.deleteOne(id ? { _id: id } : { phoneNumber: phone });
  if (res.deletedCount === 0) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}


