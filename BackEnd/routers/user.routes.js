import express from "express";
import { userRegister, userLogin, userUpdate, getUserProfile, } from "../controllers/user.controller.js";
import { authenticate } from "../Middleware/auth.middleware.js";

const router = express();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/update", authenticate, userUpdate);
router.get("/profile", authenticate, getUserProfile);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
});

export default router;
