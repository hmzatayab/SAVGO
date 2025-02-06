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
      return res.status(400).json({
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

// Transfer Funds API
export const transferFunds = async (req, res) => {
  try {
    const { amount, recipient } = req.body;
    const senderId = req.user.id;

    // Ensure that the amount is a number and greater than 0
    const transferAmount = Number(amount);
    if (transferAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Transfer amount must be greater than zero." });
    }

    // Find sender wallet and recipient wallet
    let senderWallet = await Wallet.findOne({ user: senderId });
    let recipientUser = await User.findById(recipient); // Find recipient by ID
    if (!recipientUser) {
      return res.status(400).json({ message: "Recipient not found." });
    }
    let recipientWallet = await Wallet.findOne({ user: recipient });

    if (!senderWallet || !recipientWallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (senderWallet.balance < transferAmount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance to complete the transfer." });
    }

    // Perform the transfer by updating the wallet balances
    senderWallet.balance = senderWallet.balance - transferAmount;
    recipientWallet.balance = recipientWallet.balance + transferAmount;

    // Save the wallets after transferring
    await senderWallet.save();
    await recipientWallet.save();

    // // Notify users
    // const senderMessage = `You have transferred ${amount} to ${recipientWallet.user.username}.`;
    // const recipientMessage = `You have received ${amount} from ${senderWallet.user.username}.`;

    // await createNotification(senderId, "TRANSFER", senderMessage);
    // await createNotification(recipient, "TRANSFER", recipientMessage);

    res.status(200).json({
      message: "Transfer Successful!",
      senderBalance: senderWallet.balance,
      recipientBalance: recipientWallet.balance,
    });
  } catch (error) {
    console.error("Error in transferFunds:", error); // Log the error to console
    res.status(500).json({ message: "Server error", error: error.message }); // Include actual error message
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
