import { PricePoint } from '@/types/market';

interface SparklineDataset {
  data: PricePoint[];
  label: string;
  color?: string;
}

interface SparklineProps {
  datasets: SparklineDataset[];
  width?: number;
  height?: number;
  className?: string;
  showLabels?: boolean;
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // green-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
];

export default function Sparkline({
  datasets,
  width = 300,
  height = 120,
  className = '',
  showLabels = true
}: SparklineProps) {
  if (!datasets || datasets.length === 0 || datasets.every(d => !d.data || d.data.length < 2)) {
    return null;
  }

  // Find global min and max across all datasets for consistent scaling
  const allPrices = datasets.flatMap(d => d.data.map(p => p.p));
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice;
  const isFlat = priceRange === 0;

  // Padding for the chart
  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  return (
    <div className={`${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
      >
        {/* Background */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="transparent"
        />

        {/* Grid lines */}
        <line
          x1={padding}
          y1={height / 2}
          x2={width - padding}
          y2={height / 2}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.1"
        />

        {/* Plot each dataset */}
        {datasets.map((dataset, datasetIndex) => {
          if (!dataset.data || dataset.data.length < 2) return null;

          const maxDataLength = Math.max(...datasets.map(d => d.data?.length || 0));

          // Generate SVG path
          const points = dataset.data.map((point, index) => {
            const x = padding + (index / (dataset.data.length - 1)) * chartWidth;
            const y = isFlat
              ? height / 2
              : padding + chartHeight - ((point.p - minPrice) / priceRange) * chartHeight;
            return `${x},${y}`;
          });

          const pathData = `M ${points.join(' L ')}`;
          const color = dataset.color || DEFAULT_COLORS[datasetIndex % DEFAULT_COLORS.length];

          // Calculate price change for this dataset
          const firstPrice = dataset.data[0].p;
          const lastPrice = dataset.data[dataset.data.length - 1].p;
          const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;

          return (
            <g key={datasetIndex}>
              {/* Line */}
              <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Last point indicator */}
              <circle
                cx={padding + chartWidth}
                cy={
                  isFlat
                    ? height / 2
                    : padding + chartHeight - ((lastPrice - minPrice) / priceRange) * chartHeight
                }
                r="3"
                fill={color}
              />
            </g>
          );
        })}
      </svg>

      {/* Labels */}
      {showLabels && (
        <div className="flex flex-wrap gap-4 mt-3">
          {datasets.map((dataset, index) => {
            if (!dataset.data || dataset.data.length < 2) return null;

            const firstPrice = dataset.data[0].p;
            const lastPrice = dataset.data[dataset.data.length - 1].p;
            const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;
            const isPositive = changePercent >= 0;
            const color = dataset.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

            return (
              <div key={index} className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {dataset.label}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {(lastPrice * 100).toFixed(1)}%
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    ({isPositive ? '+' : ''}{changePercent.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
