// ⏸️ WORKSHOP STEP 2: Add Basic State
// TODO: Import useState from'react'
import Canvas from "../components/Canvas.jsx";
import Spinner from "../components/Spinner.jsx";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export default function GeneratorPage() {
  // ⏸️ WORKSHOP STEP 2: Define state variables
  // TODO: Add state for: isGenerating, error, lastResult, hasDoodle
  // const [isGenerating, setIsGenerating] = useState(false)
  // const [error, setError] = useState(null)
  // const [lastResult, setLastResult] = useState(null)
  // const [hasDoodle, setHasDoodle] = useState(false)

  const handleGenerate = async (base64) => {
    // ⏸️ WORKSHOP STEP 2: Implement API call with state management
    /* TODO: Implement this function:
      1. Set isGenerating to true
      2. Clear any previous errors
      3. Make POST request to ${API}/api/generate with { doodle_data: base64 }
      4. Handle response and update lastResult
      5. Handle errors
      6. Finally, set isGenerating to false
    */
    console.log("TODO: Implement generate function", base64);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <Canvas
        onGenerate={handleGenerate}
        onCanvasChange={/* TODO: setHasDoodle */ () => {}}
        disabled={false /* TODO: Use isGenerating || !hasDoodle || !apiKey */}
      />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
          AImon Result
        </h2>
        <div className="relative w-full aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-700 overflow-hidden p-2">
          {/* TODO: Add conditional rendering based on state */}
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>Your generated AImon will appear here.</p>
          </div>
        </div>
        {error && (
          <div className="mt-4 text-red-500 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        {/* TODO: Display lastResult details if present */}
      </div>
    </div>
  );
}
