import express from "express";
import { deleteAttackById, getAttackById } from "../models/attacks.js";
import { requireAuth } from "../middleware/auth.js";

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


router.delete("/:id", requireAuth, async (req, res) => {
  const attackId = req.params.id;

  try {
    const attack = await getAttackById(attackId);

    if (!attack) {
      return res.status(404).json({ error: "Attack not found." });
    } else if (attack.attacker_id !== req.user.id) {
      return res.status(403).json({ error: "You can only delete your own attacks." });
    }

    await deleteAttackById(attackId);
    return res.json({ message: "Attack deleted successfully." });
  } catch (err) {
    console.error("Error deleting attack:", err);
    return res.status(500).json({ error: "Server error." });
  }
});





export default router;

