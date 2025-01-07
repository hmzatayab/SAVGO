const express = require("express");
const { body } = require("express-validator");
const Route = express.Router();
const userModle = require("../Modules/user.modle");
const jwt = require("jsonwebtoken");
const { register, login } = require("../controllers/user.controller");

// Register Route
Route.get("/register", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    res.redirect("/");
  }
  res.render("Register");
});

Route.post( "/register",
  body("email").trim().isEmail().isLength({ min: 13 }),
  body("username").trim().isLength({ max: 15 }),
  body("name").isLength({ max: 15 }),
  body("password").trim().isLength({ min: 8 }),
  register
);

// Login Route
Route.get("/login", (req, res) => {
  const token = req.cookies.token;
  if (token) {
   return res.redirect("/");
  }
  res.render("login", { error: null });
});

Route.post(
  "/login",
  body("username").trim().isLength({ min: 5 }),
  body("password").trim().isLength({ min: 8 }),
  login
);

// Profile Edit
Route.get("/edit", async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.username;
  const user = await userModle.findOne({ username: userId });

  res.render("editProfile", { users: user });
});

Route.post("/edit", async (req, res) => {
  const { username, name, email, image } = req.body;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.username;
  await userModle.findOneAndUpdate(
    { username: userId },
    { username, name, email, image },
    { new: true }
  );
  res.redirect("/profile");
});

// Delete Route
Route.get("/delete", async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.username;
  const result = await userModle.findOneAndDelete({ username: userId });

  // Check if user was deleted
  if (!result) {
    return res.status(404).send("User not found");
  }

  res.clearCookie("token");
  res.redirect("/");
});

// Logout
Route.get("/logout", async (req, res) => {
  await res.clearCookie("token");
  res.redirect("/");
});

module.exports = Route;
