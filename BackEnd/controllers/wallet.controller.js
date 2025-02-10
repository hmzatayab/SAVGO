import { Wallet } from "../models/wallet.model.js";
import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import Notification from "../models/notification.model.js";

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

    const transaction = new Transaction({
      wallet: wallet._id,
      amount,
      type: "deposit",
      status: "completed",
    });

    await transaction.save();

    wallet.transactions.push(transaction._id);
    await wallet.save();

    // 📌 **SEND NOTIFICATION TO USER**
    const notification = new Notification({
      receiver: userId,
      sender: userId, 
      type: "deposit",
      link: "http://localhost:5173/wallet",
      message: `Your deposit of $${amount} was successful.`,
    });
    await notification.save();

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

    const transaction = new Transaction({
      wallet: wallet._id,
      amount,
      type: "withdraw",
      status: "completed",
    });

    await transaction.save();

    wallet.transactions.push(transaction._id);
    await wallet.save();

    // 📌 **SEND NOTIFICATION TO USER**
    const notification = new Notification({
      receiver: userId,
      sender: userId, // Self-generated notification
      type: "withdraw",
      link: "http://localhost:5173/wallet",
      message: `Your withdrawal of $${amount} was successful.`,
    });
    await notification.save();

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

    const transaction = new Transaction({
      wallet: senderWallet._id,
      recipientWallet: recipientWallet._id,
      amount,
      type: "transfer",
      status: "completed",
    });

    await transaction.save();

    senderWallet.transactions.push(transaction._id);
    recipientWallet.transactions.push(transaction._id);

    await senderWallet.save();
    await recipientWallet.save();

    // 📌 **SEND NOTIFICATION TO SENDER**
    const senderNotification = new Notification({
      receiver: senderId,
      sender: senderId,
      type: "transfer",
      link: "http://localhost:5173/wallet",
      message: `You sent $${amount} to ${recipientUser.name}.`,
    });
    await senderNotification.save();

    // 📌 **SEND NOTIFICATION TO RECIPIENT**
    const recipientNotification = new Notification({
      receiver: recipient,
      sender: senderId, // Sender's ID
      type: "transfer",
      link: "http://localhost:5173/wallet",
      message: `You received $${amount} from ${req.user.username}.`,
    });
    await recipientNotification.save();    

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

export const getWalletTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    // User ka wallet find karo
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found." });
    }

    // Transactions fetch with full population
    const transactions = await Transaction.find({ wallet: wallet._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "wallet",
        populate: {
          path: "user",
          select: "name image", // Sirf required fields
        },
      })
      .populate({
        path: "recipientWallet",
        populate: {
          path: "user",
          select: "name image", // Recipient user ka data bhi milega
        },
      });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error in getWalletTransactions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTransactionInvoice = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId)
      .populate({
        path: "wallet",
        populate: {
          path: "user",
          select: "name image", // User ke name aur image fetch kar raha h
        },
      })
      .populate({
        path: "recipientWallet",
        populate: {
          path: "user",
          select: "name image", // Recipient user ka bhi name aur image fetch karega
        },
      });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ message: "Server error" });
  }
};
