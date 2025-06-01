const pool = require("./db/db");
const express = require("express");
require("dotenv").config();

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connectino error:", err);
  } else {
    console.log("Database connected at: ", res.rows[0].now);
  }
});

const userRoutes = require("./routes/userRoute");
const applicationRoutes = require("./routes/applicationRoute");
const jobRoutes = require("./routes/jobRoute");
// const messageRoutes = require("./routes/messageRoutes");
// const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
const port = process.env.PORT || 3144;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Freelance API is running");
});

// // Request Logging Middleware
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
//   next();
// });

// // Routes
app.use("/users", userRoutes);
app.use("/jobs", jobRoutes);
app.use("/applications", applicationRoutes);
// app.use("/", messageRoutes);
// app.use("/", reviewRoutes);

// // Centralized Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Something wernt wrong!" });
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
