import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { findById } from '../models/users.js';
import { getCharactersByUserId } from '../models/characters.js';
import { getAttacksByUserId } from '../models/attacks.js';

const router = express.Router();

// GET /api/users/:id

router.get("/:id", requireAuth, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user id." });
  }

  try {
    const user = await findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      user,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error." });
  }
});


// GET /api/users/:id/characters - get all characters for a user

router.get("/:id/characters", requireAuth, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user id." });
  }

  try {
    const characters = await getCharactersByUserId(userId);

    res.json({
      characters,
    });
  } catch (err) {
    console.error("Error fetching user's characters:", err);
    res.status(500).json({ error: "Server error." });
  }
});


// GET /api/users/:id/attacks - recent attacks made by the user
router.get("/:id/attacks", requireAuth, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user id." });
  }

  try {
    const attacks = await getAttacksByUserId(userId, 5);

    res.json({ attacks });
  } catch (err) {
    console.error("Error fetching user's attacks:", err);
    res.status(500).json({ error: "Server error." });
  }
});




export default router;

