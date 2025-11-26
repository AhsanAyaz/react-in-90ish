# React in 90‑ish Minutes

#### Muhammad Ahsan Ayaz

##### Google Developer Expert | Angular & AI

---

## What You Should Know So Far

- HTML
- JavaScript (ES6+) <!-- .element: class="fragment" -->
- CSS <!-- .element: class="fragment" -->
- Git <!-- .element: class="fragment" -->
- Basic programming concepts <!-- .element: class="fragment" -->

---

## Which Tools Do We Need?

- [Antigravity](https://antigravity.dev/) OR [VSCode](https://code.visualstudio.com/Download)
- [NodeJS](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/downloads)
- [Vite](https://vitejs.dev/)
- [ES7+ React Snippets Extension (optional)](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

---

## Agenda for Today

- What is React & Virtual DOM

<!-- .element: class="fragment" -->
- JSX & Components

<!-- .element: class="fragment" -->
- Event Handlers & Forms

<!-- .element: class="fragment" -->
- Conditional Rendering & Lists

<!-- .element: class="fragment" -->
- State & Props

<!-- .element: class="fragment" -->
- Hooks: `useState`, `useEffect`, `useMemo`

<!-- .element: class="fragment" -->
- Context API & React Router

<!-- .element: class="fragment" -->
- Building a `PokAImon Generator` app (workshop)!

<!-- .element: class="fragment" -->

---

## Demo: What We'll Build

**PokAImon Generator** - AI-powered Pokémon creator

- 🎨 Draw your own creature
- 🤖 Generate AI Pokémon from doodles
- 📸 Gallery with like/filter features
- 🌙 Dark mode toggle

**Tech Stack:** React 19, Vite, Tailwind, Express + Postgres

---

## What is React?

- JavaScript library for building UIs <!-- .element: class="fragment" -->
- Created by Facebook (Meta) in 2013 <!-- .element: class="fragment" -->
- Component-based architecture <!-- .element: class="fragment" -->
- Powers Netflix, Airbnb, Instagram <!-- .element: class="fragment" -->

--

## React is NOT a Framework

| Framework        | Library          |
| ---------------- | ---------------- |
| Full solution    | Focused solution |
| Angular, Vue     | React            |
| More opinionated | More flexible    |
| Built-in router  | Choose your own  |

---

### Component-Based Architecture

<iframe src="assets/supporting-html/component-tree.html" width="100%" height="680px" style="border: none;"></iframe>

```jsx
function App() {
  return (
    <div>
      <Header />
      <Sidebar />
      <MainContent />
      <Footer />
    </div>
  );
}
```

---

# JSX

### JavaScript meets HTML

--

## What is JSX?

```jsx
// What you write
const element = <h1>Hello, React!</h1>;

// What it compiles to
const element = React.createElement('h1', null, 'Hello, React!');
```

--

## JSX Rules

1. Single parent element

<!-- .element: class="fragment" -->

2. `className` instead of `class`

<!-- .element: class="fragment" -->

3. All tags must be closed

<!-- .element: class="fragment" -->

4. JavaScript in `{curly braces}`

<!-- .element: class="fragment" -->

5. Inline styles use `camelCase`

<!-- .element: class="fragment" -->

--

## JSX Rule #1: Single Parent

```jsx
// ❌ WRONG
return (
  <h1>Title</h1>
  <p>Content</p>
)

// ✅ CORRECT
return (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
)

// ✅ Also correct - Fragment
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
)
```

--

## JSX Rule #2: className & htmlFor

```jsx
// HTML
<div class="container">
  <label for="email">Email</label>
</div>

// JSX
<div className="container">
  <label htmlFor="email">Email</label>
</div>
```

--

## JSX Rule #3: Close All Tags

```jsx
// ❌ HTML style (not allowed)
<img src="photo.jpg">
<input type="text">
<br>

// ✅ JSX style
<img src="photo.jpg" />
<input type="text" />
<br />
```

--

## JSX Rule #4: JavaScript Expressions

```jsx
const name = 'Ahsan';
const items = [1, 2, 3];

return (
  <div>
    <h1>Hello, {name}!</h1>
    <p>Sum: {2 + 2}</p>
    <p>Items: {items.length}</p>
    <p>Today: {new Date().toDateString()}</p>
  </div>
);
```

--

## JSX Rule #5: Inline Styles

```jsx
const styles = {
  color: 'blue',
  fontSize: '16px',
};

return (
  <div style={styles}>
    <h1>Hello, React!</h1>
  </div>
);
```

---

# Virtual DOM

### React's Superpower 🚀

--

## The Problem: Real DOM is Slow

```javascript
// Traditional DOM manipulation
for (let i = 0; i < 1000; i++) {
  document.getElementById(`item-${i}`).textContent = `Value ${i}`;
}
// 1000 DOM operations = 💀
```

--

## The Solution: Virtual DOM

--

<iframe src="assets/supporting-html/virtual-dom-animation.html" width="100%" height="680px" style="border: none;"></iframe>

--

1. React creates lightweight copy
2. Compares old vs new (Diffing)
3. Calculates minimum changes
4. Updates only what changed

--

## Reconciliation Process

![VDOM Updates](assets/images/vdom-updates.png)

<!-- .element: style="width: 100%; height: 500px; border: none;" -->

--

## Diffing Algorithm

```
OLD VDOM              NEW VDOM

   div                   div
  /   \                 /   \
 h1    ul              h1    ul
      /|\                   /|\
    li li li            li li li
   "A" "B" "C"         "A" "X" "C"
                            ↑
                    Only this changes!
```

--

## Why Keys Matter

```jsx
// ❌ Without keys - inefficient
<ul>
  {items.map(item => (
    <li>{item.name}</li>
  ))}
</ul>

// ✅ With keys - optimized
<ul>
  {items.map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>
```

---

# Components

### Building Blocks of React

--

## Functional Components

```jsx
// Function declaration
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Arrow function
const Welcome = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};

// Usage
<Welcome name="Ahsan" />;
```

--

## Class Components (Legacy)

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

// Modern React = Functional Components
// Use hooks instead of classes!
```

--

## Props - Component Communication

```jsx
// Parent
function App() {
  return <UserCard name="Ahsan" role="Developer" verified={true} />;
}

// Child
function UserCard({ name, role, verified }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{role}</p>
      {verified && <span>✓</span>}
    </div>
  );
}
```

--

## The `children` Prop

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Usage
<Card>
  <h1>Any content</h1>
  <p>Goes here!</p>
</Card>;
```

---

# Event Handlers

### Making Components Interactive

--

## Basic Event Handlers

```jsx
function Button() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return <button onClick={handleClick}>Click Me</button>;
}

// Inline handler
<button onClick={() => alert('Clicked!')}>Click</button>
```

--

## Common Events

```jsx
<button onClick={handleClick}>Click</button>
<input onChange={handleChange} />
<input onFocus={handleFocus} />
<input onBlur={handleBlur} />
<form onSubmit={handleSubmit} />
<div onMouseEnter={handleHover} />
<input onKeyDown={handleKeyPress} />
```

--

## Event Parameters

```jsx
function EventExample() {
  const handleClick = (event) => {
    console.log(event.target); // The clicked element
    event.preventDefault(); // Prevent default behavior
    event.stopPropagation(); // Stop bubbling
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

--

## Handlers with Arguments

```jsx
function GreetButtons() {
  const greet = (name) => {
    alert(`Hello, ${name}!`);
  };

  return (
    <div>
      <button onClick={() => greet('Alice')}>Greet Alice</button>
      <button onClick={() => greet('Bob')}>Greet Bob</button>
    </div>
  );
}
```

---

# Conditional Rendering

### Showing/Hiding Content Dynamically

--

## Ternary Operator

```jsx
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please sign in.</h1>
      )}
    </div>
  );
}
```

--

## Logical AND (&&)

```jsx
function Notifications({ count }) {
  return (
    <div>
      {count > 0 && (
        <span>You have {count} new messages!</span>
      )}
    </div>
  );
}
```

Show something only when condition is `true`

--

## Multiple Conditions

```jsx
function StatusMessage({ status }) {
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (status === 'error') {
    return <div>Error occurred!</div>;
  }
  
  if (status === 'success') {
    return <div>Success!</div>;
  }
  
  return <div>Unknown status</div>;
}
```

--

## Switch Statements

```jsx
function UserDashboard({ role }) {
  const renderContent = () => {
    switch (role) {
      case 'admin':
        return <AdminPanel />;
      case 'user':
        return <UserProfile />;
      default:
        return <GuestView />;
    }
  };

  return <div>{renderContent()}</div>;
}
```

---

# Lists & Looping

### Rendering Dynamic Data

--

## Array Mapping

```jsx
function FruitList() {
  const fruits = ['Apple', 'Banana', 'Orange'];

  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}
