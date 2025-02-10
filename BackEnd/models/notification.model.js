import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Who triggered the notification
      required: true,
    },
    type: {
      type: String,
      enum: ["message", "follow", "like", "comment", "mention", "other", "withdraw", "deposit", "transfer"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String, // Optional link for redirection
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false, // Unread by default
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
