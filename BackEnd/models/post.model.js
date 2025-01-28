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
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  tags: [
    {
      type: String,
      default: []
    },
  ],
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