```

--

## Keys - Best Practice

```jsx
function UserList() {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

Always use unique IDs, not array indices!

--

## Filtering Lists

```jsx
function TodoList({ todos }) {
  const activeTodos = todos.filter((todo) => !todo.completed);

  return (
    <ul>
      {activeTodos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

--

## Dynamic Lists (Add/Remove)

```jsx
function ShoppingList() {
  const [items, setItems] = useState(['Milk', 'Bread']);

  const addItem = (item) => {
    setItems([...items, item]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item}
          <button onClick={() => removeItem(index)}>❌</button>
        </li>
      ))}
    </ul>
  );
}
```

---

# Forms & Input Handling

### Controlled Components

--

## Controlled Input

```jsx
function NameForm() {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>Hello, {name}!</p>
    </div>
  );
}
```

React controls the input value!

--

## Multiple Inputs

```jsx
function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form>
      <input name="username" onChange={handleChange} />
      <input name="email" onChange={handleChange} />
    </form>
  );
}
```

--

## Form Submission

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload!
    console.log('Submitting:', email);
    // Send to API...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

--

## Checkboxes & Radio Buttons

```jsx
function Preferences() {
  const [agreed, setAgreed] = useState(false);
  const [theme, setTheme] = useState('light');

  return (
    <div>
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
      />

      {/* Radio */}
      <input
        type="radio"
        value="light"
        checked={theme === 'light'}
        onChange={(e) => setTheme(e.target.value)}
      />
    </div>
  );
}
```

---

# State Management

### Making Components Dynamic

--

## useState Hook

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

--

## useState Anatomy

```jsx
const [count, setCount] = useState(0);
//      ↑        ↑              ↑
//   Current  Setter        Initial
//    value  function        value
```

Returns an array with exactly 2 elements

--

## State Update Rules

```jsx
// ❌ WRONG - Multiple updates don't stack
setCount(count + 1);
setCount(count + 1); // Still adds 1!

