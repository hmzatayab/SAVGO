import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    }, // Wallet Reference
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["deposit", "withdraw", "transfer", "purchase", "bid", "refund"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    recipientWallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" }, // For transfers
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // For purchases
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
