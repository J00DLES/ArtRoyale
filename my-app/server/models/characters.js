import pool from "../db/connection.js";

export async function createCharacter(userId, name, description) {
  const result = await pool.query(
    `INSERT INTO characters (user_id, name, description)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, name, description, created_at`,
    [userId, name, description || null]
  );

  return result.rows[0];
}

export async function createCharacterImage(characterId, imageUrl, isPrimary = true) {
  const result = await pool.query(
    `INSERT INTO character_images (character_id, image_url, is_primary)
     VALUES ($1, $2, $3)
     RETURNING id, character_id, image_url, is_primary, created_at`,
    [characterId, imageUrl, isPrimary]
  );

  return result.rows[0];
}

export async function getCharacterById(characterId) {
  const result = await pool.query(
    `SELECT c.id,
            c.user_id,
            c.name,
            c.description,
            c.created_at,
          NULLIF(BTRIM(ci.image_url), '') AS image_url
     FROM characters c
     LEFT JOIN LATERAL (
       SELECT image_url
       FROM character_images
       WHERE character_id = c.id
       ORDER BY is_primary DESC, id ASC
       LIMIT 1
     ) ci ON true
     WHERE c.id = $1`,
    [characterId]
  );

  return result.rows[0] || null;
}