import React from 'react';

interface ZoomControlsProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  minZoom?: number;
  maxZoom?: number;
  step?: number;
  onFitScreen?: () => void;
  onResetPan?: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoom,
  setZoom,
  minZoom = 0.4,
  maxZoom = 1.5,
  step = 0.1,
  onFitScreen,
  onResetPan,
}) => {
  const zoomIn = () => setZoom((z) => Math.min(maxZoom, parseFloat((z + step).toFixed(2))));
  const zoomOut = () => setZoom((z) => Math.max(minZoom, parseFloat((z - step).toFixed(2))));

  const handleReset = () => {
    setZoom(1);
    onResetPan?.();
  };

  const handleFitScreen = () => {
    if (onFitScreen) {
      onFitScreen();
    } else {
      handleReset();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'rgba(19, 19, 22, 0.9)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '4px',
      }}
      className="select-none shadow-lg"
    >
      {/* Zoom out (−) */}
      <button
        onClick={zoomOut}
        disabled={zoom <= minZoom}
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '6px',
          background: 'transparent',
          border: 'none',
          color: 'var(--muted-color)',
          cursor: zoom <= minZoom ? 'not-allowed' : 'pointer',
          opacity: zoom <= minZoom ? 0.4 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 600,
          transition: 'all 0.15s ease',
        }}
        className={zoom > minZoom ? 'hover:bg-white/10 hover:text-[var(--text-color)]' : ''}
        title="Zoom Out (Ctrl + Scroll Down)"
      >
        −
      </button>

      {/* Zoom percentage readout (Click to reset to 100%) */}
      <span
        onClick={handleReset}
        style={{
          padding: '0 8px',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--text-color)',
          cursor: 'pointer',
          fontWeight: 500,
        }}
        className="hover:text-blue-400 transition-colors"
        title="Click to reset zoom & position"
      >
        {Math.round(zoom * 100)}%
      </span>

      {/* Zoom in (+) */}
      <button
        onClick={zoomIn}
        disabled={zoom >= maxZoom}
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '6px',
          background: 'transparent',
          border: 'none',
          color: 'var(--muted-color)',
          cursor: zoom >= maxZoom ? 'not-allowed' : 'pointer',
          opacity: zoom >= maxZoom ? 0.4 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 600,
          transition: 'all 0.15s ease',
        }}
        className={zoom < maxZoom ? 'hover:bg-white/10 hover:text-[var(--text-color)]' : ''}
        title="Zoom In (Ctrl + Scroll Up)"
      >
        +
      </button>

      {/* Divider line */}
      <div style={{ width: '1px', height: '14px', background: 'var(--border-color)', margin: '0 2px' }} />

      {/* Fit to Screen Button */}
      <button
        onClick={handleFitScreen}
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '6px',
          background: 'transparent',
          border: 'none',
          color: 'var(--muted-color)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: 600,
          transition: 'all 0.15s ease',
        }}
        className="hover:bg-white/10 hover:text-[var(--text-color)]"
        title="Fit to Screen"
      >
        ⛶
      </button>
    </div>
  );
};
