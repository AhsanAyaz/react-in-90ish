import { createContext, useContext, useState, useEffect } from 'react';

const ApiKeyContext = createContext(null);

export function ApiKeyProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => {
    // Load from localStorage on init
    return localStorage.getItem('GEMINI_API_KEY') || '';
  });

  const updateApiKey = (newKey) => {
    setApiKey(newKey);
    if (newKey) {
      localStorage.setItem('GEMINI_API_KEY', newKey);
    } else {
      localStorage.removeItem('GEMINI_API_KEY');
    }
  };

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('GEMINI_API_KEY');
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, updateApiKey, clearApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within ApiKeyProvider');
  }
  return context;
}
