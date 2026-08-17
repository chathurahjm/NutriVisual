import React, { useState, useEffect } from 'react';
import { parseDealText, type DealItem, formatINR } from '../../utils/lootParser';
import { Zap, Sparkles, Send, Tag, AlertCircle, Copy, Check, Share2 } from 'lucide-react';
import '../../styles/loot.css';

export default function LootPasteApp() {
  const [activeTab, setActiveTab] = useState<'create' | 'view'>('create');
  const [rawInput, setRawInput] = useState(
    `https://www.amazon.in/dp/B0CX58F499\nhttps://www.amazon.in/dp/B061CVih3Up\nhttps://www.flipkart.com/nike-revolution-7-shoes`
  );
  const [amazonTag, setAmazonTag] = useState('telegramdeal-21');
  const [flipkartTag, setFlipkartTag] = useState('telegramdeal');
  const [timerMinutes, setTimerMinutes] = useState<number>(15);
  
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({
    minutes: timerMinutes,
    seconds: 0,
  });

  useEffect(() => {
    const parsed = parseDealText(rawInput, { amazonTag, flipkartTag });
    setDeals(parsed);
  }, []);

  useEffect(() => {
    if (activeTab !== 'view') return;

    setTimeLeft({ minutes: timerMinutes, seconds: 0 });

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(interval);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTab, timerMinutes]);

  const handleGenerate = () => {
    const parsed = parseDealText(rawInput, { amazonTag, flipkartTag });
    setDeals(parsed);
    setActiveTab('view');
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const shareToTelegram = () => {
    const text = encodeURIComponent(`🔥 *TOP LOOT DEALS (Up to 85% OFF)*\n\nLimited time deals list! Check before stock ends:\n${window.location.href}`);
    window.open(`https://t.me/share/url?url=${window.location.href}&text=${text}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`🔥 *HOT LOOT DEALS (Up to 85% OFF)*\n\nCheck out this live deals list:\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="loot-app">
      {/* Header */}
      <header className="loot-header">
        <div className="loot-header-inner">
          <div className="loot-logo-group">
            <div className="loot-logo-icon">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="loot-logo-text">
                Loot<span>Paste</span>
                <span className="loot-badge">Telegram Engine</span>
              </div>
            </div>
          </div>

          <div className="loot-nav-tabs">
            <button
              onClick={() => setActiveTab('create')}
              className={`loot-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            >
              Creator Mode
            </button>
            <button
              onClick={() => {
                if (deals.length === 0) handleGenerate();
                else setActiveTab('view');
              }}
              className={`loot-tab-btn ${activeTab === 'view' ? 'active' : ''}`}
            >
              Deal Wall ({deals.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="loot-container">
        {activeTab === 'create' ? (
          /* CREATOR DASHBOARD */
          <div>
            <div className="loot-card">
              <div className="loot-card-title-group">
                <Sparkles className="w-5 h-5" />
                <h2>Create LootPaste Deal List</h2>
              </div>
              <p className="loot-card-desc">
                Paste bulk product links (Amazon, Flipkart, etc.). We'll auto-extract titles, prices, images, and append your affiliate tags!
              </p>

              {/* Textarea Input */}
              <div className="loot-form-group">
                <label className="loot-label">Raw Deal Links (1 link per line):</label>
                <textarea
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  rows={5}
                  placeholder="https://www.amazon.in/dp/..."
                  className="loot-textarea"
                />
              </div>

              {/* Affiliate Tags Config */}
              <div className="loot-input-grid loot-form-group">
                <div>
                  <label className="loot-label">Amazon Associate Tag</label>
                  <input
                    type="text"
                    value={amazonTag}
                    onChange={(e) => setAmazonTag(e.target.value)}
                    placeholder="e.g. mytag-21"
                    className="loot-input"
                  />
                </div>
                <div>
                  <label className="loot-label">Flipkart Affiliate ID</label>
                  <input
                    type="text"
                    value={flipkartTag}
                    onChange={(e) => setFlipkartTag(e.target.value)}
                    placeholder="e.g. myaffid"
                    className="loot-input"
                  />
                </div>
              </div>

              {/* Timer Config */}
              <div className="loot-form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="loot-label">Flash Sale Countdown Timer</label>
                <select
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(Number(e.target.value))}
                  className="loot-input"
                >
                  <option value={15}>15 Minutes Flash Sale</option>
                  <option value={60}>1 Hour Limited Deal</option>
                  <option value={1440}>24 Hours Daily Loot</option>
                </select>
              </div>

              {/* Action Button */}
              <button onClick={handleGenerate} className="loot-btn-primary">
                <Zap className="w-4 h-4" />
                Generate LootPaste & Preview Deal Wall
              </button>
            </div>

            {/* Telegram Bot Card */}
            <div className="loot-telegram-box">
              <div className="loot-telegram-icon">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#ffffff' }}>Telegram Bot Automation</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Forward deal messages to <strong style={{ color: '#38bdf8' }}>@JustPasteItLootBot</strong> to auto-parse links in seconds.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* DEAL WALL READER VIEW */
          <div>
            {/* Flash Sale Banner */}
            <div className="loot-flash-banner">
              <div className="loot-flash-tag">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                <span>⚡ Live Flash Deal Countdown</span>
              </div>
              <div className="loot-timer-digits">
                {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>Prices change rapidly when stock depletes. Grab deals fast!</p>
            </div>

            {/* Share & Copy Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '0.5rem 0.85rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0' }}>🔥 {deals.length} Hot Deals Live</span>
              <button
                onClick={handleCopyShareLink}
                style={{ background: '#1e293b', border: 'none', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {linkCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{linkCopied ? 'Link Copied!' : 'Copy Deal Link'}</span>
              </button>
            </div>

            {/* Deals List */}
            <div>
              {deals.map((deal) => (
                <div key={deal.id} className="loot-deal-card">
                  {deal.badge && <div className="loot-deal-badge">{deal.badge}</div>}

                  <div className="loot-deal-content">
                    <div className="loot-deal-img-box">
                      <img src={deal.image} alt={deal.title} loading="lazy" />
                    </div>

                    <div className="loot-deal-info">
                      <span className="loot-merchant-tag">{deal.merchant} • {deal.discountPercent}% OFF</span>
                      <h3 className="loot-deal-title">{deal.title}</h3>

                      <div className="loot-price-row">
                        <span className="loot-price-deal">{formatINR(deal.dealPrice)}</span>
                        <span className="loot-price-mrp">{formatINR(deal.originalPrice)}</span>
                      </div>

                      {deal.couponCode && (
                        <button
                          onClick={() => handleCopyCode(deal.couponCode!, deal.id)}
                          className="loot-coupon-btn"
                        >
                          <Tag className="w-3 h-3" />
                          <span>CODE: {deal.couponCode}</span>
                          {copiedId === deal.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <a href={deal.affiliateUrl} target="_blank" rel="noopener sponsored" className="loot-cta-btn">
                    🛒 Buy Now for {formatINR(deal.dealPrice)} ({deal.merchant})
                  </a>
                </div>
              ))}
            </div>

            {/* Compliance Footer */}
            <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', marginTop: '2rem', textAlign: 'center', fontSize: '0.7rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Affiliate Disclosure</span>
              </div>
              <p>As an affiliate associate, link owner earns from qualifying purchases made via merchant links on this page.</p>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Share Bar */}
      {activeTab === 'view' && (
        <div className="loot-sticky-bar">
          <div className="loot-sticky-inner">
            <button onClick={shareToTelegram} className="loot-share-tg">
              <Send className="w-4 h-4" />
              <span>Share on Telegram</span>
            </button>
            <button onClick={shareToWhatsApp} className="loot-share-wa">
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
