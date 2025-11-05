import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';
import Lottery from '@/models/Lottery';

function weightedRandom(users) {
  const totalTickets = users.reduce((acc, u) => acc + (u.tickets || 0), 0);
  if (totalTickets <= 0) return null;
  let r = Math.random() * totalTickets;
  for (const u of users) {
    r -= (u.tickets || 0);
    if (r <= 0) return u;
  }
  return users[users.length - 1];
}

export async function POST(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const body = await request.json().catch(() => null);
  const prize = body?.prize || 'Reward';
  await dbConnect();
  const users = await User.find({ tickets: { $gt: 0 } }, 'name email phone tickets').lean();
  if (!users.length) return NextResponse.json({ message: 'No qualified users' }, { status: 409 });
  const winner = weightedRandom(users);
  const draw = await Lottery.create({ drawDate: new Date(), prize, winningUser: winner._id });
  return NextResponse.json({ draw, winner });
}


