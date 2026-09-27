const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 5432;
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD !== undefined ? String(process.env.DB_PASSWORD) : "";
const DB_NAME = process.env.DB_NAME || "skinwise";

// Determine SSL configuration for cloud providers (Render, Supabase, Neon, etc.)
const getSslConfig = () => {
  const sslEnv = process.env.DB_SSL ? process.env.DB_SSL.toLowerCase().trim() : null;
  if (sslEnv === "false" || sslEnv === "0" || sslEnv === "disable") {
    return false;
  }
  if (
    sslEnv === "true" ||
    sslEnv === "1" ||
    sslEnv === "require" ||
    process.env.NODE_ENV === "production"
  ) {
    return { rejectUnauthorized: false };
  }
  return false;
};

let pool = null;

const getPool = () => {
  if (!pool) {
    const ssl = getSslConfig();

    if (process.env.DATABASE_URL) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: ssl,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
    } else {
      pool = new Pool({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        ssl: ssl,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
    }

    pool.on("error", (err) => {
      console.error("Unexpected error on idle PostgreSQL client:", err.message);
    });
  }
  return pool;
};

// Initialize users table automatically in PostgreSQL
const initDb = async () => {
  try {
    const dbPool = getPool();

    // Create users table using standard PostgreSQL syntax
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await dbPool.query(createTableQuery);
    console.log(`Connected to PostgreSQL successfully. Table 'users' is ready.`);
    return { success: true };
  } catch (err) {
    console.error("PostgreSQL initialization notice:", err.message);
    return { success: false, error: err.message };
  }
};

const query = async (sql, params) => {
  const dbPool = getPool();
  const res = await dbPool.query(sql, params);
  return res.rows;
};

module.exports = {
  getPool,
  initDb,
  query,
};
