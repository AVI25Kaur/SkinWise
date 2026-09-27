const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const getJwtSecret = () => process.env.JWT_SECRET || "skinwise_dev_secret_key_2026";
const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN || "7d";

// @route   POST /api/auth/signup
// @desc    Register a new user in MySQL
// @access  Public
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Field presence & format validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email address is required." });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required." });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Check if user already exists
    const existingUser = await User.findByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    // 3. Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 4. Save to MySQL users table
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password_hash,
    });

    // 5. Generate JWT token
    const token = jwt.sign(
      { id: newUser.id.toString() },
      getJwtSecret(),
      { expiresIn: getJwtExpiresIn() }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle MySQL duplicate entry error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    // Handle database connection refusal
    if (error.code === "ECONNREFUSED" || error.code === "PROTOCOL_CONNECTION_LOST") {
      return res.status(503).json({
        success: false,
        message: "MySQL database connection error. Please ensure the MySQL service is running on port 3306.",
      });
    }

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      return res.status(503).json({
        success: false,
        message: "MySQL authentication error: Access denied. Please check DB_USER and DB_PASSWORD in server/.env.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error occurred during signup. Please try again.",
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user against MySQL and get JWT token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Look up user by email in MySQL
    const user = await User.findByEmail(normalizedEmail);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 2. Verify hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user.id.toString() },
      getJwtSecret(),
      { expiresIn: getJwtExpiresIn() }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    if (error.code === "ECONNREFUSED" || error.code === "PROTOCOL_CONNECTION_LOST") {
      return res.status(503).json({
        success: false,
        message: "MySQL database connection error. Please ensure MySQL is running on port 3306.",
      });
    }

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      return res.status(503).json({
        success: false,
        message: "MySQL authentication error: Access denied. Please check DB_USER and DB_PASSWORD in server/.env.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error occurred during login. Please try again.",
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get currently logged-in user profile from MySQL
// @access  Private
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving user profile.",
    });
  }
});

module.exports = router;
