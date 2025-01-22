import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    postData: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
  });
  
export default mongoose.model("post", postSchema);
