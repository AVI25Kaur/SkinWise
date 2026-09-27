const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { initDb, getPool } = require("./db");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend client
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const pool = getPool();
    await pool.query("SELECT 1 as test");
    res.json({
      status: "ok",
      app: "SkinWise Backend API",
      database: "PostgreSQL connected",
    });
  } catch (err) {
    res.status(503).json({
      status: "degraded",
      app: "SkinWise Backend API",
      database: "PostgreSQL disconnected: " + err.message,
    });
  }
});

// Initialize PostgreSQL database/tables and start HTTP server
const startServer = async () => {
  try {
    console.log("Initializing PostgreSQL database & tables...");
    const initResult = await initDb();
    if (!initResult.success) {
      console.warn("PostgreSQL initialization notice:", initResult.error);
      console.log("Please ensure PostgreSQL credentials or DATABASE_URL in server/.env are correct.");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`SkinWise authentication server listening on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("Server startup error:", err.message);
  }
};

startServer();
