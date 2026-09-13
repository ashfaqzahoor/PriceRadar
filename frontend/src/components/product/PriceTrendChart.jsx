import { useState, useMemo, useRef } from 'react';
import { Calendar, Eye, EyeOff, Info, TrendingDown } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice.js';

const PROVIDER_CONFIG = {
  blinkit: { label: 'Blinkit', color: '#EAB308', stroke: '#CA8A04' }, // warm yellow/amber
  instamart: { label: 'Instamart', color: '#F97316', stroke: '#EA580C' }, // orange
  bigbasket: { label: 'BigBasket', color: '#16A34A', stroke: '#15803D' }, // green
  groceryapi: { label: 'Grocery API', color: '#6B7280', stroke: '#4B5563' } // neutral gray
};

export function PriceTrendChart({ timeline = [], stats = null }) {
  const [timeRange, setTimeRange] = useState(30); // 7, 14, 30
  const [visibleStores, setVisibleStores] = useState({
    blinkit: true,
    instamart: true,
    bigbasket: true,
    groceryapi: true
  });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const svgRef = useRef(null);

  // Filter timeline by selected days
  const filteredTimeline = useMemo(() => {
    if (!timeline || timeline.length === 0) return [];
    return timeline.slice(-timeRange);
  }, [timeline, timeRange]);

  // Compute min and max across all visible stores in filtered timeframe
  const { minPrice, maxPrice } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const point of filteredTimeline) {
      for (const [store, isVisible] of Object.entries(visibleStores)) {
        if (isVisible && point[store]) {
          if (point[store] < min) min = point[store];
          if (point[store] > max) max = point[store];
        }
      }
    }
    if (min === Infinity) min = 100;
    if (max === -Infinity) max = 200;
    // Add 8% padding to top and bottom for visual breathing room
    const padding = Math.max(5, Math.round((max - min) * 0.1));
    return { minPrice: Math.max(0, min - padding), maxPrice: max + padding };
  }, [filteredTimeline, visibleStores]);

  const toggleStore = (storeKey) => {
    setVisibleStores((prev) => ({ ...prev, [storeKey]: !prev[storeKey] }));
  };

  // Dimensions
  const width = 700;
  const height = 260;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (index) => {
    if (filteredTimeline.length <= 1) return paddingLeft;
    return paddingLeft + (index / (filteredTimeline.length - 1)) * chartWidth;
  };

  const getY = (price) => {
    if (maxPrice === minPrice) return paddingTop + chartHeight / 2;
    const ratio = (price - minPrice) / (maxPrice - minPrice);
    return paddingTop + chartHeight - ratio * chartHeight;
  };

  // Build SVG path for each store
  const getLinePath = (storeKey) => {
    const points = filteredTimeline
      .map((pt, i) => {
        const val = pt[storeKey];
        if (val === undefined || val === null) return null;
        return `${getX(i)},${getY(val)}`;
      })
      .filter(Boolean);

    if (points.length === 0) return '';
    return `M ${points.join(' L ')}`;
  };

  const handleMouseMove = (e) => {
    if (!svgRef.current || filteredTimeline.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const xPos = ((e.clientX - rect.left) / rect.width) * width;
    const boundedX = Math.max(paddingLeft, Math.min(width - paddingRight, xPos));
    const ratio = (boundedX - paddingLeft) / chartWidth;
    const index = Math.round(ratio * (filteredTimeline.length - 1));
    setHoveredIndex(Math.max(0, Math.min(filteredTimeline.length - 1, index)));
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const activePoint = hoveredIndex !== null ? filteredTimeline[hoveredIndex] : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-700" />
            <h3 className="font-semibold text-sm text-gray-900">Price History</h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
              Last {timeRange} days
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Track how prices have trended across stores</p>
        </div>

        {/* Time range buttons */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 self-start sm:self-auto text-xs">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                timeRange === days
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      {/* Store Toggle Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-xs font-medium text-gray-500 mr-1">Stores:</span>
        {Object.entries(PROVIDER_CONFIG).map(([key, cfg]) => {
          const isVisible = visibleStores[key];
          return (
            <button
              key={key}
              onClick={() => toggleStore(key)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                isVisible
                  ? 'border-gray-300 bg-white text-gray-800 shadow-xs'
                  : 'border-gray-200 bg-gray-50 text-gray-400 opacity-60'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
              <span>{cfg.label}</span>
              {isVisible ? <Eye className="h-3 w-3 text-gray-400 ml-0.5" /> : <EyeOff className="h-3 w-3 text-gray-300 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Interactive SVG Chart Canvas */}
      <div className="relative w-full overflow-hidden select-none bg-gray-50/50 rounded-lg border border-gray-200 p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Horizontal Grid lines and Price Axis */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + ratio * chartHeight;
            const priceVal = Math.round(maxPrice - ratio * (maxPrice - minPrice));
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#9CA3AF"
                  fontFamily="Inter, sans-serif"
                >
                  ₹{priceVal}
                </text>
              </g>
            );
          })}

          {/* Average price dashed reference line */}
          {stats?.averagePrice && stats.averagePrice >= minPrice && stats.averagePrice <= maxPrice && (
            <g>
              <line
                x1={paddingLeft}
                y1={getY(stats.averagePrice)}
                x2={width - paddingRight}
                y2={getY(stats.averagePrice)}
                stroke="#CBD5E1"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={width - paddingRight}
                y={getY(stats.averagePrice) - 4}
                textAnchor="end"
                fontSize="9"
                fill="#94A3B8"
                fontFamily="Inter, sans-serif"
              >
                Avg: ₹{stats.averagePrice}
              </text>
            </g>
          )}

          {/* Store Price Lines */}
          {Object.entries(PROVIDER_CONFIG).map(([key, cfg]) => {
            if (!visibleStores[key]) return null;
            const pathData = getLinePath(key);
            if (!pathData) return null;
            return (
              <path
                key={key}
                d={pathData}
                fill="none"
                stroke={cfg.stroke}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {/* X Axis Date Labels */}
          {filteredTimeline.length > 0 &&
            [0, Math.floor(filteredTimeline.length / 4), Math.floor(filteredTimeline.length / 2), Math.floor((filteredTimeline.length * 3) / 4), filteredTimeline.length - 1].map(
              (idx) => {
                const pt = filteredTimeline[idx];
                if (!pt) return null;
                return (
                  <text
                    key={idx}
                    x={getX(idx)}
                    y={height - 10}
                    textAnchor={idx === 0 ? 'start' : idx === filteredTimeline.length - 1 ? 'end' : 'middle'}
                    fontSize="9"
                    fill="#9CA3AF"
                    fontFamily="Inter, sans-serif"
                  >
                    {pt.label}
                  </text>
                );
              }
            )}

          {/* Hover Vertical Scrubber Line & Dots */}
          {hoveredIndex !== null && activePoint && (
            <g>
              <line
                x1={getX(hoveredIndex)}
                y1={paddingTop}
                x2={getX(hoveredIndex)}
                y2={paddingTop + chartHeight}
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {Object.entries(PROVIDER_CONFIG).map(([key, cfg]) => {
                if (!visibleStores[key] || activePoint[key] === undefined) return null;
                return (
                  <circle
                    key={key}
                    cx={getX(hoveredIndex)}
                    cy={getY(activePoint[key])}
                    r="4.5"
                    fill={cfg.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* Floating Tooltip card when hovered */}
        {hoveredIndex !== null && activePoint && (
          <div
            className="absolute top-2 pointer-events-none rounded-xl bg-gray-900/95 text-white p-3 shadow-lg text-xs space-y-1.5 z-10 min-w-[170px]"
            style={{
              left: `${Math.min(75, Math.max(5, (getX(hoveredIndex) / width) * 100))}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="font-semibold text-gray-200 border-b border-gray-700 pb-1 flex justify-between items-center">
              <span>{activePoint.label}</span>
              <span className="text-[11px] text-green-400 font-medium">Low: ₹{activePoint.lowest}</span>
            </div>
            <div className="space-y-1 pt-0.5">
              {Object.entries(PROVIDER_CONFIG).map(([key, cfg]) => {
                if (!visibleStores[key] || activePoint[key] === undefined) return null;
                const isLowest = activePoint[key] === activePoint.lowest;
                return (
                  <div key={key} className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="flex items-center gap-1.5 text-gray-300">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                      {cfg.label}:
                    </span>
                    <span className={`font-semibold ${isLowest ? 'text-green-400' : 'text-gray-100'}`}>
                      ₹{activePoint[key]} {isLowest && '(Lowest)'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
