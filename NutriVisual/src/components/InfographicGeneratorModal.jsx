import React, { useRef, useEffect, useState } from 'react';
import foodsData from '../data/foods.json';

/**
 * InfographicGeneratorModal - Renders high-DPI social graphics onto HTML5 Canvas
 * and provides 1-click social sharing (Facebook, X, WhatsApp, Web Share),
 * image clipboard copying, and PNG downloads.
 */
export default function InfographicGeneratorModal({
  isOpen,
  onClose,
  food1Id = 'avocado',
  food2Id = 'atlantic-salmon',
  portionGrams = 100,
  initialTemplate = 'portion'
}) {
  const canvasRef = useRef(null);
  const [template, setTemplate] = useState(initialTemplate); // 'portion' | 'comparison' | 'blueprint'
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sync state when initialTemplate prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setTemplate(initialTemplate);
    }
  }, [isOpen, initialTemplate]);

  const food1 = foodsData.find((f) => f.id === food1Id) || foodsData[0];
  const food2 = foodsData.find((f) => f.id === food2Id) || foodsData[1];

  // Calculated Portion Scaled Metrics
  const scale = portionGrams / 100;
  const scaledCalories = Math.round(food1.calories * scale);
  const scaledFat = Math.round(food1.macros.fat * scale * 10) / 10;
  const scaledCarbs = Math.round(food1.macros.carbs * scale * 10) / 10;
  const scaledProtein = Math.round(food1.macros.protein * scale * 10) / 10;

  const totalMacro = scaledFat + scaledCarbs + scaledProtein || 1;
  const fatPct = Math.round((scaledFat / totalMacro) * 100);
  const carbsPct = Math.round((scaledCarbs / totalMacro) * 100);
  const proteinPct = Math.round((scaledProtein / totalMacro) * 100);

  // Social Share Metadata
  const shareUrl = `https://nutrivisual.com/food/${food1.id}/`;
  const shareTitle = `🥗 ${food1.name} (${portionGrams}g Portion) — Visual Nutrition Breakdown`;
  const shareText = `Check out the visual nutrition breakdown for ${portionGrams}g of ${food1.name}: ${scaledCalories} kcal | ${scaledProtein}g Protein | ${scaledFat}g Fat | ${scaledCarbs}g Carbs on NutriVisual!`;

  // Render Canvas Graphic whenever template or selection changes
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    // High DPI Canvas resolution (1200 x 630px - standard social share card)
    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    const renderCanvas = (img1 = null, img2 = null) => {
      if (!isMounted) return;
      ctx.clearRect(0, 0, width, height);

      // Background Gradient (Sleek Dark Mode Glassmorphism)
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a0f1d');
      bgGrad.addColorStop(0.5, '#0f172a');
      bgGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Decorative Glowing Orbs
      const orb1 = ctx.createRadialGradient(200, 150, 10, 200, 150, 400);
      orb1.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
      orb1.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = orb1;
      ctx.fillRect(0, 0, width, height);

      const orb2 = ctx.createRadialGradient(1000, 500, 10, 1000, 500, 400);
      orb2.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
      orb2.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = orb2;
      ctx.fillRect(0, 0, width, height);

      // Header Branding Banner
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('🥑 NutriVisual', 60, 70);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 20px sans-serif';
      ctx.fillText('Visual Nutrition Reference • nutrivisual.com', 310, 68);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 100);
      ctx.lineTo(width - 60, 100);
      ctx.stroke();

      if (template === 'portion') {
        // PORTION VISUALIZER CARD TEMPLATE
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(`${food1.name} — ${portionGrams}g Serving Visualizer`, 60, 160);

        ctx.fillStyle = '#10b981';
        ctx.font = '600 22px sans-serif';
        ctx.fillText(`Exact Macro Ratio & Energy Density Breakdown (${portionGrams} grams)`, 60, 195);

        // Left Card - Energy & Serving Summary
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(60, 230, 450, 330, 20);
        ctx.fill();
        ctx.stroke();

        // Draw Food Image Thumbnail on Left Card
        if (img1) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(330, 255, 150, 130, 16);
          ctx.clip();
          ctx.drawImage(img1, 330, 255, 150, 130);
          ctx.restore();

          // Image Accent Border
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(330, 255, 150, 130, 16);
          ctx.stroke();
        }

        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 18px sans-serif';
        ctx.fillText('TOTAL ENERGY & SERVING', 90, 275);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 54px monospace';
        ctx.fillText(`${scaledCalories} kcal`, 90, 345);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '22px sans-serif';
        ctx.fillText(`⚖️ Portion Size: ${portionGrams}g`, 90, 400);
        ctx.fillText(`🌱 Category: ${food1.category}`, 90, 440);

        // Category Badge
        ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(90, 470, 390, 60, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`🛡️ Longevity Tag: ${food1.tags ? food1.tags[0] : 'Whole Food'}`, 110, 506);

        // Right Card - Macro & Micronutrient Distribution
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(540, 230, 600, 330, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('Macronutrient & Density Distribution', 570, 275);

        // Macro Bars
        const drawBar = (y, label, gVal, pctVal, color, emoji) => {
          ctx.fillStyle = '#e2e8f0';
          ctx.font = '20px sans-serif';
          ctx.fillText(`${emoji} ${label}: ${gVal}g (${pctVal}%)`, 570, y);

          // Bar Track
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.beginPath();
          ctx.roundRect(570, y + 10, 540, 14, 7);
          ctx.fill();

          // Fill Bar
          const barWidth = Math.max(12, (pctVal / 100) * 540);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.roundRect(570, y + 10, barWidth, 14, 7);
          ctx.fill();
        };

        drawBar(310, 'Protein Density', scaledProtein, proteinPct, '#f59e0b', '🥩');
        drawBar(370, 'Healthy Fats', scaledFat, fatPct, '#10b981', '🥑');
        drawBar(430, 'Carbohydrates', scaledCarbs, carbsPct, '#06b6d4', '🍚');

        // Micronutrients Summary Line
        ctx.fillStyle = '#94a3b8';
        ctx.font = '18px sans-serif';
        ctx.fillText(
          `⚡ Potassium: ${food1.micros.potassium}  •  Magnesium: ${food1.micros.magnesium}  •  Fiber: ${food1.micros.fiber}`,
          570,
          520
        );

      } else if (template === 'comparison') {
        // COMPARISON CARD TEMPLATE
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

        if (img1) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(430, 255, 115, 105, 14);
          ctx.clip();
          ctx.drawImage(img1, 430, 255, 115, 105);
          ctx.restore();

          ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(430, 255, 115, 105, 14);
          ctx.stroke();
        }

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

        if (img2) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(1000, 255, 115, 105, 14);
          ctx.clip();
          ctx.drawImage(img2, 1000, 255, 115, 105);
          ctx.restore();

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(1000, 255, 115, 105, 14);
          ctx.stroke();
        }

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
        // BLUEPRINT CARD TEMPLATE
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

        if (img1) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(880, 240, 240, 240, 20);
          ctx.clip();
          ctx.drawImage(img1, 880, 240, 240, 240);
          ctx.restore();

          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(880, 240, 240, 240, 20);
          ctx.stroke();
        }
      }

      // Footer Watermark
      ctx.fillStyle = '#64748b';
      ctx.font = '600 18px sans-serif';
      ctx.fillText('Generated with NutriVisual Engine • https://nutrivisual.com', 60, 595);
    };

    // Render immediately (text/layout fallback)
    renderCanvas(null, null);

    // Asynchronously load food images with CORS
    let loadedImg1 = null;
    let loadedImg2 = null;

    if (food1 && food1.image) {
      const i1 = new Image();
      i1.crossOrigin = 'anonymous';
      i1.onload = () => {
        loadedImg1 = i1;
        renderCanvas(loadedImg1, loadedImg2);
      };
      i1.src = food1.image;
    }

    if (template === 'comparison' && food2 && food2.image) {
      const i2 = new Image();
      i2.crossOrigin = 'anonymous';
      i2.onload = () => {
        loadedImg2 = i2;
        renderCanvas(loadedImg1, loadedImg2);
      };
      i2.src = food2.image;
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, template, food1Id, food2Id, portionGrams]);

  if (!isOpen) return null;

  // Handle Download PNG
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const imageURI = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `nutrivisual-${food1.id}-${portionGrams}g-portion.png`;
    link.href = imageURI;
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Copy High-DPI Graphic to Clipboard
  const handleCopyGraphic = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
        } else {
          // Fallback to copying URL text
          navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
        }
      }, 'image/png');
    } catch (err) {
      console.warn('Clipboard write error fallback:', err);
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  // Native Web Share API (Mobile & Desktop)
  const handleNativeShare = async () => {
    if (!canvasRef.current) return;
    if (navigator.share) {
      try {
        canvasRef.current.toBlob(async (blob) => {
          if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'nutrivisual-portion.png', { type: 'image/png' })] })) {
            const file = new File([blob], `nutrivisual-${food1.id}.png`, { type: 'image/png' });
            await navigator.share({
              title: shareTitle,
              text: shareText,
              files: [file]
            });
          } else {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              url: shareUrl
            });
          }
        }, 'image/png');
      } catch (e) {
        console.log('Share canceled or failed', e);
      }
    } else {
      handleCopyGraphic();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
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
        maxWidth: '920px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📸</span> Quick Social Graphic & Portion Exporter
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Export high-resolution infographics and share custom portion breakdowns to Facebook, X, WhatsApp, or copy to clipboard.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
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
            onClick={() => setTemplate('portion')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              backgroundColor: template === 'portion' ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🥗 Portion Visualizer Card ({portionGrams}g)
          </button>
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

        {/* Quick Social Share Bar (Facebook, X, WhatsApp, LinkedIn, Web Share, Copy Image) */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🚀 1-Click Quick Social Share to Platform:</span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {/* Facebook Share Button */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#1877f2',
                color: '#ffffff',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(24, 119, 242, 0.3)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>

            {/* X (Twitter) Share Button */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X / Twitter
            </a>

            {/* WhatsApp Share Button */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#25d366',
                color: '#ffffff',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>

            {/* Copy Graphic Image to Clipboard */}
            <button
              onClick={handleCopyGraphic}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              📋 {copySuccess ? 'Copied HD Graphic! ✓' : 'Copy Image to Clipboard'}
            </button>

            {/* Native Web Share */}
            <button
              onClick={handleNativeShare}
              style={{
                backgroundColor: '#38bdf8',
                color: '#0f172a',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
              }}
            >
              📲 Native Share Sheet
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
            {downloadSuccess ? '✓ Infographic PNG saved to your downloads!' : '✨ Ready to share or download high-DPI graphic'}
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
              Close
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

