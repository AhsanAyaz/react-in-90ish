// ⏸️ WORKSHOP STEP 1: Set Up Routing
// TODO: Import Link and NavLink from react-router-dom

import ApiKeyPrompt from './ApiKeyPrompt.jsx';

export default function Header() {
  // ⏸️ WORKSHOP STEP 5: Add Context
  // TODO: Import and use useTheme hook here
  // const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
        {/* ⏸️ WORKSHOP STEP 1: Replace div with Link */}
        <div className="text-xl font-bold text-gray-900 dark:text-white">
          Doodle → PokAImon
        </div>

        <div className="flex items-center gap-4">
          <ApiKeyPrompt />
          
          <nav className="flex gap-2">
            {/* ⏸️ WORKSHOP STEP 1: Add NavLink components here */}
            {/* TODO: Add NavLink to="/" and to="/gallery" */}
          </nav>

          {/* ⏸️ WORKSHOP STEP 5: Uncomment theme toggle */}
          {/* <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button> */}
        </div>
      </div>
    </header>
  );
}
