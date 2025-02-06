import express from "express";
import { createGame, joinGame, makeMove, getGameState } from '../controllers/game.controller.js';

const router = express.Router(); // ✅ `express()` ki jagah `express.Router()`

router.post("/create", createGame); // Game create karne ka route
router.post("/join", joinGame); // Game join karne ka route
router.post("/move", makeMove); // Move karne ka route
router.get("/:id", getGameState); // Game ka current state get karne ka route

export default router;
