const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

module.exports = app;
