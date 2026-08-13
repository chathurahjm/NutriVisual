import React, { useState } from 'react';

const VOLUME_FOODS = [
  {
    id: 'broccoli',
    name: 'Fresh Broccoli',
    category: 'High Volume (Lowest Density)',
    caloriesPer100g: 34,
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80',
    volumeRating: 'Extreme High Volume'
  },
  {
    id: 'strawberries',
    name: 'Fresh Strawberries',
    category: 'High Volume (Fruit)',
    caloriesPer100g: 32,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
    volumeRating: 'High Volume'
  },
  {
    id: 'popcorn-air',
    name: 'Air-Popped Popcorn',
    category: 'High Volume (Snack)',
    caloriesPer100g: 387,
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80',
    volumeRating: 'High Air Volume'
  },
  {
    id: 'chicken-breast',
    name: 'Skinless Chicken Breast',
    category: 'Moderate Volume (Lean Protein)',
    caloriesPer100g: 165,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
    volumeRating: 'Moderate'
  },
  {
    id: 'peanut-butter',
    name: 'Peanut Butter',
    category: 'Low Volume (Calorie Dense)',
    caloriesPer100g: 588,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
    volumeRating: 'Tiny Portion'
  },
  {
    id: 'olive-oil',
    name: 'Extra Virgin Olive Oil',
    category: 'Low Volume (Pure Fat)',
    caloriesPer100g: 884,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    volumeRating: 'Ultra Dense Liquid'
  }
];

export default function VolumeEatingCalculator() {
  const [targetCalories, setTargetCalories] = useState(300);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #15803d 0%, #0f172a 60%, #064e3b 100%)',
      borderRadius: '24px',
      padding: '32px 24px',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      border: '1px solid rgba(34, 197, 94, 0.25)',
      margin: '32px 0'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(34, 197, 94, 0.15)',
          color: '#4ade80',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '12px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          🥗 Volumetrics & Calorie Density Tool
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 12px 0' }}>
          What Does <span style={{ color: '#4ade80' }}>{targetCalories} Calories</span> Look Like?
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          Drag the calorie slider below to see how physical food volume changes dramatically between low-calorie high-volume foods vs calorie-dense fats!
        </p>
      </div>

      {/* Calorie Slider */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        padding: '24px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{ fontWeight: 700, fontSize: '1.1rem', color: '#cbd5e1' }}>Calorie Budget:</label>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#4ade80' }}>{targetCalories} kcal</span>
        </div>

        <input
          type="range"
          min="100"
          max="600"
          step="50"
          value={targetCalories}
          onChange={(e) => setTargetCalories(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#4ade80', cursor: 'pointer', marginBottom: '16px' }}
        />

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[100, 200, 300, 500].map(cal => (
            <button
              key={cal}
              onClick={() => setTargetCalories(cal)}
              style={{
                background: targetCalories === cal ? '#4ade80' : 'rgba(255,255,255,0.06)',
                color: targetCalories === cal ? '#0f172a' : '#cbd5e1',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {cal} kcal
            </button>
          ))}
        </div>
      </div>

      {/* Food Comparison Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        {VOLUME_FOODS.map(food => {
          const gramsForCalories = Math.round((targetCalories / food.caloriesPer100g) * 100);
          const ozForCalories = (gramsForCalories * 0.035274).toFixed(1);

          return (
            <div
              key={food.id}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <img src={food.image} alt={food.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
                <span style={{ fontSize: '0.7rem', color: '#4ade80', textTransform: 'uppercase', fontWeight: 700 }}>
                  {food.category}
                </span>
                <h4 style={{ margin: '4px 0 12px 0', fontSize: '1.1rem', color: '#f8fafc' }}>{food.name}</h4>

                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  padding: '12px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  marginBottom: '8px'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Food Weight for {targetCalories} kcal</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: food.caloriesPer100g < 100 ? '#4ade80' : '#f59e0b' }}>
                    {gramsForCalories}g
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>({ozForCalories} oz)</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
