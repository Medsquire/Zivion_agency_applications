
import React, { useState, useMemo } from 'react';
import TableScrollSlider from '../components/TableScrollSlider';

function DashboardHome({
  requests = [],
  technicians = [],
  payments = [],
  apartments = [],
  agencyAssignments = {},
  onNavigate,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApartment, setSelectedApartment] = useState('All Apartments');

  const pending = useMemo(
    () => requests.filter((r) => r.status === 'Pending').length,
    [requests]
  );

  const ongoing = useMemo(
    () => requests.filter((r) => r.status === 'In Progress').length,
    [requests]
  );

  const completed = useMemo(
    () => requests.filter((r) => r.status === 'Completed').length,
    [requests]
  );

  const apartmentRequests = useMemo(
    () =>
      selectedApartment === 'All Apartments'
        ? requests
        : requests.filter((request) => request.apartment === selectedApartment),
    [requests, selectedApartment]
  );

  const apartmentAgencyNames = useMemo(() => {
    if (selectedApartment !== 'All Apartments') {
      return agencyAssignments[selectedApartment] || [];
    }

    return Array.from(new Set(Object.values(agencyAssignments).flat()));
  }, [agencyAssignments, selectedApartment]);

  const apartmentActiveTechnicianCount = useMemo(() => {
    const assignedTechnicians = new Set(
      apartmentRequests
        .flatMap((request) => [request.technicianId, request.technician])
        .filter(Boolean)
    );

    return technicians.filter(
      (technician) =>
        ['Available', 'Assigned'].includes(technician.status) &&
        (assignedTechnicians.has(technician.id) || assignedTechnicians.has(technician.name))
    ).length;
  }, [apartmentRequests, technicians]);

  const cards = [
    {
      title: 'Pending Requests',
      value: pending,
      page: 'Services',
      colorClass: 'color-orange',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: 'In Progress Requests',
      value: ongoing,
      page: 'Services',
      colorClass: 'color-blue',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
        </svg>
      ),
    },
    {
      title: 'Completed Requests',
      value: completed,
      page: 'Services',
      colorClass: 'color-green',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      title: 'Technicians',
      value: technicians.length,
      page: 'Technicians',
      colorClass: 'color-purple',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: 'Payment Records',
      value: payments.length,
      page: 'Payment Records',
      colorClass: 'color-teal',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <circle cx="7" cy="15" r="1" />
          <path d="M12 15h6" />
        </svg>
      ),
    },
    {
      title: 'Reports',
      value: '06',
      page: 'Reports',
      colorClass: 'color-rose',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
  ];

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests.slice(0, 5);
    const q = searchQuery.toLowerCase();
    return requests
      .filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.service.toLowerCase().includes(q) ||
          r.resident.toLowerCase().includes(q) ||
          r.apartment.toLowerCase().includes(q) ||
          r.flatNo.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [requests, searchQuery]);

  const getInitials = (name = '') => {
    return (
      name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'R'
    );
  };

  return (
    <div className="page-content">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <h1>Welcome back, Agency Administrator</h1>
        </div>
      </div>

      {/* Clean Modern Cards: Blue/White with Separate Theme Accents */}
      <div className="overview-grid">
        {cards.map((card) => (
          <button
            type="button"
            className={`overview-card ${card.colorClass}`}
            key={card.title}
            onClick={() => onNavigate(card.page)}
            aria-label={`${card.title}: ${card.value}`}
          >
            <div className="overview-card-top">
              <span className="overview-card-name">{card.title}</span>
              <div className="overview-icon" aria-hidden="true">
                {card.icon}
              </div>
            </div>
            <div className="overview-card-bottom">
              <h2 className="overview-card-count">{card.value}</h2>
              <span className="overview-card-link">View details →</span>
            </div>
          </button>
        ))}
      </div>

      <section className="content-card apartment-overview">
        <div className="section-heading apartment-overview-heading">
          <div>
            <h2>Apartment Overview</h2>
          </div>
          <label className="apartment-filter">
            <span>Filter by apartment</span>
            <select
              value={selectedApartment}
              onChange={(event) => setSelectedApartment(event.target.value)}
            >
              <option value="All Apartments">All Apartments</option>
              {apartments.map((apartment) => (
                <option key={apartment} value={apartment}>
                  {apartment}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="apartment-metrics">
          <article className="apartment-metric apartment-metric-technicians">
            <span className="apartment-metric-label">Active Technicians</span>
            <strong className="apartment-metric-value">{apartmentActiveTechnicianCount}</strong>
            <span className="apartment-metric-note">
              Available or assigned to service requests
            </span>
          </article>
          <article className="apartment-metric apartment-metric-inactive">
            <span className="apartment-metric-label">Inactive Technicians</span>
            <strong className="apartment-metric-value">0</strong>
            <span className="apartment-metric-note">
              No inactive status is currently tracked
            </span>
          </article>
          <article className="apartment-metric apartment-metric-requests">
            <span className="apartment-metric-label">Pending Requests</span>
            <strong className="apartment-metric-value">
              {apartmentRequests.filter((request) => request.status === 'Pending').length}
            </strong>
            <span className="apartment-metric-note">Awaiting service</span>
          </article>
          <article className="apartment-metric apartment-metric-progress">
            <span className="apartment-metric-label">In Progress Requests</span>
            <strong className="apartment-metric-value">
              {apartmentRequests.filter((request) => request.status === 'In Progress').length}
            </strong>
            <span className="apartment-metric-note">Currently being handled</span>
          </article>
          <article className="apartment-metric apartment-metric-departments">
            <span className="apartment-metric-label">No. of Departments</span>
            <strong className="apartment-metric-value">7</strong>
            <span className="apartment-metric-note">Departments per property</span>
          </article>
          <article className="apartment-metric apartment-metric-agencies">
            <span className="apartment-metric-label">Agencies</span>
            <strong className="apartment-metric-value apartment-metric-value-list">
              {apartmentAgencyNames.length
                ? apartmentAgencyNames.join(', ')
                : 'No agencies assigned'}
            </strong>
            <span className="apartment-metric-note">
              {selectedApartment === 'All Apartments' ? 'Across all properties' : selectedApartment}
            </span>
          </article>
        </div>
      </section>

      {/* Recent Service Requests Table Section */}
      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Recent Service Requests</h2>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search recent tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="table-search-input"
            />
            <button
              type="button"
              className="primary-button"
              onClick={() => onNavigate('Services')}
            >
              View all requests →
            </button>
          </div>
        </div>

        <TableScrollSlider>
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Service Type</th>
                <th>Resident</th>
                <th>Apartment & Flat</th>
                <th>Assigned Specialist</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#3B82F6' }}>
                    No service requests found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <span className="request-id-badge">{request.id}</span>
                    </td>
                    <td>
                      <strong className="table-row-title">{request.service}</strong>
                    </td>
                    <td>
                      <div className="resident-avatar-cell">
                        <div className="resident-avatar-circle">
                          {getInitials(request.resident)}
                        </div>
                        <span className="table-row-text">{request.resident}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <span className="table-row-text">{request.apartment}</span>
                        <span className="table-flat-chip">
                          {request.flatNo}
                        </span>
                      </div>
                    </td>
                    <td>
                      {request.technician ? (
                        <span className="table-specialist-item">
                          <span style={{ color: '#16A34A' }}>●</span>
                          {request.technician}
                        </span>
                      ) : (
                        <span style={{ color: '#EA580C', fontSize: '12px', fontWeight: 600 }}>
                          Unassigned
                        </span>
                      )}
                    </td>
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
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="table-quick-action"
                        onClick={() => onNavigate('Services')}
                      >
                        Manage →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableScrollSlider>
      </section>
    </div>
  );
}

export default DashboardHome;
