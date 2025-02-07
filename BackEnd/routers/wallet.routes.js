import express from "express";
import { depositFunds, withdrawFunds, getWalletBalance, transferFunds, getWalletTransactions } from "../controllers/wallet.controller.js";
import { authenticate } from "../Middleware/auth.middleware.js";

const router = express.Router();

// Wallet Routes
router.post("/deposit", authenticate, depositFunds); // Deposit funds
router.post("/withdraw", authenticate, withdrawFunds); // Withdraw funds
router.post("/transfer", authenticate, transferFunds); // Withdraw funds
router.get("/balance", authenticate, getWalletBalance); // Get wallet balance


router.get("/transaction", authenticate, getWalletTransactions); // Get wallet transactions

export default router;
