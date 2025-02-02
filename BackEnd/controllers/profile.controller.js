import userModel from "../models/user.model.js";
import postModel from "../models/post.model.js";
import mongoose from "mongoose";

export const imageUpload = async (req, res) => {
  const { title, description, tags } = req.body;
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    let post = await postModel.create({
      postData: req.file.filename,
      user: user._id,
      title,
      description,
      tags,
    });

    user.posts.push(post._id);
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
  }
};

export const followUser = async (req, res) => {
  const { userId, targetId } = req.body;

  // Self-following check
  if (userId === targetId) {
    return res.status(400).json({ message: "You cannot follow yourself!" });
  }

  try {
    const user = await userModel.findById(userId);
    const targetUser = await userModel.findById(targetId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isFollowing = user.following.includes(targetId);

    if (isFollowing) {
      // Unfollow logic
      user.following = user.following.filter(
        (id) => id.toString() !== targetId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Follow logic
      user.following.push(targetId);
      targetUser.followers.push(userId);
    }

    // Save both users
    await user.save();
    await targetUser.save();

    res.status(200).json({
      message: isFollowing
        ? "Unfollowed successfully!"
        : "Followed successfully!",
      user: {
        following: user.following,
        followers: targetUser.followers,
      },
    });
  } catch (error) {
    console.error(error); // Console mein error log karna useful hoga
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getUserFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel
      .findById(userId)
      .populate("followers", "name email username posts followers image"); // Populate followers

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

    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const userId = req.user.id; // Logged-in user's ID
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Find the index of user ID in the likes array
    const userIndex = post.likes.indexOf(user._id);

    if (userIndex === -1) {
      // If user ID is not found, add it (like)
      post.likes.push(user._id);

      // Add the post to the user's wishlist
      if (!user.wishlist.includes(post._id)) {
        user.wishlist.push(post._id);
      }
    } else {
      // If user ID is found, remove it (unlike)
      post.likes.splice(userIndex, 1);

      // Remove the post from the user's wishlist
      user.wishlist = user.wishlist.filter(
        (wishlistPostId) => wishlistPostId.toString() !== post._id.toString()
      );
    }

    await post.save();
    await user.save();

    const isLikedByCurrentUser = post.likes.includes(user._id);

    // Respond with updated data
    res.status(200).json({
      message: "Post liked/unliked successfully",
      post: {
        _id: post._id,
        postData: post.postData,
        user: post.user,
        likes: post.likes,
        isLikedByCurrentUser,
        date: post.date,
      },
      wishlist: user.wishlist, // Include updated wishlist in response
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .populate({
        path: "wishlist",
        populate: {
          path: "user", // Wishlist ke andar jo user hai usko populate karega
          select: "username email image name followers", // Jo fields chahiye unko select karein
        },
      })
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // User ke wishlist ke andar user image aur post image URL modify karna
    user.wishlist = user.wishlist.map((item) => {
      // Post image URL
      if (item.postData) {
        item.imageURL = `${req.protocol}://${req.get("host")}/Images/Uploads/${item.postData}`;
      }

      return item;
    });

    return res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred.", error });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await userModel
      .findOne({ username: req.params.username })
      .populate("posts")
      .select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    // Add image URLs to each post
    user.posts = user.posts.map((post) => {
      post.imageURL = `${req.protocol}://${req.get("host")}/Images/Uploads/${
        post.postData
      }`;
      return post;
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const postOpen = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id).populate("user").select("-password");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.imageURL = `${req.protocol}://${req.get("host")}/Images/Uploads/${post.postData}`;

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
