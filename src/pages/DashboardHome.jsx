
import React, { useState, useMemo } from 'react';
import TableScrollSlider from '../components/TableScrollSlider';
import AudioVoicePlayer from '../components/AudioVoicePlayer';
import {
  DashboardIcon,
  ServicesIcon,
  CommunitiesIcon,
  TechniciansIcon,
  ReportsIcon,
  TeamAccessIcon,
  LogoutIcon,
} from '../components/AppIcons';

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
      icon: <ServicesIcon size={18} />,
    },
    {
      title: 'In Progress Requests',
      value: ongoing,
      page: 'Services',
      colorClass: 'color-blue',
      icon: <ServicesIcon size={18} />,
    },
    {
      title: 'Completed Requests',
      value: completed,
      page: 'Services',
      colorClass: 'color-green',
      icon: <ServicesIcon size={18} />,
    },
    {
      title: 'Technicians',
      value: technicians.length,
      page: 'Technicians',
      colorClass: 'color-purple',
      icon: <TechniciansIcon size={18} />,
    },
    {
      title: 'Communities',
      value: apartments.length || 5,
      page: 'Communities',
      colorClass: 'color-teal',
      icon: <CommunitiesIcon size={18} />,
    },
    {
      title: 'Reports',
      value: '06',
      page: 'Reports',
      colorClass: 'color-rose',
      icon: <ReportsIcon size={18} />,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <DashboardIcon size={22} style={{ color: '#2563EB' }} />
          <h1>Dashboard Overview</h1>
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
              <span className="overview-card-icon-arrow" aria-hidden="true">
                <LogoutIcon size={14} />
              </span>
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
            <span>Filter</span>
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

        <div className="apartment-metrics apartment-metrics-lite">
          <article className="apartment-metric apartment-metric-technicians" title="Active Technicians available or assigned">
            <div className="apartment-metric-icon"><TechniciansIcon size={20} /></div>
            <div className="apartment-metric-info">
              <strong className="apartment-metric-value">{apartmentActiveTechnicianCount}</strong>
              <span className="apartment-metric-label">Active Techs</span>
            </div>
          </article>
          <article className="apartment-metric apartment-metric-inactive" title="Inactive Technicians">
            <div className="apartment-metric-icon"><TechniciansIcon size={20} /></div>
            <div className="apartment-metric-info">
              <strong className="apartment-metric-value">0</strong>
              <span className="apartment-metric-label">Inactive</span>
            </div>
          </article>
          <article className="apartment-metric apartment-metric-requests" title="Pending Service Requests">
            <div className="apartment-metric-icon"><ServicesIcon size={20} /></div>
            <div className="apartment-metric-info">
              <strong className="apartment-metric-value">
                {apartmentRequests.filter((request) => request.status === 'Pending').length}
              </strong>
              <span className="apartment-metric-label">Pending</span>
            </div>
          </article>
          <article className="apartment-metric apartment-metric-progress" title="In Progress Requests">
            <div className="apartment-metric-icon"><ServicesIcon size={20} /></div>
            <div className="apartment-metric-info">
              <strong className="apartment-metric-value">
                {apartmentRequests.filter((request) => request.status === 'In Progress').length}
              </strong>
              <span className="apartment-metric-label">In Progress</span>
            </div>
          </article>
          <article className="apartment-metric apartment-metric-departments" title="Departments per property">
            <div className="apartment-metric-icon"><CommunitiesIcon size={20} /></div>
            <div className="apartment-metric-info">
              <strong className="apartment-metric-value">7</strong>
              <span className="apartment-metric-label">Depts</span>
            </div>
          </article>
          <article className="apartment-metric apartment-metric-agencies" title={selectedApartment === 'All Apartments' ? 'Agencies across all properties' : selectedApartment}>
            <div className="apartment-metric-icon"><TeamAccessIcon size={20} /></div>
            <div className="apartment-metric-info">
              <strong className="apartment-metric-value">
                {apartmentAgencyNames.length || 0}
              </strong>
              <span className="apartment-metric-label">Agencies</span>
            </div>
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
              className="primary-button lite-action-btn"
              onClick={() => onNavigate('Services')}
              title="View all service requests"
            >
              <ServicesIcon size={15} />
              <span>All Requests</span>
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <strong className="table-row-title">{request.service}</strong>
                          {request.workOrderId && (
                            <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', background: '#F1F5F9', color: '#475569', padding: '1px 5px', borderRadius: '4px', border: '1px solid #CBD5E1', fontWeight: 600 }}>
                              {request.workOrderId}
                            </span>
                          )}
                        </div>
                        {request.audio && (
                          <AudioVoicePlayer audio={request.audio} compact />
                        )}
                      </div>
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
                      {request.assignedTechnicians && request.assignedTechnicians.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          {request.assignedTechnicians.slice(0, 2).map((tech, idx) => (
                            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}>
                              <span style={{ fontSize: '0.66rem', fontFamily: 'monospace', fontWeight: 700, background: idx === 0 ? '#FDF4FF' : '#EEF2FF', color: idx === 0 ? '#A21CAF' : '#4338CA', padding: '1px 5px', borderRadius: '3px', border: '1px solid currentColor' }}>
                                {tech.soId || `SO-0${idx + 1}`}
                              </span>
                              <strong style={{ color: '#0F172A', fontWeight: 600 }}>{tech.name}</strong>
                            </span>
                          ))}
                          {request.assignedTechnicians.length > 2 && (
                            <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600, paddingLeft: '4px' }}>
                              +{request.assignedTechnicians.length - 2} more SO
                            </span>
                          )}
                        </div>
                      ) : request.technician ? (
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
                        className="table-quick-action-icon"
                        title="Manage request"
                        aria-label={`Manage request ${request.id}`}
                        onClick={() => onNavigate('Services')}
                      >
                        <ServicesIcon size={15} />
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
