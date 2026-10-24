
import React from 'react';
import {
  ReportsIcon,
  ServicesIcon,
  TechniciansIcon,
  PaymentsIcon,
} from '../components/AppIcons';

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
            icon: <ServicesIcon size={20} />,
        },
        {
            title: 'Pending Work',
            value: pending,
            icon: <ServicesIcon size={20} />,
        },
        {
            title: 'Work In Progress',
            value: ongoing,
            icon: <ServicesIcon size={20} />,
        },
        {
            title: 'Completed Work',
            value: completed,
            icon: <ServicesIcon size={20} />,
        },
        {
            title: 'Active Specialists',
            value: technicians.length,
            icon: <TechniciansIcon size={20} />,
        },
        {
            title: 'Payment Records',
            value: payments.length,
            icon: <PaymentsIcon size={20} />,
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ReportsIcon size={22} style={{ color: '#2563EB' }} />
                    <h1>Reports</h1>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="button"
                        className="primary-button lite-action-btn"
                        onClick={exportReport}
                        title="Export CSV"
                    >
                        <ReportsIcon size={15} />
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
                        <div className="modern-kpi-icon"><ServicesIcon size={22} style={{ color: '#2563EB' }} /></div>
                        <div className="modern-kpi-body">
                            <span className="modern-kpi-label">Total Requests</span>
                            <h3 className="modern-kpi-val">{requests.length}</h3>
                        </div>
                    </div>
                    <div className="modern-kpi-box">
                        <div className="modern-kpi-icon"><ServicesIcon size={22} style={{ color: '#16A34A' }} /></div>
                        <div className="modern-kpi-body">
                            <span className="modern-kpi-label">Completed</span>
                            <h3 className="modern-kpi-val">{completed}</h3>
                        </div>
                    </div>
                    <div className="modern-kpi-box">
                        <div className="modern-kpi-icon"><ServicesIcon size={22} style={{ color: '#0284C7' }} /></div>
                        <div className="modern-kpi-body">
                            <span className="modern-kpi-label">In Progress</span>
                            <h3 className="modern-kpi-val">{ongoing}</h3>
                        </div>
                    </div>
                    <div className="modern-kpi-box">
                        <div className="modern-kpi-icon"><ServicesIcon size={22} style={{ color: '#EA580C' }} /></div>
                        <div className="modern-kpi-body">
                            <span className="modern-kpi-label">Pending</span>
                            <h3 className="modern-kpi-val">{pending}</h3>
                        </div>
                    </div>
                    <div className="modern-kpi-box">
                        <div className="modern-kpi-icon"><PaymentsIcon size={22} style={{ color: '#059669' }} /></div>
                        <div className="modern-kpi-body">
                            <span className="modern-kpi-label">Paid Records</span>
                            <h3 className="modern-kpi-val">{paid}</h3>
                        </div>
                    </div>
                    <div className="modern-kpi-box">
                        <div className="modern-kpi-icon"><PaymentsIcon size={22} style={{ color: '#D97706' }} /></div>
                        <div className="modern-kpi-body">
                            <span className="modern-kpi-label">Pending Dues</span>
                            <h3 className="modern-kpi-val">{pendingPayments}</h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Reports;
