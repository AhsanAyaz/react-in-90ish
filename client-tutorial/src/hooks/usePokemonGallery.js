// ⏸️ WORKSHOP STEP 4: Create Custom Hook
// TODO: Import useEffect, useState, useCallback

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export function useAImonGallery() {
  /* TODO: Implement custom hook
    1. Create state for: data, loading, error
    2. Create fetchGallery function with useCallback
    3. Use useEffect to fetch on mount
    4. Return { data, loading, error, refetch }
  */

  return {
    data: [],
    loading: true,
    error: null,
    refetch: () => console.log("TODO: Implement refetch"),
  };
}
