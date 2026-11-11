var db = require("../db");

function mapComment(row) {
  if (!row) {
    return null;
  }

  return {
    _id: String(row.id),
    id: String(row.id),
    text: row.text,
    createdAt: row.created_at,
    rating: row.rating,
    campgroundId: String(row.campground_id),
    author: {
      id: String(row.user_id),
      username: row.username
    }
  };
}

module.exports = {
  async findById(id) {
    if (!/^\d+$/.test(String(id))) {
      return null;
    }
    var result = await db.query(
      `SELECT comments.*, users.username
       FROM comments
       JOIN users ON users.id = comments.user_id
       WHERE comments.id = $1`,
      [id]
    );
    return mapComment(result.rows[0]);
  },

  async findByCampground(campgroundId) {
    var result = await db.query(
      `SELECT comments.*, users.username
       FROM comments
       JOIN users ON users.id = comments.user_id
       WHERE comments.campground_id = $1
       ORDER BY comments.created_at DESC`,
      [campgroundId]
    );
    return result.rows.map(mapComment);
  },

  async findByAuthor(userId) {
    var result = await db.query(
      `SELECT comments.*, users.username
       FROM comments
       JOIN users ON users.id = comments.user_id
       WHERE comments.user_id = $1
       ORDER BY comments.created_at DESC`,
      [userId]
    );
    return result.rows.map(mapComment);
  },

  async hasUserReviewed(campgroundId, userId) {
    var result = await db.query(
      "SELECT 1 FROM comments WHERE campground_id = $1 AND user_id = $2",
      [campgroundId, userId]
    );
    return result.rowCount > 0;
  },

  async create(campgroundId, user, comment) {
    var result = await db.query(
      `INSERT INTO comments (campground_id, user_id, text, rating)
       VALUES ($1, $2, $3, $4)
       RETURNING id, campground_id, user_id, text, rating, created_at`,
      [campgroundId, user._id, comment.text, comment.rating]
    );
    return mapComment(Object.assign({}, result.rows[0], {
      username: user.username
    }));
  },

  async update(id, user, comment) {
    var result = await db.query(
      `UPDATE comments
       SET text = $1, rating = $2
       WHERE id = $3
       RETURNING id, campground_id, user_id, text, rating, created_at`,
      [comment.text, comment.rating, id]
    );
    if (!result.rows[0]) {
      return null;
    }
    return mapComment(Object.assign({}, result.rows[0], {
      username: user.username
    }));
  },

  async delete(id) {
    var result = await db.query(
      "DELETE FROM comments WHERE id = $1 RETURNING campground_id",
      [id]
    );
    return result.rows[0] ? String(result.rows[0].campground_id) : null;
  }
};
