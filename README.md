# React in 90-ish Minutes 🚀

Welcome to **React in 90-ish Minutes** - a 90 minutes crash course on ReactJS, including [explanatory slides](https://ahsanayaz.github.io/react-in-90ish/slides.html?md=react-19-slides.md&title=React%20in%2090%E2%80%91ish%20Minutes#/), a YouTube video tutorial, and a hands-on tutorial where you'll learn React by building a real, full-stack application!

## Video Tutorial

Watch the full workshop on YouTube:

[![React 19 Workshop](https://img.youtube.com/vi/tqjJrXd27m4/0.jpg)](https://www.youtube.com/watch?v=tqjJrXd27m4)

## StackBlitz examples (shown in the video tutorial)

Try the stackblitz examples directly in your browser:

[Open in StackBlitz ⚡️](https://stackblitz.com/@AhsanAyaz/collections/react-in-90-ish)

You can also find the code for these examples in the `stackblitz-examples` directory in this repository.

---

## 📚 What You'll Learn

By the end of this tutorial, you'll understand:

- ✅ React fundamentals (Components, JSX, Props)
- ✅ **Routing** with React Router
- ✅ State Management (`useState`)
- ✅ Side Effects (`useEffect`)
- ✅ Custom Hooks
- ✅ Context API for global state
- ✅ Performance optimization (`useMemo`, `useCallback`)
- ✅ **React 19 Features** (Suspense, Lazy Loading)
- ✅ Error Handling with Error Boundaries

## 🎨 What You'll Build

**AImon Generator** - An AI-powered creature creator app with:

- 🎨 Canvas drawing interface
- 🤖 AI-generated creatures from your doodles
- 📸 Gallery with filtering and sorting
- ❤️ Like functionality
- 🌙 Dark mode toggle
- 🚀 Modern React patterns and best practices

## 🗂️ Project Structure

```
react-in-90-tutorial/
├── client-tutorial/    # React app (Vite + Tailwind)
│   └── README.md      # Step-by-step tutorial guide
├── slides/            # Presentation slides
├── server/            # Express API + Postgres
└── docker-compose.yml # Database setup
```

## 🚦 Quick Start

### Prerequisites

- Node.js 18+
- Docker (for database)
- Basic JavaScript knowledge

### 1. Start the Database

```bash
docker compose up -d
```

This starts a PostgreSQL database with the schema pre-configured.

### 2. Configure Environment

Create environment files:

**Backend** (`server/.env`):

```env
PORT=3001
DATABASE_URL=postgres://postgres:postgres@localhost:5432/pokegen
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_api_key_here  # Optional: for AI features
```

**Frontend** (`client-tutorial/.env`):

```env
VITE_BACKEND_URL=http://localhost:3001
```

### 3. Start the Backend

```bash
cd server
npm install
npm start
```

Backend runs at `http://localhost:3001`

### 4. Start the Frontend

```bash
cd client-tutorial
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 5. Follow the Tutorial!

Open `client-tutorial/README.md` for the complete step-by-step tutorial guide. The tutorial walks you through building the entire app from scratch!

## 🎓 Tutorial Agenda

**Theory + Concepts (45 min)**

- React fundamentals
- Virtual DOM
- Hooks ecosystem
- Modern patterns

**Hands-On Coding (45 min)**

- Follow `client-tutorial/README.md`
- Build features incrementally
- Test as you go

## 🛠️ Tech Stack

**Frontend**

- React 19 (Vite)
- React Router
- Tailwind CSS

**Backend**

- Node.js + Express
- PostgreSQL 16
- Gemini AI (optional)

## 📖 API Endpoints

Base URL: `http://localhost:3001`

| Method  | Endpoint              | Description        |
| ------- | --------------------- | ------------------ |
| `GET`   | `/api/health`         | Health check       |
| `GET`   | `/api/gallery`        | Get all AImon      |
| `POST`  | `/api/generate`       | Generate new AImon |
| `PATCH` | `/api/aimon/:id/like` | Like a AImon       |

### Example: Generate AImon

```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"doodle_data": "<base64-encoded-image>"}'
```

Response:

```json
{
  "id": 1,
  "name": "Scribblet",
  "type": "Fire/Dragon",
  "characteristics": "Cheerful and imaginative",
  "image_url": "data:image/png;base64,...",
  "like_count": 0
}
```

## 🤖 AI Integration (Optional)

The app can generate AI-powered creatures using Google's Gemini API:

1. Get an API key from [Google AI Studio](https://aistudio.google.com/)
2. Add it to `server/.env` as `GEMINI_API_KEY`
3. The app will use AI to generate unique creatures!

Without the API key, the app uses simulated placeholder generation.

## 🐛 Troubleshooting

**Database connection issues?**

- Ensure Docker is running: `docker compose ps`
- Reset database: `docker compose down -v && docker compose up -d`

**Port conflicts?**

- Backend: Change `PORT` in `server/.env`
- Frontend: Update `VITE_BACKEND_URL` to match

**CORS errors?**

- Verify `CORS_ORIGIN` in `server/.env` matches your frontend URL

## 📝 License

For educational and tutorial purposes.

---

**Happy coding! 🎉** If you get stuck, check the `client-tutorial/README.md` for detailed instructions on each step.
