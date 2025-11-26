// ⏸️ WORKSHOP STEP 1: Set Up Routing
// TODO: Import Routes and Route from 'react-router-dom'

// ⏸️ WORKSHOP STEP 7: Add Suspense and Lazy Loading
// TODO: Import lazy and Suspense from 'react'

// ⏸️ WORKSHOP STEP 8: Add Error Boundary
// TODO: Import ErrorBoundary component

import Header from "./components/Header.jsx";
import Spinner from "./components/Spinner.jsx";
import { ApiKeyProvider } from "./context/ApiKeyContext.jsx";

// Regular imports (will be replaced with lazy in Step 8)
import GeneratorPage from "./pages/GeneratorPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";

// ⏸️ WORKSHOP STEP 7: Replace above with lazy loading
// const GeneratorPage = lazy(() => import('./pages/GeneratorPage.jsx'))
// const GalleryPage = lazy(() => import('./pages/GalleryPage.jsx'))

export default function App() {
  return (
    <ApiKeyProvider>
      {/* ⏸️ WORKSHOP STEP 8: Wrap in ErrorBoundary */}
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors">
        <Header />
        <main className="flex-1 container mx-auto p-4 lg:p-8">
          {/* ⏸️ WORKSHOP STEP 1: Set up Routes */}
          {/* TODO: Wrap content in Suspense (Step 7) */}
          {/* TODO: Add Routes with Route elements for "/" and "/gallery" */}

          {/* Placeholder - replace with routing */}
          <div className="text-center text-gray-600 dark:text-gray-400 mt-20">
            <h1 className="text-3xl font-bold mb-4">
              Welcome to PokAImon Generator!
            </h1>
            <p>Complete Workshop Step 2 to set up routing</p>
          </div>
        </main>
      </div>
    </ApiKeyProvider>
  );
}
