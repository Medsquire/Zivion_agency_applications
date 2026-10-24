import React from 'react';

/**
 * Standardized SVG Icon Suite
 * Exactly matches the icons used in the Sidebar navigation.
 * All icons follow the 24x24 viewBox, stroke="currentColor", strokeWidth="2" standard.
 */

export function DashboardIcon({ size = 18, width, height, className = '', ...props }) {
  const w = width || size;
  const h = height || size;
  return (
    <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function ServicesIcon({ size = 18, width, height, className = '', ...props }) {
  const w = width || size;
  const h = height || size;
  return (
    <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export function CommunitiesIcon({ size = 18, width, height, className = '', ...props }) {
  const w = width || size;
  const h = height || size;
  return (
    <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function TechniciansIcon({ size = 18, width, height, className = '', ...props }) {
  const w = width || size;
  const h = height || size;
  return (
    <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function PaymentsIcon({ size = 18, width, height, className = '', ...props }) {
  const w = width || size;
  const h = height || size;
  return (
    <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

export function ReportsIcon({ size = 18, width, height, className = '', ...props }) {
  const w = width || size;
  const h = height || size;
  return (
    <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

export function TeamAccessIcon({ size = 18, width, height, className = '', ...props }) {
  const w = width || size;
  const h = height || size;
  return (
    <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function LogoutIcon({ size = 18, width, height, className = '', ...props }) {
  const w = width || size;
  const h = height || size;
  return (
    <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

/**
 * Helper to fetch the sidebar icon for a given page name
 */
export function getSidebarIcon(pageName, props = {}) {
  switch (pageName) {
    case 'Dashboard':
      return <DashboardIcon {...props} />;
    case 'Services':
      return <ServicesIcon {...props} />;
    case 'Communities':
      return <CommunitiesIcon {...props} />;
    case 'Technicians':
      return <TechniciansIcon {...props} />;
    case 'Payment Records':
    case 'Payments':
      return <PaymentsIcon {...props} />;
    case 'Reports':
      return <ReportsIcon {...props} />;
    case 'Team & Access':
    case 'TeamAccess':
      return <TeamAccessIcon {...props} />;
    case 'Logout':
      return <LogoutIcon {...props} />;
    default:
      return <DashboardIcon {...props} />;
  }
}

export default {
  Dashboard: DashboardIcon,
  Services: ServicesIcon,
  Communities: CommunitiesIcon,
  Technicians: TechniciansIcon,
  Payments: PaymentsIcon,
  Reports: ReportsIcon,
  TeamAccess: TeamAccessIcon,
  Logout: LogoutIcon,
  getSidebarIcon,
};
