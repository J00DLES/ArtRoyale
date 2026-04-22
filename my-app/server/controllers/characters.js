import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { findById } from '../models/users.js';

const router = express.Router();

// GET /api/characters/:id

// GET /api/characters/recent - get recent characters for everyone

// GET /api/characters/new - form to create new character
router.get("/new", requireAuth, (req, res) => {
  res.json({ message: "This will eventually return a form to create a new character." });
});

// POST /api/characters/new - create new character

export default router;