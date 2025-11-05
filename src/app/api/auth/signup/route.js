import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, university, phone } = await req.json();

    if (!name || !email || !password || !university || !phone) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ message: 'Invalid email address' }), { status: 400 });
    }
    if (password.length < 8) {
      return new Response(JSON.stringify({ message: 'Password must be at least 8 characters' }), { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      university,
      password: hashed,
      role: "user",
    });

    return new Response(JSON.stringify({ message: "Signup successful", user }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Signup failed" }), { status: 500 });
  }
}
