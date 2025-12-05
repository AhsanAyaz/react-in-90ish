# React 19 Workshop - AImon Generator 🎨

Welcome to the React 19 hands-on workshop! In this 90-minute tutorial, you'll build a complete React application from scratch, learning modern React patterns and React 19 features.

## What You'll Build

A AImon Generator app where you can:

- Draw your own AImon-style creatures
- Generate AI-powered AImon from your doodles
- Browse a gallery of created AImon
- Like your favorite creations

## What You'll Learn

- ✅ React fundamentals (Components, JSX, Props)
- ✅ **Routing** (React Router)
- ✅ State Management (useState)
- ✅ Side Effects (useEffect)
- ✅ Custom Hooks
- ✅ Context API
- ✅ Performance (useMemo, useCallback)
- ✅ **React 19 Features** (Suspense, Lazy Loading)
- ✅ Error Handling

---

## Prerequisites

- Node.js 18+ installed
- Basic JavaScript knowledge
- Text editor (Antigravity (or VSCode) recommended)

---

## Video Tutorial

Watch the full workshop on YouTube:

[![React 19 Workshop](https://img.youtube.com/vi/tqjJrXd27m4/0.jpg)](https://www.youtube.com/watch?v=tqjJrXd27m4)

---

## StackBlitz examples (shown in the video tutorial)

Try the stackblitz examples directly in your browser:

[Open in StackBlitz ⚡️](https://stackblitz.com/@AhsanAyaz/collections/react-in-90-ish)

You can also find the code for these examples in the `stackblitz-examples` directory in this repository.

---

## Sponsors

Support the project by checking out our sponsors:

💰 **Get 50% OFF Cloudways Hosting for 3 months:**  
[Sign Up Now](https://unified.cloudways.com/signup?id=1879418&coupon=BFCM5050) (50% OFF For 3 Months + 50 Free Migrations)

💰 **Check out Cloudways pricing:**  
[View Pricing](https://www.cloudways.com/en/pricing.php?id=1879418&data1=bfcm&data2=Nov)

---

## Setup Instructions

1. **Navigate to the tutorial folder:**

```bash
cd client-tutorial
```

2. **Copy environment file:**

```bash
cp .env.example .env
```

3. **Install dependencies** (already done if you followed setup):

```bash
npm install
```

4. **Start the development server:**

```bash
npm run dev
```

5. **Make sure the backend is running:**

```bash
# In another terminal, from the project root:
cd server
npm start
```

The app should open at `http://localhost:5173`

---

## Using Your Gemini API Key

The app uses the Gemini API for AI-powered AImon generation. To provide your API key:

### Getting Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key or copy an existing one

### Using the `useApiKey` Hook

The app includes an `ApiKeyContext` that manages your API key securely in browser storage. Use the `useApiKey` hook to access and include it in API calls:

```jsx
import { useApiKey } from "../context/ApiKeyContext";

function YourComponent() {
  const { apiKey } = useApiKey();

  const makeApiCall = async () => {
    const res = await fetch(`${API}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doodle_data: base64,
        gemini_api_key: apiKey, // Include the API key
      }),
    });
    // ... handle response
  };
}
```

The `useApiKey` hook provides:

- `apiKey` - The current API key (or empty string if not set)
- `updateApiKey(newKey)` - Update the stored API key
- `clearApiKey()` - Remove the stored API key

Your API key is stored locally in your browser and never sent to our backend except as part of API requests to generate AImon.

---

# Workshop Steps

## Step 1: Set Up Routing

**📍 Locations:** `src/App.jsx`, `src/main.jsx`, `src/components/Header.jsx`

**What you'll learn:** Client-side routing with React Router

### 1.1 Update main.jsx

Add import:

```jsx
import { BrowserRouter } from "react-router-dom";
```

Wrap App:

```jsx
<React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</React.StrictMode>
```

### 1.2 Update App.jsx

Add imports:

```jsx
import { Routes, Route } from "react-router-dom";
```

Replace the placeholder div in main with:

```jsx
<Routes>
  <Route path="/" element={<GeneratorPage />} />
  <Route path="/gallery" element={<GalleryPage />} />
</Routes>
```

### 1.3 Update Header.jsx

Add imports:

```jsx
import { Link, NavLink } from "react-router-dom";
```

Replace the div with Link:

```jsx
<Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
  Doodle → AImon
</Link>
```

Add NavLinks in the nav:

```jsx
<nav className="flex gap-2">
  <NavLink
    to="/"
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium ${
        isActive
          ? "bg-indigo-600 text-white"
          : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`
    }
  >
    Generator
  </NavLink>
  <NavLink
    to="/gallery"
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium ${
        isActive
          ? "bg-indigo-600 text-white"
          : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`
    }
  >
    Gallery
  </NavLink>
