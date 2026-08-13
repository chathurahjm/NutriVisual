import React, { useState, useMemo } from 'react';

const GLP1_FOODS = [
  {
    id: 'whey-isolate-shake',
    name: 'Whey Isolate in Water',
    category: 'Liquid / Soft',
    proteinPerServing: 25,
    caloriesPerServing: 110,
    volumeMl: 250,
    digestiveEase: 'Very Easy (Liquid)',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80',
    whyGlp1: 'Quick liquid absorption when solid food causes nausea.'
  },
  {
    id: 'greek-yogurt-super',
    name: 'Non-Fat Greek Yogurt (1 cup)',
    category: 'Liquid / Soft',
    proteinPerServing: 23,
    caloriesPerServing: 130,
    volumeMl: 220,
    digestiveEase: 'Easy (Probiotic)',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    whyGlp1: 'Smooth texture, high protein density, supports gut health.'
  },
  {
    id: 'egg-white-scramble',
    name: 'Egg White Scramble (1 cup)',
    category: 'Soft Foods',
    proteinPerServing: 26,
    caloriesPerServing: 120,
    volumeMl: 200,
    digestiveEase: 'Easy (Light)',
    image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=600&q=80',
    whyGlp1: 'High volume of pure protein with zero heavy fats.'
  },
  {
    id: 'bone-broth-collagen',
    name: 'Bone Broth + Collagen (16 oz)',
    category: 'Liquid / Soft',
    proteinPerServing: 20,
    caloriesPerServing: 90,
    volumeMl: 450,
    digestiveEase: 'Very Easy (Hydrating)',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    whyGlp1: 'Soothes stomach, rich in electrolytes and glycine.'
  },
  {
    id: 'canned-tuna-olive',
    name: 'Light Tuna Can (120g drained)',
    category: 'Lean Solid',
    proteinPerServing: 31,
    caloriesPerServing: 140,
    volumeMl: 120,
    digestiveEase: 'Moderate',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    whyGlp1: 'Tiny physical size with huge 31g protein payload.'
  },
  {
    id: 'cottage-cheese-cup',
    name: 'Low-Fat Cottage Cheese (1 cup)',
    category: 'Soft Foods',
    proteinPerServing: 28,
    caloriesPerServing: 180,
    volumeMl: 220,
    digestiveEase: 'Easy',
    image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=600&q=80',
    whyGlp1: 'Slow-digesting casein protects muscle mass overnight.'
  },
  {
    id: 'skinless-chicken-3oz',
    name: 'Grilled Chicken Breast (4 oz)',
    category: 'Lean Solid',
    proteinPerServing: 35,
    caloriesPerServing: 185,
    volumeMl: 110,
    digestiveEase: 'Moderate (Chew Well)',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
    whyGlp1: 'Maximum protein per bite for solid food meals.'
  }
];

export default function Glp1ProteinCalculator() {
  const [weightKg, setWeightKg] = useState(75); // default ~165 lbs
  const [selectedMeals, setSelectedMeals] = useState([
    'greek-yogurt-super',
    'whey-isolate-shake',
    'skinless-chicken-3oz'
  ]);

  // Protein targets: 1.2g to 1.6g per kg of body weight
  const minTargetProtein = Math.round(weightKg * 1.2);
  const maxTargetProtein = Math.round(weightKg * 1.6);
  const recommendedTarget = Math.round((minTargetProtein + maxTargetProtein) / 2);

  const currentMealStats = useMemo(() => {
    let totalProtein = 0;
    let totalCalories = 0;
    selectedMeals.forEach(id => {
      const food = GLP1_FOODS.find(f => f.id === id);
      if (food) {
        totalProtein += food.proteinPerServing;
        totalCalories += food.caloriesPerServing;
      }
    });
    return { totalProtein, totalCalories };
  }, [selectedMeals]);

  const toggleMeal = (id) => {
    if (selectedMeals.includes(id)) {
      setSelectedMeals(selectedMeals.filter(m => m !== id));
    } else {
      setSelectedMeals([...selectedMeals, id]);
    }
  };

  const progressPercent = Math.min(100, Math.round((currentMealStats.totalProtein / recommendedTarget) * 100));

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0284c7 0%, #0f172a 60%, #1e1b4b 100%)',
      borderRadius: '24px',
      padding: '32px 24px',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      border: '1px solid rgba(56, 189, 248, 0.2)',
      margin: '32px 0'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(56, 189, 248, 0.15)',
          color: '#38bdf8',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '12px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          💉 GLP-1 & Ozempic Small-Portion Tool
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 12px 0' }}>
          Personalized GLP-1 Muscle Protection Calculator
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          Calculate your target daily protein to prevent lean muscle loss during appetite suppression, and build a 4-mini-meal plan using gentle, high-density foods!
        </p>
      </div>

      {/* Body Weight Input & Targets */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(12px)',
        padding: '24px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '8px' }}>
              Your Body Weight: <span style={{ color: '#38bdf8' }}>{weightKg} kg</span> ({Math.round(weightKg * 2.20462)} lbs)
            </label>
            <input
              type="range"
              min="45"
              max="140"
              step="1"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
            />
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended Daily Target</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>
              {minTargetProtein}g – {maxTargetProtein}g
            </div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>(1.2g – 1.6g per kg to preserve muscle)</div>
          </div>
        </div>
      </div>

      {/* Progress Tracker Bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
          <span>Selected Mini-Meal Plan: {currentMealStats.totalProtein}g Protein</span>
          <span style={{ color: progressPercent >= 100 ? '#34d399' : '#38bdf8' }}>{progressPercent}% of Recommended ({recommendedTarget}g)</span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.1)', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: progressPercent >= 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #0284c7, #38bdf8)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'right' }}>
          Total Calories: <strong style={{ color: '#f8fafc' }}>{currentMealStats.totalCalories} kcal</strong>
        </div>
      </div>

      {/* Food Selection Grid */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
        Select Easy-to-Digest High-Density Foods:
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '16px'
      }}>
        {GLP1_FOODS.map(food => {
          const isSelected = selectedMeals.includes(food.id);

          return (
            <div
              key={food.id}
              onClick={() => toggleMeal(food.id)}
              style={{
                background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                border: isSelected ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: food.category.includes('Liquid') ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.08)',
                    color: food.category.includes('Liquid') ? '#38bdf8' : '#94a3b8'
                  }}>
                    {food.category}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isSelected ? '#38bdf8' : '#64748b'
                  }}>
                    {isSelected ? '✓ Added' : '+ Add'}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px 0', color: '#f8fafc' }}>
                  {food.name}
                </h4>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>{food.proteinPerServing}g</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Protein</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#cbd5e1' }}>{food.caloriesPerServing}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Calories</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                  💡 <em>{food.whyGlp1}</em>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
