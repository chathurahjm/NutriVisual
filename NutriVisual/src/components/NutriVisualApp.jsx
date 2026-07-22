import React, { useState } from 'react';
import foodsData from '../data/foods.json';

export default function NutriVisualApp() {
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'compare' | 'plate'
  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState(''); // 'bp' | 'brain' | 'gut' | 'muscle' | 'keto'
  const [selectedFoodId, setSelectedFoodId] = useState('avocado');
  const [portionGrams, setPortionGrams] = useState(100);

  // Comparison State
  const [compareFoodId1, setCompareFoodId1] = useState('avocado');
  const [compareFoodId2, setCompareFoodId2] = useState('atlantic-salmon');
  const [comparePortionGrams, setComparePortionGrams] = useState(100);

  // Meal Plate State (Move 3)
  const [plateItems, setPlateItems] = useState([
    { foodId: 'atlantic-salmon', grams: 150 },
    { foodId: 'avocado', grams: 100 },
    { foodId: 'broccoli', grams: 120 }
  ]);

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
    // Search match
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Biohack outcome filters (Move 2)
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
      setPlateItems([...plateItems, { foodId, grams: 100 }]);
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

      {/* Mode Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="tab-container">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>🥗</span> Food Explorer
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>⚖️</span> Side-by-Side
          </button>
          <button
            onClick={() => setActiveTab('plate')}
            className={`tab-btn ${activeTab === 'plate' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>🍽️</span> Visual Meal Builder ({plateItems.length})
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {['All', 'Proteins', 'Healthy Fats', 'Superfoods', 'Vegetables'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSearchQuery(cat === 'All' ? '' : cat);
                setOutcomeFilter('');
              }}
              style={{
                fontSize: '0.8rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '20px',
                backgroundColor: searchQuery === cat || (cat === 'All' && !searchQuery && !outcomeFilter) ? 'var(--accent-green)' : 'var(--bg-card)',
                color: searchQuery === cat || (cat === 'All' && !searchQuery && !outcomeFilter) ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
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

      {/* VIEW 1: SINGLE FOOD EXPLORER VIEW */}
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

              {/* Bottom Micronutrients */}
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

          {/* Sidebar */}
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
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: food.id === selectedFoodId ? 'var(--accent-green)' : 'var(--text-main)' }}>{food.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{food.calories} kcal / 100g</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SIDE BY SIDE COMPARE */}
      {activeTab === 'compare' && (
        <div>
          {/* Portion Scale Slider Header */}
          <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ⚖️ Comparison Serving Scale:
              </span>
              <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '1.05rem' }}>
                {comparePortionGrams} grams per item
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              step="10"
              value={comparePortionGrams}
              onChange={(e) => setComparePortionGrams(Number(e.target.value))}
              aria-label="Adjust comparison portion in grams"
            />
          </div>

          <div className="layout-compare-selects">
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <label htmlFor="compare-select-1" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Food Item #1</label>
              <select id="compare-select-1" value={compareFoodId1} onChange={(e) => setCompareFoodId1(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}>
                {sortedFoods.map((f) => (<option key={f.id} value={f.id}>{f.name} ({Math.round(f.calories * (comparePortionGrams / 100))} kcal)</option>))}
              </select>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <label htmlFor="compare-select-2" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Food Item #2</label>
              <select id="compare-select-2" value={compareFoodId2} onChange={(e) => setCompareFoodId2(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}>
                {sortedFoods.map((f) => (<option key={f.id} value={f.id}>{f.name} ({Math.round(f.calories * (comparePortionGrams / 100))} kcal)</option>))}
              </select>
            </div>
          </div>

          <div className="layout-compare-cards">
            {[compareFood1, compareFood2].map((food, idx) => {
              const compScale = comparePortionGrams / 100;
              const scaledCal = Math.round(food.calories * compScale);
              const scaledProt = Math.round(food.macros.protein * compScale * 10) / 10;
              const scaledCarb = Math.round(food.macros.carbs * compScale * 10) / 10;
              const scaledFat = Math.round(food.macros.fat * compScale * 10) / 10;

              return (
                <div key={idx} className="glass-card compare-card">
                  <img src={food.image} alt={food.name} className="compare-card-image" />
                  <h2 className="compare-card-title">{food.name}</h2>
                  <div style={{ color: 'var(--accent-green)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                    {food.category} • <span style={{ color: 'var(--text-muted)' }}>{comparePortionGrams}g portion</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}><span>Calories</span><span style={{ fontFamily: 'var(--font-mono)' }}>{scaledCal} kcal</span></div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px' }}><div style={{ width: `${Math.min(100, (scaledCal / 600) * 100)}%`, height: '100%', backgroundColor: 'var(--text-main)', borderRadius: '4px' }} /></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}><span>Protein</span><span style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>{scaledProt}g</span></div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px' }}><div style={{ width: `${Math.min(100, (scaledProt / 30) * 100)}%`, height: '100%', backgroundColor: 'var(--accent-amber)', borderRadius: '4px' }} /></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}><span>Carbs</span><span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{scaledCarb}g</span></div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px' }}><div style={{ width: `${Math.min(100, (scaledCarb / 40) * 100)}%`, height: '100%', backgroundColor: 'var(--accent-cyan)', borderRadius: '4px' }} /></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}><span>Fat</span><span style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>{scaledFat}g</span></div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px' }}><div style={{ width: `${Math.min(100, (scaledFat / 50) * 100)}%`, height: '100%', backgroundColor: 'var(--accent-green)', borderRadius: '4px' }} /></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MOVE 3: VISUAL MEAL STACK BUILDER VIEW */}
      {activeTab === 'plate' && (
        <div className="layout-plate">
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🍽️ Your Custom Visual Meal Stack
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
