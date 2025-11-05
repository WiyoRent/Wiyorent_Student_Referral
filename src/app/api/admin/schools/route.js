import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';

export async function GET(request) {
  const admin = verifyToken(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  await dbConnect();

  const users = await User.find({}, 'name email phone university').lean();
  const schoolsMap = new Map();
  for (const u of users) {
    const key = u.university || 'Unknown';
    if (!schoolsMap.has(key)) schoolsMap.set(key, []);
    schoolsMap.get(key).push(u);
  }

  const schools = Array.from(schoolsMap.entries()).map(([university, students]) => ({
    university,
    studentCount: students.length,
    students,
  }));

  return NextResponse.json({ schools });
}


