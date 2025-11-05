import mongoose from "mongoose";

const BlacklistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true, // ensures each number can only appear once
      trim: true,
    },
    reason: {
      type: String,
      required: true, // e.g. "Not a landlord", "Duplicate listing", etc.
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin who marked it as blacklisted
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Blacklist ||
  mongoose.model("Blacklist", BlacklistSchema);
