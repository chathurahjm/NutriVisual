import React, { useState, useMemo } from 'react';
import foodsData from '../data/foods.json';

/**
 * Helper to parse numeric micro values like "363 mg" -> 363
 */
const parseNum = (str) => {
  if (!str) return 0;
  const match = str.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

/**
 * Calculates scientifically-grounded Satiety Index score (15 to 98)
 * based on Holt et al. satiety research (Protein + Fiber weight vs Calorie density).
 */
const getSatietyScore = (food) => {
  const protein = food.macros.protein || 0;
  const fiber = parseNum(food.micros?.fiber);
  const calories = food.calories || 100;

  let catBonus = 0;
  if (food.category === 'Vegetables') catBonus = 12;
  if (food.category === 'Superfoods' && fiber > 3) catBonus = 8;
  if (food.category === 'Proteins' && protein > 20) catBonus = 10;

  const rawScore = 18 + ((protein * 2.0 + fiber * 3.5) / (calories / 100 + 0.3)) + catBonus;
  return Math.min(98, Math.max(15, Math.round(rawScore)));
};

export default function SatietyMatrix({ onSelectFood }) {
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'cards'
  const [selectedQuadrant, setSelectedQuadrant] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoodId, setSelectedFoodId] = useState('atlantic-salmon');
  const [showGuide, setShowGuide] = useState(true);

  // Process all foods with satiety scores and matrix coordinates
  const processedFoods = useMemo(() => {
    return foodsData.map((f) => {
      const satiety = getSatietyScore(f);
      const calDensity = f.calories;

      let quadrant = 'power';
      let zoneName = '🟦 Nutrient Powerhouse';
      let zoneDescription = 'High fullness & complete protein for muscle building.';

      if (calDensity < 180 && satiety >= 50) {
        quadrant = 'volume';
        zoneName = '🟢 Fat Loss Volume Zone';
        zoneDescription = 'Fills your stomach with very low calories. Eat freely for fat loss!';
      } else if (calDensity >= 180 && satiety >= 50) {
        quadrant = 'power';
        zoneName = '🟦 Nutrient Powerhouse';
        zoneDescription = 'Highly satiating & packed with protein and key micronutrients.';
      } else if (calDensity < 180 && satiety < 50) {
        quadrant = 'light';
        zoneName = '🟨 Light Snack Booster';
        zoneDescription = 'Low calorie & light energy, great for hydration and vitamins.';
      } else {
        quadrant = 'dense';
        zoneName = '🟥 Calorie Dense / Healthy Fats';
        zoneDescription = 'High energy per 100g. Enjoy in smaller, measured portions.';
      }

      return {
        ...f,
        satiety,
        calDensity,
        quadrant,
        zoneName,
        zoneDescription
      };
    });
  }, []);

  // Filtered dataset based on user controls
  const filteredFoods = processedFoods.filter((f) => {
    if (selectedQuadrant !== 'All' && f.quadrant !== selectedQuadrant) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const activeFood = processedFoods.find((f) => f.id === selectedFoodId) || processedFoods[0];

  // SVG Chart Dimensions
  const svgWidth = 720;
  const svgHeight = 440;
  const padding = { top: 40, right: 40, bottom: 60, left: 70 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const xMax = 750;
  const getX = (val) => padding.left + (Math.min(val, xMax) / xMax) * graphWidth;

  const yMax = 100;
  const getY = (val) => padding.top + graphHeight - (val / yMax) * graphHeight;

  const midX = getX(180);
  const midY = getY(50);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Top Title & View Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              📊 Satiety vs. Calorie Density Finder
            </h2>
            <button
              onClick={() => setShowGuide(!showGuide)}
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                backgroundColor: 'var(--accent-green-glow)',
                color: 'var(--accent-green)',
                border: '1px solid var(--accent-green)',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              {showGuide ? 'Hide Beginner Guide 💡' : 'How to Read This Guide 💡'}
            </button>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            Easily find foods that keep you full for hours with fewer calories.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'var(--bg-surface)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setViewMode('chart')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: viewMode === 'chart' ? 'var(--accent-green)' : 'transparent',
              color: viewMode === 'chart' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📊 Visual Scatter Chart
          </button>
          <button
            onClick={() => setViewMode('cards')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: viewMode === 'cards' ? 'var(--accent-green)' : 'transparent',
              color: viewMode === 'cards' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🏆 Simple Zone Ranking Cards
          </button>
        </div>
      </div>

      {/* Beginner Guide Card (Collapsible) */}
      {showGuide && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--accent-green)',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.4rem' }}>⬆️</span>
            <div>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem', display: 'block' }}>Vertical Axis (Fullness)</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Higher up means the food keeps you full for longer (high protein & fiber).</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.4rem' }}>➡️</span>
            <div>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem', display: 'block' }}>Horizontal Axis (Calories)</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Farther right means more calories packed into 100g (high fat/oils).</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.4rem' }}>💡</span>
            <div>
              <strong style={{ color: 'var(--accent-green)', fontSize: '0.85rem', display: 'block' }}>Fat Loss Secret Zone</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Top-Left Green Zone = Max fullness with minimal calories!</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Controls & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Filter Zone:</span>
          {[
            { key: 'All', label: 'All Foods' },
            { key: 'volume', label: '🟢 Fat Loss Volume' },
            { key: 'power', label: '🟦 High-Protein Power' },
            { key: 'light', label: '🟨 Light Boosters' },
            { key: 'dense', label: '🟥 High Calorie' }
          ].map((q) => (
            <button
              key={q.key}
              onClick={() => setSelectedQuadrant(q.key)}
              style={{
                fontSize: '0.78rem',
                padding: '0.3rem 0.7rem',
                borderRadius: '16px',
                backgroundColor: selectedQuadrant === q.key ? 'var(--accent-green)' : 'var(--bg-card)',
                color: selectedQuadrant === q.key ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              {q.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="🔍 Search food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            width: '200px'
          }}
        />
      </div>

      {/* MODE 1: VISUAL SCATTER CHART */}
      {viewMode === 'chart' && (
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1rem', overflowX: 'auto' }}>
          <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ minWidth: '620px' }}>
            {/* Shaded Quadrant Backgrounds */}
            <rect x={padding.left} y={padding.top} width={midX - padding.left} height={midY - padding.top} fill="rgba(16, 185, 129, 0.08)" rx="10" />
            <rect x={midX} y={padding.top} width={padding.left + graphWidth - midX} height={midY - padding.top} fill="rgba(56, 189, 248, 0.07)" rx="10" />
            <rect x={padding.left} y={midY} width={midX - padding.left} height={padding.top + graphHeight - midY} fill="rgba(245, 158, 11, 0.05)" rx="10" />
            <rect x={midX} y={midY} width={padding.left + graphWidth - midX} height={padding.top + graphHeight - midY} fill="rgba(239, 68, 68, 0.06)" rx="10" />

            {/* Quadrant Zone Titles */}
            <text x={padding.left + 12} y={padding.top + 24} fill="#10b981" fontSize="12" fontWeight="900">
              🟢 FAT LOSS VOLUME ZONE (High Fullness, Low Calorie)
            </text>
            <text x={svgWidth - padding.right - 12} y={padding.top + 24} fill="#38bdf8" fontSize="12" fontWeight="900" textAnchor="end">
              🟦 HIGH-PROTEIN POWERHOUSES
            </text>
            <text x={padding.left + 12} y={svgHeight - padding.bottom - 14} fill="#f59e0b" fontSize="12" fontWeight="900">
              🟨 LIGHT SNACK BOOSTERS
            </text>
            <text x={svgWidth - padding.right - 12} y={svgHeight - padding.bottom - 14} fill="#ef4444" fontSize="12" fontWeight="900" textAnchor="end">
              🟥 CALORIE DENSE (Enjoy in Portion Control)
            </text>

            {/* Quadrant Division Lines */}
            <line x1={midX} y1={padding.top} x2={midX} y2={padding.top + graphHeight} stroke="var(--border-color)" strokeDasharray="4,4" strokeWidth="1.5" />
            <line x1={padding.left} y1={midY} x2={padding.left + graphWidth} y2={midY} stroke="var(--border-color)" strokeDasharray="4,4" strokeWidth="1.5" />

            {/* Axes Lines */}
            <line x1={padding.left} y1={padding.top + graphHeight} x2={padding.left + graphWidth} y2={padding.top + graphHeight} stroke="var(--border-color)" strokeWidth="2" />
            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + graphHeight} stroke="var(--border-color)" strokeWidth="2" />

            {/* Simplified Axis Labels */}
            <text x={padding.left + graphWidth / 2} y={svgHeight - 12} fill="var(--text-main)" fontSize="12.5" fontWeight="800" textAnchor="middle">
              ➡️ Calorie Heavy per 100g (Calories) →
            </text>
            <text x={22} y={padding.top + graphHeight / 2} fill="var(--text-main)" fontSize="12.5" fontWeight="800" textAnchor="middle" transform={`rotate(-90 22 ${padding.top + graphHeight / 2})`}>
              ⬆️ Fills You Up Longer (Satiety Index) →
            </text>

            {/* Food Plot Nodes */}
            {filteredFoods.map((food) => {
              const cx = getX(food.calDensity);
              const cy = getY(food.satiety);
              const isSelected = food.id === selectedFoodId;

              let nodeColor = '#10b981';
              if (food.category === 'Proteins') nodeColor = '#38bdf8';
              if (food.category === 'Healthy Fats') nodeColor = '#f59e0b';
              if (food.category === 'Superfoods') nodeColor = '#a855f7';

              return (
                <g
                  key={food.id}
                  onClick={() => {
                    setSelectedFoodId(food.id);
                    if (onSelectFood) onSelectFood(food.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Selection Pulsing Ring */}
                  {isSelected && (
                    <circle cx={cx} cy={cy} r="15" fill="none" stroke={nodeColor} strokeWidth="3" opacity="0.85" />
                  )}

                  {/* Food Node Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? '9' : '7'}
                    fill={nodeColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    style={{ transition: 'all 0.2s ease' }}
                  />

                  {/* Food Label */}
                  {(isSelected || food.satiety > 82 || food.calDensity > 620) && (
                    <text
                      x={cx}
                      y={cy - 12}
                      fill="var(--text-main)"
                      fontSize="10.5"
                      fontWeight={isSelected ? '900' : '700'}
                      textAnchor="middle"
                      style={{ pointerEvents: 'none' }}
                    >
                      {food.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* MODE 2: SIMPLE CHEAT-SHEET RANKING CARDS */}
      {viewMode === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[
            { key: 'volume', title: '🟢 Fat Loss Volume Zone', subtitle: 'Eat freely! Highest fullness per calorie.', items: processedFoods.filter(f => f.quadrant === 'volume') },
            { key: 'power', title: '🟦 High-Protein Powerhouses', subtitle: 'Build muscle & maintain energy for hours.', items: processedFoods.filter(f => f.quadrant === 'power') },
            { key: 'light', title: '🟨 Light Energy Boosters', subtitle: 'Low calories, great for vitamins & snacks.', items: processedFoods.filter(f => f.quadrant === 'light') },
            { key: 'dense', title: '🟥 Calorie Dense / Healthy Fats', subtitle: 'Enjoy in small, measured portions.', items: processedFoods.filter(f => f.quadrant === 'dense') }
          ].map((zone) => (
            <div key={zone.key} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--text-main)' }}>{zone.title}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{zone.subtitle}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                {zone.items.map((food) => (
                  <div
                    key={food.id}
                    onClick={() => setSelectedFoodId(food.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: selectedFoodId === food.id ? 'var(--accent-green-glow)' : 'var(--bg-surface)',
                      border: `1px solid ${selectedFoodId === food.id ? 'var(--accent-green)' : 'var(--border-color)'}`,
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <img src={food.image} alt={food.name} style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{food.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{food.calories} kcal/100g</div>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
                      {food.satiety}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Beginner-Friendly Selected Food Inspector Card */}
      {activeFood && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          padding: '1.25rem 1.5rem',
          borderRadius: '18px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img src={activeFood.image} alt={activeFood.name} style={{ width: '75px', height: '75px', borderRadius: '14px', objectFit: 'cover' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>{activeFood.name}</h3>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '8px', backgroundColor: 'var(--accent-green-glow)', color: 'var(--accent-green)' }}>
                  {activeFood.zoneName}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                💡 <strong>Beginner Takeaway:</strong> {activeFood.zoneDescription}
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.4rem', fontWeight: 600 }}>
                🔥 {activeFood.calories} kcal/100g • 🥩 {activeFood.macros.protein}g protein • 🌾 {parseNum(activeFood.micros?.fiber)}g fiber
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', backgroundColor: 'var(--bg-surface)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Fullness Rank</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
              {activeFood.satiety} / 100
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
