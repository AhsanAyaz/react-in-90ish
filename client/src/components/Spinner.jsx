export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      {label && (
        <p className="mt-4 text-gray-600 dark:text-gray-400">{label}</p>
      )}
    </div>
  );
}
