import Game from "../models/game.model.js";
import userModel from "../models/user.model.js";

// Helper function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const createGame = async (req, res) => {
  try {
    const { creatorId } = req.body;

    const users = await userModel.find().populate("posts").select("-password");
    let allPosts = [];

    users.forEach((user) => {
      user.posts.forEach((post) => {
        post.imageURL = `${req.protocol}://${req.get("host")}/Images/Uploads/${post.postData}`;
        post.userData = {
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
          userID: user._id,
          followers: user.followers,
          following: user.following,
        };
        allPosts.push(post);
      });
    });

    if (allPosts.length < 10) {
      return res.status(400).json({ message: "Not enough posts to create a game" });
    }

    // Random 10 posts select karna
    const shuffledPosts = allPosts.sort(() => Math.random() - 0.5).slice(0, 10);
    const images = shuffledPosts.map((post) => post.imageURL);

    // Cards shuffle
    const shuffledCards = [...images, ...images]
      .map((image, index) => ({
        id: index,
        image,
        flipped: false,
        matched: false,
      }))
      .sort(() => Math.random() - 0.5);

    const creator = await userModel.findById(creatorId).select('name email image');

    const newGame = new Game({
      players: [creatorId],
      cards: shuffledCards,
      currentTurn: null,
      scores: { [creatorId]: 0 },
      userData: {
        [creatorId]: {
          name: creator.name,
          email: creator.email,
          image: creator.image,
        },
      },
    });

    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const joinGame = async (req, res) => {
  try {
    const { gameId, playerId } = req.body;
    const game = await Game.findById(gameId);

    if (!game) return res.status(404).json({ message: "Game not found" });
    if (game.players.length >= 2) return res.status(400).json({ message: "Game is full" });
    if (game.players.includes(playerId)) return res.status(400).json({ message: "Player already in game" });

    game.players.push(playerId);

    const user = await userModel.findById(playerId).select('name email image');
    if (!game.userData) game.userData = {};
    game.userData[playerId] = {
      name: user.name,
      email: user.email,
      image: user.image,
    };

    if (game.players.length === 2) {
      game.currentTurn = game.players[0]; // Game start when 2 players join
    }

    await game.save();

    // Socket.io Event Emit
    req.io.to(gameId).emit("playerJoined", { game });

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const makeMove = async (req, res) => {
  try {
    const { gameId, playerId, card1Id, card2Id } = req.body;
    const game = await Game.findById(gameId);

    if (!game || game.players.length < 2) {
      return res.status(403).json({ message: "Game hasn't started yet" });
    }

    if (game.currentTurn !== playerId) {
      return res.status(403).json({ message: "Not your turn!" });
    }

    const card1 = game.cards.find((c) => c.id === card1Id);
    const card2 = game.cards.find((c) => c.id === card2Id);

    if (card1.matched || card2.matched || card1.flipped || card2.flipped) {
      return res.status(400).json({ message: "Invalid move" });
    }

    card1.flipped = true;
    card2.flipped = true;

    let isMatch = false;

    if (card1.image === card2.image) {
      card1.matched = true;
      card2.matched = true;
      isMatch = true;
      game.scores[playerId] = (game.scores[playerId] || 0) + 1;
    } else {
      // Delay flipping back the cards if they don't match
      await delay(2000);
      card1.flipped = false;
      card2.flipped = false;
      game.currentTurn = game.players.find((p) => p !== playerId);
    }

    const isGameOver = game.cards.every((card) => card.matched);
    if (isGameOver) {
      const winner = Object.entries(game.scores).sort((a, b) => b[1] - a[1])[0][0];
      game.winner = winner;
    }

    await game.save();

    // Socket.io Event Emit
    req.io.to(gameId).emit("moveMade", { game, isMatch, isGameOver });

    res.status(200).json({ game, isMatch, isGameOver });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGameState = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
