import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from 'path';
import userRouter from './routers/user.routes.js';
import profileRouter from './routers/profile.routes.js'
import { fileURLToPath } from 'url';


dotenv.config();
connectDB();
const app = express();
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // Replace this with your frontend URL
  credentials: true, // Allow cookies to be sent
}));

// Define __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user", userRouter);
app.use("/profile", profileRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
