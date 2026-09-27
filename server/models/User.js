const db = require("../db");

class User {
  // Find user by email (includes password_hash for authentication verification)
  static async findByEmail(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const rows = await db.query(
      "SELECT id, name, email, password_hash, created_at FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // Find user by ID (excludes password_hash for safe profile return)
  static async findById(id) {
    const rows = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // Insert a new user into MySQL
  static async create({ name, email, password_hash }) {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name.trim(), normalizedEmail, password_hash]
    );

    return {
      id: result.insertId,
      name: name.trim(),
      email: normalizedEmail,
    };
  }
}

module.exports = User;
