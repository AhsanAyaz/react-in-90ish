# API Key Management Feature

## Overview

The PokAImon Generator now supports client-side API key management, allowing users to provide their own Gemini API keys for AI image generation without needing server-side configuration.

## How It Works

### Client-Side (Frontend)

1. **API Key Storage**: The Gemini API key is stored in the browser's `localStorage`
2. **API Key Prompt**: When the app loads, it checks if an API key exists
3. **User Interface**: A button in the header allows users to set/change their API key
4. **Secure Transmission**: The API key is sent with each generation request to the backend

### Server-Side (Backend)

1. **Optional Parameter**: The server accepts an optional `gemini_api_key` in the request body
2. **Fallback**: If no key is provided, the server uses the environment variable `GEMINI_API_KEY`
3. **Per-Request Keys**: Each request can use a different API key

## Usage

### For End Users

1. **Get an API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy the key

2. **Set the API Key in the App**:
   - Click the "⚠️ Set Gemini API Key" button in the header
   - Paste your API key (it will be masked like a password)
   - Click "Save"

3. **Generate Pokemon**:
   - Your API key is now stored locally and will be used for all generations
   - The key persists across browser sessions

4. **Change/Remove Key**:
   - Click "Change" next to "✓ API Key Set" to update your key

### For Developers

#### Client-Side Integration

The API key is managed through React Context:

```javascript
import { useApiKey } from './context/ApiKeyContext';

function MyComponent() {
  const { apiKey, updateApiKey, clearApiKey } = useApiKey();
  
  // Use apiKey in API calls
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doodle_data: base64Data,
      gemini_api_key: apiKey // Send API key with request
    })
  });
}
```

#### Server-Side Integration

The server accepts the API key in the request body:

```javascript
app.post('/api/generate', async (req, res) => {
  const { doodle_data, gemini_api_key } = req.body;
  
  // Use client-provided key or fall back to env var
  const result = await generateImage(doodle_data, gemini_api_key);
  res.json(result);
});
```

## Components

### `ApiKeyContext.jsx`
- React Context provider for managing API key state
- Handles localStorage persistence
- Provides `updateApiKey()` and `clearApiKey()` functions

### `ApiKeyPrompt.jsx`
- UI component for setting/changing the API key
- Shows warning when no key is set
- Displays confirmation when key is configured
- Password-masked input for security

## Security Considerations

### ✅ Secure Practices

- API keys are stored in `localStorage` (never in cookies or session storage)
- Input uses `type="password"` to mask the key during entry
- Keys are transmitted via HTTPS in production
- Server validates requests before using API keys

### ⚠️ Important Notes

- **Client-side storage**: API keys in `localStorage` can be accessed by JavaScript
- **Demo/Education Purpose**: This approach is designed for demos and tutorials
- **Production Recommendation**: For production apps, consider:
  - Backend-only API key storage
  - User authentication with server-side key management
  - Rate limiting per user

### 🔐 Best Practices

1. **For Demos/Workshops**: Client-side API keys work great!
   - Users can try the app with their own keys
   - No backend configuration needed
   - Perfect for teaching React

2. **For Production**: Use server-side authentication
   - Store API keys in environment variables
   - Implement user auth (JWT, OAuth, etc.)
   - Associate API quotas with authenticated users

## API Endpoints

### POST /api/generate

Generate a Pokemon from a doodle.

**Request Body:**
```json
{
  "doodle_data": "base64-encoded-png-data",
  "gemini_api_key": "optional-api-key-override"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Sketchy",
  "type": "Fire/Dragon",
  "image_url": "data:image/png;base64,...",
  "powers": [...],
  "characteristics": "Cheerful and imaginative"
}
```

### POST /api/pokaimon/:id/action-image

Generate an action image for a Pokemon's power.

**Request Body:**
```json
{
  "power": { "name": "Flame Burst", "description": "..." },
  "force": false,
  "gemini_api_key": "optional-api-key-override"
}
```

## Environment Variables

### Server

```bash
# Backend will use this if client doesn't provide a key
GEMINI_API_KEY=your-default-api-key

# Server configuration
PORT=3001
DATABASE_URL=postgresql://...
MEMCACHED_SERVERS=localhost:11211
```

### Client

```bash
# Backend API URL
VITE_BACKEND_URL=http://localhost:3001
```

## Demo Flow

1. **Workshop Introduction**:
   - Show the warning button in the header
   - Explain that users need their own API key
   - Demo getting a key from Google AI Studio

2. **Setting the Key**:
   - Click "Set Gemini API Key"
   - Paste the key (show it's masked)
   - Click Save
   - Show the confirmation "✓ API Key Set"

3. **Testing Generation**:
   - Draw a doodle
   - Click "Generate PokAImon"
   - Show that it works with the client-provided key

4. **Behind the Scenes** (code walkthrough):
   - Show `ApiKeyContext` managing localStorage
   - Show API call including `gemini_api_key`
   - Show server accepting and using the key

## Troubleshooting

### "API Key Missing" Error

**Symptoms**: Generation fails with "GEMINI_API_KEY missing"

**Solutions**:
1. Check if API key is set in the UI (look for "✓ API Key Set")
2. Verify the key is correct at [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Check browser console for localStorage: `localStorage.getItem('GEMINI_API_KEY')`

### API Key Not Persisting

**Symptoms**: Key not saved after browser refresh

**Solutions**:
1. Check if localStorage is disabled in browser
2. Verify browser is not in incognito/private mode
3. Check browser console for errors

### Server Not Using Client Key

**Symptoms**: Server uses env var even when client provides key

**Solutions**:
1. Verify request body includes `gemini_api_key`
2. Check network tab in DevTools
3. Review server logs for API key source

## Future Enhancements

Possible improvements:
- API key validation on save
- Multiple API key profiles
- Usage tracking/quota display
- API key encryption in localStorage
- Backend user authentication system
- Admin dashboard for key management
