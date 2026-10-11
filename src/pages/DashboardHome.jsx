
import React from 'react';

function DashboardHome({
  requests,
  technicians,
  payments,
  onNavigate,
}) {
  const pending = requests.filter(
    (request) => request.status === 'Pending'
  ).length;

  const ongoing = requests.filter(
    (request) => request.status === 'In Progress'
  ).length;

  const completed = requests.filter(
    (request) => request.status === 'Completed'
  ).length;

  const cards = [
    {
      title: 'Pending Requests',
      value: pending,
      icon: '◷',
      description: 'Requests awaiting action',
      page: 'Services',
      color: 'orange',
    },
    {
      title: 'In Progress Requests',
      value: ongoing,
      icon: '↻',
      description: 'Currently being handled',
      page: 'Services',
      color: 'blue',
    },
    {
      title: 'Completed Requests',
      value: completed,
      icon: '✓',
      description: 'Successfully completed',
      page: 'Services',
      color: 'green',
    },
    {
      title: 'Technicians',
      value: technicians.length,
      icon: '♙',
      description: 'Registered technicians',
      page: 'Technicians',
      color: 'purple',
    },
    {
      title: 'Payment Records',
      value: payments.length,
      icon: '₹',
      description: 'Recorded payments',
      page: 'Payment Records',
      color: 'teal',
    },
    {
      title: 'Reports',
      value: '06',
      icon: '▤',
      description: 'Available summary reports',
      page: 'Reports',
      color: 'gray',
    },
  ];

  return (
    <div className="page-content">
      <div className="breadcrumb">
        BEE Property Management / Dashboard
      </div>

      <div className="page-heading">
        <div>
          <p className="eyebrow">AGENCY OVERVIEW</p>
          <h1>Welcome back, Agency Administrator</h1>
          <p>
            Manage service requests, technicians and payments
            from one place.
          </p>
        </div>
      </div>

      <div className="overview-grid">
        {cards.map((card) => (
          <button
            type="button"
            className="overview-card"
            key={card.title}
            onClick={() => onNavigate(card.page)}
          >
            <div className="overview-card-top">
              <span>{card.title}</span>
              <span className={`overview-icon ${card.color}`}>
                {card.icon}
              </span>
            </div>

            <h2>{card.value}</h2>
            <p>{card.description}</p>

            <span className="card-link">View details →</span>
          </button>
        ))}
      </div>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Recent Service Requests</h2>
            <p>View the latest requests submitted by residents.</p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => onNavigate('Services')}
          >
            View all requests
          </button>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Service</th>
                <th>Resident</th>
                <th>Apartment</th>
                <th>Flat No.</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {requests.slice(0, 5).map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.service}</td>
                  <td>{request.resident}</td>
                  <td>{request.apartment}</td>
                  <td>{request.flatNo}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        request.status === 'Pending'
                          ? 'status-pending'
                          : request.status === 'In Progress'
                            ? 'status-progress'
                            : 'status-completed'
                      }`}
                    >
                      {request.status}
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

export default DashboardHome;
