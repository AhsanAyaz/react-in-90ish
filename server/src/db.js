import { URL } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

export class Database {
  constructor({ url }) {
    if (!url) {
      throw new Error('DATABASE_URL is required');
    }
    this.url = url;
    this.pool = new Pool({
      connectionString: this.url,
    });
  }

  async connect() {
    // quick test query
    await this.pool.query('SELECT 1');
    console.log('[DB] Connected to Postgres.');
  }

  async insert(pokemon) {
    const { name, type, powers, characteristics, image_url, doodle_source } = pokemon;
    const result = await this.pool.query(
      `INSERT INTO generated_pokaimon (name, type, powers, characteristics, image_url, doodle_source)
       VALUES ($1, $2, $3::jsonb, $4, $5, $6)
       RETURNING id, name, type, powers, characteristics, image_url, doodle_source, like_count, action_images`,
      [name, type, JSON.stringify(powers ?? []), characteristics, image_url, doodle_source]
    );
    return result.rows[0];
  }

  async list() {
    const result = await this.pool.query(
      `SELECT id, name, type, powers, characteristics, image_url, doodle_source, like_count, action_images
       FROM generated_pokaimon
       ORDER BY id DESC`
    );
    return result.rows;
  }

  async like(id) {
    const result = await this.pool.query(
      `UPDATE generated_pokaimon SET like_count = like_count + 1 WHERE id = $1
       RETURNING id, name, type, powers, characteristics, image_url, doodle_source, like_count, action_images`,
      [id]
    );
    return result.rows[0] || null;
  }

  async getById(id) {
    const result = await this.pool.query(
      `SELECT id, name, type, powers, characteristics, image_url, doodle_source, like_count, action_images
       FROM generated_pokaimon WHERE id = $1`,
      [id]
    )
    return result.rows[0] || null
  }

  async setActionImage(id, powerName, imageUrl) {
    const result = await this.pool.query(
      `UPDATE generated_pokaimon
       SET action_images = jsonb_set(COALESCE(action_images, '{}'::jsonb), $2::text[], to_jsonb($3::text), true)
       WHERE id = $1
       RETURNING id, name, type, powers, characteristics, image_url, doodle_source, like_count, action_images`,
      [id, [powerName], imageUrl]
    )
    return result.rows[0] || null
  }
}
