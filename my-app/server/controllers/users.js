import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { findById } from '../models/users.js';

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

export default router;