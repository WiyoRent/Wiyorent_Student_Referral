import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken, createCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return new Response(JSON.stringify({ message: "Invalid password" }), { status: 401 });

    const token = generateToken(user);
    const cookie = createCookie(token);

    return new Response(
      JSON.stringify({ message: "Login successful", user: { id: user._id, email: user.email } }),
      {
        status: 200,
        headers: { "Set-Cookie": cookie },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Login failed" }), { status: 500 });
  }
}
