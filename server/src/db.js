import { URL } from "url";
import pkg from "pg";
const { Pool } = pkg;

export class Database {
  constructor({ url }) {
    if (!url) {
      throw new Error("DATABASE_URL is required");
    }
    this.url = url;
    this.pool = new Pool({
      connectionString: this.url,
    });
  }

  async connect() {
    // quick test query
    await this.pool.query("SELECT 1");
    console.log("[DB] Connected to Postgres.");
  }

  async initialize() {
    // Auto-create table if it doesn't exist
    // Note: image_url stores file paths like "/images/aimon-123.png" (not data URLs)
    // Note: action_images stores {powerName: "/images/action-123.png"} mapping
    const schema = `
      CREATE TABLE IF NOT EXISTS generated_aimon (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(100),
        powers JSONB,
        characteristics TEXT,
        image_url TEXT,
        doodle_source TEXT,
        like_count INTEGER NOT NULL DEFAULT 0,
        action_images JSONB DEFAULT '{}'::jsonb
      );
    `;
    await this.pool.query(schema);
    console.log("[DB] Schema initialized.");
  }

  async insert(aimon) {
    const { name, type, powers, characteristics, image_url, doodle_source } =
      aimon;
    const result = await this.pool.query(
      `INSERT INTO generated_aimon (name, type, powers, characteristics, image_url, doodle_source)
       VALUES ($1, $2, $3::jsonb, $4, $5, $6)
       RETURNING id, name, type, powers, characteristics, image_url, doodle_source, like_count, action_images`,
      [
        name,
        type,
        JSON.stringify(powers ?? []),
        characteristics,
        image_url,
        doodle_source,
      ]
    );
    return result.rows[0];
  }

  async list() {
    const result = await this.pool.query(
      `SELECT id, name, type, powers, characteristics, image_url, doodle_source, like_count, action_images
       FROM generated_aimon
       ORDER BY id DESC`
    );
    return result.rows;
  }

  async like(id) {
    const result = await this.pool.query(
      `UPDATE generated_aimon SET like_count = like_count + 1 WHERE id = $1
       RETURNING id, name, type, powers, characteristics, image_url, doodle_source, like_count, action_images`,
      [id]
    );
    return result.rows[0] || null;
  }

  async getById(id) {
    const result = await this.pool.query(
      `SELECT id, name, type, powers, characteristics, image_url, doodle_source, like_count, action_images
       FROM generated_aimon WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async setActionImage(id, powerName, imageUrl) {
    const result = await this.pool.query(
      `UPDATE generated_aimon
       SET action_images = jsonb_set(COALESCE(action_images, '{}'::jsonb), $2::text[], to_jsonb($3::text), true)
       WHERE id = $1
       RETURNING id, name, type, powers, characteristics, image_url, doodle_source, like_count, action_images`,
      [id, [powerName], imageUrl]
    );
    return result.rows[0] || null;
  }
}
