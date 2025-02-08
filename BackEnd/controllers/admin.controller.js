import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const adminRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await Admin.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      name,
      email,
      password: hashPassword,
      image:
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    });

    await admin.save();

    res.status(201).json({
      ...admin._doc,
      password: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Both fields are required" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin does not exist" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      token,
      admin: {
        ...admin._doc,
      password: null,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getProfile = async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select("-password");
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }
  res.json(admin);
};

export const getAllUsersData = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // ✅ Password hata diya for security
      .populate({
        path: "wallet",
        populate: {
          path: "transactions", // ✅ Wallet ke andar Transactions bhi populate
          model: "Transaction",
        },
      })
      .populate({
        path: "posts",
        populate: [
          {
            path: "user", // ✅ Post ka user populate hoga
            select: "name image",
          },
          {
            path: "comments", // ✅ Post ke andar comments bhi populate
            populate: {
              path: "user", // ✅ Comment ka user bhi populate
              select: "name image",
            },
          },
        ],
      })
      .populate("followers", "name image") // ✅ Followers ka sirf name, image milega
      .populate("following", "name image") // ✅ Following ka bhi sirf name, image milega
      .populate("wishlist"); // ✅ Wishlist ki saari details bhi aayengi

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const adminLogout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};
