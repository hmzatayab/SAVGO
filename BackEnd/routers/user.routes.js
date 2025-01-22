import express from "express";
import { userRegister, userLogin, userUpdate, getUserProfile, getAllUser, getUserAllPost, userLogout, getAllpost } from "../controllers/user.controller.js";
import { authenticate } from "../Middleware/auth.middleware.js";

const router = express();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/update", authenticate, userUpdate);
router.get("/profile", authenticate, getUserProfile);
router.get("/users", authenticate, getAllUser)
router.get("/posts", authenticate, getUserAllPost)
router.get("/all-posts", getAllpost)
router.get("/logout", userLogout);
export default router;
