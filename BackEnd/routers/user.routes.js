import express from "express";
import { userRegister, userLogin } from "../controllers/user.controller.js";

const router = express();

router.post('/register', userRegister);
router.post('/login', userLogin);

export default router;