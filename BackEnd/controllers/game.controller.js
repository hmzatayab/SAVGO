import Game from "../models/game.model.js";
import userModel from "../models/user.model.js";

export const createGame = async (req, res) => {
  try {
    const { creatorId } = req.body;

    const users = await userModel.find().populate("posts").select("-password");
    const allPosts = [];

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

    const selectedPosts = allPosts.slice(0, 10);
    const images = selectedPosts.map((post) => post.imageURL);

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
      currentTurn: creatorId,
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

    await game.save();
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const makeMove = async (req, res) => {
  try {
    const { gameId, playerId, card1Id, card2Id } = req.body;
    const game = await Game.findById(gameId);

    if (game.currentTurn !== playerId) {
      return res.status(403).json({ message: "Not your turn!" });
    }

    const card1 = game.cards.find((c) => c.id === card1Id);
    const card2 = game.cards.find((c) => c.id === card2Id);

    if (card1.matched || card2.matched || card1.flipped || card2.flipped) {
      return res.status(400).json({ message: "Invalid move" });
    }

    let isMatch = false;

    if (card1.image === card2.image) {
      card1.matched = true;
      card2.matched = true;
      isMatch = true;
      game.scores[playerId] = (game.scores[playerId] || 0) + 1;
    } else {
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
    res.status(200).json({ game, isMatch, isGameOver });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGameState = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate("userData");
    if (!game) return res.status(404).json({ message: "Game not found" });

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};