</nav>
```

**✅ Test:** Click between Generator and Gallery!

---

## Step 2: Add Basic State (useState)

**📍 Location:** `src/pages/GeneratorPage.jsx`

**What you'll learn:** Managing component state with useState

**Find the TODO comments and implement:**

### 2.1 Import useState and useApiKey

```jsx
import { useState } from "react";
import { useApiKey } from "../context/ApiKeyContext";
```

### 2.2 Add state variables

Replace the TODO comment with:

```jsx
const [isGenerating, setIsGenerating] = useState(false);
const [error, setError] = useState(null);
const [lastResult, setLastResult] = useState(null);
const [hasDoodle, setHasDoodle] = useState(false);
const { apiKey } = useApiKey();
```

### 2.3 Implement handleGenerate function

Replace the placeholder function with:

```jsx
const handleGenerate = async (base64) => {
  try {
    setIsGenerating(true);
    setError(null);
    const res = await fetch(`${API}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doodle_data: base64,
        gemini_api_key: apiKey,
      }),
    });
    if (!res.ok) throw new Error("Failed to generate");
    const json = await res.json();
    setLastResult(json);
  } catch (e) {
    setError(e.message);
  } finally {
    setIsGenerating(false);
  }
};
```

### 2.4 Update Canvas props

Change:

```jsx
<Canvas
  onGenerate={handleGenerate}
  disabled={false /* TODO: Use isGenerating */}
/>
```

To:

```jsx
<Canvas
  onGenerate={handleGenerate}
  onCanvasChange={setHasDoodle}
  disabled={isGenerating || !hasDoodle || !apiKey}
/>
```

### 2.5 Add conditional rendering

Replace the placeholder divs with:

```jsx
{
  !lastResult && !isGenerating && (
    <div className="text-center text-gray-500 dark:text-gray-400">
      <p>Your generated AImon will appear here.</p>
    </div>
  );
}
{
  isGenerating && <Spinner label="Generating your AImon…" />;
}
{
  lastResult && !isGenerating && (
    <img
      src={`${API}${lastResult.image_url}`}
      alt={lastResult.name}
      className="object-contain w-full h-full"
    />
  );
}
```

Add error display:

```jsx
{
  error && (
    <div className="mt-4 text-red-500 dark:text-red-400 text-sm text-center">
      {error}
    </div>
  );
}
```

Add result details after error:

```jsx
{
  lastResult && (
    <div className="w-full mt-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {lastResult.name}
      </h3>
      {lastResult.type && (
        <span className="text-xs px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200">
          {lastResult.type}
        </span>
      )}
      {lastResult.characteristics && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          {lastResult.characteristics}
        </p>
      )}
    </div>
  );
}
```

**✅ Test:** Draw something and click Generate!

---

## Step 3: Fetch Data (useEffect)

**📍 Location:** `src/pages/GalleryPage.jsx`

**What you'll learn:** Side effects and data fetching

### 3.1 Add imports

```jsx
import { useState, useEffect } from "react";
```

### 3.2 Replace placeholder data with real state

```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### 3.3 Add useEffect to fetch data

```jsx
useEffect(() => {
  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/api/gallery`);
      if (!res.ok) throw new Error("Failed to load gallery");
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  fetchGallery();
}, []);
```

### 3.4 Update like function (temporarily)

```jsx
const like = async (id) => {
  try {
    const res = await fetch(`${API}/api/aimon/${id}/like`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to like");
    // Refetch data
    const galleryRes = await fetch(`${API}/api/gallery`);
    const json = await galleryRes.json();
    setData(json);
  } catch (e) {
    console.error(e);
  }
};
```

### 3.5 Add basic card rendering

```jsx
{
  data.map((p) => (
    <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <img
        src={`${API}${p.image_url}`}
        alt={p.name}
        className="w-full aspect-square object-contain"
      />
      <h3 className="text-xl font-semibold mt-3 text-gray-900 dark:text-white">
        {p.name}
      </h3>
      {p.type && (
        <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200">
          {p.type}
        </span>
      )}
      {p.characteristics && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          {p.characteristics}
        </p>
      )}
      {p.powers && Array.isArray(p.powers) && p.powers.length > 0 && (
        <div className="mt-3 space-y-1">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Powers:
          </p>
          {p.powers.map((power, idx) => (
            <div key={idx} className="text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">
                {power.name}
              </span>
              {power.description && <span> - {power.description}</span>}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => like(p.id)}
        className="mt-3 w-full px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        ❤️ Like ({p.like_count || 0})
      </button>
    </div>
  ));
}
```

**✅ Test:** Generate a AImon, then visit Gallery!

---

## Step 4: Create Custom Hook

**📍 Location:** `src/hooks/useAImonGallery.js`

**What you'll learn:** Reusable logic with custom hooks

### 4.1 Add imports

```jsx
import { useEffect, useState, useCallback } from "react";
```

### 4.2 Implement the hook

```jsx
export function useAImonGallery() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/api/gallery`);
      if (!res.ok) throw new Error("Failed to load gallery");
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return { data, loading, error, refetch: fetchGallery };
}
```

### 4.3 Update GalleryPage.jsx

Add import:

```jsx
import { useAImonGallery } from "../hooks/useAImonGallery.js";
```

Replace the manual fetch code with:

```jsx
const { data, loading, error, refetch } = useAImonGallery();
```

Update like function to use refetch:

```jsx
const like = async (id) => {
  try {
    const res = await fetch(`${API}/api/aimon/${id}/like`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to like");
    await refetch();
  } catch (e) {
    console.error(e);
  }
};
```

**✅ Test:** Gallery should still work, but now using a custom hook!

---

## Step 5: Add Context API

**📍 Locations:** `src/context/ThemeContext.jsx`, `src/main.jsx`, `src/components/Header.jsx`

**What you'll learn:** Global state with Context API

### 5.1 Implement ThemeContext.jsx

```jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

### 5.2 Update main.jsx

Add import:

```jsx
import { ThemeProvider } from "./context/ThemeContext.jsx";
```

Wrap App:

```jsx
<React.StrictMode>
  <ThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
</React.StrictMode>
```

### 5.3 Update Header.jsx

Add import:

```jsx
import { useTheme } from "../context/ThemeContext.jsx";
```

Use the hook:

```jsx
const { theme, toggleTheme } = useTheme();
```

Uncomment the theme toggle button (it's already there!)

**✅ Test:** Click the moon/sun icon to toggle dark mode!

---

## Step 6: Optimize with useMemo

**📍 Location:** `src/pages/GalleryPage.jsx`

**What you'll learn:** Performance optimization with useMemo

### 6.1 Add import

Add `useMemo` to the React import:

```jsx
import { useState, useMemo } from "react";
```

### 6.2 Add sorting/filtering state

```jsx
const [sortBy, setSortBy] = useState("newest");
const [filterType, setFilterType] = useState("all");
```

### 6.3 Create processed data with useMemo

```jsx
const processedData = useMemo(() => {
  let result = [...data];

  // Filter by type
  if (filterType !== "all") {
    result = result.filter(
      (p) => p.type?.toLowerCase() === filterType.toLowerCase()
    );
  }

  // Sort
  switch (sortBy) {
    case "likes":
      result.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
    default:
      break;
  }

  return result;
}, [data, sortBy, filterType]);

const availableTypes = useMemo(() => {
  const types = new Set(data.map((p) => p.type).filter(Boolean));
  return Array.from(types).sort();
}, [data]);
```

### 6.4 Add controls in the header div

```jsx
<div className="flex flex-col sm:flex-row gap-3">
  <div className="flex items-center gap-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Sort:
    </label>
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
    >
      <option value="newest">Newest</option>
      <option value="likes">Most Liked</option>
      <option value="name">Name</option>
    </select>
  </div>

  {availableTypes.length > 0 && (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Type:
      </label>
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
      >
        <option value="all">All Types</option>
        {availableTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  )}
</div>
```

### 6.5 Update rendering to use processedData

Change `{data.map(...)` to `{processedData.map(...)}`

**✅ Test:** Sort and filter your AImon!

---

## Step 7: Add Suspense & Lazy Loading (React 19)

**📍 Location:** `src/App.jsx`

**What you'll learn:** Code splitting and lazy loading

### 8.1 Add imports

```jsx
import { lazy, Suspense } from "react";
```

### 8.2 Replace regular imports with lazy

Comment out:

```jsx
// import GeneratorPage from './pages/GeneratorPage.jsx'
// import GalleryPage from './pages/GalleryPage.jsx'
```

Add lazy imports:

```jsx
const GeneratorPage = lazy(() => import("./pages/GeneratorPage.jsx"));
const GalleryPage = lazy(() => import("./pages/GalleryPage.jsx"));
```

### 8.3 Wrap Routes in Suspense

```jsx
<main className="flex-1 container mx-auto p-4 lg:p-8">
  <Suspense fallback={<Spinner label="Loading page..." />}>
    <Routes>
      <Route path="/" element={<GeneratorPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
    </Routes>
  </Suspense>
</main>
```

**✅ Test:** Navigate between pages - you'll see loading spinner briefly!

---

## Step 8: Add Error Boundary

**📍 Locations:** `src/components/ErrorBoundary.jsx`, `src/App.jsx`

**What you'll learn:** Error handling in React

### 9.1 Implement ErrorBoundary.jsx

```jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 9.2 Update App.jsx

Add import:

```jsx
import ErrorBoundary from "./components/ErrorBoundary.jsx";
```

Wrap everything:

```jsx
return (
  <ErrorBoundary>
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Rest of the app */}
    </div>
  </ErrorBoundary>
);
```

**✅ Test:** Error handling is now in place! To test, temporarily throw an error in a component.

---

## 🎉 Congratulations!

You've built a complete React 19 application with:

- ✅ Routing
- ✅ Modern hooks and patterns
- ✅ Global state management
- ✅ Performance optimizations
- ✅ React 19 features
- ✅ Error handling

### Next Steps

- Experiment with the app
- Try adding new features
- Check out the React documentation
- Build your own projects!

### Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [React 19 Blog](https://react.dev/blog)

---

Made with ❤️ for the React community