// ✅ CORRECT - Functional updates
setCount((prev) => prev + 1);
setCount((prev) => prev + 1); // Adds 2!
```

--

## State is Immutable

```jsx
// ❌ WRONG - Direct mutation
const [user, setUser] = useState({ name: 'A' });
user.name = 'B'; // NO!

// ✅ CORRECT - Create new object
setUser({ ...user, name: 'B' });

// ❌ WRONG - Array mutation
items.push(newItem); // NO!

// ✅ CORRECT - Spread operator
setItems([...items, newItem]);
```

---

# useEffect Hook

### Side Effects in React

--

## What Are Side Effects?

- Data fetching
- Subscriptions
- DOM manipulation
- Timers
- Logging

--

## useEffect Anatomy

```jsx
useEffect(() => {
  // Effect code runs here
  console.log('Effect ran!');

  return () => {
    // Cleanup (optional)
    console.log('Cleanup ran!');
  };
}, [dependencies]);
```

--

## Three Ways to Use useEffect

```jsx
// 1. Run on EVERY render
useEffect(() => {
  /* ... */
});

// 2. Run ONLY on mount
useEffect(() => {
  /* ... */
}, []);

// 3. Run when dependencies change
useEffect(() => {
  /* ... */
}, [userId]);
```

--

## Real-World Example

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <Spinner />;
  return <div>{user.name}</div>;
}
```

--

## Complete API Call Pattern

```jsx
function PokemonGallery() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3001/api/gallery');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPokemon(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {pokemon.map((p) => (
        <PokemonCard key={p.id} pokemon={p} />
      ))}
    </div>
  );
}
```

Production-ready with error handling!

--

## Common Mistakes

```jsx
// ❌ Missing dependency
useEffect(() => {
  console.log(count); // Using count...
}, []); // ...but not in deps!

// ❌ Object in dependencies
useEffect(() => {
  // Runs EVERY render!
}, [{ name: 'test' }]);
```

---

# Context API

### Sharing State Across Components

--

## The Problem: Prop Drilling

```jsx
<App user={user}>
  <Header user={user}>
    <Nav user={user}>
      <UserMenu user={user}>
        <Avatar user={user} />
      </UserMenu>
    </Nav>
  </Header>
</App>
```

😱 Passing props through every level!

--

## The Solution: Context

```jsx
// 1. Create context
const UserContext = createContext(null);

// 2. Provider component
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 3. Custom hook
function useUser() {
  return useContext(UserContext);
}
```

--

## Using Context

```jsx
// Wrap app
<UserProvider>
  <App />
</UserProvider>;

// Use anywhere - no prop drilling!
function Avatar() {
  const { user } = useUser();
  return <img src={user.avatar} />;
}
```

--

## Context Best Practices

- Split contexts by concern <!-- .element: class="fragment" -->
- Don't use for frequently changing state <!-- .element: class="fragment" -->
- Create custom hooks for contexts <!-- .element: class="fragment" -->
- Consider state management libraries for complex state <!-- .element: class="fragment" -->

---

# React Router

### Navigation Made Easy

--

## Why Routing?

Single Page Applications (SPAs) need:

- Multiple "pages" without page reload <!-- .element: class="fragment" -->
- URL-based navigation <!-- .element: class="fragment" -->
- Browser back/forward support <!-- .element: class="fragment" -->
- Shareable URLs <!-- .element: class="fragment" -->

