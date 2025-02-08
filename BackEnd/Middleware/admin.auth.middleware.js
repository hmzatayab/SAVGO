import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const adminAuthenticate = async (req, res, next) => {    
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    const admin = await Admin.findById(decoded.id); // Find the user by ID in the token

    if (!decoded || !decoded.id) {
        return res.status(400).json({ success: false, message: "Invalid token structure" });
      }

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.admin = { id: admin._id, username: admin.name }; 
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};