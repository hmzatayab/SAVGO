import express from "express";
import { adminRegister, adminLogin, getProfile, getAllUsersData, adminLogout } from "../controllers/admin.controller.js";
import {adminAuthenticate} from "../Middleware/admin.auth.middleware.js"

const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.get("/logout", adminLogout);
router.get("/profile", adminAuthenticate, getProfile);

router.get("/api/users", adminAuthenticate, getAllUsersData)

export default router;
