import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // keep secure!

// 1. Create JWT
export function generateToken(user) {
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
}

// 2. Create Cookie
export function createCookie(token) {
  return serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

// 3. Verify JWT from cookie
export function verifyToken(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader.split("token=")[1]?.split(";")[0];
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
