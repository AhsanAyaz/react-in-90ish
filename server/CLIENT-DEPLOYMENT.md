# Client Deployment Guide

This guide explains how to build and deploy the client-tutorial to be served from the server.

## Quick Deploy

```bash
cd server
npm run build-client
```

This will:

1. Build the client-tutorial production bundle
2. Copy it to `server/public/app/`
3. Server will serve it at `http://your-server/app/`

## Configuration

### 1. Production API URL

The client needs to know where your API is. Set this in `client-tutorial/.env`:

```bash
VITE_BACKEND_URL=https://your-production-domain.com
```

**Important:** The backend URL should NOT include `/app` - just the base domain.

### 2. Vite Base Path

Already configured in `vite.config.js`:

```javascript
base: '/app/', // Client will be served from /app/ subdirectory
```

### 3. React Router Fallback

Already configured in `server/src/index.js`:

```javascript
// SPA fallback - serves index.html for all /app/* routes
app.get("/app/*", (req, res) => {
  res.sendFile("public/app/index.html", { root: "." });
});
```

## Deployment Steps for Cloudways

### 1. Build Locally or on Server

**Option A: Build locally and deploy**

```bash
cd server
npm run build-client
# Then deploy the entire server folder including public/app
```

**Option B: Build on server**

```bash
# SSH into your Cloudways server
cd /path/to/your/app/server
npm run build-client
```

### 2. Verify Deployment

Visit: `https://your-domain.com/app/`

You should see the client application running!

## API URL Configuration

### Development

Client uses: `http://localhost:3001`

### Production

Set `VITE_BACKEND_URL` before building:

**For same-server deployment:**

```bash
# client-tutorial/.env
VITE_BACKEND_URL=https://your-domain.com
```

**For separate API server:**

```bash
# client-tutorial/.env
VITE_BACKEND_URL=https://api.your-domain.com
```

## Troubleshooting

### Routes not working (404 errors)

- **Cause:** SPA fallback not configured
- **Fix:** Ensure the `app.get('/app/*')` route is in `server/src/index.js` AFTER API routes

### Assets not loading (404 for .js/.css files)

- **Cause:** Incorrect base path
- **Fix:** Check `vite.config.js` has `base: '/app/'`

### API calls failing

- **Cause:** Wrong API URL
- **Fix:** Check `VITE_BACKEND_URL` in client `.env` before building

### Images not displaying

- **Cause:** Images stored as file paths, client needs backend URL
- **Fix:** Already handled - client prepends `${API}` to image URLs

## File Structure After Deployment

```
server/
├── public/
│   ├── app/              # Client application (built)
│   │   ├── index.html
│   │   ├── assets/
│   │   └── ...
│   └── images/           # Generated AImon images
├── src/
│   └── index.js          # Server with SPA fallback
└── scripts/
    └── build-client.js   # Build script
```

## Important Notes

1. **Build before deploy:** Always run `npm run build-client` before deploying to production
2. **Environment variables:** Set `VITE_BACKEND_URL` in client's `.env` before building
3. **CORS:** Ensure server's `CORS_ORIGIN` allows requests from your domain
4. **Static files:** Server serves client from `/app/` and images from `/images/`
5. **React Router:** All `/app/*` routes fallback to `index.html` for client-side routing
