import { Auction } from "../models/auction.model.js";
import Post from "../models/post.model.js";
import { Wallet } from "../models/wallet.model.js";
import Notification from "../models/notification.model.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

// Create an auction
export const createAuction = async (req, res) => {
  try {
    const { post, startingPrice } = req.body;
    const sellerId = req.user?.id;

    if (!sellerId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // ✅ Check if post exists & belongs to user
    const existingPost = await Post.findById(post).populate("user");
    if (
      !existingPost ||
      !existingPost.user ||
      existingPost.user._id.toString() !== sellerId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You can only create an auction for your own post" });
    }

    // ✅ Check eligibility (5 likes & 1 comment required)
    if (existingPost.likes.length < 5 || existingPost.comments.length < 1) {
      return res.status(400).json({
        message: "You need at least 5 likes and 1 comment to start an auction",
      });
    }

    // ✅ Find the seller's wallet
    let wallet = await Wallet.findOne({ user: sellerId });

    if (!wallet || !wallet.isActive) {
      return res
        .status(400)
        .json({ message: "Wallet is inactive. Cannot start auction." });
    }

    if (wallet.balance < startingPrice) {
      return res
        .status(400)
        .json({ message: "Insufficient balance to start auction." });
    }

    // ✅ Deduct starting price from wallet
    wallet.balance -= startingPrice;
    await wallet.save();

    // ✅ Create transaction record
    const transaction = new Transaction({
      wallet: wallet._id,
      amount: startingPrice,
      type: "withdraw",
      status: "completed",
    });

    await transaction.save();
    wallet.transactions.push(transaction._id);
    await wallet.save();

    // ✅ Create Auction
    const newAuction = new Auction({
      post,
      seller: sellerId,
      startingPrice,
    });

    await newAuction.save();

    // ✅ **Update Post Model**
    existingPost.isAuctioned = true;
    existingPost.auctionId = newAuction._id;
    existingPost.winner = null;
    await existingPost.save();

    // ✅ Schedule auction completion (2 minutes)
    setTimeout(async () => {
      try {
        console.log(`Auction timeout triggered for auction: ${newAuction._id}`); // Debugging

        // ✅ Fresh auction data fetch karo
        const auction = await Auction.findById(newAuction._id)
          .populate("highestBidder")
          .populate({
            path: "bids",
            populate: { path: "user", select: "_id" },
          });

        if (!auction) {
          console.log("Auction not found!");
          return;
        }

        if (auction.highestBidder) {
          // ✅ Update post winner
          existingPost.winner = auction.highestBidder._id;
          existingPost.isAuctioned = false; // ✅ Auction completed, reset post status
          await existingPost.save();

          // ✅ Notify Winner
          const winnerNotification = new Notification({
            receiver: auction.highestBidder._id,
            sender: sellerId,
            type: "auction-win",
            link: `http://localhost:5173/auction/${newAuction._id}`,
            message: `🎉 Congratulations! You won the auction for the post "${existingPost.title}".`,
          });
          await winnerNotification.save();
        } else {
          // ✅ If no winner, reset auction status
          existingPost.isAuctioned = false;
          await existingPost.save();
        }

        // ✅ Notify All Other Bidders
        const bidderIds = auction.bids.map((bid) => bid.user._id.toString());
        const uniqueBidders = [...new Set(bidderIds)];

        for (const bidderId of uniqueBidders) {
          if (
            auction.highestBidder &&
            bidderId !== auction.highestBidder._id.toString()
          ) {
            const notification = new Notification({
              receiver: bidderId,
              sender: sellerId,
              type: "auction-lost",
              link: `http://localhost:5173/auction/${newAuction._id}`,
              message: `🛑 Auction ended. You lost the bid on "${existingPost.title}". Thanks for participating!`,
            });
            await notification.save();
          }
        }

        // ✅ Mark auction as completed
        auction.status = "completed";
        await auction.save();
        console.log(`Auction ${newAuction._id} marked as completed.`);
      } catch (err) {
        console.error("Error completing auction:", err);
      }
    }, 600 * 1000); // ✅ 2 minutes (120,000 milliseconds) for testing

    // ✅ Send Notification to User
    const notification = new Notification({
      receiver: sellerId,
      sender: sellerId,
      type: "auction",
      link: `http://localhost:5173/auction/${newAuction._id}`,
      message: `Your auction has been created successfully, and $${startingPrice} has been deducted from your wallet.`,
    });

    await notification.save();

    res.status(201).json({
      message: "Auction created successfully, and amount deducted from wallet",
      auction: newAuction,
      balance: wallet.balance,
    });
  } catch (error) {
    console.error("Error in createAuction:", error);
    res.status(500).json({ message: error.message });
  }
};

export const placeBid = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { bidAmount } = req.body;
    const bidderId = req.user?.id;

    if (!bidderId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // ✅ Check if auction exists
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // ✅ Check if auction is active
    if (auction.status !== "active") {
      return res.status(400).json({ message: "Auction is not active" });
    }

    // ✅ Bid amount should be higher than current highest bid
    if (bidAmount <= auction.highestBid) {
      return res
        .status(400)
        .json({ message: "Bid must be higher than current highest bid" });
    }

    // ✅ Check bidder's wallet
    let wallet = await Wallet.findOne({ user: bidderId });
    if (!wallet || !wallet.isActive) {
      return res
        .status(400)
        .json({ message: "Wallet is inactive. Cannot place bid." });
    }

    if (wallet.balance < bidAmount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance to place bid." });
    }

    // ✅ Refund previous highest bidder
    if (auction.highestBidder) {
      let prevBidderWallet = await Wallet.findOne({
        user: auction.highestBidder,
      });

      if (prevBidderWallet) {
        prevBidderWallet.balance += auction.highestBid; // Refund previous bid amount
        await prevBidderWallet.save();

        // ✅ **Create refund transaction**
        const refundTransaction = new Transaction({
          wallet: prevBidderWallet._id,
          amount: auction.highestBid,
          type: "refund",
          status: "completed",
        });

        await refundTransaction.save();
        prevBidderWallet.transactions.push(refundTransaction._id);
        await prevBidderWallet.save();

        // 📌 **Notify previous highest bidder about refund**
        const refundNotification = new Notification({
          receiver: auction.highestBidder,
          sender: auction.seller,
          type: "bid-refund",
          message: `Your previous bid of $${auction.highestBid} has been refunded and deposited back into your wallet.`,
        });

        await refundNotification.save();
      }
    }

    // ✅ Deduct bid amount from new bidder's wallet
    wallet.balance -= bidAmount;
    await wallet.save();

    // ✅ Create transaction for bid deduction
    const transaction = new Transaction({
      wallet: wallet._id,
      amount: bidAmount,
      type: "bid",
      status: "completed",
    });

    await transaction.save();
    wallet.transactions.push(transaction._id);
    await wallet.save();

    // ✅ Update Auction with new highest bid
    auction.highestBid = bidAmount;
    auction.highestBidder = bidderId;
    auction.bids.push({ user: bidderId, amount: bidAmount });
    await auction.save();

    // ✅ Notify auction owner
    const ownerNotification = new Notification({
      receiver: auction.seller,
      sender: bidderId,
      type: "bid",
      message: `A new bid of $${bidAmount} has been placed on your auction.`,
    });

    await ownerNotification.save();

    // ✅ Notify bidder
    const bidderNotification = new Notification({
      receiver: bidderId,
      sender: auction.seller,
      type: "bid-success",
      message: `Your bid of $${bidAmount} has been placed successfully.`,
    });

    await bidderNotification.save();

    res.status(200).json({
      message: "Bid placed successfully",
      auction,
      balance: wallet.balance,
    });
  } catch (error) {
    console.error("Error in placeBid:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getActiveAuctions = async (req, res) => {
  try {
    // ✅ Fetch only active auctions
    const activeAuctions = await Auction.find({ status: "active" })
      .populate("post seller highestBidder bids.user")
      .sort({ createdAt: -1 }); // Sorting by latest auctions

    res.status(200).json({
      success: true,
      count: activeAuctions.length,
      auctions: activeAuctions,
    });
  } catch (error) {
    console.error("Error fetching active auctions:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAuctionDetails = async (req, res) => {
  try {
    const { auctionId } = req.params;

    // ✅ Check if auction exists
    const auction = await Auction.findById(auctionId)
      .populate("post seller highestBidder bids.user")
      .lean();

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    res.status(200).json({
      success: true,
      auction,
    });
  } catch (error) {
    console.error("Error fetching auction details:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const endAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const userId = req.user.id; // Seller ID

    const system = "67a89173b0193bc494b2392a";

    // ✅ Find auction
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // ✅ Only seller can end the auction
    if (auction.seller.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to end this auction" });
    }

    // ✅ Check if already ended
    if (auction.status === "ended") {
      return res.status(400).json({ message: "Auction already ended" });
    }

    // ✅ Update auction status
    auction.status = "ended";
    auction.winner = auction.highestBidder; // Winner ko store karega
    await auction.save();

    let refundAmount = 0;
    let extraBonus = 0;
    let commission = 0;

    // ✅ Refund highest bidder with 3% extra
    if (auction.highestBidder && auction.highestBid > 0) {
      const bidderWallet = await Wallet.findOne({
        user: auction.highestBidder,
      });

      if (!bidderWallet) {
        return res.status(500).json({ message: "Bidder wallet not found" });
      }

      refundAmount = auction.highestBid;
      extraBonus = (refundAmount * 3) / 100; // 3% extra
      const totalRefund = refundAmount + extraBonus;

      // ✅ Update bidder wallet balance
      await Wallet.findByIdAndUpdate(
        bidderWallet._id,
        { $inc: { balance: totalRefund } },
        { new: true }
      );

      // ✅ Create refund transaction
      const refundTransaction = await Transaction.create({
        wallet: bidderWallet._id,
        amount: totalRefund,
        type: "refund",
        status: "completed",
      });

      // ✅ Push transaction ID to bidder's wallet
      await Wallet.findByIdAndUpdate(bidderWallet._id, {
        $push: { transactions: refundTransaction._id },
      });

      // ✅ Notify bidder
      await Notification.create({
        receiver: auction.highestBidder,
        sender: auction.seller,
        type: "auction-refund",
        message: `Auction ended! Your bid of $${refundAmount} has been refunded with a 3% bonus ($${extraBonus}).`,
      });
    }

    // ✅ Deduct 3% commission from seller (only if bid > 0)
    if (auction.highestBid > 0) {
      const sellerWallet = await Wallet.findOne({ user: auction.seller });

      if (!sellerWallet) {
        return res.status(500).json({ message: "Seller wallet not found" });
      }

      commission = (auction.highestBid * 3) / 100; // 3% commission

      // ✅ Check if seller has enough balance
      if (sellerWallet.balance < commission) {
        return res.status(400).json({
          message:
            "Insufficient balance in seller wallet for commission deduction.",
        });
      }

      // ✅ Deduct commission
      await Wallet.findByIdAndUpdate(
        sellerWallet._id,
        { $inc: { balance: -commission } },
        { new: true }
      );

      // ✅ Create commission transaction
      const commissionTransaction = await Transaction.create({
        wallet: sellerWallet._id,
        amount: commission,
        type: "withdraw",
        status: "completed",
      });

      // ✅ Push transaction ID to seller's wallet
      await Wallet.findByIdAndUpdate(sellerWallet._id, {
        $push: { transactions: commissionTransaction._id },
      });

      // ✅ Notify seller about commission deduction
      await Notification.create({
        receiver: auction.seller,
        sender: system,
        type: "commission",
        message: `Auction ended! A 3% commission ($${commission}) has been deducted.`,
      });

      // ✅ Update winner in User Model
      await User.findByIdAndUpdate(auction.highestBidder, {
        $push: {
          auctionsWon: {
            auction: auction._id,
            finalPrice: auction.highestBid,
          },
        },
      });
    }

    res.status(200).json({
      message: "Auction ended successfully",
      auction,
      refundAmount,
      extraBonus,
      commission,
    });
  } catch (error) {
    console.error("Error in endAuction:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Complete Auction
export const completeAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId)
      .populate("highestBidder")
      .populate({ path: "bids", populate: { path: "user", select: "_id" } });

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const existingPost = await Post.findById(auction.post);

    if (auction.highestBidder) {
      existingPost.winner = auction.highestBidder._id;
      existingPost.isAuctioned = false;
      await existingPost.save();

      // Notify Winner
      await Notification.create({
        receiver: auction.highestBidder._id,
        sender: auction.seller,
        type: "auction-win",
        message: `🎉 You won the auction for post: ${existingPost.title}`,
      });
    } else {
      existingPost.isAuctioned = false;
      await existingPost.save();
    }

    // Notify Other Bidders
    const uniqueBidders = [
      ...new Set(auction.bids.map((bid) => bid.user._id.toString())),
    ];
    uniqueBidders.forEach(async (bidderId) => {
      if (
        auction.highestBidder &&
        bidderId !== auction.highestBidder._id.toString()
      ) {
        await Notification.create({
          receiver: bidderId,
          sender: auction.seller,
          type: "auction-lost",
          message: `🛑 You lost the auction for post: ${existingPost.title}`,
        });
      }
    });

    // Update Auction Status
    auction.status = "completed";
    auction.winner = auction.highestBidder._id
    await auction.save();

    res.status(200).json({ message: "Auction completed successfully" });
  } catch (error) {
    console.error("Error completing auction:", error);
    res.status(500).json({ message: "Server error" });
  }
};
