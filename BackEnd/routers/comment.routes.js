import express from "express";
import { authenticate } from "../Middleware/auth.middleware.js";
import { addComment, getComments, likeComment, addReply, likeReply } from "../controllers/comment.controller.js";

const router = express();

router.post("/:postId", authenticate, addComment); // ✅ Add a new comment on a post
router.get("/:postId", getComments); // ✅ Get all comments for a post
router.put("/like/:commentId", authenticate, likeComment); // ✅ Like a comment

router.post("/reply/:commentId", authenticate, addReply); // ✅ Add a reply to a comment
router.put("/reply/like/:commentId/:replyId", authenticate, likeReply); // ✅ Like a reply on a comment

export default router;