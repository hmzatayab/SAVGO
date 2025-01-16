import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";

export const userRegister = async (req, res) => {
  const { username, name, email, password, image } = req.body;

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
      image,
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    
    res.cookie("token", token, {
      httpOnly: true,
    });


    res.status(200).json({ 
        token,
        ...user._doc,
        password: null,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}
