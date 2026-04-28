import express from "express";
import { getAttackById } from "../models/attacks.js";

const router = express.Router();

// GET /api/attacks/:id - fetch single attack details
router.get("/:id", async (req, res) => {
  const attackId = req.params.id;

  try {
    const attack = await getAttackById(attackId);

    if (!attack) {
      return res.status(404).json({ error: "Attack not found." });
    }

    return res.json({ attack });
  } catch (err) {
    console.error("Error fetching attack:", err);
    return res.status(500).json({ error: "Server error." });
  }
});

export default router;
