import express from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";
import {
  createCharacter,
  createCharacterImage,
  clearPrimaryCharacterImages,
  deleteCharacter,
  getCharacterById,
    updateCharacter,
} from "../models/characters.js";
import { createAttack, getAttacksByCharacterId } from "../models/attacks.js";

const router = express.Router();
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith("image/")) {
      cb(null, true);
      return;
    }

    const typeError = new Error("Only image uploads are allowed.");
    typeError.code = "LIMIT_FILE_TYPE";
    cb(typeError);
  },
});

function uploadBufferToCloudinary(buffer, folder = "characters") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
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

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ error: "Image must be 5MB or smaller." });
  }

  if (err?.code === "LIMIT_FILE_TYPE") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
});

async function handleDeleteCharacter(req, res) {
  const characterId = req.params.id;

  try {
    const character = await getCharacterById(characterId);

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    if (character.user_id !== req.user.id) {
      return res.status(403).json({ error: "You do not have permission to delete this character." });
    }

    await deleteCharacter(characterId);
    return res.json({ message: "Character deleted successfully." });
  } catch (err) {
    console.error("Error deleting character:", err);
    res.status(500).json({ error: "Server error." });
  }
}

router.delete("/:id", requireAuth, handleDeleteCharacter);
router.post("/:id/delete", requireAuth, handleDeleteCharacter);


// attack routes 
router.get("/:id/attack", async (req, res) => {
  const characterId = req.params.id;

  try {
    const character = await getCharacterById(characterId);

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    res.json({
      message: `This will eventually return a form to attack ${character.name}.`,
      character,
    });
  } catch (err) {
    console.error("Error fetching character for attack:", err);
    res.status(500).json({ error: "Server error." });
  }
});

router.get("/:id/attacks", async (req, res) => {
  const characterId = req.params.id;

  try {
    const character = await getCharacterById(characterId);

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    const attacks = await getAttacksByCharacterId(characterId);
    return res.json({ attacks });
  } catch (err) {
    console.error("Error fetching attacks for character:", err);
    return res.status(500).json({ error: "Server error." });
  }
});

router.post("/:id/attack", requireAuth, upload.single("image"), async (req, res) => {
  const characterId = req.params.id;
  const message = req.body?.message?.trim();

  if (!message) {
    return res.status(400).json({ error: "Attack message is required." });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Attack image is required." });
  }

  if (message.length > 280) {
    return res.status(400).json({ error: "Attack message must be 280 characters or fewer." });
  }

  try {
    const character = await getCharacterById(characterId);

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    if (character.user_id === req.user.id) {
      return res.status(400).json({ error: "You cannot attack your own character." });
    }

    const uploadedImage = await uploadBufferToCloudinary(req.file.buffer, "attacks");

    const attack = await createAttack({
      attackerId: req.user.id,
      defenderId: character.user_id,
      characterId,
      imageUrl: uploadedImage.secure_url,
      message,
    });

    return res.status(201).json({ attack });
  } catch (err) {
    console.error("Error creating attack:", err);
    return res.status(500).json({ error: "Server error." });
  }
});

export default router;


