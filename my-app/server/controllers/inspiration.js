import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = req.query.q || "art pose";
    const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim();

    if (!accessKey) {
      return res.status(500).json({ error: "Missing Unsplash access key." });
    }

    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=6`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const message =
        response.status === 401
          ? "Unsplash rejected the access key. Check UNSPLASH_ACCESS_KEY in your .env file."
          : data?.errors?.[0] || data?.error || data?.message || "Failed to fetch inspiration images.";
      throw new Error(message);
    }

    const sourceImages = Array.isArray(data) ? data : data ? [data] : [];

    const images = sourceImages
      .filter((img) => img && img.id && img.urls)
      .map((img) => ({
        id: img.id,
        url: img.urls.small,
        full: img.urls.full,
        photographer: img.user?.name || "Unknown photographer"
      }));

    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch inspiration images" });
  }
});
export default router;