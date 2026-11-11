var fs = require("fs");
var path = require("path");
var { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set to connect to PostgreSQL.");
}

var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE === "require" ?
    { rejectUnauthorized: true } : undefined
});

module.exports = {
  query: function(text, values) {
    return pool.query(text, values);
  },
  initialize: function() {
    var schema = fs.readFileSync(
      path.join(__dirname, "db", "schema.sql"),
      "utf8"
    );
    return pool.query(schema);
  },
  close: function() {
    return pool.end();
  }
};
