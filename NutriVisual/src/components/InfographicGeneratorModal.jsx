import React, { useRef, useEffect, useState } from 'react';
import foodsData from '../data/foods.json';

/**
 * InfographicGeneratorModal - Renders high-DPI social graphics onto HTML5 Canvas
 * and provides instant 1-click PNG downloads and clipboard copying.
 */
export default function InfographicGeneratorModal({ isOpen, onClose, food1Id = 'atlantic-salmon', food2Id = 'chicken-breast' }) {
  const canvasRef = useRef(null);
  const [template, setTemplate] = useState('comparison'); // 'comparison' | 'satiety' | 'blueprint'
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const food1 = foodsData.find((f) => f.id === food1Id) || foodsData[0];
  const food2 = foodsData.find((f) => f.id === food2Id) || foodsData[1];

  // Render Canvas Graphic whenever template or selection changes
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI Canvas resolution (1200 x 630px - standard social share card)
    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient (Sleek Dark Mode Glassmorphism)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0a0f1d');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Glowing Orbs
    const orb1 = ctx.createRadialGradient(200, 150, 10, 200, 150, 400);
    orb1.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
    orb1.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = orb1;
    ctx.fillRect(0, 0, width, height);

    const orb2 = ctx.createRadialGradient(1000, 500, 10, 1000, 500, 400);
    orb2.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
    orb2.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = orb2;
    ctx.fillRect(0, 0, width, height);

    // Header Branding Banner
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText('🥑 NutriVisual', 60, 70);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 20px sans-serif';
    ctx.fillText('Visual Nutrition Guide • nutrivisual.com', 310, 68);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 100);
    ctx.lineTo(width - 60, 100);
    ctx.stroke();

    if (template === 'comparison') {
      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px sans-serif';
      ctx.fillText(`${food1.name} vs. ${food2.name}`, 60, 160);

      ctx.fillStyle = '#10b981';
      ctx.font = '600 22px sans-serif';
      ctx.fillText('Side-by-Side 100g Macro & Calorie Density Breakdown', 60, 195);

      // Card 1 Container
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(60, 230, 510, 330, 20);
      ctx.fill();
      ctx.stroke();

      // Card 1 Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(food1.name, 90, 285);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 44px monospace';
      ctx.fillText(`${food1.calories} kcal`, 90, 345);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '22px sans-serif';
      ctx.fillText(`🥩 Protein: ${food1.macros.protein}g`, 90, 400);
      ctx.fillText(`🥑 Fat: ${food1.macros.fat}g`, 90, 440);
      ctx.fillText(`🍚 Carbs: ${food1.macros.carbs}g`, 90, 480);
      ctx.fillText(`⚡ Potassium: ${food1.micros.potassium}`, 90, 520);

      // Card 2 Container
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(630, 230, 510, 330, 20);
      ctx.fill();
      ctx.stroke();

      // Card 2 Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(food2.name, 660, 285);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 44px monospace';
      ctx.fillText(`${food2.calories} kcal`, 660, 345);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '22px sans-serif';
      ctx.fillText(`🥩 Protein: ${food2.macros.protein}g`, 660, 400);
      ctx.fillText(`🥑 Fat: ${food2.macros.fat}g`, 660, 440);
      ctx.fillText(`🍚 Carbs: ${food2.macros.carbs}g`, 660, 480);
      ctx.fillText(`⚡ Potassium: ${food2.micros.potassium}`, 660, 520);
    } else {
      // Default/Blueprint template
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText('🧬 Visual Biohack Nutrition Card', 60, 170);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(`Target Food: ${food1.name}`, 60, 230);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '24px sans-serif';
      ctx.fillText(`🔥 Calorie Density: ${food1.calories} kcal per 100g`, 60, 300);
      ctx.fillText(`🥩 Protein Density: ${food1.macros.protein}g per 100g`, 60, 350);
      ctx.fillText(`🌱 Category: ${food1.category}`, 60, 400);
      ctx.fillText(`✨ Key Benefits: ${food1.benefits ? food1.benefits.join(', ') : 'Nutrient Rich'}`, 60, 450);
    }

    // Footer Watermark
    ctx.fillStyle = '#64748b';
    ctx.font = '600 18px sans-serif';
    ctx.fillText('Generated with NutriVisual Engine • https://nutrivisual.com', 60, 595);
  }, [isOpen, template, food1Id, food2Id]);

  if (!isOpen) return null;

  // Handle Download PNG
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const imageURI = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `nutrivisual-infographic-${food1.id}-vs-${food2.id}.png`;
    link.href = imageURI;
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              📸 One-Click Social Graphic Generator
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Export high-resolution infographic cards formatted for Instagram, X, and Pinterest.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '1rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Template Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setTemplate('comparison')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              backgroundColor: template === 'comparison' ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            ⚖️ Food Comparison Card
          </button>
          <button
            onClick={() => setTemplate('blueprint')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              backgroundColor: template === 'blueprint' ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🧬 Biohack Blueprint Card
          </button>
        </div>

        {/* Canvas Preview Box */}
        <div style={{ backgroundColor: '#020617', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'center' }}>
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
            }}
          />
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
            {downloadSuccess ? '✓ Infographic PNG saved to your downloads!' : '✨ Ready to download high-DPI graphic'}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              📥 Download PNG Infographic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
