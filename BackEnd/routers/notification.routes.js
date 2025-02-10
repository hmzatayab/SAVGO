import express from "express";
import { getNotification, notificationRead, createNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/:userId", getNotification);
router.put("/:notificationId/read", notificationRead);
router.post("/", createNotification);

export default router;
