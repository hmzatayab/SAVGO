import mongoose from "mongoose";
import { type } from "os";

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
    followers: String,
    following: String,
  },
  title: {
    type: String,
    trim: true,
    minlength: [15, "Title must be at least 15 characters"],
    maxlength: [25, "Title cannot exceed 25 characters"],
    required: [true, "Title is required"],
    default: ""
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Description is required"],
    validate: {
      validator: function (value) {
        return value.split(" ").length <= 30;
      },
      message: "Description cannot exceed 30 words",
    },
    default: ""
  },
  tags: {
    type: [
      {
        type: String,
        trim: true,
      },
    ],
    validate: {
      validator: function (value) {
        return value.length <= 10;
      },
      message: "You can add a maximum of 10 tags",
    },
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
  isLikedByCurrentUser :{
    type: Boolean,
    default: false
  },
  imageURL: { type: String },
});

export default mongoose.model("post", postSchema);
