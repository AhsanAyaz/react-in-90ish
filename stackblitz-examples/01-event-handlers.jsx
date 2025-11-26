// ============================================
// EVENT HANDLERS IN REACT
// ============================================

import { useState } from 'react';

// Example 1: Basic Click Handler
function BasicClickExample() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return <button onClick={handleClick}>Click Me</button>;
}

// Example 2: Inline Handler
function InlineHandlerExample() {
  return <button onClick={() => alert('Inline click!')}>Click Me</button>;
}

// Example 3: Handler with Event Parameter
function EventParameterExample() {
  const handleClick = (event) => {
    console.log('Event:', event);
    console.log('Target:', event.target);
    console.log('Type:', event.type);
  };

  return <button onClick={handleClick}>Inspect Event</button>;
}

// Example 4: Handler with Arguments
function HandlerWithArgsExample() {
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

// Example 5: Multiple Event Types
function MultipleEventsExample() {
  const [status, setStatus] = useState('');

  return (
    <div>
      <input
        type="text"
        onFocus={() => setStatus('Input focused!')}
        onBlur={() => setStatus('Input blurred!')}
        onChange={(e) => setStatus(`Typing: ${e.target.value}`)}
        placeholder="Type something..."
      />
      <p>Status: {status}</p>
    </div>
  );
}

// Example 6: Preventing Default Behavior
function PreventDefaultExample() {
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents page reload
    alert('Form submitted without reload!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Enter name" />
      <button type="submit">Submit</button>
    </form>
  );
}

// Example 7: Event Propagation (Bubbling)
function EventPropagationExample() {
  const handleParentClick = () => {
    console.log('Parent div clicked');
  };

  const handleChildClick = (event) => {
    event.stopPropagation(); // Prevents bubbling to parent
    console.log('Child button clicked');
  };

  return (
    <div 
      onClick={handleParentClick} 
      style={{ padding: '20px', background: '#f0f0f0' }}
    >
      <button onClick={handleChildClick}>Click Me (No Bubbling)</button>
    </div>
  );
}

// Example 8: Keyboard Events
function KeyboardEventsExample() {
  const [key, setKey] = useState('');

  const handleKeyDown = (event) => {
    setKey(`Key pressed: ${event.key}`);
    
    // Special key detection
    if (event.key === 'Enter') {
      alert('Enter key pressed!');
    }
  };

  return (
    <div>
      <input
        type="text"
        onKeyDown={handleKeyDown}
        placeholder="Press any key..."
      />
      <p>{key}</p>
    </div>
  );
}

// Example 9: Mouse Events
function MouseEventsExample() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ 
        height: '200px', 
        background: '#e0e0e0', 
        padding: '20px' 
      }}
    >
      <p>Mouse Position: X: {position.x}, Y: {position.y}</p>
    </div>
  );
}

// Example 10: Complete Interactive Counter
function InteractiveCounter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);
  const incrementBy = (amount) => setCount(count + amount);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Count: {count}</h2>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={decrement}>-1</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+1</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => incrementBy(5)}>+5</button>
        <button onClick={() => incrementBy(10)}>+10</button>
      </div>
    </div>
  );
}

// MAIN APP - Copy this entire file to Stackblitz
export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React Event Handlers Examples</h1>
      
      <section style={{ marginBottom: '30px' }}>
        <h3>1. Basic Click</h3>
        <BasicClickExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>2. Inline Handler</h3>
        <InlineHandlerExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>3. Event Parameter (Check Console)</h3>
        <EventParameterExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>4. Handler with Arguments</h3>
        <HandlerWithArgsExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>5. Multiple Events</h3>
        <MultipleEventsExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>6. Prevent Default (Form)</h3>
        <PreventDefaultExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>7. Event Propagation (Check Console)</h3>
        <EventPropagationExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>8. Keyboard Events</h3>
        <KeyboardEventsExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>9. Mouse Events</h3>
        <MouseEventsExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h3>10. Interactive Counter</h3>
        <InteractiveCounter />
      </section>
    </div>
  );
}
