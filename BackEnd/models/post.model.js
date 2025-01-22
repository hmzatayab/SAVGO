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
    image: String
  },
  date: {
    type: Date,
    default: Date.now,
  },
  like: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  imageURL: { type: String },
});

export default mongoose.model("post", postSchema);
