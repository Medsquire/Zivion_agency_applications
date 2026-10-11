
import React, { useState } from 'react';

const categories = [
  'All Services',
  'Plumbing',
  'Electrical',
  'Civil Maintenance',
  'AC Maintenance',
  'Painting',
  'Cleaning',
];

function Services({ requests = [] }) {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] =
    useState('All Services');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const pendingCount = requests.filter(
    (request) => request.status === 'Pending'
  ).length;

  const ongoingCount = requests.filter(
    (request) => request.status === 'In Progress'
  ).length;

  const completedCount = requests.filter(
    (request) => request.status === 'Completed'
  ).length;

  const statusCards = [
    {
      name: 'Pending',
      label: 'Pending Requests',
      count: pendingCount,
      icon: '◷',
      color: 'orange',
    },
    {
      name: 'In Progress',
      label: 'Ongoing Requests',
      count: ongoingCount,
      icon: '↻',
      color: 'blue',
    },
    {
      name: 'Completed',
      label: 'Completed Requests',
      count: completedCount,
      icon: '✓',
      color: 'green',
    },
  ];

  const filteredRequests = requests.filter((request) => {
    const statusMatches =
      selectedStatus === 'All' ||
      request.status === selectedStatus;

    const service = (request.service || '').toLowerCase();

    const categoryMatches =
      selectedCategory === 'All Services' ||
      service.includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'AC Maintenance' &&
        (service.includes('ac') || service.includes('air conditioning'))) ||
      (selectedCategory === 'Civil Maintenance' &&
        service.includes('civil'));

    return statusMatches && categoryMatches;
  });

  const requestFields = [
    ['id', 'Request ID'],
    ['service', 'Service'],
    ['resident', 'Resident Name'],
    ['apartment', 'Apartment Name'],
    ['flatNo', 'Flat No.'],
    ['technician', 'Technician Name'],
    ['technicianId', 'Technician ID'],
    ['assignedDate', 'Assigned Date'],
  ];

  const getStatusClass = (status) => {
    if (status === 'Pending') {
      return 'status-pending';
    }

    if (status === 'In Progress') {
      return 'status-progress';
    }

    if (status === 'Completed') {
      return 'status-completed';
    }

    return '';
  };

  const clearFilters = () => {
    setSelectedStatus('All');
    setSelectedCategory('All Services');
  };

  return (
    <div className="page-content">
      <div className="breadcrumb">
        BEE Property Management / Services
      </div>

      <div className="page-heading">
        <div>
          <h1>Services</h1>
          <p>
            Manage maintenance requests and service categories.
          </p>
        </div>
      </div>

      {/* Status summary cards - retained */}
      <div className="service-status-grid">
        {statusCards.map((card) => (
          <button
            type="button"
            key={card.name}
            className={`service-status-card ${
              selectedStatus === card.name ? 'selected' : ''
            }`}
            onClick={() =>
              setSelectedStatus(
                selectedStatus === card.name ? 'All' : card.name
              )
            }
          >
            <div className={`service-status-icon ${card.color}`}>
              {card.icon}
            </div>

            <p>{card.label}</p>
            <h2>{card.count}</h2>
            <span>View requests →</span>
          </button>
        ))}
      </div>

      {/* Service requests table */}
      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Service Requests</h2>
            <p>View maintenance requests and their details.</p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        {/* Filters */}
        <div className="services-filter-bar">
          <label htmlFor="service-category-filter">
            Service Category
          </label>

          <select
            id="service-category-filter"
            className="table-select services-category-select"
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-summary">
          Showing {filteredRequests.length} request(s)
          {selectedStatus !== 'All' && ` · ${selectedStatus}`}
          {selectedCategory !== 'All Services' &&
            ` · ${selectedCategory}`}
        </div>

        <div className="table-wrapper">
          <table className="data-table request-table">
            <thead>
              <tr>
                {requestFields.map(([field, label]) => (
                  <th key={field}>{label}</th>
                ))}
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  {requestFields.map(([field]) => (
                    <td key={field}>
                      {request[field] ?? '—'}
                    </td>
                  ))}

                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        request.status
                      )}`}
                    >
                      {request.status || 'Unknown'}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="secondary-button view-request-button"
                      onClick={() => setSelectedRequest(request)}
                    >
                      View Request
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={requestFields.length + 2}>
                    No requests match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Selected request details modal */}
      {selectedRequest && (
        <div
          className="request-modal-overlay"
          onClick={() => setSelectedRequest(null)}
        >
          <section
            className="request-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="request-modal-header">
              <div>
                <h2 id="request-modal-title">
                  Request Details
                </h2>
                <p>
                  {selectedRequest.id || 'Service Request'}
                </p>
              </div>

              <button
                type="button"
                className="request-modal-close"
                aria-label="Close request details"
                onClick={() => setSelectedRequest(null)}
              >
                ×
              </button>
            </div>

            <div className="request-modal-body">
              {requestFields.map(([field, label]) => (
                <div className="request-detail-item" key={field}>
                  <span>{label}</span>
                  <strong>
                    {selectedRequest[field] ?? '—'}
                  </strong>
                </div>
              ))}

              <div className="request-detail-item">
                <span>Status</span>
                <strong>
                  <span
                    className={`status-badge ${getStatusClass(
                      selectedRequest.status
                    )}`}
                  >
                    {selectedRequest.status || 'Unknown'}
                  </span>
                </strong>
              </div>
            </div>

            <div className="request-modal-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Services;
