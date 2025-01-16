import express from "express";
import { userRegister, userLogin } from "../controllers/user.controller.js";

const router = express();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/logout', (req, res) =>{
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out' });
});


export default router;