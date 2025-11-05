import mongoose from "mongoose";

const WiyoRentLandlordSchema = new mongoose.Schema(
  {
    landlordName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.models.WiyoRentLandlord || mongoose.model("WiyoRentLandlord", WiyoRentLandlordSchema);


