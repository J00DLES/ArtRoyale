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

export async function clearPrimaryCharacterImages(characterId) {
  await pool.query(
    `UPDATE character_images
     SET is_primary = false
     WHERE character_id = $1 AND is_primary = true`,
    [characterId]
  );
}

export async function getCharacterById(characterId) {
  const result = await pool.query(
    `SELECT c.id,
            c.user_id,
            u.username,
            c.name,
            c.description,
            c.created_at,
          NULLIF(BTRIM(ci.image_url), '') AS image_url
     FROM characters c
     JOIN users u ON u.id = c.user_id
     LEFT JOIN LATERAL (
       SELECT image_url
       FROM character_images
       WHERE character_id = c.id
       ORDER BY is_primary DESC, id DESC
       LIMIT 1
     ) ci ON true
     WHERE c.id = $1`,
    [characterId]
  );

  return result.rows[0] || null;
}

export async function updateCharacter(characterId, name, description) {
  const result = await pool.query(
    `UPDATE characters
     SET name = $1,
         description = $2
     WHERE id = $3
     RETURNING id, user_id, name, description, created_at`,
    [name, description || null, characterId]
  );

  return result.rows[0];
}

export async function getCharactersByUserId(userId) {
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
       ORDER BY is_primary DESC, id DESC
       LIMIT 1
     ) ci ON true
     WHERE c.user_id = $1
     ORDER BY c.created_at DESC`,
    [userId]
  );

  return result.rows;
}

export async function deleteCharacter(characterId) {
  await pool.query(
    `DELETE FROM characters
     WHERE id = $1`,
    [characterId]
  );
}

export async function deleteCharacterImages(characterId) {
  await pool.query(
    `DELETE FROM character_images
     WHERE character_id = $1`,
    [characterId]
  );
}

export async function updateCharacterImage(characterId, imageUrl) {
  const result = await pool.query(
    `UPDATE character_images
     SET image_url = $1,
         updated_at = NOW()
     WHERE character_id = $2 AND is_primary = true
     RETURNING id, character_id, image_url, is_primary, created_at, updated_at`,
    [imageUrl, characterId]
  );

  return result.rows[0];
}



export async function getRecentCharacters(limit = 10) {
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
       ORDER BY is_primary DESC, id DESC
       LIMIT 1
     ) ci ON true
     ORDER BY c.created_at DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows;
}


export async function getCharactersByUserIds(userIds) {
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
       ORDER BY is_primary DESC, id DESC
       LIMIT 1
     ) ci ON true
     WHERE c.user_id = ANY($1)
     ORDER BY c.created_at DESC`,
    [userIds]
  );

  return result.rows;
}