import React, { useState, useMemo } from 'react';

const FOOD_DATABASE = [
  {
    id: 'chicken-breast',
    name: 'Chicken Breast (Skinless)',
    category: 'Poultry & Meat',
    proteinPer100g: 31.0,
    caloriesPer100g: 165,
    fatPer100g: 3.6,
    carbsPer100g: 0,
    servingUnit: 'breast (approx 220g raw)',
    unitWeight: 220,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
    tags: ['Lean', 'High Density', 'Keto Friendly']
  },
  {
    id: 'canned-tuna',
    name: 'Canned Tuna (in Water)',
    category: 'Seafood',
    proteinPer100g: 26.0,
    caloriesPer100g: 116,
    fatPer100g: 1.0,
    carbsPer100g: 0,
    servingUnit: 'can (approx 120g drained)',
    unitWeight: 120,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    tags: ['Ultra Lean', 'Budget', 'Convenient']
  },
  {
    id: 'atlantic-salmon',
    name: 'Atlantic Salmon (Wild)',
    category: 'Seafood',
    proteinPer100g: 22.1,
    caloriesPer100g: 206,
    fatPer100g: 12.3,
    carbsPer100g: 0,
    servingUnit: 'fillet (approx 170g)',
    unitWeight: 170,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    tags: ['Omega-3', 'Healthy Fats']
  },
  {
    id: 'egg-whites',
    name: 'Liquid Egg Whites',
    category: 'Dairy & Eggs',
    proteinPer100g: 11.0,
    caloriesPer100g: 52,
    fatPer100g: 0.2,
    carbsPer100g: 0.7,
    servingUnit: 'cup (243g)',
    unitWeight: 243,
    image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=600&q=80',
    tags: ['Zero Fat', 'Ultra Volume', 'Low Calorie']
  },
  {
    id: 'whole-eggs',
    name: 'Whole Large Eggs',
    category: 'Dairy & Eggs',
    proteinPer100g: 12.6,
    caloriesPer100g: 155,
    fatPer100g: 10.6,
    carbsPer100g: 1.1,
    servingUnit: 'large egg (~50g)',
    unitWeight: 50,
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
    tags: ['Nutrient Dense', 'Whole Food']
  },
  {
    id: 'greek-yogurt',
    name: 'Non-Fat Greek Yogurt',
    category: 'Dairy & Eggs',
    proteinPer100g: 10.3,
    caloriesPer100g: 59,
    fatPer100g: 0.4,
    carbsPer100g: 3.6,
    servingUnit: 'single container (~170g)',
    unitWeight: 170,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    tags: ['Probiotic', 'Satiety', 'High Volume']
  },
  {
    id: 'cottage-cheese',
    name: 'Low-Fat Cottage Cheese (2%)',
    category: 'Dairy & Eggs',
    proteinPer100g: 11.8,
    caloriesPer100g: 81,
    fatPer100g: 2.3,
    carbsPer100g: 4.7,
    servingUnit: 'cup (226g)',
    unitWeight: 226,
    image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=600&q=80',
    tags: ['Slow Digesting', 'Casein Rich']
  },
  {
    id: 'extra-firm-tofu',
    name: 'Extra Firm Tofu',
    category: 'Plant-Based',
    proteinPer100g: 12.1,
    caloriesPer100g: 94,
    fatPer100g: 5.3,
    carbsPer100g: 2.3,
    servingUnit: 'block (340g)',
    unitWeight: 340,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    tags: ['Vegan', 'Low Calorie', 'Budget']
  },
  {
    id: 'seitan',
    name: 'Seitan (Vital Wheat Gluten)',
    category: 'Plant-Based',
    proteinPer100g: 75.0,
    caloriesPer100g: 370,
    fatPer100g: 1.9,
    carbsPer100g: 14.0,
    servingUnit: 'serving (100g)',
    unitWeight: 100,
    image: 'https://images.unsplash.com/photo-1584947897851-d558b09320e8?auto=format&fit=crop&w=600&q=80',
    tags: ['Plant Powerhouse', 'Ultra High Protein']
  },
  {
    id: 'whey-isolate',
    name: 'Whey Protein Isolate',
    category: 'Supplements',
    proteinPer100g: 85.0,
    caloriesPer100g: 370,
    fatPer100g: 1.0,
    carbsPer100g: 2.0,
    servingUnit: 'scoop (~30g)',
    unitWeight: 30,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80',
    tags: ['Fast Absorbing', 'Post Workout']
  },
  {
    id: 'edamame',
    name: 'Cooked Edamame (Shelled)',
    category: 'Plant-Based',
    proteinPer100g: 11.9,
    caloriesPer100g: 122,
    fatPer100g: 5.2,
    carbsPer100g: 8.9,
    servingUnit: 'cup (155g)',
    unitWeight: 155,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    tags: ['High Fiber', 'Vegan']
  },
  {
    id: 'sirloin-steak',
    name: 'Top Sirloin Steak (Lean)',
    category: 'Poultry & Meat',
    proteinPer100g: 27.2,
    caloriesPer100g: 183,
    fatPer100g: 7.5,
    carbsPer100g: 0,
    servingUnit: 'steak (approx 220g)',
    unitWeight: 220,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    tags: ['Iron Rich', 'B12 Power']
  }
];

const CATEGORIES = ['All', 'Poultry & Meat', 'Dairy & Eggs', 'Seafood', 'Plant-Based', 'Supplements'];

