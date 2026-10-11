
import React from 'react';

const menuItems = [
    { name: 'Dashboard', icon: '▦' },
    { name: 'Services', icon: '⚒' },
    { name: 'Technicians', icon: '♙' },
    { name: 'Payment Records', icon: '₹' },
    { name: 'Reports', icon: '▤' },
];

function Sidebar({ activePage, onNavigate }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo">B</div>
                <div>
                    <h2>BEE</h2>
                    <p>Agency Portal</p>
                </div>
            </div>

            <p className="sidebar-label">WORKSPACE</p>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        type="button"
                        className={`nav-item ${activePage === item.name ? 'active' : ''
                            }`}
                        onClick={() => onNavigate(item.name)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.name}</span>
                        {activePage === item.name && (
                            <span className="nav-indicator">●</span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="sidebar-account">
                <p className="sidebar-label">SIGNED IN AS</p>
                <div className="account-email">admin@beeportal.com</div>
                <button
                    id="logout-button"
                    type="button"
                    className="logout-button"
                    onClick={() => onNavigate('Logout')}
                >
                    ↪ Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
