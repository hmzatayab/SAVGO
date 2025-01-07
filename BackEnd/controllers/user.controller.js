const { validationResult } = require("express-validator");
const userModle = require("../Modules/user.modle");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register user
async function register(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors,
      message: "Invalid Value",
    });
  }

  const { name, username, email, password, image } = req.body;

  const imageUrl = image || "https://via.placeholder.com/150";

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const user = await userModle.create({
      username,
      name,
      email,
      password: hashPassword,
      image: imageUrl,
    });

    // Send success response
    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// Login user
async function login(req, res) {
  try {
    const errors = validationResult(req);

    // Handle validation errors
    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        error: "Invalid input values. Please try again.",
      });
    }

    const { username, password } = req.body;

    // Find user
    const user = await userModle.findOne({ username });
    if (!user) {
      return res.status(400).render("login", {
        error: "Invalid username or password.",
      });
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render("login", {
        error: "Invalid username or password.",
      });
    }

    // JWT Token Create
    const token = jwt.sign(
      {
        userid: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token);
    res.redirect("/");
  } catch (e) {
    console.error(e);
    res.status(500).render({
      error: "Something went wrong on the server.",
    });
  }
}

module.exports = { register, login };
