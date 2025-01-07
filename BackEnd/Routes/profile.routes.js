const express = require("express");
const Route = express.Router();
const userModle = require("../Modules/user.modle");
const postModle = require("../Modules/post.modle");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authMiddleware");
const upload = require("../utils/multerConfig");

// Profile Route
Route.get("/", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/user/login");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.username;
  const user = await userModle
    .findOne({ username: userId }, "username image name email posts")
    .populate("posts");
  let isTokenPresent = token ? true : false;

  res.render("dashboard", { isTokenPresent, tokenTrue: true, users: user });
});

// Upload Image Routes
Route.get("/upload", authenticate, (req, res) => {
  res.render("upload");
});

Route.post("/upload", upload.single("imageUpload"), async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.username;
  const user = await userModle.findOne({ username: userId });
  let post = await postModle.create({
    postData: req.file.filename,
    user: user._id,
  });

  user.posts.push(post._id);
  await user.save();

  res.redirect("/profile");
});

// Delete Post
Route.get("/delete/post/:id", authenticate, async (req, res) => {
  try {
    const postId = req.params.id;

    // Delete the post
    const deletedPost = await postModle.findOneAndDelete({ _id: postId });

    if (deletedPost) {
      // Remove post ID from the user's posts array
      await userModle.findByIdAndUpdate(deletedPost.user, {
        $pull: { posts: postId },
      });
    }

    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error deleting post" });
  }
});


Route.get("/like/:id", async (req, res) => {
  try {
    // Validate the token
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/user/login'); // Redirect to login if no token
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.username;

    // Find the user
    const user = await userModle.findOne({ username: userId });
    if (!user) {
      return res.redirect('/user/login'); // Redirect if user not found
    }

    // Find the post and check if it exists
    const post = await postModle.findOne({ _id: req.params.id });
    if (!post) {
      return res.status(404).send("Post not found"); // Handle missing post
    }

    // Handle like/unlike logic
    if (post.like.indexOf(user._id) === -1) {
      post.like.push(user._id); // Add like
    } else {
      post.like.splice(post.like.indexOf(user._id), 1); // Remove like
    }

    // Save the post and redirect
    await post.save();
    res.redirect('/');
  } catch (err) {
    console.error(err); // Log errors
    res.status(500).send("An error occurred while processing your request.");
  }
});


module.exports = Route;
