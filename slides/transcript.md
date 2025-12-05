# React in 90-ish Minutes - Video Transcript

## 0:00 - Intro & The "Why"

**(Face to Camera)**
"Hey everyone! Welcome back. Today, we’re doing something crazy. We are going to learn React—the _modern_ React of 2025—in about 90 minutes. And we’re not just building a To-Do list. We’re building a full-stack **AImon Generator**."

**(Screen Share: Demo of the finished app)**
"Check this out. We’ll have a canvas where you draw a doodle... hit 'Generate'... and boom! AI turns it into a AImon card with stats, powers, and a type. We’ll save it to a database and build a gallery. It’s a real app."

**(Face to Camera)**
"But here’s the kicker: React is changing. You’ve heard about **React 19**, the **Compiler**, **Server Components**. It’s a lot. Most tutorials are stuck in 2020. Today, I’m going to teach you the core fundamentals that haven't changed, _and_ I’ll show you where React is going so you don't learn obsolete habits. Let’s dive in."

---

## 5:00 - Core Concepts: The Virtual DOM

**(Slide: `virtual-dom.html` Animation)**
"First, how does React actually work? Why is it fast?"

"Imagine your website is a house. Changing the HTML directly is like knocking down a wall just to hang a picture. It’s slow and expensive. React uses something called the **Virtual DOM**."

**(Action: Trigger Animation)**
"Look at this. On the left is the Virtual DOM—a blueprint. On the right is the Real DOM—the house. When we change something in React, we update the blueprint first. React compares the new blueprint with the old one (this is called 'diffing'), finds exactly what changed, and then surgically updates _only_ that part of the real house. This is why React feels so snappy."

---

## 10:00 - Core Concepts: Components & Data Flow

**(Slide: `component-tree.html` Animation)**
"Next: **Components**. We build apps out of Lego bricks. A button is a component. A card is a component. The whole page is a component."

**(Action: Trigger Animation - Data Flow)**
"Data in React flows **down**. Like a waterfall. We call this 'Props'. Parent passes props to child. Child passes props to grandchild. If a child wants to talk back? It has to use an event—like a phone call up the chain."

**(Action: Trigger Animation - React Compiler)**
"Now, a quick 2025 update. Historically, if a parent re-rendered, all children re-rendered. We used to fix this manually with `useMemo` and `useCallback`. But look at this..."
**(Visual shows 'Compiler Mode')**
"With the new **React Compiler**, React automatically figures out what depends on what. It 'memoizes' for you. You just write code, and it runs fast. We won't obsess over optimization today because the Compiler has our back."

---

## 15:00 - Setup: Vite & Project Structure

**(Screen Share: Terminal)**
"Enough theory. Let's code. We’re using **Vite**. It’s the standard build tool now—blazing fast."

```bash
npm create vite@latest client -- --template react
```

"We’ll also grab **Tailwind CSS** because I don't want to write 500 lines of CSS today."
_(Fast forward setup steps)_

"Here’s our structure:

- `App.jsx`: The root.
- `main.jsx`: Where React attaches to the HTML.
- `components/`: Our Lego bricks."

---

## 20:00 - Live Coding: The Shell & Routing

"We need two pages: a **Generator** and a **Gallery**. For that, we need a Router."

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GeneratorPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
    </Routes>
  );
}
```

"Notice how `App` is just a function? That's it. It returns UI."

---

## 30:00 - The Context API (and the `use` API)

**(Slide: `context-api.html` Animation)**
"Okay, we have a global problem. We want a 'Dark Mode' or a 'User Session' available everywhere. Passing props down 10 layers is called 'Prop Drilling', and it sucks."

**(Action: Trigger Animation)**
"See this? Instead of drilling, we use **Context**. It’s like a wormhole. We drop data in at the top, and any component at the bottom can grab it."

**(Code: ThemeContext)**
"In React 19, we can consume this even easier with the new `use` API. But for now, let's build a simple `ThemeContext`."

```jsx
// contexts/ThemeContext.jsx
import { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

"Now we wrap our app in `ThemeProvider`, and boom—dark mode accessible anywhere."

---

## 40:00 - The Generator: State & Effects

"Let's build the Generator. We need to track:

1. Is it generating? (`isLoading`)
2. The result? (`data`)
3. Any errors? (`error`)"

"This is **State**. `useState`."

```jsx
const [isGenerating, setIsGenerating] = useState(false);
```

"And when we want to talk to the outside world (like our API), we use **Effects** or Event Handlers. Since we generate on _click_, we just need a handler."

**(Code: handleGenerate)**
"We’ll fetch from our Express backend. By the way, if we were using **Next.js** (which uses React Server Components), this fetch might happen directly on the server. But since we're in a Client SPA, we fetch just like standard JS."

---

## 55:00 - Forms & Actions (The Future)

"We have a form here. In standard React, we handle `onSubmit`. But watch out for **React 19 Actions**. They let you pass a function _directly_ to the `action` prop of a form, and React handles the pending state for you with `useActionState`."

"We’ll stick to the simple `onSubmit` for this crash course, but just know: handling forms is getting WAY easier."

---

## 60:00 - The Canvas & Custom Hooks

"I’m pasting in a `Canvas` component because drawing logic is heavy math. But look at how we use it. We pass a function `onGenerate` _down_ to it. The Canvas calls it with the image data."

"Now, let's look at the Gallery. We need to fetch data when the component mounts. That’s `useEffect`."

```jsx
useEffect(() => {
  fetch('/api/gallery').then(...)
}, [])
```

"But copying this logic everywhere is messy. Let's build a **Custom Hook**: `useAImonGallery`."

```jsx
// hooks/useAImonGallery.js
export function useAImonGallery() {
  const [data, setData] = useState([]);
  // ... fetch logic ...
  return { data, loading, refetch };
}
```

"Now our component is clean: `const { data } = useAImonGallery()`."

---

## 75:00 - Lists & Keys

"We have a list of AImon. We map over them."

```jsx
{
  data.map((p) => <Card key={p.id} aimon={p} />);
}
```

"Don't forget the `key`! Remember the Virtual DOM? The `key` tells React exactly which item is which, so if we reorder them, it doesn't destroy and recreate the DOM nodes. It just moves them."

---

## 85:00 - Wrap Up & Next Steps

"We built a full app. We covered:

- **Components & JSX**
- **State & Effects**
- **Context API** for global data
- **Custom Hooks** for logic reuse
- **The Virtual DOM** (conceptually)
- And we peeked at **React 19** features like the Compiler and Actions."

"Where to go next?

1. **TypeScript**: It’s essential for big apps.
2. **Next.js / Remix**: For Server Components and full-stack React.
3. **Testing**: Vitest & React Testing Library."

"Thanks for watching. Code is in the description. Go build something awesome!"
