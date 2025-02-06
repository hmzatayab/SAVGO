import { Wallet } from "../models/wallet.model.js";
import User from "../models/user.model.js";

// Deposit Funds
export const depositFunds = async (req, res) => {
  try {
    let { amount } = req.body; // amount from the request body
    const userId = req.user.id;

    // Ensure the amount is a number
    amount = Number(amount);

    // Check if the amount is a valid number and greater than zero
    if (isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({
          message: "Deposit amount must be a valid number greater than zero.",
        });
    }

    let wallet = await Wallet.findOne({ user: userId });

    // If wallet doesn't exist or is inactive
    if (!wallet || !wallet.isActive) {
      return res
        .status(400)
        .json({ message: "Wallet is inactive. Cannot deposit." });
    }

    // Add the amount to the wallet's balance
    wallet.balance += amount;
    await wallet.save();

    res.status(200).json({
      message: "Funds deposited successfully",
      balance: wallet.balance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Withdraw Funds
export const withdrawFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    let wallet = await Wallet.findOne({ user: userId });

    if (!wallet || !wallet.isActive) {
      return res
        .status(400)
        .json({ message: "Wallet is inactive. Cannot withdraw." });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    wallet.balance -= amount;
    await wallet.save();

    res.status(200).json({
      message: "Funds withdrawn successfully",
      balance: wallet.balance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Wallet Balance
export const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    let wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found." });
    }

    res.status(200).json({ balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
