import express from "express";
import { userRegister, userLogin, userUpdate, getUserProfile, getAllUser, getUserAllPost, userLogout, getAllpost } from "../controllers/user.controller.js";
import { authenticate } from "../Middleware/auth.middleware.js";
import {upload} from "../utils/multerConfig.js";

const router = express();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/update", authenticate, upload.single("imageUpload"), userUpdate);
router.get("/profile", authenticate, getUserProfile);
router.get("/users", authenticate, getAllUser)
router.get("/posts", authenticate, getUserAllPost)
router.get("/all-posts", getAllpost)
router.get("/logout", userLogout);
export default router;
