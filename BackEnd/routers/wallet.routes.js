import express from "express";
import { depositFunds, withdrawFunds, getWalletBalance } from "../controllers/wallet.controller.js";
import { authenticate } from "../Middleware/auth.middleware.js";

const router = express.Router();

// Wallet Routes
router.post("/deposit", authenticate, depositFunds); // Deposit funds
router.post("/withdraw", authenticate, withdrawFunds); // Withdraw funds
router.get("/balance", authenticate, getWalletBalance); // Get wallet balance

export default router;
