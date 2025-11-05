import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';

// GET /api/admin/lottery/qualified - list users with at least one ticket
export async function GET(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  await dbConnect();
  const users = await User.find({ tickets: { $gte: 1 } })
    .select('name email phone tickets')
    .sort({ tickets: -1 })
    .lean();
  return NextResponse.json({ users });
}



