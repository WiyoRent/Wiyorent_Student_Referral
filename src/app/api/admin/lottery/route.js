import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import Lottery from '@/models/Lottery';
import User from '@/models/User';

// GET /api/admin/lottery - List draws
export async function GET(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  await dbConnect();
  const draws = await Lottery.find({}).sort({ drawDate: -1 });
  return NextResponse.json({ draws });
}

// POST /api/admin/lottery - Create a draw
export async function POST(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const body = await request.json().catch(() => null);
  const drawDate = body?.drawDate ? new Date(body.drawDate) : new Date();
  const prize = body?.prize || 'Reward';
  await dbConnect();
  const draw = await Lottery.create({ drawDate, prize });
  return NextResponse.json({ draw }, { status: 201 });
}

// GET /api/admin/lottery/qualified - list users with at least one ticket
export async function GET_qualified() {}


