import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Database } from "./db.js";
import {
  generateImageFromDoodle,
  generateAImonMeta,
  generateActionImage,
} from "./ai.js";
import cache from "./cache.js";
import { saveBase64Image } from "./imageStorage.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: "4mb" }));
app.use(express.static("public"));

let db;
try {
  db = new Database({ url: process.env.DATABASE_URL });
  await db.connect();
  await db.initialize();
} catch (err) {
  console.error("[DB] Startup failed:", err.message);
  process.exit(1);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Gallery endpoint with Memcached caching
app.get("/api/gallery", async (_req, res) => {
  try {
    const rows = await cache.getOrSet("gallery:all", () => db.list(), 300);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const { doodle_data, gemini_api_key } = req.body || {};
    if (!doodle_data || typeof doodle_data !== "string") {
      return res
        .status(400)
        .json({ error: "doodle_data (base64) is required" });
    }

    // 1) Generate the base image from the doodle
    const imgB64 = await generateImageFromDoodle(doodle_data, gemini_api_key);

    // Save image as file instead of using data URL
    const imageUrl = saveBase64Image(imgB64, "aimon");

    // 2) Generate metadata using the produced image as reference for higher accuracy
    const meta = await generateAImonMeta(
      "Design an original battle-creature matching the reference. Use allowed types and include the name in each power description.",
      {
        baseImageDataUrl: `data:image/png;base64,${imgB64}`,
        apiKey: gemini_api_key,
      }
    );

    const normalizedPowers = Array.isArray(meta?.powers)
      ? meta.powers.map((p) => ({ name: p.name, description: p.description }))
      : [
          { name: "Ink Splash", description: "Splashes ink playfully." },
          {
            name: "Doodle Dash",
            description: "Dashes leaving doodle lines.",
          },
        ];

    // Ensure power descriptions use the generated name explicitly
    const name = (meta?.name || "Sketchy").toString();
    const powersWithName = normalizedPowers.map((p) => {
      const desc = (p.description || "").toString();
      const hasName = new RegExp(`\\b${name}\\b`, "i").test(desc);
      const replaced = desc.replace(
        /\b(the user|the creature|the character)\b/gi,
        name
      );
      if (hasName) return { ...p, description: replaced };
      // If name not present, prepend it for clarity
      const trimmed = replaced.trim();
      const lower = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
      return { ...p, description: `${name} ${lower}` };
    });

    const aimon = {
      name,
      type:
        Array.isArray(meta?.type) && meta.type.length
          ? meta.type.slice(0, 2).join("/")
          : typeof meta?.type === "string"
          ? meta.type
          : "Normal",
      powers: powersWithName,
      characteristics: meta?.characteristics || "Cheerful and imaginative.",
      image_url: imageUrl, // File path instead of data URL
      doodle_source: (doodle_data || "").slice(0, 60) + "...",
    };
    const saved = await db.insert(aimon);

    // Update gallery cache by prepending new AImon (more efficient than invalidation)
    const cached = await cache.get("gallery:all");
    if (cached && Array.isArray(cached)) {
      cached.unshift(saved); // Add to beginning (newest first)
      await cache.set("gallery:all", cached, 300);
      console.log("Cache updated: gallery:all in insert");
    }

    return res.json(saved);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Failed to generate" });
  }
});

app.patch("/api/aimon/:id/like", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "Invalid id" });
    const updated = await db.like(id);
    if (!updated) return res.status(404).json({ error: "Not found" });

    // Update the AImon in cache (more efficient than invalidation)
    const cached = await cache.get("gallery:all");
    if (cached && Array.isArray(cached)) {
      const index = cached.findIndex((p) => p.id === id);
      if (index !== -1) {
        cached[index] = updated;
        await cache.set("gallery:all", cached, 300);
        console.log(`Cache updated: AImon #${id} in gallery:all`);
      }
    }

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to like" });
  }
});

app.post("/api/aimon/:id/action-image", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "Invalid id" });
    const { power, force, gemini_api_key } = req.body || {};
    const powerName = typeof power === "string" ? power : power?.name;
    const powerDesc =
      typeof power === "object" ? power?.description : undefined;
    if (!powerName)
      return res.status(400).json({ error: "power (name) required" });

    const aimon = await db.getById(id);
    if (!aimon) return res.status(404).json({ error: "Not found" });

    const cached = aimon.action_images?.[powerName];
    if (cached && !force) {
      return res.json({ image_url: cached, cached: true });
    }

    const b64 = await generateActionImage(
      {
        baseImageDataUrl: aimon.image_url.startsWith("/images/")
          ? `http://localhost:${PORT}${aimon.image_url}`
          : aimon.image_url,
        name: aimon.name,
        type: aimon.type,
        characteristics: aimon.characteristics,
        apiKey: gemini_api_key,
      },
      { name: powerName, description: powerDesc }
    );

    // Save as file instead of data URL
    const actionImageUrl = saveBase64Image(b64, "action");
    const updated = await db.setActionImage(id, powerName, actionImageUrl);
    return res.json({ image_url: actionImageUrl, cached: false });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to generate action image" });
  }
});

// SPA fallback for React Router
// Serve index.html for all routes that don't match API or static files
// MUST be the last route, after all API routes
app.get("*", (req, res) => {
  // Don't fallback for API routes or file extensions
  if (req.path.startsWith("/api/") || req.path.includes(".")) {
    return res.status(404).send("Not found");
  }
  res.sendFile("public/index.html", { root: "." });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
