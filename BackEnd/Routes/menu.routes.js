const express = require("express");
const Route = express.Router();



Route.get("/pricing", async (req, res) => {
  res.render("Menu Pages/pricing");
});

Route.get("/messages", async (req, res) => {
  res.render("Menu Pages/messages");
});

module.exports = Route;
