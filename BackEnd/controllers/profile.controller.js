import userModel from "../models/user.model.js";
import postModel from "../models/post.model.js";

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
