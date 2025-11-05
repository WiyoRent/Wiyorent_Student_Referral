import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import Setting from '@/models/Setting';

async function getSingleton() {
  await dbConnect();
  const existing = await Setting.findOne({});
  if (existing) return existing;
  return await Setting.create({});
}

export async function GET(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const s = await getSingleton();
  return NextResponse.json({ settings: { submissionEnabled: s.submissionEnabled } });
}

export async function PUT(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const body = await request.json().catch(() => null);
  const submissionEnabled = body?.submissionEnabled;
  const s = await getSingleton();
  if (typeof submissionEnabled === 'boolean') s.submissionEnabled = submissionEnabled;
  await s.save();
  return NextResponse.json({ settings: { submissionEnabled: s.submissionEnabled } });
}


