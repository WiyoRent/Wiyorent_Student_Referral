import mongoose from "mongoose";

const ReferralSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  landlordName: { type: String, required: true },
  landlordPhone: { type: String, required: true },
  location: String,
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  rejectionReason: String,
}, { timestamps: true });

export default mongoose.models.Referral || mongoose.model("Referral", ReferralSchema);
