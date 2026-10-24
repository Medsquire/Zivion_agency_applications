
import React from 'react';
import TableScrollSlider from '../components/TableScrollSlider';
import { TechniciansIcon } from '../components/AppIcons';

function Technicians({ technicians }) {
    const available = technicians.filter((item) => item.status === 'Available').length;
    const assigned = technicians.filter((item) => item.status === 'Assigned').length;

    const summaryCards = [
        {
            title: 'Total Technicians',
            value: technicians.length,
            icon: <TechniciansIcon size={20} />,
        },
        {
            title: 'Available Specialists',
            value: available,
            icon: <TechniciansIcon size={20} />,
        },
        {
            title: 'Assigned on Work',
            value: assigned,
            icon: <TechniciansIcon size={20} />,
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TechniciansIcon size={22} style={{ color: '#2563EB' }} />
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

                <TableScrollSlider>
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
                                            <TechniciansIcon size={14} style={{ color: '#2563EB' }} />
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
                </TableScrollSlider>
            </section>
        </div>
    );
}

export default Technicians;

