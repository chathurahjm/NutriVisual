import React, { useState } from 'react';

const POTASSIUM_SWAPS = [
  {
    id: 'potato-vs-cauliflower',
    highFood: 'Baked White Potato',
    highPotassiumMg: 925,
    highCalories: 160,
    highImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    lowFood: 'Mashed Cauliflower',
    lowPotassiumMg: 180,
    lowCalories: 25,
    lowImage: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
    reductionPercent: 81,
    tip: 'Cauliflower offers the exact same comforting texture of mashed potatoes with 81% less potassium!'
  },
  {
    id: 'banana-vs-apple',
    highFood: 'Medium Banana',
    highPotassiumMg: 422,
    highCalories: 105,
    highImage: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    lowFood: 'Medium Crisp Apple',
    lowPotassiumMg: 107,
    lowCalories: 95,
    lowImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    reductionPercent: 75,
    tip: 'Apples and berries are premier low-potassium fruit substitutes for renal diets.'
  },
  {
    id: 'spinach-vs-cabbage',
    highFood: 'Cooked Spinach (1 cup)',
    highPotassiumMg: 839,
    highCalories: 41,
    highImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    lowFood: 'Shredded Green Cabbage (1 cup)',
    lowPotassiumMg: 151,
    lowCalories: 22,
    lowImage: 'https://images.unsplash.com/photo-1598170845058-12f9a6a5da58?auto=format&fit=crop&w=600&q=80',
    reductionPercent: 82,
    tip: 'Cabbage, cucumber, and iceberg lettuce deliver crunchy greens without high potassium.'
  },
  {
    id: 'avocado-vs-cucumber',
    highFood: 'Fresh Avocado (1 whole)',
    highPotassiumMg: 975,
    highCalories: 320,
    highImage: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    lowFood: 'Sliced Cucumber (1 cup)',
    lowPotassiumMg: 153,
    lowCalories: 16,
    lowImage: 'https://images.unsplash.com/photo-1447175008436-08417090795a?auto=format&fit=crop&w=600&q=80',
    reductionPercent: 84,
    tip: 'Swap avocado in salads with cucumber or radishes for hydration and low potassium.'
  },
  {
    id: 'tomato-vs-red-pepper',
    highFood: 'Raw Tomato (1 medium)',
    highPotassiumMg: 292,
    highCalories: 22,
    highImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    lowFood: 'Red Bell Pepper (1 medium)',
    lowPotassiumMg: 175,
    lowCalories: 24,
    lowImage: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
    reductionPercent: 40,
    tip: 'Red bell peppers provide vibrant color, Vitamin C, and lower potassium than tomatoes.'
  }
];

export default function RenalPotassiumCalculator() {
  const [dailyCapMg, setDailyCapMg] = useState(2000);
  const [selectedSwaps, setSelectedSwaps] = useState(['potato-vs-cauliflower', 'banana-vs-apple']);
  const [isLeached, setIsLeached] = useState(false);

  const toggleSwap = (id) => {
    if (selectedSwaps.includes(id)) {
      setSelectedSwaps(selectedSwaps.filter(s => s !== id));
    } else {
      setSelectedSwaps([...selectedSwaps, id]);
    }
  };

  const totalPotassiumSaved = selectedSwaps.reduce((acc, id) => {
    const item = POTASSIUM_SWAPS.find(s => s.id === id);
    if (!item) return acc;
    return acc + (item.highPotassiumMg - item.lowPotassiumMg);
  }, 0);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 60%, #042f2e 100%)',
      borderRadius: '24px',
      padding: '32px 24px',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      border: '1px solid rgba(16, 185, 129, 0.25)',
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
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '12px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          🩺 Renal Diet Visual Tool
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 12px 0' }}>
          Low Potassium Food Swap Calculator
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          Visually compare high-potassium staples with renal-friendly alternatives to keep your daily intake under target limits!
        </p>
      </div>

      {/* Cap Tracker Bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        padding: '24px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontWeight: 700, fontSize: '0.95rem', color: '#cbd5e1' }}>Daily Potassium Cap Target:</label>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>{dailyCapMg} mg/day</div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '12px 20px', borderRadius: '12px', textAlign: 'right', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Potassium Saved by Selected Swaps</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>-{totalPotassiumSaved} mg</div>
          </div>
        </div>

        {/* Leaching Toggle Feature */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          padding: '16px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          border: '1px dashed rgba(255,255,255,0.1)'
        }}>
          <div>
            <span style={{ fontWeight: 700, color: '#f8fafc', display: 'block', fontSize: '0.9rem' }}>🥔 Potato Leaching Method Simulator</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Soaking & boiling sliced potatoes reduces potassium by up to 50%!</span>
          </div>
          <button
            onClick={() => setIsLeached(!isLeached)}
            style={{
              background: isLeached ? '#10b981' : 'rgba(255,255,255,0.1)',
              color: isLeached ? '#0f172a' : '#f8fafc',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            {isLeached ? '✓ Leaching Active (-50%)' : 'Apply Leaching'}
          </button>
        </div>
      </div>

      {/* Swaps Grid */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
        Interactive High vs Low Potassium Swaps:
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {POTASSIUM_SWAPS.map(swap => {
          const isSelected = selectedSwaps.includes(swap.id);
          const effectiveHighPotassium = (swap.id.includes('potato') && isLeached)
            ? Math.round(swap.highPotassiumMg * 0.5)
            : swap.highPotassiumMg;

          return (
            <div
              key={swap.id}
              onClick={() => toggleMeal(swap.id)}
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: '20px',
                padding: '20px',
                border: isSelected ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.2s ease',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gap: '16px',
                alignItems: 'center'
              }}
            >
              {/* High Potassium Side */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#ef4444', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>
                  ❌ High Potassium
                </div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#f8fafc' }}>{swap.highFood}</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{effectiveHighPotassium} mg</div>
                {swap.id.includes('potato') && isLeached && (
                  <span style={{ fontSize: '0.7rem', color: '#34d399', display: 'block' }}>(Leached from {swap.highPotassiumMg}mg)</span>
                )}
              </div>

              {/* Swap Arrow & Reduction Badge */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: '#10b981',
                  color: '#0f172a',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  marginBottom: '6px'
                }}>
                  -{swap.reductionPercent}%
                </div>
                <div style={{ fontSize: '1.5rem' }}>➔</div>
              </div>

              {/* Low Potassium Side */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>
                  ✅ Renal-Friendly Swap
                </div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#f8fafc' }}>{swap.lowFood}</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>{swap.lowPotassiumMg} mg</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
