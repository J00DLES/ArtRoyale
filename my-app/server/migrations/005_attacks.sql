CREATE TABLE IF NOT EXISTS attacks (
  id SERIAL PRIMARY KEY,
  attacker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  defender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  type VARCHAR(10) CHECK (type IN ('attack', 'defense')) NOT NULL,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
