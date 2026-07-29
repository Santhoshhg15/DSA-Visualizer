import React, { useEffect, useState } from 'react';

interface StockTrackersProps {
  minPrice: number;
  minPriceDay: number;
  maxProfit: number;
  buyDay: number;
  sellDay: number;
  action?: 'update-min' | 'update-profit' | 'no-change' | null;
}

export const StockTrackers: React.FC<StockTrackersProps> = ({
  minPrice,
  minPriceDay,
  maxProfit,
  buyDay,
  sellDay,
  action,
}) => {
  const [minPulse, setMinPulse] = useState(false);
  const [profitPulse, setProfitPulse] = useState(false);

  useEffect(() => {
    if (action === 'update-min') {
      setMinPulse(true);
      const timer = setTimeout(() => setMinPulse(false), 220);
      return () => clearTimeout(timer);
    }
  }, [minPrice, minPriceDay, action]);

  useEffect(() => {
    if (action === 'update-profit') {
      setProfitPulse(true);
      const timer = setTimeout(() => setProfitPulse(false), 220);
      return () => clearTimeout(timer);
    }
  }, [maxProfit, buyDay, sellDay, action]);

  const displayMinPrice = minPrice === Infinity ? '—' : `$${minPrice}`;
  const displayMinDayText = minPriceDay >= 0 ? `(day ${minPriceDay})` : '—';

  const displayMaxProfit = `$${maxProfit}`;
  const displayProfitDayText =
    buyDay >= 0 && sellDay >= 0 ? `(buy day ${buyDay}, sell day ${sellDay})` : '—';

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px',
        width: '100%',
        maxWidth: '520px',
      }}
    >
      {/* MIN PRICE SO FAR CARD */}
      <div
        style={{
          flex: 1,
          background: 'var(--input-bg)',
          border: '1.5px solid var(--accent-blue)',
          borderRadius: '12px',
          padding: '12px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'transform 0.2s ease, border-color 0.2s ease',
          transform: minPulse ? 'scale(1.1)' : 'scale(1)',
          boxShadow: minPulse ? '0 0 16px var(--accent-blue-bg)' : 'none',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted-color)',
            marginBottom: '4px',
          }}
        >
          MIN PRICE SO FAR
        </span>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--cell-source-text)',
            lineHeight: 1.1,
          }}
        >
          {displayMinPrice}
        </span>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--cell-filled-text)',
            marginTop: '4px',
            fontWeight: 500,
          }}
        >
          {displayMinDayText}
        </span>
      </div>

      {/* MAX PROFIT SO FAR CARD */}
      <div
        style={{
          flex: 1,
          background: 'var(--input-bg)',
          border: '1.5px solid var(--accent-green)',
          borderRadius: '12px',
          padding: '12px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'transform 0.2s ease, border-color 0.2s ease',
          transform: profitPulse ? 'scale(1.1)' : 'scale(1)',
          boxShadow: profitPulse ? '0 0 16px var(--accent-green-bg)' : 'none',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted-color)',
            marginBottom: '4px',
          }}
        >
          MAX PROFIT SO FAR
        </span>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--cell-match-text)',
            lineHeight: 1.1,
          }}
        >
          {displayMaxProfit}
        </span>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--cell-match-text)',
            marginTop: '4px',
            fontWeight: 500,
          }}
        >
          {displayProfitDayText}
        </span>
      </div>
    </div>
  );
};
