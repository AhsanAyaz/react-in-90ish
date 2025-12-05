import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log("[ImageStorage] Created images directory:", IMAGES_DIR);
}

/**
 * Generate a unique filename
 * @param {string} prefix - Prefix for the filename (e.g., 'aimon', 'action')
 * @returns {string} Filename without extension
 */
function generateFilename(prefix = "image") {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Save base64 image data to a PNG file
 * @param {string} base64Data - Base64 image data (with or without data URL prefix)
 * @param {string} prefix - Prefix for the filename (e.g., 'aimon', 'action')
 * @returns {string} URL path to the saved image (e.g., '/images/aimon-123.png')
 */
export function saveBase64Image(base64Data, prefix = "image") {
  // Strip data URL prefix if present
  const base64 = base64Data.replace(/^data:image\/\w+;base64,/, "");

  // Generate unique filename
  const filename = `${generateFilename(prefix)}.png`;
  const filePath = path.join(IMAGES_DIR, filename);

  // Convert base64 to buffer and write to file
  const buffer = Buffer.from(base64, "base64");
  fs.writeFileSync(filePath, buffer);

  console.log(
    `[ImageStorage] Saved image: ${filename} (${(buffer.length / 1024).toFixed(
      2
    )} KB)`
  );

  // Return URL path
  return `/images/${filename}`;
}

/**
 * Delete an image file
 * @param {string} imageUrl - URL path to the image (e.g., '/images/aimon-123.png')
 * @returns {boolean} True if deleted successfully
 */
export function deleteImage(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith("/images/")) {
    return false;
  }

  const filename = path.basename(imageUrl);
  const filePath = path.join(IMAGES_DIR, filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[ImageStorage] Deleted image: ${filename}`);
      return true;
    }
  } catch (err) {
    console.error(`[ImageStorage] Failed to delete ${filename}:`, err.message);
  }

  return false;
}
