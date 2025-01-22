import express from "express";
import { authenticate } from "../Middleware/auth.middleware.js";
import { imageUpload, followUser, getUserFollowers, getUserFollowing } from "../controllers/profile.controller.js";
import {upload} from "../utils/multerConfig.js";

const router = express();

router.post("/upload", authenticate, upload.single("imageUpload"), imageUpload);
router.post('/follow', authenticate, followUser);
router.get('/:userId/followers', getUserFollowers);
router.get('/:userId/following', getUserFollowing);


export default router;