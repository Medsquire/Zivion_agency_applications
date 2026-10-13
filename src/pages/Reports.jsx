
import React from 'react';

function Reports({ requests, technicians, payments }) {
    const pending = requests.filter(
        (request) => request.status === 'Pending'
    ).length;

    const ongoing = requests.filter(
        (request) => request.status === 'In Progress'
    ).length;

    const completed = requests.filter(
        (request) => request.status === 'Completed'
    ).length;

    const paid = payments.filter(
        (payment) => payment.status === 'Paid'
    ).length;

    const pendingPayments = payments.filter(
        (payment) => payment.status === 'Pending'
    ).length;

    const reportCards = [
        {
            title: 'Service Requests',
            value: requests.length,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                </svg>
            ),
        },
        {
            title: 'Pending Work',
            value: pending,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
        {
            title: 'Work In Progress',
            value: ongoing,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
            ),
        },
        {
            title: 'Completed Work',
            value: completed,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            ),
        },
        {
            title: 'Active Specialists',
            value: technicians.length,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
        },
        {
            title: 'Payment Records',
            value: payments.length,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
            ),
        },
    ];

    const exportReport = () => {
        const headers = [
            'Request ID',
            'Service',
            'Resident Name',
            'Apartment Name',
            'Flat Number',
            'Technician Name',
            'Technician ID',
            'Assigned Date',
            'Status',
        ];

        const rows = requests.map((request) => [
            request.id,
            request.service,
            request.resident,
            request.apartment,
            request.flatNo,
            request.technician,
            request.technicianId,
            request.assignedDate,
            request.status,
        ]);

        const csv = [headers, ...rows]
            .map((row) =>
                row
                    .map((value) =>
                        `"${String(value ?? '').replace(/"/g, '""')}"`
                    )
                    .join(',')
            )
            .join('\n');

        const blob = new Blob(['\uFEFF', csv], {
            type: 'text/csv;charset=utf-8;',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'bee-service-report.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="page-content">
            <div className="page-heading">
                <div>
                    <h1>Reports</h1>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="button"
                        className="primary-button"
                        onClick={exportReport}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="overview-grid">
                {reportCards.map((card) => (
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
                    <h2>Performance Metrics</h2>
                </div>

                <div className="modern-kpi-grid">
                    <div className="modern-kpi-box">
                        <span className="modern-kpi-label">Total Requests</span>
                        <h3 className="modern-kpi-val">{requests.length}</h3>
                    </div>
                    <div className="modern-kpi-box">
                        <span className="modern-kpi-label">Completed</span>
                        <h3 className="modern-kpi-val">{completed}</h3>
                    </div>
                    <div className="modern-kpi-box">
                        <span className="modern-kpi-label">In Progress</span>
                        <h3 className="modern-kpi-val">{ongoing}</h3>
                    </div>
                    <div className="modern-kpi-box">
                        <span className="modern-kpi-label">Pending</span>
                        <h3 className="modern-kpi-val">{pending}</h3>
                    </div>
                    <div className="modern-kpi-box">
                        <span className="modern-kpi-label">Paid Transactions</span>
                        <h3 className="modern-kpi-val">{paid}</h3>
                    </div>
                    <div className="modern-kpi-box">
                        <span className="modern-kpi-label">Pending Payments</span>
                        <h3 className="modern-kpi-val">{pendingPayments}</h3>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Reports;
