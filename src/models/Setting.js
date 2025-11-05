import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    submissionEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);


