import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from 'path';
import userRouter from './routers/user.routes.js';
import profileRouter from './routers/profile.routes.js';
import commentRouter from './routers/comment.routes.js';
import { fileURLToPath } from 'url';
import gameRouter from './routers/game.routes.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
connectDB();
const app = express();

// HTTP server banaya Socket.io ke liye
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.100.13:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Socket.io Events
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Game join karne ka event
  socket.on('joinGame', (data) => {
    console.log('Player joined:', data);
    socket.join(data.gameId); // Room join karna
    io.to(data.gameId).emit('playerJoined', { playerId: socket.id });
  });

  // Move karne ka event
  socket.on('makeMove', (moveData) => {
    console.log('Move received:', moveData);
    io.to(moveData.gameId).emit('moveMade', moveData); // Broadcast to room
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "http://192.168.100.13:5173"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

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

app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/c", commentRouter);
app.use("/game", gameRouter);


// Server Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on ${PORT}`);
  console.log(`http://192.168.100.13:${PORT}`);
});
