import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from 'path';
import userRouter from './routers/user.routes.js';
import auctionRouter from './routers/auction.routes.js';
import walletRouter from './routers/wallet.routes.js'
import profileRouter from './routers/profile.routes.js';
import commentRouter from './routers/comment.routes.js';
import { fileURLToPath } from 'url';
import gameRouter from './routers/game.routes.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
connectDB();
const app = express();

// HTTP server for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.100.13:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Game State Object
const games = {};

// Socket.io Events
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('joinGame', (data) => {
    if (!data.gameId) return;

    if (!games[data.gameId]) {
        games[data.gameId] = { players: [] };
    }

    if (games[data.gameId].players.length < 2) {
        games[data.gameId].players.push(socket.id);
        socket.join(data.gameId);
        io.to(data.gameId).emit('playerJoined', { playerId: socket.id });

        if (games[data.gameId].players.length === 2) {
            io.to(data.gameId).emit('gameStart', { gameId: data.gameId });
        }
    }
  });

  socket.on('makeMove', (moveData) => {
    console.log('Move received:', moveData);
    io.to(moveData.gameId).emit('moveMade', moveData);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);

    for (let gameId in games) {
        games[gameId].players = games[gameId].players.filter(id => id !== socket.id);
        if (games[gameId].players.length === 0) {
            delete games[gameId];
        }
    }
  });
});

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "http://192.168.100.13:5173"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Allow CORS Headers for Cookies
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Define __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/Images", express.static(path.join(__dirname, "public/Images")));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/c", commentRouter);
app.use("/game", gameRouter);
app.use("/auction", auctionRouter)
app.use("/wallet", walletRouter)

// Server Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on ${PORT}`);
  console.log(`http://192.168.100.13:${PORT}`);
});