--

## Installation

```bash
npm install react-router-dom
```

React Router is the standard routing library for React

--

## Basic Setup

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
```

--

## Navigation with Link

```jsx
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
}
```

`Link` prevents full page reload!

---

# Backend Architecture & Performance

### Powered by Advanced Caching

--

## Our Tech Stack

**Frontend:**
- ⚛️ React 19
- 🎨 Tailwind CSS
- 🔧 Vite

**Backend:**
- 🟢 Node.js + Express
- 🐘 PostgreSQL
- ⚡ **Memcached**

--

## Our Caching Strategy

**What we're using: Memcached** 🚀

Fast in-memory caching for database query results

**Why Memcached?**
- Simple key-value storage (perfect for our needs)
- Easy to set up and use
- 10-40x performance improvement
- Built-in support on most hosting platforms

--

## How Memcached Works

```
┌─────────────────────┐
│   React Frontend    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Express Server     │
└──────────┬──────────┘
           │
      Cache check
           │
    ┌──────▼──────┐
    │  Memcached  │ ← Fast! (1-5ms)
    └──────┬──────┘
           │
    Cache miss?
           │
┌──────────▼──────────┐
│  PostgreSQL         │ ← Slower (50-200ms)
└─────────────────────┘
```

--

## Performance Benefits

| Metric | Without Cache | With Memcached |
|--------|---------------|----------------|
| **Response Time** | ~150ms | ~3ms |
| **DB Load** | 100% queries hit DB | ~10% queries hit DB |
| **Requests/sec** | ~200 | ~2000 |

**Result:** 50x faster responses, 10x more capacity! ⚡

--

## Code Example

```javascript
// Gallery endpoint with Memcached
app.get('/api/gallery', async (req, res) => {
  const cacheKey = 'gallery:all';
  
  // Try cache first
  const cached = await cache.get(cacheKey);
  if (cached) {
    return res.json(cached); // ⚡ Cache hit! ~3ms
  }
  
  // Cache miss - fetch from DB
  const pokemon = await db.list(); // ~150ms
  await cache.set(cacheKey, pokemon, 300); // Cache for 5 min
  res.json(pokemon);
});
```

--

## Other Caching Options

**Redis:**
- When you need sessions, leaderboards, real-time features
- More features, slightly more complex

**Varnish/CDN:**
- HTTP caching at the edge
- Great for static content

**For our app:** Memcached gives us 90% of the benefits with 10% of the complexity!

--

## How It Works in Our App

```jsx
// React Frontend fetches data
const response = await fetch('/api/pokemon/123');
// ↓
// Varnish checks cache (hit!)
// Returns cached response in 10ms ⚡
//
// OR
//
// Varnish miss → Redis checks (hit!)
// OR
// Redis miss → Memcached checks (hit!)
// OR
// All miss → PostgreSQL query → Cache for next time
```

**Smart caching = Amazing UX!**

---

# What's Next?

### React 19 & Advanced Topics

--

## React 19 is Here! 🎉

New features we didn't cover today:

- `use` hook for promises <!-- .element: class="fragment" -->
- `useActionState` for forms <!-- .element: class="fragment" -->
- `useOptimistic` for instant UI <!-- .element: class="fragment" -->
- Server Components & Actions <!-- .element: class="fragment" -->
- React Compiler (auto-optimization) <!-- .element: class="fragment" -->

**💡 Comment below if you want a dedicated React 19 video!**

--

## Advanced Topics

Also available as bonus content:

- **Advanced Hooks:** useRef, useMemo, useCallback, useReducer
- **Performance:** Code splitting, lazy loading, virtualization
- **Advanced Router:** useParams, useNavigate, protected routes
- **Suspense & Error Boundaries**

**Check out BONUS-ADVANCED.md for details!**

---

# Let's Build! 🚀

### Time to Code Together

--

Building **PokAImon Generator** - a complete React app:

- 🎨 Draw doodles and generate AI PokAImon
- 🖼️ Browse gallery with filtering/sorting  
- 🧭 React Router navigation
- 🎣 Custom hooks & Context API
- 📦 Complete production-ready app

---

# Thank You! 🙏

### Muhammad Ahsan Ayaz

- YouTube: Code with Ahsan
- Twitter: @codewith_ahsan
- LinkedIn: /in/ahsanayaz
- All other socials: [meetme.cards/p/codewithahsan](https://meetme.cards/p/codewithahsan)

**Like, Subscribe & Share!**

---

## Resources

- [React Documentation](https://react.dev)
- [React 19 Blog](https://react.dev/blog)
- [This Course's GitHub Repo](https://github.com/AhsanAyaz/react-in-90ish)
- [Code with Ahsan YouTube](https://www.youtube.com/@codewithahsan)
