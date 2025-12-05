// ⏸️ WORKSHOP STEP 3: Fetch Data with useEffect
// TODO: Import useState and useEffect
// TODO: Import useMemo from 'react' for Step 6
import Spinner from "../components/Spinner.jsx";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export default function GalleryPage() {
  // ⏸️ WORKSHOP STEP 4: Use Custom Hook
  // TODO: Replace manual fetch with useAImonGallery hook
  // const { data, loading, error, refetch } = useAImonGallery();

  // Temporary placeholder data
  const data = [];
  const loading = false;
  const error = null;

  // ⏸️ WORKSHOP STEP 6: Add useMemo for Sorting
  // TODO: Add state for sortBy and filterType
  // TODO: Implement useMemo to process and filter data

  const like = async (id) => {
    // TODO: Implement like function (will be added in Step 4)
    console.log("TODO: Implement like", id);
  };

  if (loading) return <Spinner label="Loading gallery…" />;
  if (error)
    return (
      <div className="text-red-500 dark:text-red-400">
        Failed to load: {String(error)}
      </div>
    );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          AImon Gallery
        </h2>

        {/* ⏸️ WORKSHOP STEP 6: Add Sort and Filter Controls */}
        {/* TODO: Add select dropdowns for sorting and filtering */}
      </div>

      {data.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No generated AImon yet. Head to the Generator!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TODO: Map over processedData and render cards */}
        </div>
      )}
    </div>
  );
}
