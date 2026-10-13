import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import './TableScrollSlider.css';

/**
 * TableScrollSlider
 * Displays only a clean sliding bar below the table in mobile view
 * to smoothly move and see the total table.
 */
export default function TableScrollSlider({ children, className = '', minWidth }) {
  const tableRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const { isDark } = useTheme();

  const updateScrollState = useCallback(() => {
    const el = tableRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const hasOverflow = maxScroll > 4;
    setCanScroll(hasOverflow);

    if (hasOverflow) {
      const progress = Math.min(100, Math.max(0, (el.scrollLeft / maxScroll) * 100));
      setScrollProgress(progress);
    } else {
      setScrollProgress(0);
    }
  }, []);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    updateScrollState();

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateScrollState();
      });
      resizeObserver.observe(el);
      if (el.firstElementChild) {
        resizeObserver.observe(el.firstElementChild);
      }
    }

    window.addEventListener('resize', updateScrollState);

    return () => {
      window.removeEventListener('resize', updateScrollState);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [updateScrollState]);

  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    setScrollProgress(value);
    const el = tableRef.current;
    if (el) {
      const maxScroll = el.scrollWidth - el.clientWidth;
      el.scrollLeft = (value / 100) * maxScroll;
    }
  };

  const progressColor = isDark ? '#3B82F6' : '#2563EB';
  const trackColor = isDark ? '#1E293B' : '#CBD5E1';

  return (
    <div className={`table-scroll-container ${className}`}>
      {/* Scrollable Table */}
      <div
        className="table-wrapper"
        ref={tableRef}
        onScroll={updateScrollState}
        style={minWidth ? { minWidth } : undefined}
      >
        {children}
      </div>

      {/* Clean Sliding Bar Below the Table (Mobile View) */}
      <div
        className={`table-bottom-slider ${canScroll ? 'is-active' : ''}`}
        aria-label="Table horizontal slider"
      >
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={scrollProgress}
          onChange={handleSliderChange}
          className="table-sliding-bar"
          aria-label="Slide to move and view total table"
          style={{
            background: `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${scrollProgress}%, ${trackColor} ${scrollProgress}%, ${trackColor} 100%)`
          }}
        />
      </div>
    </div>
  );
}
