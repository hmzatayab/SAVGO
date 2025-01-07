const express = require("express");
const userRoute = require("./Routes/user.routes");
const profileRoute = require("./Routes/profile.routes");
const companyRoute = require("./Routes/company.routes");
const menuRoute = require("./Routes/menu.routes");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db.config");
const cookieParser = require("cookie-parser");
const userModel = require("./Modules/user.modle");
const postModle = require("./Modules/post.modle");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

const server = http.createServer(app); // HTTP server
const io = new Server(server); // Socket.IO server

dotenv.config();
connectDB();
app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle message event from client
  socket.on("message", (msg) => {
    console.log("This is a server message:", msg);

    // Broadcast the message to all clients
    io.emit("message", msg);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.get("/", async (req, res) => {
  const token = req.cookies.token;
  let user = null;
  let isTokenPresent = false;

  try {
    // Token verification
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.username;
      user = await userModel.findOne(
        { username: userId },
        "username image name email"
      );
      isTokenPresent = true;
    }

    // Fetch posts
    const usersPosts = await postModle.find().populate("user");

    res.render("index", {
      isTokenPresent,
      tokenTrue: !!user,
      users: user,
      posts: usersPosts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/user", userRoute, (req, res) => {
  res.redirect("/");
});

app.use("/profile", profileRoute, (req, res) => {
  res.redirect("/");
});

app.use("/company", companyRoute, (req, res) => {
  res.redirect("/");
});

app.use("/menu", menuRoute, (req, res) => {
  res.redirect("/");
});

// Server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:9687/`);
});
