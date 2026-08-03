import React from 'react';

/**
 * BiohackRadarChart - Responsive SVG Spider/Radar Chart for NutriVisual
 * Maps 5 health outcome dimensions with enhanced high-readability text labels:
 * 1. Brain & Focus (Cognitive)
 * 2. Lean Muscle & Recovery (Protein quality)
 * 3. Gut & Microbiome (Fiber & Polyphenols)
 * 4. Cardiovascular Shield (Potassium & Electrolytes)
 * 5. Metabolic Speed (Low carb / density ratio)
 */
export default function BiohackRadarChart({ scores = {} }) {
  const categories = [
    { key: 'brain', label: '🧠 Brain & Focus', color: '#38bdf8' },
    { key: 'muscle', label: '💪 Lean Muscle', color: '#f59e0b' },
    { key: 'gut', label: '🌿 Gut Microbiome', color: '#10b981' },
    { key: 'heart', label: '🛡️ Heart & Circulation', color: '#ec4899' },
    { key: 'metabolism', label: '⚡ Metabolic Flexibility', color: '#a855f7' }
  ];

  // Axis values (normalized 0 to 100)
  const values = categories.map((cat) => Math.min(100, Math.max(10, scores[cat.key] || 20)));

  const size = 380;
  const center = size / 2;
  const radius = 120;
  const numAxes = categories.length;

  // Calculate (x, y) point for given axis index and value (0-100)
  const getCoordinates = (index, value) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Polygon points for score shape
  const points = values.map((val, i) => {
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(' ');

  // Grid concentric rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible', maxWidth: '100%' }}>
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0.05" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Grid Rings */}
        {rings.map((ring, idx) => {
          const ringPoints = categories.map((_, i) => {
            const { x, y } = getCoordinates(i, ring * 100);
            return `${x},${y}`;
          }).join(' ');
          return (
            <polygon
              key={idx}
              points={ringPoints}
              fill="none"
              stroke="var(--border-color)"
              strokeDasharray={idx < 4 ? '3,3' : 'none'}
              strokeWidth={idx === 4 ? '1.5' : '1'}
              opacity={0.6}
            />
          );
        })}

        {/* Axis Lines */}
        {categories.map((cat, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={cat.key}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="var(--border-color)"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}

        {/* Dynamic Value Polygon */}
        <polygon
          points={points}
          fill="url(#radarGlow)"
          stroke="var(--accent-green)"
          strokeWidth="2.8"
          filter="url(#glow)"
          style={{ transition: 'all 0.4s ease' }}
        />

        {/* Vertex Markers & Labels */}
        {categories.map((cat, i) => {
          const val = values[i];
          const { x, y } = getCoordinates(i, val);
          const outerLabelPos = getCoordinates(i, 134);

          return (
            <g key={cat.key}>
              {/* Vertex Dot */}
              <circle
                cx={x}
                cy={y}
                r="6"
                fill={cat.color}
                stroke="#ffffff"
                strokeWidth="2"
                style={{ transition: 'all 0.4s ease' }}
              />

              {/* Larger Axis Category Label */}
              <text
                x={outerLabelPos.x}
                y={outerLabelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--text-main)"
                fontSize="13.5"
                fontWeight="800"
              >
                {cat.label}
              </text>

              {/* Larger Score Badge */}
              <text
                x={outerLabelPos.x}
                y={outerLabelPos.y + 16}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={cat.color}
                fontSize="12"
                fontWeight="900"
                fontFamily="var(--font-mono)"
              >
                {Math.round(val)}/100
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
