import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Header from "./components/Header.jsx";
import Spinner from "./components/Spinner.jsx";
import { ApiKeyProvider } from "./context/ApiKeyContext.jsx";

// Lazy load pages for code splitting
const GeneratorPage = lazy(() => import("./pages/GeneratorPage.jsx"));
const GalleryPage = lazy(() => import("./pages/GalleryPage.jsx"));

export default function App() {
  return (
    <ApiKeyProvider>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors">
          <Header />
          <main className="flex-1 container mx-auto p-4 lg:p-8">
            <Suspense fallback={<Spinner label="Loading page..." />}>
              <Routes>
                <Route path="/" element={<GeneratorPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </ErrorBoundary>
    </ApiKeyProvider>
  );
}
