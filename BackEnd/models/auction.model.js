import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
    {
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true,
      },
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      startingPrice: {
        type: Number,
        required: true,
      },
      highestBid: {
        type: Number,
        default: 0,
      },
      highestBidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      bids: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
      startTime: {
        type: Date,
        default: Date.now,
      },
      endTime: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["active", "ended"],
        default: "active",
      },
    },
    { timestamps: true }
  );

  export const Auction = mongoose.model("Auction", auctionSchema);