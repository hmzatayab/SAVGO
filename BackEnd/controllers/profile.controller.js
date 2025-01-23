import userModel from "../models/user.model.js";
import postModel from "../models/post.model.js";
import mongoose from 'mongoose';


export const imageUpload = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    let post = await postModel.create({
      postData: req.file.filename,
      user: user._id,
    });

    user.posts.push(post._id);
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
  }
};

export const followUser = async (req, res) => {
  try {
    const { targetId } = req.body;

    // Validation: Ensure both users exist
    const user = await userModel.findById(req.user.id).select("-password");
    const targetUser = await userModel.findById(targetId).select("-password");

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (targetUser.followers.indexOf(user._id) === -1) {
      // Add follow
      targetUser.followers.push(user._id);
      user.following.push(targetId);
    } else {
      // Remove follow
      targetUser.followers.splice(targetUser.followers.indexOf(user._id), 1);
      user.following.splice(user.following.indexOf(targetId), 1);
    }

    await targetUser.save();
    await user.save();

    return res.status(200).json({
      message:
        targetUser.followers.indexOf(user._id) === -1
          ? "User unfollowed successfully."
          : "User followed successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred.", error });
  }
};

export const getUserFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel
      .findById(userId)
      .populate("followers", "name email"); // Populate followers

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ followers: user.followers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

export const getUserFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel
      .findById(userId)
      .populate("following", "name email"); // Populate following

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ following: user.following });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Get user
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find post
    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Add like logic (example)
    if (!post.likes.includes(user._id)) {
      post.likes.push(user._id);
    } else {
      post.likes = post.likes.filter((like) => !like.equals(user._id));
    }

    await post.save();
    res.status(200).json({ message: "Post liked/unliked successfully", post });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
