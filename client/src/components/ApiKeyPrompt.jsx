import { useState } from 'react';
import { useApiKey } from '../context/ApiKeyContext';

export default function ApiKeyPrompt() {
  const { apiKey, updateApiKey } = useApiKey();
  const [showPrompt, setShowPrompt] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      updateApiKey(inputValue.trim());
      setShowPrompt(false);
      setInputValue('');
    }
  };

  // Check if API key is missing and show button to prompt
  if (apiKey) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-600 dark:text-green-400">
          ✓ API Key Set
        </span>
        <button
          onClick={() => {updateApiKey(''); setShowPrompt(true);}}
          className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div>
      {!showPrompt ? (
        <button
          onClick={() => setShowPrompt(true)}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
        >
          ⚠️ Set Gemini API Key
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="password"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPrompt(false);
                setInputValue('');
              }}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {!apiKey && !showPrompt && (
        <p className="text-xs text-gray-500 mt-1">
          Get your key from{' '}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            Google AI Studio
          </a>
        </p>
      )}
    </div>
  );
}
