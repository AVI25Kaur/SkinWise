CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  full_name TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  image_id TEXT NOT NULL DEFAULT '',
  joined TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS campgrounds (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  image_id TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  price NUMERIC,
  booking JSONB NOT NULL DEFAULT '{}'::jsonb,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_username TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rate_avg DOUBLE PRECISION NOT NULL DEFAULT 0,
  rate_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  campground_id BIGINT NOT NULL REFERENCES campgrounds(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campground_id, user_id)
);

CREATE INDEX IF NOT EXISTS campgrounds_author_id_idx
  ON campgrounds(author_id);
CREATE INDEX IF NOT EXISTS comments_campground_id_idx
  ON comments(campground_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx
  ON comments(user_id);
