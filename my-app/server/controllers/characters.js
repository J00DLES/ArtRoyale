import express from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";
import {
  createCharacter,
  createCharacterImage,
  clearPrimaryCharacterImages,
  getCharacterById,
    updateCharacter,
} from "../models/characters.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "characters",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

// GET /api/characters/new - form to create new character
router.get("/new", requireAuth, (req, res) => {
  res.json({ message: "This will eventually return a form to create a new character." });
});

// POST /api/characters/new - create new character with an uploaded image
router.post("/new", requireAuth, upload.single("image"), async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Character name is required." });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Character image is required." });
  }

  try {
    const uploadedImage = await uploadBufferToCloudinary(req.file.buffer);
    const character = await createCharacter(req.user.id, name, description);
    const characterImage = await createCharacterImage(
      character.id,
      uploadedImage.secure_url,
      true
    );

    res.status(201).json({
      character,
      image: characterImage,
    });
  } catch (err) {
    console.error("Error creating character:", err);
    res.status(500).json({ error: "Server error." });
  }
});

router.get("/:id", async (req, res) => {
  const characterId = req.params.id;

  try {
    const character = await getCharacterById(characterId);

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    res.json(character);
  } catch (err) {
    console.error("Error fetching character:", err);
    res.status(500).json({ error: "Server error." });
  }
});


router.get("/:id/edit", requireAuth, async (req, res) => {
  const characterId = req.params.id;

  try {
    const character = await getCharacterById(characterId);

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    if (character.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not have permission to edit this character." });
    }

    res.json(character);
  } catch (err) {
    console.error("Error fetching character for edit:", err);
    res.status(500).json({ error: "Server error." });
  }
});

router.post("/:id/edit", requireAuth, upload.single("image"), async (req, res) => {
  const characterId = req.params.id;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Character name is required." });
  }

  try {
    const character = await getCharacterById(characterId);

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    if (character.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not have permission to edit this character." });
    }

    let imageUrl = character.image_url;

    if (req.file) {
      const uploadedImage = await uploadBufferToCloudinary(req.file.buffer);
      imageUrl = uploadedImage.secure_url;
      await clearPrimaryCharacterImages(character.id);
      await createCharacterImage(character.id, imageUrl, true);
    }

    const updatedCharacter = await updateCharacter(characterId, name, description);
    res.json({
      character: {
        ...updatedCharacter,
        image_url: imageUrl,
      },
    });
  } catch (err) {
    console.error("Error updating character:", err);
    res.status(500).json({ error: "Server error." });
  }
});

export default router;