
import React from 'react';
import { useUser } from '../context/UserContext';
import { getInitials } from './ProfileAvatar';
import {
  DashboardIcon,
  ServicesIcon,
  CommunitiesIcon,
  TechniciansIcon,
  ReportsIcon,
  LogoutIcon,
} from './AppIcons';

const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Services', icon: <ServicesIcon /> },
    { name: 'Communities', icon: <CommunitiesIcon /> },
    { name: 'Technicians', icon: <TechniciansIcon /> },
    { name: 'Reports', icon: <ReportsIcon /> },
];

function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
    const userContext = useUser();
    const user = userContext?.user;
    const displayName = user?.fullName || 'John Doe';
    const displayEmail = user?.email || 'john.doe@agency.com';
    const initials = getInitials(displayName);

    return (
        <>
            {/* Mobile backdrop overlay */}
            <div
                className={`sidebar-mobile-backdrop ${isOpen ? 'open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />
            <aside className={`sidebar sidebar-slim ${isOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-brand">
                    <div className="brand-logo" title="BEE Agency Portal">B</div>
                    {/* Mobile close button */}
                    <button
                        type="button"
                        className="sidebar-close-btn"
                        onClick={onClose}
                        aria-label="Close navigation"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            type="button"
                            className={`nav-item ${activePage === item.name ? 'active' : ''}`}
                            title={item.name}
                            aria-label={item.name}
                            onClick={() => {
                                onNavigate(item.name);
                                if (onClose) onClose();
                            }}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-tooltip">{item.name}</span>
                            {activePage === item.name && (
                                <span className="nav-indicator" aria-hidden="true" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-account">
                    <div
                        className="account-box"
                        title={`${displayName} (${displayEmail}) · Admin`}
                    >
                        <div className="account-avatar">
                            {user?.photoUrl ? (
                                <img src={user.photoUrl} alt={displayName} className="account-avatar-img" />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>
                        <span className="account-tooltip">{displayName}</span>
                    </div>
                    <button
                        id="logout-button"
                        type="button"
                        className="logout-button"
                        title="Logout"
                        aria-label="Logout"
                        onClick={() => onNavigate('Logout')}
                    >
                        <LogoutIcon />
                        <span className="logout-tooltip">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;

