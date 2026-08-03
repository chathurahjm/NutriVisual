import React, { useState } from 'react';
import foodsData from '../data/foods.json';
import BiohackRadarChart from './BiohackRadarChart.jsx';
import SatietyMatrix from './SatietyMatrix.jsx';
import InfographicGeneratorModal from './InfographicGeneratorModal.jsx';

export default function NutriVisualApp() {
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'compare' | 'biohack' | 'satiety' | 'plate'
  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState(''); // 'bp' | 'brain' | 'gut' | 'muscle' | 'keto'
  const [selectedFoodId, setSelectedFoodId] = useState('avocado');
  const [portionGrams, setPortionGrams] = useState(100);

  // Comparison State
  const [compareFoodId1, setCompareFoodId1] = useState('avocado');
  const [compareFoodId2, setCompareFoodId2] = useState('atlantic-salmon');
  const [comparePortionGrams, setComparePortionGrams] = useState(100);

  // Meal Plate State
  const [plateItems, setPlateItems] = useState([
    { foodId: 'atlantic-salmon', grams: 150 },
    { foodId: 'avocado', grams: 100 },
    { foodId: 'broccoli', grams: 120 }
  ]);

  // Infographic Modal State
  const [isInfographicOpen, setIsInfographicOpen] = useState(false);

  // Helper to parse numeric values from micro strings (e.g. "363 mg" -> 363)
  const parseNum = (str) => {
    if (!str) return 0;
    const match = str.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Alphabetically sorted food list for select dropdowns
  const sortedFoods = [...foodsData].sort((a, b) => a.name.localeCompare(b.name));

  // Filtered foods for search and outcome filters
  const filteredFoods = sortedFoods.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (outcomeFilter === 'bp') return parseNum(f.micros.potassium) >= 300;
    if (outcomeFilter === 'brain') return parseNum(f.micros.magnesium) >= 50 || f.tags.some(t => t.includes('Omega-3') || t.includes('Brain'));
    if (outcomeFilter === 'gut') return parseNum(f.micros.fiber) >= 3.0;
    if (outcomeFilter === 'muscle') return f.macros.protein >= 20;
    if (outcomeFilter === 'keto') return f.macros.fat >= 12 && f.macros.carbs <= 5;

    return true;
  });

  const activeFood = foodsData.find((f) => f.id === selectedFoodId) || foodsData[0];
  const compareFood1 = foodsData.find((f) => f.id === compareFoodId1) || foodsData[0];
  const compareFood2 = foodsData.find((f) => f.id === compareFoodId2) || foodsData[1];

  // Single food portion scaling
  const scale = portionGrams / 100;
  const scaledCalories = Math.round(activeFood.calories * scale);
  const scaledFat = Math.round(activeFood.macros.fat * scale * 10) / 10;
  const scaledCarbs = Math.round(activeFood.macros.carbs * scale * 10) / 10;
  const scaledProtein = Math.round(activeFood.macros.protein * scale * 10) / 10;

  const totalMacroGrams = scaledFat + scaledCarbs + scaledProtein || 1;
  const fatPct = Math.round((scaledFat / totalMacroGrams) * 100);
  const carbsPct = Math.round((scaledCarbs / totalMacroGrams) * 100);
  const proteinPct = Math.round((scaledProtein / totalMacroGrams) * 100);

  // Biohack Radar Scores for active food (0 to 100)
  const biohackScores = {
    brain: Math.min(95, Math.round((parseNum(activeFood.micros.magnesium) / 60) * 50 + (activeFood.macros.fat > 8 ? 40 : 15))),
    muscle: Math.min(98, Math.round((activeFood.macros.protein / 30) * 85 + 10)),
    gut: Math.min(95, Math.round((parseNum(activeFood.micros.fiber) / 5) * 80 + 15)),
    heart: Math.min(95, Math.round((parseNum(activeFood.micros.potassium) / 400) * 70 + (activeFood.macros.fat < 15 ? 25 : 10))),
    metabolism: Math.min(95, Math.round(Math.max(10, (1 - (activeFood.macros.carbs / 50)) * 60 + (activeFood.macros.protein > 15 ? 30 : 10))))
  };

  // Meal Plate Totals calculation
  const rawPlateTotals = plateItems.reduce(
    (acc, item) => {
      const food = foodsData.find((f) => f.id === item.foodId);
      if (!food) return acc;
      const s = item.grams / 100;
      acc.calories += food.calories * s;
      acc.fat += food.macros.fat * s;
      acc.carbs += food.macros.carbs * s;
      acc.protein += food.macros.protein * s;
      acc.potassium += parseNum(food.micros.potassium) * s;
      acc.magnesium += parseNum(food.micros.magnesium) * s;
      acc.fiber += parseNum(food.micros.fiber) * s;
      return acc;
    },
    { calories: 0, fat: 0, carbs: 0, protein: 0, potassium: 0, magnesium: 0, fiber: 0 }
  );

  const plateTotals = {
    calories: Math.round(rawPlateTotals.calories),
    fat: Math.round(rawPlateTotals.fat * 10) / 10,
    carbs: Math.round(rawPlateTotals.carbs * 10) / 10,
    protein: Math.round(rawPlateTotals.protein * 10) / 10,
    potassium: Math.round(rawPlateTotals.potassium),
    magnesium: Math.round(rawPlateTotals.magnesium),
    fiber: Math.round(rawPlateTotals.fiber * 10) / 10
  };

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [addedFoodId, setAddedFoodId] = useState(null);

  const addToPlate = (foodId) => {
    const food = foodsData.find((f) => f.id === foodId);
    const foodName = food ? food.name : 'Food item';

    if (!plateItems.some((item) => item.foodId === foodId)) {
      setPlateItems([...plateItems, { foodId, grams: portionGrams }]);
      setToastMessage(`✓ ${foodName} added to your Visual Meal Stack!`);
    } else {
      setToastMessage(`ℹ️ ${foodName} is already on your Meal Stack.`);
    }

    setAddedFoodId(foodId);
    setTimeout(() => setAddedFoodId(null), 1500);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const removeFromPlate = (foodId) => {
    setPlateItems(plateItems.filter((item) => item.foodId !== foodId));
  };

  const updatePlateGrams = (foodId, grams) => {
    setPlateItems(plateItems.map((item) => (item.foodId === foodId ? { ...item, grams: Number(grams) } : item)));
  };

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'var(--accent-green)',
          color: '#ffffff',
          padding: '0.85rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          fontWeight: 600,
          fontSize: '0.9rem',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Social Graphic Exporter Modal */}
      <InfographicGeneratorModal
        isOpen={isInfographicOpen}
        onClose={() => setIsInfographicOpen(false)}
        food1Id={compareFoodId1}
        food2Id={compareFoodId2}
      />

      {/* Mode Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="tab-container">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>🥗</span> Food Portion Visualizer
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>⚖️</span> Macro Comparison Chart
          </button>
          <button
            onClick={() => setActiveTab('biohack')}
            className={`tab-btn ${activeTab === 'biohack' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>🧬</span> Biohack Blueprint
          </button>

          <button
            onClick={() => setActiveTab('plate')}
            className={`tab-btn ${activeTab === 'plate' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>🍽️</span> Calorie Density & Meal Builder ({plateItems.length})
          </button>
        </div>

        {/* Action Button: One-Click Social Infographic Exporter */}
        <button
          onClick={() => setIsInfographicOpen(true)}
          style={{
            backgroundColor: 'var(--accent-green-glow)',
            color: 'var(--accent-green)',
            border: '1px solid var(--accent-green)',
            padding: '0.55rem 1.1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-card)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>📸</span> Export Social Graphic
        </button>
      </div>

      {/* MOVE 2: Biohack & Longevity Target Outcome Filter Bar */}
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.85rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🎯 Filter by Health Outcome:
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { key: 'bp', label: '🛡️ Lower Blood Pressure' },
            { key: 'brain', label: '🧠 Cognitive Vitality' },
            { key: 'gut', label: '🌿 Gut Microbiome' },
            { key: 'muscle', label: '💪 Lean Muscle' },
            { key: 'keto', label: '⚡ Keto / Low Carb' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setOutcomeFilter(outcomeFilter === item.key ? '' : item.key);
                setSearchQuery('');
              }}
              style={{
                fontSize: '0.8rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                backgroundColor: outcomeFilter === item.key ? 'var(--accent-green-glow)' : 'var(--bg-card)',
                color: outcomeFilter === item.key ? 'var(--accent-green)' : 'var(--text-muted)',
                border: `1px solid ${outcomeFilter === item.key ? 'var(--accent-green)' : 'var(--border-color)'}`,
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: SINGLE FOOD EXPLORER VIEW (ORIGINAL COMPLETE DESIGN RESTORED) */}
      {activeTab === 'explorer' && (
        <div className="layout-explorer">
          <div>
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <input
                type="text"
                aria-label="Search food"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOutcomeFilter('');
                }}
                placeholder="Search food, macro, or tag (e.g. Avocado, Omega-3, Potassium)..."
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  color: 'var(--text-main)',
                  fontSize: '1rem',
                  outline: 'none',
                  boxShadow: 'var(--shadow-card)',
                }}
              />
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div className="layout-food-detail">
                <div style={{ borderRadius: '12px', overflow: 'hidden', height: '260px', position: 'relative' }}>
                  <img src={activeFood.image} alt={activeFood.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'var(--bg-header)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 600, backdropFilter: 'blur(8px)' }}>
                    {activeFood.category}
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>{activeFood.name}</h2>
                    <button
                      onClick={() => addToPlate(activeFood.id)}
                      style={{
                        backgroundColor: addedFoodId === activeFood.id ? '#10b981' : 'var(--accent-green)',
                        color: '#fff',
                        border: 'none',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {addedFoodId === activeFood.id ? 'Added ✓' : '+ Add to Plate'}
                    </button>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>Reference Serving: <strong style={{ color: 'var(--accent-green)' }}>{portionGrams}g</strong></div>
                    <a href={`/food/${activeFood.id}/`} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                      View Full Profile →
                    </a>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      <span>Portion Slider</span>
                      <span style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>{portionGrams} grams</span>
                    </div>
                    <input type="range" min="50" max="300" step="10" value={portionGrams} onChange={(e) => setPortionGrams(Number(e.target.value))} aria-label="Adjust portion in grams" />
                  </div>

                  <div className="layout-macro-stats">
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Energy</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{scaledCalories} kcal</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fat</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>{scaledFat}g</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Carbs</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{scaledCarbs}g</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Protein</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>{scaledProtein}g</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Micronutrients & Donut Ring */}
              <div className="layout-micro-section">
                <div style={{ textAlign: 'center' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '130px', height: '130px', transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--border-color)" strokeWidth="3.8" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--accent-green)" strokeWidth="3.8" strokeDasharray={`${fatPct} ${100 - fatPct}`} strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--accent-cyan)" strokeWidth="3.8" strokeDasharray={`${carbsPct} ${100 - carbsPct}`} strokeDashoffset={`-${fatPct}`} />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--accent-amber)" strokeWidth="3.8" strokeDasharray={`${proteinPct} ${100 - proteinPct}`} strokeDashoffset={`-${fatPct + carbsPct}`} />
                  </svg>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{fatPct}% Fat</span> • <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{carbsPct}% Carb</span> • <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>{proteinPct}% Prot</span>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-main)' }}>🧬 Key Longevity Micronutrients & Benefits</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {Object.entries(activeFood.micros).map(([key, val]) => (
                      <div key={key} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{key}:</span> <strong style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>{val}</strong>
                      </div>
                    ))}
                    {activeFood.benefits && activeFood.benefits.map((b) => (
                      <div key={b} style={{ backgroundColor: 'var(--accent-green-glow)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        🛡️ {b}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Quick Select Food */}
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>🥦 Quick Select Food</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '520px', overflowY: 'auto' }}>
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  onClick={() => setSelectedFoodId(food.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    backgroundColor: food.id === selectedFoodId ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                    border: `1px solid ${food.id === selectedFoodId ? 'var(--accent-green)' : 'var(--border-color)'}`,
                    padding: '0.75rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <img src={food.image} alt={food.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{food.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{food.calories} kcal/100g</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MACRO COMPARISON VIEW */}
      {activeTab === 'compare' && (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Side-by-Side Macro Comparison Chart</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Compare macro ratios, calorie density, and micronutrient totals between any two whole foods.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* Food 1 */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block', color: 'var(--text-main)' }}>Select Food A:</label>
              <select
                value={compareFoodId1}
                onChange={(e) => setCompareFoodId1(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontWeight: 600, marginBottom: '1rem' }}
              >
                {sortedFoods.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>

              <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}>
                <img src={compareFood1.image} alt={compareFood1.name} style={{ width: '100%', height: '140px', borderRadius: '8px', objectFit: 'cover', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>{compareFood1.name}</h3>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>{compareFood1.calories} kcal/100g</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <div>🥩 Protein: <strong>{compareFood1.macros.protein}g</strong></div>
                  <div>🥑 Fat: <strong>{compareFood1.macros.fat}g</strong></div>
                  <div>🍚 Carbs: <strong>{compareFood1.macros.carbs}g</strong></div>
                  <div>⚡ Potassium: <strong>{compareFood1.micros.potassium}</strong></div>
                </div>
              </div>
            </div>

            {/* Food 2 */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block', color: 'var(--text-main)' }}>Select Food B:</label>
              <select
                value={compareFoodId2}
                onChange={(e) => setCompareFoodId2(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontWeight: 600, marginBottom: '1rem' }}
              >
                {sortedFoods.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>

              <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}>
                <img src={compareFood2.image} alt={compareFood2.name} style={{ width: '100%', height: '140px', borderRadius: '8px', objectFit: 'cover', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>{compareFood2.name}</h3>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>{compareFood2.calories} kcal/100g</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <div>🥩 Protein: <strong>{compareFood2.macros.protein}g</strong></div>
                  <div>🥑 Fat: <strong>{compareFood2.macros.fat}g</strong></div>
                  <div>🍚 Carbs: <strong>{compareFood2.macros.carbs}g</strong></div>
                  <div>⚡ Potassium: <strong>{compareFood2.micros.potassium}</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: BIOHACK BLUEPRINT RADAR VIEW */}
      {activeTab === 'biohack' && (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2rem auto' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
              🧬 Biohack Health & Longevity Radar
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0 0 1.25rem 0' }}>
              Real-time nutrient synergy breakdown mapping 5 health dimensions for <strong>{activeFood.name}</strong>.
            </p>

            {/* Food Selector Dropdown & Quick Food Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', maxWidth: '380px' }}>
                <label htmlFor="biohack-food-select" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                  🥑 Select Food:
                </label>
                <select
                  id="biohack-food-select"
                  value={selectedFoodId}
                  onChange={(e) => setSelectedFoodId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {sortedFoods.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Preset Buttons for Top Biohack Foods */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {['atlantic-salmon', 'avocado', 'blueberries', 'eggs', 'broccoli', 'beef-liver', 'matcha', 'dark-chocolate'].map((id) => {
                  const foodItem = foodsData.find((f) => f.id === id);
                  if (!foodItem) return null;
                  const isSel = selectedFoodId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedFoodId(id)}
                      style={{
                        fontSize: '0.78rem',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '16px',
                        backgroundColor: isSel ? 'var(--accent-green)' : 'var(--bg-surface)',
                        color: isSel ? '#ffffff' : 'var(--text-muted)',
                        border: `1px solid ${isSel ? 'var(--accent-green)' : 'var(--border-color)'}`,
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {foodItem.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <BiohackRadarChart scores={biohackScores} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.3rem 0', color: '#38bdf8' }}>🧠 Cognitive Vitality: {biohackScores.brain}/100</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Magnesium ({activeFood.micros.magnesium}) & essential fatty acids support neurotransmitter synthesis and brain cell fluidity.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.3rem 0', color: '#f59e0b' }}>💪 Lean Muscle Recovery: {biohackScores.muscle}/100</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Delivers {activeFood.macros.protein}g of complete protein per 100g to fuel mTOR activation and muscle tissue repair.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.3rem 0', color: '#10b981' }}>🌿 Gut Microbiome: {biohackScores.gut}/100</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Dietary fiber ({activeFood.micros.fiber}) feeds beneficial gut microbiota to produce short-chain fatty acids.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.3rem 0', color: '#ec4899' }}>🛡️ Heart & Circulation: {biohackScores.heart}/100</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Potassium ({activeFood.micros.potassium}) regulates intracellular fluid balance and supports arterial elasticity.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.3rem 0', color: '#a855f7' }}>⚡ Metabolic Flexibility: {biohackScores.metabolism}/100</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Optimal carbohydrate-to-protein ratio keeps postprandial insulin stable and promotes mitochondrial energy output.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* VIEW 5: MEAL PLATE BUILDER VIEW */}
      {activeTab === 'plate' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              🍽️ Visual Calorie Density & Meal Stack Builder
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Combine multiple food ingredients to view accumulated macro balances and total longevity micronutrients in real time.
            </p>

            {/* Total Plate Macro Header */}
            <div className="layout-plate-totals">
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Energy</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{plateTotals.calories} kcal</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Fat</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>{plateTotals.fat}g</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Carbs</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{plateTotals.carbs}g</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Protein</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>{plateTotals.protein}g</div>
              </div>
            </div>

            {/* Accumulated Micros Bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                🥑 Potassium: <strong style={{ color: 'var(--accent-green)' }}>{plateTotals.potassium} mg</strong>
              </div>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                ⚡ Magnesium: <strong style={{ color: 'var(--accent-green)' }}>{plateTotals.magnesium} mg</strong>
              </div>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                🌾 Dietary Fiber: <strong style={{ color: 'var(--accent-green)' }}>{plateTotals.fiber} g</strong>
              </div>
            </div>

            {/* Plate Items List */}
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Ingredients on Plate ({plateItems.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {plateItems.map((item) => {
                const food = foodsData.find((f) => f.id === item.foodId);
                if (!food) return null;
                const s = item.grams / 100;
                return (
                  <div key={item.foodId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '12px', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={food.image} alt={food.name} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{food.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {Math.round(food.calories * s)} kcal • {Math.round(food.macros.protein * s * 10) / 10}g protein
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input
                          type="number"
                          min="10"
                          max="500"
                          value={item.grams}
                          onChange={(e) => updatePlateGrams(item.foodId, e.target.value)}
                          aria-label="Portion grams for this food item"
                          style={{ width: '70px', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', textAlign: 'center', fontWeight: 600 }}
                        />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>g</span>
                      </div>
                      <button
                        onClick={() => removeFromPlate(item.foodId)}
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar to add ingredients */}
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>+ Add Food to Plate</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '520px', overflowY: 'auto' }}>
              {sortedFoods.map((food) => (
                <div
                  key={food.id}
                  onClick={() => addToPlate(food.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={food.image} alt={food.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>{food.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{food.calories} kcal</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: addedFoodId === food.id ? '#10b981' : 'var(--accent-green)', fontWeight: 700 }}>
                    {addedFoodId === food.id ? 'Added ✓' : '+ Add'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
