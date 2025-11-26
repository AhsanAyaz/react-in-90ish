// ============================================
// CONDITIONAL RENDERING IN REACT
// ============================================

import { useState } from 'react';

// Example 1: If/Else with Variable
function IfElseExample() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let content;
  if (isLoggedIn) {
    content = <h2>Welcome back!</h2>;
  } else {
    content = <h2>Please sign in.</h2>;
  }

  return (
    <div>
      {content}
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  );
}

// Example 2: Ternary Operator
function TernaryExample() {
  const [isDay, setIsDay] = useState(true);

  return (
    <div>
      <h2>{isDay ? '☀️ Good Morning!' : '🌙 Good Evening!'}</h2>
      <button onClick={() => setIsDay(!isDay)}>Toggle Time</button>
    </div>
  );
}

// Example 3: Logical AND (&&)
function LogicalAndExample() {
  const [hasNotifications, setHasNotifications] = useState(true);
  const [count, setCount] = useState(3);

  return (
    <div>
      <h3>Notifications</h3>
      {hasNotifications && <span style={{ color: 'red' }}>🔔 You have {count} new messages!</span>}
      <br />
      <button onClick={() => setHasNotifications(!hasNotifications)}>
        Toggle Notifications
      </button>
    </div>
  );
}

// Example 4: Logical OR (||)
function LogicalOrExample() {
  const [username, setUsername] = useState('');

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
      />
      <h3>Hello, {username || 'Guest'}!</h3>
    </div>
  );
}

// Example 5: Multiple Conditions
function MultipleConditionsExample() {
  const [status, setStatus] = useState('pending');

  const getStatusMessage = () => {
    if (status === 'pending') return '⏳ Processing...';
    if (status === 'success') return '✅ Success!';
    if (status === 'error') return '❌ Error occurred!';
    return '❓ Unknown status';
  };

  return (
    <div>
      <h3>{getStatusMessage()}</h3>
      <button onClick={() => setStatus('pending')}>Pending</button>
      <button onClick={() => setStatus('success')}>Success</button>
      <button onClick={() => setStatus('error')}>Error</button>
    </div>
  );
}

// Example 6: Switch Statement
function SwitchExample() {
  const [role, setRole] = useState('user');

  const renderContent = () => {
    switch (role) {
      case 'admin':
        return <div>👑 Admin Dashboard</div>;
      case 'moderator':
        return <div>🛡️ Moderator Panel</div>;
      case 'user':
        return <div>👤 User Profile</div>;
      default:
        return <div>🚫 Access Denied</div>;
    }
  };

  return (
    <div>
      {renderContent()}
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => setRole('admin')}>Admin</button>
        <button onClick={() => setRole('moderator')}>Moderator</button>
        <button onClick={() => setRole('user')}>User</button>
        <button onClick={() => setRole('guest')}>Guest</button>
      </div>
    </div>
  );
}

// Example 7: Conditional Classes/Styles
function ConditionalStylesExample() {
  const [isActive, setIsActive] = useState(false);

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: isActive ? '#4CAF50' : '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <button style={buttonStyle} onClick={() => setIsActive(!isActive)}>
      {isActive ? 'Active' : 'Inactive'}
    </button>
  );
}

// Example 8: Null Rendering (Hide Component)
function NullRenderingExample() {
  const [showWarning, setShowWarning] = useState(true);

  if (!showWarning) {
    return null; // Component doesn't render anything
  }

  return (
    <div style={{ background: '#fff3cd', padding: '10px', borderRadius: '4px' }}>
      <strong>⚠️ Warning:</strong> This is important!
      <button onClick={() => setShowWarning(false)} style={{ marginLeft: '10px' }}>
        Dismiss
      </button>
    </div>
  );
}

// Example 9: Loading State
function LoadingStateExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = () => {
    setIsLoading(true);
    setData(null);
    
    // Simulate API call
    setTimeout(() => {
      setData({ name: 'John Doe', email: 'john@example.com' });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      
      {isLoading && <p>Loading...</p>}
      
      {!isLoading && data && (
        <div style={{ marginTop: '10px', padding: '10px', background: '#e3f2fd' }}>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Email:</strong> {data.email}</p>
        </div>
      )}
      
      {!isLoading && !data && <p>No data. Click fetch to load.</p>}
    </div>
  );
}

// Example 10: Complex Authentication Flow
function AuthenticationFlow() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setHasPermission(true);
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setHasPermission(false);
  };

  if (isLoading) {
    return <div>🔄 Authenticating...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <h3>Please Login</h3>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  if (isAuthenticated && !hasPermission) {
    return <div>❌ You don't have permission to view this content.</div>;
  }

  return (
    <div>
      <h3>✅ Welcome to the Dashboard!</h3>
      <p>You have full access.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// MAIN APP - Copy this entire file to Stackblitz
export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React Conditional Rendering Examples</h1>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>1. If/Else with Variable</h3>
        <IfElseExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>2. Ternary Operator</h3>
        <TernaryExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>3. Logical AND (&&)</h3>
        <LogicalAndExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>4. Logical OR (||)</h3>
        <LogicalOrExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>5. Multiple Conditions</h3>
        <MultipleConditionsExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>6. Switch Statement</h3>
        <SwitchExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>7. Conditional Styles</h3>
        <ConditionalStylesExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>8. Null Rendering</h3>
        <NullRenderingExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>9. Loading State</h3>
        <LoadingStateExample />
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>10. Authentication Flow</h3>
        <AuthenticationFlow />
      </section>
    </div>
  );
}
