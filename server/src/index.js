import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Database } from './db.js';
import { generateImageFromDoodle, generatePokemonMeta, generateActionImage } from './ai.js';
import cache from './cache.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '4mb' }));

let db;
try {
  db = new Database({ url: process.env.DATABASE_URL });
  await db.connect();
} catch (err) {
  console.error('[DB] Startup failed:', err.message);
  process.exit(1);
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function simulatePokemon(doodleSource) {
  const typeA = ['Fire', 'Water', 'Grass', 'Electric', 'Ghost', 'Psychic', 'Rock'];
  const typeB = ['Fairy', 'Steel', 'Ice', 'Dragon', 'Ground', 'Flying', 'Dark'];
  const names = ['Pika', 'Squir', 'Bulba', 'Charm', 'Eevee', 'Mew', 'Abra', 'Draco'];
  const suffix = ['-Doodle', '-Sketch', '-Ink', '-Scribble'];
  const powers = [
    [
      { name: 'Hydro Pump', description: 'Blasts foes with high-pressure water.' },
      { name: 'Ink Spray', description: 'Squirts ink to obscure vision.' },
    ],
    [
      { name: 'Flame Burst', description: 'Explodes embers on contact.' },
      { name: 'Char Mark', description: 'Leaves a scorching trail.' },
    ],
    [
      { name: 'Leaf Blade', description: 'Cuts with razor-sharp leaves.' },
      { name: 'Vine Swipe', description: 'Whips foes with vines.' },
    ],
    [
      { name: 'Thunder Jolt', description: 'Quick electric shock.' },
      { name: 'Spark Trail', description: 'Leaves crackling sparks behind.' },
    ],
    [
      { name: 'Shadow Sneak', description: 'Strikes from the shadows.' },
      { name: 'Spook Flick', description: 'Startles enemies briefly.' },
    ],
  ];
  const chosenPowers = randomChoice(powers);

  return {
    name: `${randomChoice(names)}${randomChoice(suffix)}`,
    type: `${randomChoice(typeA)}/${randomChoice(typeB)}`,
    powers: chosenPowers,
    characteristics: 'Loves to draw; slightly grumpy.',
    image_url: 'https://placehold.co/512x512/png?text=PokéGen',
    doodle_source: (doodleSource || '').slice(0, 60) + '...',
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Gallery endpoint with Memcached caching
app.get('/api/gallery', async (_req, res) => {
  try {
    const rows = await cache.getOrSet('gallery:all', () => db.list(), 300);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const { doodle_data, gemini_api_key } = req.body || {};
    if (!doodle_data || typeof doodle_data !== 'string') {
      return res.status(400).json({ error: 'doodle_data (base64) is required' });
    }

    try {
      // Attempt real AI generation if configured
      // 1) Generate the base image from the doodle
      const imgB64 = await generateImageFromDoodle(doodle_data, gemini_api_key);
      const imageDataUrl = `data:image/png;base64,${imgB64}`;
      // 2) Generate metadata using the produced image as reference for higher accuracy
      const meta = await generatePokemonMeta(
        'Design an original battle-creature matching the reference. Use allowed types and include the name in each power description.',
        { baseImageDataUrl: imageDataUrl, apiKey: gemini_api_key }
      );

      const normalizedPowers = Array.isArray(meta?.powers)
        ? meta.powers.map((p) => ({ name: p.name, description: p.description }))
        : [
            { name: 'Ink Splash', description: 'Splashes ink playfully.' },
            { name: 'Doodle Dash', description: 'Dashes leaving doodle lines.' },
          ];

      // Ensure power descriptions use the generated name explicitly
      const name = (meta?.name || 'Sketchy').toString()
      const powersWithName = normalizedPowers.map((p) => {
        const desc = (p.description || '').toString()
        const hasName = new RegExp(`\\b${name}\\b`, 'i').test(desc)
        const replaced = desc.replace(/\b(the user|the creature|the character)\b/gi, name)
        if (hasName) return { ...p, description: replaced }
        // If name not present, prepend it for clarity
        const trimmed = replaced.trim()
        const lower = trimmed.charAt(0).toLowerCase() + trimmed.slice(1)
        return { ...p, description: `${name} ${lower}` }
      })

      const pokemon = {
        name,
        type: Array.isArray(meta?.type) && meta.type.length
          ? meta.type.slice(0, 2).join('/')
          : (typeof meta?.type === 'string' ? meta.type : 'Normal'),
        powers: powersWithName,
        characteristics: meta?.characteristics || 'Cheerful and imaginative.',
        image_url: imageDataUrl,
        doodle_source: (doodle_data || '').slice(0, 60) + '...',
      };
      const saved = await db.insert(pokemon);
      
      // Invalidate gallery cache on new Pokemon creation
      await cache.del('gallery:all');
      
      return res.json(saved);
    } catch (aiErr) {
      console.warn('[AI] Falling back to simulated generation:', aiErr.message);
      const simulated = simulatePokemon(doodle_data);
      const saved = await db.insert(simulated);
      
      // Invalidate gallery cache on new Pokemon creation
      await cache.del('gallery:all');
      
      return res.json(saved);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to generate' });
  }
});

app.patch('/api/pokaimon/:id/like', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    const updated = await db.like(id);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to like' });
  }
});

app.post('/api/pokaimon/:id/action-image', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' })
    const { power, force, gemini_api_key } = req.body || {}
    const powerName = typeof power === 'string' ? power : power?.name
    const powerDesc = typeof power === 'object' ? power?.description : undefined
    if (!powerName) return res.status(400).json({ error: 'power (name) required' })

    const pokemon = await db.getById(id)
    if (!pokemon) return res.status(404).json({ error: 'Not found' })

    const cached = pokemon.action_images?.[powerName]
    if (cached && !force) {
      return res.json({ image_url: cached, cached: true })
    }

    const b64 = await generateActionImage(
      {
        baseImageDataUrl: pokemon.image_url,
        name: pokemon.name,
        type: pokemon.type,
        characteristics: pokemon.characteristics,
        apiKey: gemini_api_key,
      },
      { name: powerName, description: powerDesc }
    )
    const dataUrl = `data:image/png;base64,${b64}`
    const updated = await db.setActionImage(id, powerName, dataUrl)
    return res.json({ image_url: dataUrl, cached: false })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to generate action image' })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
