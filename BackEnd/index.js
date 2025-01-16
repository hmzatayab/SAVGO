import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from './routers/user.routes.js';

dotenv.config();
connectDB();
const app = express();
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // Replace this with your frontend URL
  credentials: true, // Allow cookies to be sent
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user", userRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
