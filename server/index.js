const express = require("express");
const cors = require("cors");
const path = require("path");

// Load .env only in local dev (Render uses its own env vars)
try {
  require("dotenv-flow").config();
} catch (e) { }

const app = express();

// Allow requests from frontend / Postman
app.use(cors());

// Serve JSON
app.use(express.json());

// MongoDB connection
const mongoose = require("mongoose");
const todoRoutes = require("./routes/todoRoutes");

const source = process.env.MONGODB_ATLAS_CONNECTION;

mongoose
  .connect(source)
  .then(() => console.log("✅ DB Connected Successfully"))
  .catch((error) => console.log(error));

// API routes
app.use("/api", todoRoutes);

// Serve React frontend build
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

// Catch-all: send React app for any non-API route (Express 5 compatible)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
