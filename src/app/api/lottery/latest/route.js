import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Lottery from '@/models/Lottery';

// GET /api/lottery/latest - public endpoint to show latest draw and winner
export async function GET() {
  await dbConnect();
  const draw = await Lottery.findOne({})
    .sort({ drawDate: -1 })
    .populate({ path: 'winningUser', select: 'name email phone tickets' })
    .lean();
  return NextResponse.json({ draw: draw || null });
}


