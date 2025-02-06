import mongoose from "mongoose";


const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ["deposit", "withdrawal", "bid", "auction_win"],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true, // Set to true when the wallet is active
    },
  },
  { timestamps: true }
);

export const Wallet = mongoose.model("Wallet", walletSchema);
