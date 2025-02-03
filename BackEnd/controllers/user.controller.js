import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";


export const userRegister = async (req, res) => {
  const { username, name, email, password } = req.body;

  try {
    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      username,
      name,
      email,
      password: hashPassword,
      image:
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    });

    await user.save();

    res.status(201).json({
      ...user._doc,
      password: null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const userLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Both fields are required" });
    }

    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        image: user.image,
        followers: user.followers,
        following: user.following,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const userUpdate = async (req, res) => {
  try {
    const { name, bio } = req.body;
    let imageUrl = req.body.image; // Fallback if image isn't uploaded

    if (req.file) {
      // If image is uploaded, generate the permanent URL
      imageUrl = `${req.protocol}://${req.get("host")}/Images/Uploads/${req.file.filename}`; // Save relative path
    }

    // Update the user's profile with the image URL
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      { name, bio, image: imageUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return updated user profile with image URL
    res.status(200).json({
      success: true,
      message: "Successfully Updated",
      updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const userLogout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password"); // Exclude password from response

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllUser = async (req, res) => {
  const user = await userModel.find();
  res.status(200).json({ success: true, user });
};

export const getAllpost = async (req, res) => {
  try {
    const users = await userModel.find().populate("posts").select("-password");
    const allPosts = [];

    users.forEach((user) => {
      user.posts.forEach((post) => {
        post.imageURL = `${req.protocol}://${req.get("host")}/Images/Uploads/${
          post.postData
        }`;
        post.userData = {
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
          userID: user._id,
          followers: user.followers,
          following: user.following,
        };
        allPosts.push(post); // Collect each post
      });
    });

    res.status(200).json({ success: true, posts: allPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching posts",
    });
  }
};

export const getUserAllPost = async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "User not authenticated" });
  }
  const post = await userModel
    .findById(req.user.id)
    .populate("posts")
    .select("-password");
  post.posts.forEach((post) => {
    post.imageURL = `${req.protocol}://${req.get("host")}/Images/Uploads/${
      post.postData
    }`;
  });

  res.status(200).json({ success: true, post });
};
