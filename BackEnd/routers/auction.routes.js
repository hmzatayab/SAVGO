import express from "express";
import { createAuction, placeBid, getActiveAuctions, getAuctionDetails, endAuction, completeAuction } from "../controllers/auction.controller.js";
import { authenticate } from "../Middleware/auth.middleware.js";

const router = express.Router();

// Auction Routes
router.post("/create", authenticate, createAuction); // Create an auction
router.post("/bid/:auctionId", authenticate, placeBid); // Place a bid
router.get("/active", getActiveAuctions); // Get all active auctions
router.get("/:auctionId", authenticate, getAuctionDetails); // Get auction details
router.put("/complete/:auctionId", completeAuction); // Complete Auction Route
router.post("/end/:auctionId", authenticate, endAuction); // End an auction


export default router;
