import { GoogleGenAI, Type } from '@google/genai'

const IMAGE_MODEL = 'gemini-2.5-flash-image-preview'
const TEXT_MODEL = 'gemini-flash-lite-latest'
const ALLOWED_TYPES = [
  'Normal','Fire','Water','Grass','Electric','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy'
]

function getClient(apiKeyOverride = null) {
  // Allow client to provide API key, otherwise use env var
  const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY
  if (!apiKey) return null
  try {
    return new GoogleGenAI({ apiKey })
  } catch {
    return null
  }
}

export async function generateImageFromDoodle(base64Png, apiKey = null) {
  const ai = getClient(apiKey)
  if (!ai) throw new Error('GEMINI_API_KEY missing')

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: [
            'Create a high-quality PNG of an original battle-creature based on this doodle.',
            'Keep the same character identity, colors, and silhouette, but polish proportions and details.',
            'Scene: spotlighted in a stylized creature arena with subtle stadium lighting, boundary lines, and a soft bokeh crowd.',
            'Keep the background clean and readable (arena context, shallow depth of field).',
            'Do not depict a plush/toy or fabric; render a lively creature illustration.',
            'Return only the image.',
          ].join(' '),
        },
        { inlineData: { mimeType: 'image/png', data: base64Png } },
      ],
    },
  ]

  const config = {
    // Ask for image output
    responseModalities: ['IMAGE'],
  }

  const resp = await ai.models.generateContent({ model: IMAGE_MODEL, contents, config })
  const candidate = resp?.candidates?.[0]
  const part = candidate?.content?.parts?.find((p) => p.inlineData)
  const data = part?.inlineData?.data
  if (!data) throw new Error('No image data from Gemini')
  return data // base64 (png)
}

export async function generatePokemonMeta(promptText, { baseImageDataUrl, apiKey } = {}) {
  const ai = getClient(apiKey)
  if (!ai) throw new Error('GEMINI_API_KEY missing')

  const config = {
    thinkingConfig: { thinkingBudget: 0 },
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      required: ['characteristics', 'type', 'name', 'powers'],
      properties: {
        characteristics: { type: Type.STRING },
        // Return 1 or 2 types from the allowed list
        type: {
          type: Type.ARRAY,
          items: { type: Type.STRING, enum: ALLOWED_TYPES },
          minItems: 1,
          maxItems: 2,
        },
        name: { type: Type.STRING },
        powers: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ['name', 'description'],
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
            },
          },
        },
      },
    },
  }

  const parts = [
    {
      text: [
        promptText || 'Design a new original battle-creature based on the provided reference.',
        'Return JSON only. Fields: name (short, memorable),',
        'type (1–2 values from the allowed list; do not invent new types; do not use "Doodle"),',
        'characteristics (one sentence personality/appearance),',
        'powers (array of {name, description}).',
        'In each power.description, write in third person using the character\'s generated name explicitly (e.g., "<NAME> unleashes ..."), never "the user" or "the creature".',
      ].join(' '),
    },
  ]

  // If an image data URL is provided, include it as reference
  if (baseImageDataUrl && baseImageDataUrl.startsWith('data:image/')) {
    const i = baseImageDataUrl.indexOf(',')
    const b64 = i > -1 ? baseImageDataUrl.slice(i + 1) : null
    if (b64) parts.push({ inlineData: { mimeType: 'image/png', data: b64 } })
  }

  const contents = [
    {
      role: 'user',
      parts,
    },
  ]

  const resp = await ai.models.generateContent({ model: TEXT_MODEL, contents, config })
  // SDK returns text content containing JSON
  const text = resp?.text || resp?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('No text from Gemini')
  const parsed = JSON.parse(text)
  return parsed
}

export async function generateActionImage({ baseImageDataUrl, name, type, characteristics, apiKey }, power) {
  const ai = getClient(apiKey)
  if (!ai) throw new Error('GEMINI_API_KEY missing')

  // Extract base64 from data URL if available
  let base64Img = null
  if (baseImageDataUrl && baseImageDataUrl.startsWith('data:image/')) {
    const i = baseImageDataUrl.indexOf(',')
    if (i > -1) base64Img = baseImageDataUrl.slice(i + 1)
  }

  const ANGLES = [
    'dynamic low-angle 3/4 view from the left',
    'dynamic low-angle 3/4 view from the right',
    'high-angle 3/4 view from the left',
    'high-angle 3/4 view from the right',
    'profile side view mid-action',
    'rear over-shoulder toward the opponent',
    'front-facing wide-angle with motion blur',
  ]
  const angle = ANGLES[Math.floor(Math.random() * ANGLES.length)]

  const POSES = [
    'leaping forward mid-attack',
    'crouched, charging energy',
    'winding up a heavy strike',
    'sideways dash with motion blur',
    'aerial spin attack',
    'defensive stance with braced footing',
  ]
  const pose = POSES[Math.floor(Math.random() * POSES.length)]

  const actionText = [
    `Create a high-quality PNG of the same original battle-creature performing the action "${power?.name || 'Unknown'}".`,
    power?.description ? `Action details: ${power.description}.` : '',
    `Appearance guide — Name: ${name || 'Unknown'}, Type(s): ${Array.isArray(type) ? type.join('/') : (type || 'Unknown')}. ${characteristics || ''}`,
    `IMPORTANT: DO NOT USE THE SAME CAMERA ANGLE OR POSE AS THE REFERENCE. Change the camera by at least 45 degrees and use this framing: ${angle}.`,
    `Pose cue: ${pose}. Recompose the shot so the creature is in a different screen position (rule-of-thirds acceptable). Alter pose/orientation to communicate motion (limbs extended, torso twisted).`,
    'Scene: stylized creature arena with stadium lighting and boundary lines; shallow depth of field.',
    'The creature should be attacking a sillhoute/stick figure opponent with the move and the opponent should be impacted by the action.',
  ].join(' ')

  const parts = [{ text: actionText }]
  if (base64Img) {
    parts.push({ inlineData: { mimeType: 'image/png', data: base64Img } })
  }

  const contents = [{ role: 'user', parts }]
  const config = { responseModalities: ['IMAGE'], generationConfig: { temperature: 0.9 } }

  const resp = await ai.models.generateContent({ model: IMAGE_MODEL, contents, config })
  const candidate = resp?.candidates?.[0]
  const part = candidate?.content?.parts?.find((p) => p.inlineData)
  const data = part?.inlineData?.data
  if (!data) throw new Error('No image data from Gemini for action')
  return data
}
