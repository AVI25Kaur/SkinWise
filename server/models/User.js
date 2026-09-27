const db = require("../db");

class User {
  // Find user by email (includes password_hash for authentication verification)
  static async findByEmail(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const rows = await db.query(
      "SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1 LIMIT 1",
      [normalizedEmail]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // Find user by ID (excludes password_hash for safe profile return)
  static async findById(id) {
    const rows = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1 LIMIT 1",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // Insert a new user into PostgreSQL users table and return created record
  static async create({ name, email, password_hash }) {
    const normalizedEmail = email.trim().toLowerCase();
    const rows = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name.trim(), normalizedEmail, password_hash]
    );

    return {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      created_at: rows[0].created_at,
    };
  }
}

module.exports = User;
