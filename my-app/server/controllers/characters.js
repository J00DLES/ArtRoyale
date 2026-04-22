import express from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";
import { createCharacter, createCharacterImage } from "../models/characters.js";

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

export default router;