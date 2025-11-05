import { verifyToken } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req) {
  const payload = verifyToken(req);
  if (!payload) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  await dbConnect();
  const user = await User.findById(payload.id).select("name email role tickets university phone createdAt");
  if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  return new Response(JSON.stringify({ user }), { status: 200 });
}


