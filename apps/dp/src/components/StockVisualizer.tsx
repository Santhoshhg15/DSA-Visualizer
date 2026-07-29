import React, { useState, useEffect, useRef } from 'react';
import { useDPStore } from '../store';
import { DPTape } from './DPTape';
import { StockTrackers } from './StockTrackers';
import { ZoomControls } from './ZoomControls';

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export const StockVisualizer: React.FC = () => {
  const { steps, cur, stockPrices } = useDPStore();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const centerStageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const step = steps[cur] || steps[0];
  const prices = step?.stockPrices || stockPrices || [7, 1, 5, 3, 6, 4];
  const currentDay = step?.stockCurrentDay ?? -1;
  const minPrice = step?.stockMinPrice ?? Infinity;
  const minPriceDay = step?.stockMinPriceDay ?? -1;
  const maxProfit = step?.stockMaxProfit ?? 0;
  const buyDay = step?.stockBuyDay ?? -1;
  const sellDay = step?.stockSellDay ?? -1;
  const action = step?.stockAction ?? null;
  const isDone = step?.type === 'done';

  const handleFitScreen = () => {
    setPan({ x: 0, y: 0 });
    const availableWidth = centerStageRef.current?.clientWidth ?? 800;
    const availableHeight = centerStageRef.current?.clientHeight ?? 600;

    const contentWidth = prices.length * 60 + 100;
    const contentHeight = 320;

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;
    const autoZoom = Math.min(1, Math.min(scaleX, scaleY));

    setZoom(Math.max(ZOOM_MIN, parseFloat(autoZoom.toFixed(2))));
  };

  useEffect(() => {
    handleFitScreen();
  }, [stockPrices]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoom((z) =>
        Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, parseFloat((z + delta).toFixed(2))))
      );
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, input, a, select')) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!step) return null;

  // Custom state mapping function for DPTape
  const customCellState = (index: number) => {
    if (currentDay === -1 && !isDone) {
      // init step
      return 'unfilled';
    }
    if (index === currentDay && !isDone) {
      return 'active';
    }
    if (index === minPriceDay && minPrice !== Infinity) {
      return 'source';
    }
    if (currentDay >= 0 && index <= currentDay) {
      return 'filled';
    }
    if (isDone) {
      return 'filled';
    }
    return 'unfilled';
  };

  // Custom badge rendering for DPTape cells (e.g. MIN badge)
  const customCellBadge = (index: number) => {
    if (index === minPriceDay && minPrice !== Infinity) {
      return (
        <span
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: 'var(--accent-blue)',
            color: 'var(--bg-primary)',
            fontSize: '9px',
            fontWeight: 800,
            padding: '1px 4px',
            borderRadius: '4px',
            fontFamily: 'JetBrains Mono, monospace',
            lineHeight: 1,
            zIndex: 10,
          }}
        >
          MIN
        </span>
      );
    }
    return null;
  };

  return (
    <div
      ref={centerStageRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      className="center-stage flex-1 flex flex-col overflow-hidden relative h-full w-full select-none"
    >
      <ZoomControls
        zoom={zoom}
        setZoom={setZoom}
        minZoom={ZOOM_MIN}
        maxZoom={ZOOM_MAX}
        step={ZOOM_STEP}
        onFitScreen={handleFitScreen}
        onResetPan={() => setPan({ x: 0, y: 0 })}
      />

      {/* CANVAS */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center">
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
          className="p-4 pointer-events-auto"
        >
          {/* PRICES TAPE */}
          <DPTape customCellState={customCellState} customCellBadge={customCellBadge} />

          {/* BUY / SELL MARKERS OVERLAY ON DONE STEP */}
          {isDone && (
            <div
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '-8px',
              }}
            >
              {maxProfit > 0 && buyDay >= 0 && sellDay >= 0 ? (
                <>
                  <div
                    style={{
                      background: 'var(--accent-blue-bg)',
                      border: '1px solid var(--accent-blue)',
                      color: 'var(--accent-blue)',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    ↑ BUY (Day {buyDay}, ${prices[buyDay]})
                  </div>
                  <div
                    style={{
                      background: 'var(--accent-green-bg)',
                      border: '1px solid var(--accent-green)',
                      color: 'var(--accent-green)',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    ↓ SELL (Day {sellDay}, ${prices[sellDay]})
                  </div>
                </>
              ) : (
                <div
                  style={{
                    color: 'var(--muted-color)',
                    fontSize: '12px',
                    fontStyle: 'italic',
                  }}
                >
                  No profitable transaction possible
                </div>
              )}
            </div>
          )}

          {/* SIDE-BY-SIDE TRACKER CARDS */}
          <StockTrackers
            minPrice={minPrice}
            minPriceDay={minPriceDay}
            maxProfit={maxProfit}
            buyDay={buyDay}
            sellDay={sellDay}
            action={action}
          />
        </div>
      </div>
    </div>
  );
};
