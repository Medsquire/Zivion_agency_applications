
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

    const reports = [
        {
            title: 'Service Request Report',
            description: 'Overview of all service requests and their status.',
            value: requests.length,
            detail: `${completed} completed`,
            icon: '▦',
        },
        {
            title: 'Pending Work Report',
            description: 'Requests waiting for action.',
            value: pending,
            detail: 'Pending requests',
            icon: '◷',
        },
        {
            title: 'Ongoing Work Report',
            description: 'Requests currently being handled.',
            value: ongoing,
            detail: 'In-progress requests',
            icon: '↻',
        },
        {
            title: 'Completion Report',
            description: 'Successfully completed service requests.',
            value: completed,
            detail: 'Completed requests',
            icon: '✓',
        },
        {
            title: 'Technician Report',
            description: 'Registered technician directory.',
            value: technicians.length,
            detail: 'Registered technicians',
            icon: '♙',
        },
        {
            title: 'Payment Report',
            description: 'Payment record and collection overview.',
            value: payments.length,
            detail: `${paid} paid · ${pendingPayments} pending`,
            icon: '₹',
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
            <div className="breadcrumb">
                BEE Property Management / Reports
            </div>

            <div className="page-heading">
                <div>
                    <h1>Reports</h1>
                    <p>Review agency operations and service performance.</p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={exportReport}
                >
                    Export Service CSV
                </button>
            </div>

            <div className="report-grid">
                {reports.map((report) => (
                    <article className="report-card" key={report.title}>
                        <div className="report-card-top">
                            <span className="report-icon">{report.icon}</span>
                            <span className="report-tag">Summary</span>
                        </div>

                        <h2>{report.title}</h2>
                        <p>{report.description}</p>

                        <div className="report-value">{report.value}</div>
                        <span className="report-detail">{report.detail}</span>
                    </article>
                ))}
            </div>

            <section className="content-card">
                <h2>Agency Performance Summary</h2>
                <p>
                    Total service requests: <strong>{requests.length}</strong>
                </p>
                <p>
                    Work completed: <strong>{completed}</strong>
                </p>
                <p>
                    Work in progress: <strong>{ongoing}</strong>
                </p>
                <p>
                    Awaiting action: <strong>{pending}</strong>
                </p>
                <p>
                    Total technicians: <strong>{technicians.length}</strong>
                </p>
                <p>
                    Total payment records: <strong>{payments.length}</strong>
                </p>
            </section>
        </div>
    );
}

export default Reports;
