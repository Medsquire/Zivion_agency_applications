import React from 'react';

/**
 * Slim, Featherweight Vector Icon Suite (1.4px - 1.5px stroke)
 * Designed for high-end SaaS UI/UX (Linear / Stripe style).
 */

const baseProps = (size = 16, strokeWidth = 1.5, className = '') => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className,
});

export function SlimServices({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export function SlimWrench({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export function SlimGrid({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function SlimShield({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function SlimSparkles({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}

export function SlimSearch({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function SlimFilter({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

export function SlimSliders({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

export function SlimTableView({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

export function SlimKanbanView({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <rect x="3" y="3" width="5" height="18" rx="1.2" />
      <rect x="10" y="3" width="5" height="12" rx="1.2" />
      <rect x="17" y="3" width="5" height="15" rx="1.2" />
    </svg>
  );
}

export function SlimEye({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function SlimUserCheck({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

export function SlimUserPlus({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}

export function SlimPencil({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

export function SlimTrash({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function SlimPlus({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function SlimArrowRight({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function SlimChevronDown({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function SlimX({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function SlimCheck({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function SlimCalendar({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function SlimMapPin({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function SlimAlertCircle({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function SlimClock({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function SlimRotateCcw({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

export function SlimLayers({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

export function SlimZap({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function SlimDroplet({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

export function SlimHammer({ size = 16, strokeWidth = 1.5, className = '', ...props }) {
  return (
    <svg {...baseProps(size, strokeWidth, className)} {...props}>
      <path d="M14.5 9.5 21 3m0 0-4 4m4-4 2 2-4 4" />
      <path d="m14 10-9 9a2.12 2.12 0 1 1-3-3l9-9" />
    </svg>
  );
}

