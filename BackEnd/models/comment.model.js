import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    trim: true,
    maxlength: [200, "Comment cannot exceed 200 characters"],
    required: [true, "Comment is required"],
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replies: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        trim: true,
        maxlength: [200, "Reply cannot exceed 200 characters"],
        required: [true, "Reply is required"],
      },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Comment", commentSchema);
