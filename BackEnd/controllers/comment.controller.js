import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import mongoose from "mongoose";

// ✅ Add a new comment on a post
export const addComment = async (req, res) => {
    try {
      const { postId } = req.params; // Post ID from URL params
      const { text } = req.body; // Comment text from request body
      const userId = req.user.id; // User ID from JWT
  
      // Check if post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Create new comment
      const newComment = new Comment({
        post: postId,
        user: userId,
        text,
      });
  
      await newComment.save(); // Save comment to DB
  
      // Populate the `user` field
      const populatedComment = await Comment.findById(newComment._id).populate(
        "user",
        "name image"
      );
  
      // Add comment ID to the post's comments array
      post.comments.push(newComment._id);
      await post.save(); // Save updated post
  
      res.status(201).json({
        message: "Comment added successfully",
        newComment: populatedComment,
      });
    } catch (error) {
      console.error("Error in addComment:", error);
      res.status(500).json({ message: error.message });
    }
  };

// ✅ Get all comments for a post
export const getComments = async (req, res) => {
    try {
      const { postId } = req.params;
  
      // Fetch comments and populate user data for both comments and replies
      const comments = await Comment.find({ post: postId })
        .populate("user", "name image") // Populate user for parent comments
        .populate({
          path: "replies.user", // Populate user for replies
          select: "name image",
        });
  
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// ✅ Like a comment
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes.pull(userId); // Unlike
    } else {
      comment.likes.push(userId); // Like
    }

    await comment.save();
    res.status(200).json({ message: "Success", likes: comment.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add a reply to a comment
export const addReply = async (req, res) => {
  try {
    const { text } = req.body;
    const { commentId } = req.params;

    const userId = req.user?.id || req.user?._id; // ✅ Fixing User ID retrieval

    if (!text) {
      return res.status(400).json({ message: "Reply cannot be empty" });
    }

    // **Comment exist karta hai ya nahi?**
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // ✅ **Ensure userId is a valid ObjectId**
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid User ID:", userId); // ✅ Debugging
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // **Reply object create karo**
    const reply = {
      user: new mongoose.Types.ObjectId(userId), // ✅ Convert to ObjectId
      text,
    };

    // **Comment ke replies array me push karo**
    comment.replies.push(reply);
    await comment.save(); // **Comment ko update karke save karo**

    res.status(201).json({ message: "Reply added successfully", reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Like a reply on a comment
export const likeReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const alreadyLiked = reply.likes.includes(userId);

    if (alreadyLiked) {
      reply.likes.pull(userId); // Unlike reply
    } else {
      reply.likes.push(userId); // Like reply
    }

    await comment.save();
    res.status(200).json({ message: "Success", likes: reply.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





