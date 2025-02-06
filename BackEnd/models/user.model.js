import mongoose from "mongoose";
import { Wallet } from "../models/wallet.model.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [4, "Username must be at least 4 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [4, "Name must be at least 4 characters"],
      maxlength: [30, "Name cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [100, "Email cannot exceed 100 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [100, "Password cannot exceed 100 characters"],
    },
    image: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [160, "Bio cannot exceed 160 characters"],
      default: "",
    },
    totalImagesSold: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
    auctionBids: [
      {
        auction: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auction",
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
    auctionsWon: [
      {
        auction: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auction",
        },
        finalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
