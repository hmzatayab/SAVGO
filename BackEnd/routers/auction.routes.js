import express from "express";
// import { createAuction, placeBid, getActiveAuctions, getAuctionDetails, endAuction } from "../controllers/auction.controller.js";
import { authenticate } from "../Middleware/auth.middleware.js";

const router = express.Router();

// Auction Routes
// router.post("/create", authenticate, createAuction); // Create an auction
// router.post("/bid/:auctionId", authenticate, placeBid); // Place a bid
// router.get("/active", getActiveAuctions); // Get all active auctions
// router.get("/:auctionId", getAuctionDetails); // Get auction details
// router.post("/end/:auctionId", authenticate, endAuction); // End an auction


export default router;
