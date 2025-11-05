import mongoose from 'mongoose';

const LotterySchema = new mongoose.Schema(
  {
    drawDate: { type: Date, required: true },
    winningUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    prize: { type: String, default: 'Reward' },
  },
  { timestamps: true }
);

export default mongoose.models.Lottery || mongoose.model('Lottery', LotterySchema);


