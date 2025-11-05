import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  university: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  tickets: { type: Number, default: 0 },
  password: String, // optional (for email login)
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
