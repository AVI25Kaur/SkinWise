const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 3306;
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "";
const DB_NAME = process.env.DB_NAME || "skinwise";

let pool = null;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
};

// Initialize database & table automatically
const initDb = async () => {
  try {
    // 1. Connect to MySQL server without database first to ensure DB exists
    const rootConnection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await rootConnection.end();

    // 2. Initialize pool with the target database
    const dbPool = getPool();

    // 3. Create users table if it does not already exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await dbPool.query(createTableQuery);
    console.log(`Connected to MySQL successfully. Database '${DB_NAME}' and table 'users' are ready.`);
    return { success: true };
  } catch (err) {
    console.error("MySQL initialization error:", err.message);
    return { success: false, error: err.message };
  }
};

const query = async (sql, params) => {
  const dbPool = getPool();
  const [rows] = await dbPool.execute(sql, params);
  return rows;
};

module.exports = {
  getPool,
  initDb,
  query,
};
