interface CircleProgressLoaderProps {
  progress: number; // Progress amount between 0 and 1
  width?: number;   // Width of the loader in pixels
  height?: number;  // Height of the loader in pixels
  fontSize?: string; // Font size for the percentage number (e.g., "2xl", "4xl")
}

export default function CircleProgressLoader({
  progress,
  width = 50,  // Default width
  height = 50, // Default height
  fontSize = "xs", // Default font size
}: CircleProgressLoaderProps) {
  const strokeDashoffset = 251.2 * (1 - progress);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
        <svg
          className="absolute top-0 left-0 w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="url(#progress-gradient)"
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset={strokeDashoffset}
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-gray-900 dark:text-gray-50 text-${fontSize}`}
        >
          {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  );
}
