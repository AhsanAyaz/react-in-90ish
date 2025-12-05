import { useState, useMemo } from "react";
import Spinner from "../components/Spinner.jsx";
import { useAImonGallery } from "../hooks/useAImonGallery.js";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export default function GalleryPage() {
  const { data, loading, error, refetch } = useAImonGallery();
  const [sortBy, setSortBy] = useState("newest");
  const [filterType, setFilterType] = useState("all");

  const processedData = useMemo(() => {
    let result = [...data];

    // Filter by type
    if (filterType !== "all") {
      result = result.filter(
        (p) => p.type?.toLowerCase() === filterType.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case "likes":
        result.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        break;
    }

    return result;
  }, [data, sortBy, filterType]);

  const availableTypes = useMemo(() => {
    const types = new Set(data.map((p) => p.type).filter(Boolean));
    return Array.from(types).sort();
  }, [data]);

  const like = async (id) => {
    try {
      const res = await fetch(`${API}/api/aimon/${id}/like`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to like");
      await refetch();
    } catch (e) {
      console.error(e);
    }
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

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="likes">Most Liked</option>
              <option value="name">Name</option>
            </select>
          </div>

          {availableTypes.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Type:
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="all">All Types</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {processedData.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No generated AImon yet. Head to the Generator!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedData.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4"
            >
              <img
                src={`${API}${p.image_url}`}
                alt={p.name}
                className="w-full aspect-square object-contain"
              />
              <h3 className="text-xl font-semibold mt-3 text-gray-900 dark:text-white">
                {p.name}
              </h3>
              {p.type && (
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200">
                  {p.type}
                </span>
              )}
              {p.characteristics && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {p.characteristics}
                </p>
              )}
              {p.powers && Array.isArray(p.powers) && p.powers.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Powers:
                  </p>
                  {p.powers.map((power, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-gray-600 dark:text-gray-400"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        {power.name}
                      </span>
                      {power.description && <span> - {power.description}</span>}
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => like(p.id)}
                className="mt-3 w-full px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                ❤️ Like ({p.like_count || 0})
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
