var crypto = require("crypto");
var db = require("../db");

function mapUser(row) {
  if (!row) {
    return null;
  }
  return {
    _id: String(row.id),
    id: String(row.id),
    username: row.username,
    email: row.email,
    phone: row.phone,
    fullName: row.full_name,
    image: row.image,
    imageId: row.image_id,
    joined: row.joined,
    isAdmin: row.is_admin
  };
}

function passwordHash(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

module.exports = {
  async findById(id) {
    if (!/^\d+$/.test(String(id))) {
      return null;
    }
    var result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return mapUser(result.rows[0]);
  },

  async findByUsername(username) {
    var result = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return result.rows[0] || null;
  },

  verifyPassword(user, password) {
    if (!user || typeof password !== "string") {
      return false;
    }
    var actual = Buffer.from(passwordHash(password, user.password_salt), "hex");
    var expected = Buffer.from(user.password_hash, "hex");
    return actual.length === expected.length &&
      crypto.timingSafeEqual(actual, expected);
  },

  async create(values, password) {
    var salt = crypto.randomBytes(16).toString("hex");
    var result = await db.query(
      `INSERT INTO users
        (username, password_hash, password_salt, email, phone, full_name,
         image, image_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        values.username,
        passwordHash(password, salt),
        salt,
        values.email || "",
        values.phone || "",
        values.fullName || "",
        values.image || "",
        values.imageId || ""
      ]
    );
    return mapUser(result.rows[0]);
  },

  async update(id, values) {
    var result = await db.query(
      `UPDATE users
       SET email = $1, phone = $2, full_name = $3, image = $4, image_id = $5
       WHERE id = $6
       RETURNING *`,
      [
        values.email,
        values.phone,
        values.fullName,
        values.image,
        values.imageId,
        id
      ]
    );
    return mapUser(result.rows[0]);
  },

  async delete(id) {
    await db.query("DELETE FROM users WHERE id = $1", [id]);
  }
};