export default function ProteinVisualCalculator() {
  const [targetProtein, setTargetProtein] = useState(100);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const filteredFoods = useMemo(() => {
    if (activeCategory === 'All') return FOOD_DATABASE;
    return FOOD_DATABASE.filter(f => f.category === activeCategory);
  }, [activeCategory]);

  const toggleCompare = (foodId) => {
    if (selectedForCompare.includes(foodId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== foodId));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare up to 3 foods at a time.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, foodId]);
    }
  };

  const getDensityColor = (caloriesPerTarget) => {
    if (caloriesPerTarget <= 450) return '#10b981'; // emerald green
    if (caloriesPerTarget <= 750) return '#3b82f6'; // blue
    if (caloriesPerTarget <= 1100) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      borderRadius: '24px',
      padding: '32px 24px',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.08)',
      margin: '32px 0'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '12px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          ⚡ Interactive Visual Portion Calculator
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 12px 0', background: 'linear-gradient(90deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          What Does <span style={{ color: '#34d399', WebkitTextFillColor: 'initial' }}>{targetProtein}g Protein</span> Look Like?
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.5 }}>
          Adjust your target protein goal below to calculate exact weight in grams, serving counts, calories, and macro efficiency across different foods!
        </p>
      </div>

      {/* Target Control Slider & Presets */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{ fontWeight: 700, fontSize: '1.1rem', color: '#e2e8f0' }}>Target Protein Goal:</label>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>{targetProtein} grams</span>
        </div>
        
        <input
          type="range"
          min="30"
          max="200"
          step="5"
          value={targetProtein}
          onChange={(e) => setTargetProtein(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#10b981',
            cursor: 'pointer',
            height: '8px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}
        />

        {/* Quick Presets */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: '30g Breakfast', val: 30 },
            { label: '50g Single Meal', val: 50 },
            { label: '100g Daily Goal', val: 100 },
            { label: '150g Bodybuilder Target', val: 150 }
          ].map((preset) => (
            <button
              key={preset.val}
              onClick={() => setTargetProtein(preset.val)}
              style={{
                background: targetProtein === preset.val ? '#10b981' : 'rgba(255,255,255,0.06)',
                color: targetProtein === preset.val ? '#0f172a' : '#cbd5e1',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              background: activeCategory === cat ? 'linear-gradient(90deg, #10b981, #059669)' : 'rgba(255,255,255,0.04)',
              color: activeCategory === cat ? '#ffffff' : '#94a3b8',
              border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.08)',
              padding: '8px 18px',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {filteredFoods.map((food) => {
          const gramsNeeded = Math.round((targetProtein / food.proteinPer100g) * 100);
          const caloriesNeeded = Math.round((gramsNeeded / 100) * food.caloriesPer100g);
          const servingsCount = (gramsNeeded / food.unitWeight).toFixed(1);
          const isSelected = selectedForCompare.includes(food.id);
          const densityColor = getDensityColor(caloriesNeeded);

          return (
            <div
              key={food.id}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: isSelected ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {/* Food Image Banner */}
              <div style={{ height: '140px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={food.image}
                  alt={food.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(30, 41, 59, 1) 0%, transparent 80%)'
                }} />
                
                {/* Compare Checkbox */}
                <button
                  onClick={() => toggleCompare(food.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: isSelected ? '#10b981' : 'rgba(15, 23, 42, 0.8)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  {isSelected ? '✓ Comparing' : '+ Compare'}
                </button>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    {food.category}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 12px 0', color: '#f8fafc' }}>
                    {food.name}
                  </h3>

                  {/* Main Metric Highlight */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '14px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Weight Needed</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>{gramsNeeded}g</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>({(gramsNeeded * 0.035274).toFixed(1)} oz)</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Calories</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: densityColor }}>{caloriesNeeded}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>kcal</div>
                    </div>
                  </div>

                  {/* Visual Equivalent */}
                  <div style={{ fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '12px', lineHeight: 1.4 }}>
                    🍽️ <strong>Visual Equivalent:</strong><br />
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>~{servingsCount}</span> {food.servingUnit}s
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {food.tags.map(t => (
                    <span key={t} style={{
                      background: 'rgba(255,255,255,0.05)',
                      color: '#94a3b8',
                      fontSize: '0.7rem',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Compare Drawer Bar */}
      {selectedForCompare.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0f172a',
          border: '1px solid #10b981',
          borderRadius: '9999px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          zIndex: 1000
        }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
            {selectedForCompare.length} food{selectedForCompare.length > 1 ? 's' : ''} selected for comparison
          </span>
          <button
            onClick={() => setShowCompareModal(true)}
            style={{
              background: '#10b981',
              color: '#0f172a',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '9999px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Compare Side-by-Side 📊
          </button>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            background: '#1e293b',
            borderRadius: '24px',
            maxWidth: '800px',
            width: '100%',
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowCompareModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>
              Side-by-Side Comparison for {targetProtein}g Protein
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedForCompare.length}, 1fr)`, gap: '16px' }}>
              {selectedForCompare.map(id => {
                const food = FOOD_DATABASE.find(f => f.id === id);
                const gramsNeeded = Math.round((targetProtein / food.proteinPer100g) * 100);
                const caloriesNeeded = Math.round((gramsNeeded / 100) * food.caloriesPer100g);
                const servingsCount = (gramsNeeded / food.unitWeight).toFixed(1);

                return (
                  <div key={id} style={{ background: '#0f172a', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                    <img src={food.image} alt={food.name} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>{food.name}</h4>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginBottom: '4px' }}>{gramsNeeded}g</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '12px' }}>{caloriesNeeded} Total Calories</div>
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px' }}>
                      ~{servingsCount} {food.servingUnit}s
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
