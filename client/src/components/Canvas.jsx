import { useEffect, useRef, useState } from "react";

const COLORS = [
  "#000000",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#78716C",
  "#FFFFFF",
];

export default function Canvas({ onGenerate, onCanvasChange, disabled }) {
  const canvasRef = useRef(null);
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const drawingRef = useRef({ isDrawing: false, lastX: 0, lastY: 0 });

  // Canvas setup with useEffect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      const parent = canvas.parentElement;
      const size = Math.min(parent.clientWidth, parent.clientHeight);
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 8;
      ctx.strokeStyle = activeColor;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [activeColor]);

  // Mouse and touch event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const getCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches && e.touches.length) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const start = (e) => {
      e.preventDefault();
      drawingRef.current.isDrawing = true;
      const { x, y } = getCoords(e);
      drawingRef.current.lastX = x;
      drawingRef.current.lastY = y;
    };
    const draw = (e) => {
      if (!drawingRef.current.isDrawing) return;
      e.preventDefault();
      const { x, y } = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(drawingRef.current.lastX, drawingRef.current.lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = activeColor;
      ctx.stroke();
      drawingRef.current.lastX = x;
      drawingRef.current.lastY = y;
      onCanvasChange?.(true);
    };
    const stop = () => (drawingRef.current.isDrawing = false);

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stop);
    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stop);
      canvas.removeEventListener("mouseleave", stop);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stop);
    };
  }, [activeColor, onCanvasChange]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onCanvasChange?.(false);
  };

  const handleGenerate = async () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    const base64 = dataUrl.split(",")[1];
    onGenerate?.(base64);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
        Doodle Area
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Choose a color:
        </label>
        <div className="flex flex-wrap gap-3 justify-center">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveColor(c)}
              className={`w-8 h-8 rounded-full border ${
                c === "#FFFFFF" ? "border-gray-400" : "border-gray-200"
              } ${c === activeColor ? "ring-2 ring-indigo-600 scale-110" : ""}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="relative w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl overflow-hidden touch-none bg-white">
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={clearCanvas}
          className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
        >
          Clear Canvas
        </button>
        <button
          disabled={disabled}
          onClick={handleGenerate}
          className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Generate
        </button>
      </div>
    </div>
  );
}
