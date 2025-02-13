const mongoose = require('mongoose');

const ownershipSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
  },
  previousOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  newOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  auctionWinner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  auctionEndedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['Completed', 'Cancelled', 'Transferred'],
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Ownership', ownershipSchema);
