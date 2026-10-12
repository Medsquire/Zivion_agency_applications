
import React from 'react';

function Technicians({ technicians }) {
    const available = technicians.filter((item) => item.status === 'Available').length;
    const assigned = technicians.filter((item) => item.status === 'Assigned').length;

    const summaryCards = [
        {
            title: 'Total Technicians',
            value: technicians.length,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
        },
        {
            title: 'Available Specialists',
            value: available,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            ),
        },
        {
            title: 'Assigned on Work',
            value: assigned,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
    ];

    const getInitials = (name = '') =>
        name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'T';

    return (
        <div className="page-content">
            <div className="page-heading">
                <div>
                    <h1>Technicians</h1>
                </div>
            </div>

            <div className="overview-grid">
                {summaryCards.map((card) => (
                    <div className="overview-card" key={card.title}>
                        <div className="overview-card-top">
                            <span className="overview-card-name">{card.title}</span>
                            <div className="overview-icon" aria-hidden="true">
                                {card.icon}
                            </div>
                        </div>
                        <div className="overview-card-bottom">
                            <h2 className="overview-card-count">{card.value}</h2>
                            <span className="overview-card-link"></span>
                        </div>
                    </div>
                ))}
            </div>

            <section className="content-card">
                <div className="section-heading">
                    <div>
                        <h2>Technician Directory</h2>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Technician ID</th>
                                <th>Technician Name</th>
                                <th>Specialization</th>
                                <th>Mobile Number</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {technicians.map((technician) => (
                                <tr key={technician.id}>
                                    <td>
                                        <span className="request-id-badge">{technician.id}</span>
                                    </td>
                                    <td>
                                        <div className="resident-avatar-cell">
                                            <div className="resident-avatar-circle">
                                                {getInitials(technician.name)}
                                            </div>
                                            <strong>{technician.name}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="spec-badge">{technician.skill}</span>
                                    </td>
                                    <td>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                            {technician.mobile}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`status-badge ${technician.status === 'Available'
                                                ? 'status-completed'
                                                : 'status-progress'
                                                }`}
                                        >
                                            {technician.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Technicians;

