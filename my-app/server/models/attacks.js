import pool from "../db/connection.js";

export async function createAttack({
  attackerId,
  defenderId,
  characterId,
  imageUrl,
  message,
}) {
  const result = await pool.query(
    `INSERT INTO attacks (attacker_id, defender_id, character_id, image_url, type, points, message)
     VALUES ($1, $2, $3, $4, 'attack', 0, $5)
     RETURNING id, attacker_id, defender_id, character_id, image_url, type, points, message, created_at`,
    [attackerId, defenderId, characterId, imageUrl, message]
  );

  return result.rows[0];
}

export async function getAttacksByCharacterId(characterId, limit = 25) {
  const parsedLimit = Number.isInteger(limit) ? limit : 25;

  const result = await pool.query(
    `SELECT a.id,
            a.attacker_id,
            a.defender_id,
            a.character_id,
            a.image_url,
            a.type,
            a.points,
            a.message,
            a.created_at,
            u.username AS attacker_username
     FROM attacks a
     JOIN users u ON u.id = a.attacker_id
     WHERE a.character_id = $1
     ORDER BY a.created_at DESC
     LIMIT $2`,
    [characterId, parsedLimit]
  );

  return result.rows;
}
