import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    id: Number,
    image: String,
    flipped: { type: Boolean, default: false },
    matched: { type: Boolean, default: false }
});

const gameSchema = new mongoose.Schema({
    players: [String], // Player IDs
    cards: [cardSchema], 
    currentTurn: String,
    scores: { type: Map, of: Number }
});

export default mongoose.model('Game', gameSchema);
