var db = require("../db");

function mapCampground(row) {
  if (!row) {
    return null;
  }

  var commentCount = Number(row.comment_count || 0);
  return {
    _id: String(row.id),
    id: String(row.id),
    name: row.name,
    image: row.image,
    imageId: row.image_id,
    description: row.description,
    location: row.location,
    lat: row.lat,
    lng: row.lng,
    price: row.price,
    booking: row.booking || {},
    tags: row.tags || [],
    createdAt: row.created_at,
    author: {
      id: String(row.author_id),
      username: row.author_username
    },
    comments: Array(commentCount).fill(null),
    rateAvg: Number(row.rating_average || row.rate_avg || 0),
    rateCount: commentCount,
    hasRated: []
  };
}

var baseSelect = `SELECT campgrounds.*,
  COUNT(comments.id)::integer AS comment_count,
  COALESCE(AVG(comments.rating), 0)::float AS rating_average
  FROM campgrounds
  LEFT JOIN comments ON comments.campground_id = campgrounds.id`;

var orderBy = {
  rateAvg: "comment_count DESC, rating_average DESC",
  rateCount: "comment_count DESC",
  priceLow: "price ASC NULLS LAST, rating_average DESC",
  priceHigh: "price DESC NULLS LAST, rating_average DESC"
};

module.exports = {
  async findAll(options) {
    options = options || {};
    var order = orderBy[options.sortBy] || "campgrounds.created_at DESC";
    var where = options.authorId ? " WHERE campgrounds.author_id = $1" : "";
    var values = options.authorId ? [options.authorId] : [];
    var result = await db.query(
      `${baseSelect}${where}
       GROUP BY campgrounds.id
       ORDER BY ${order}`,
      values
    );
    return result.rows.map(mapCampground);
  },

  async findById(id) {
    if (!/^\d+$/.test(String(id))) {
      return null;
    }
    var result = await db.query(
      `${baseSelect}
       WHERE campgrounds.id = $1
       GROUP BY campgrounds.id`,
      [id]
    );
    var campground = mapCampground(result.rows[0]);
    if (campground) {
      var ratings = await db.query(
        "SELECT user_id FROM comments WHERE campground_id = $1",
        [id]
      );
      campground.hasRated = ratings.rows.map(function(row) {
        return String(row.user_id);
      });
    }
    return campground;
  },

  async create(values, user) {
    var result = await db.query(
      `INSERT INTO campgrounds
        (name, image, image_id, description, location, lat, lng, price,
         booking, tags, author_id, author_username)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        values.name,
        values.image || "",
        values.imageId || "",
        values.description || "",
        values.location || "",
        values.lat || null,
        values.lng || null,
        values.price || null,
        JSON.stringify(values.booking || {}),
        values.tags || [],
        user._id,
        user.username
      ]
    );
    return this.findById(result.rows[0].id);
  },

  async update(id, values) {
    var result = await db.query(
      `UPDATE campgrounds
       SET name = $1, description = $2, location = $3, lat = $4, lng = $5,
           price = $6, booking = $7, tags = $8, image = $9, image_id = $10
       WHERE id = $11
       RETURNING id`,
      [
        values.name,
        values.description,
        values.location,
        values.lat,
        values.lng,
        values.price || null,
        JSON.stringify(values.booking || {}),
        values.tags || [],
        values.image,
        values.imageId,
        id
      ]
    );
    return result.rows[0] ? this.findById(id) : null;
  },

  async updateRating(id) {
    await db.query(
      `UPDATE campgrounds
       SET rate_avg = COALESCE(
             (SELECT AVG(rating) FROM comments WHERE campground_id = $1), 0
           ),
           rate_count = (
             SELECT COUNT(*) FROM comments WHERE campground_id = $1
           )
       WHERE id = $1`,
      [id]
    );
  },

  async delete(id) {
    await db.query("DELETE FROM campgrounds WHERE id = $1", [id]);
  }
};
