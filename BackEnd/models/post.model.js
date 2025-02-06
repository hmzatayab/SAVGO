import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  postData: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userData: {
    name: String,
    username: String,
    email: String,
    image: String,
    userID: String,
    followers: Array,
    following: Array,
  },
  title: {
    type: String,
    trim: true,
    minlength: [15, "Title must be at least 15 characters"],
    maxlength: [25, "Title cannot exceed 25 characters"],
    required: [true, "Title is required"],
    default: "",
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Description is required"],
    validate: {
      validator: function (value) {
        const charCount = value.length; // Count characters in description
        return charCount >= 100 && charCount <= 250; // Between 100 and 250 characters
      },
      message: "Description must be between 100 and 250 characters",
    },
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  isLikedByCurrentUser: {
    type: Boolean,
    default: false,
  },
  imageURL: { type: String },
  isAuctioned: {
    type: Boolean,
    default: false,
  },
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    default: null,
  }
});

export default mongoose.model("post", postSchema);
