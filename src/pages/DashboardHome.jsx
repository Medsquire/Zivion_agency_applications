
import React, { useState, useMemo, useEffect } from 'react';
import TableScrollSlider from '../components/TableScrollSlider';
import InspectionMediaModal from '../components/InspectionMediaModal';
import {
  DashboardIcon,
  ServicesIcon,
  CommunitiesIcon,
  TechniciansIcon,
  ReportsIcon,
  TeamAccessIcon,
  LogoutIcon,
} from '../components/AppIcons';
import {
  SlimImage,
  SlimEye,
  SlimCheck,
  SlimX,
  SlimClock,
  SlimMapPin,
  SlimUserCheck,
  SlimAlertCircle,
  SlimActivity,
  SlimServices,
  SlimPencil,
  SlimZap,
  SlimDroplet,
  SlimHammer,
  SlimShield,
  SlimSparkles,
  SlimUsers,
} from '../components/SlimIcons';
import { getAssignedTechs, getServiceClassification } from './Services';

// Helper to provide realistic issue, check-in (IN) and check-out (OUT) media
export function getRequestMedia(req = {}) {
  const s = ((req.service || '') + ' ' + (req.caseTitle || '')).toLowerCase();

  let issueImage = req.issueImage || (req.images && req.images[0]);
  let inImage = req.inImage;
  let outImage = req.outImage;
  let inTime = req.inTime;
  let outTime = req.outTime;
  let inNotes = req.inNotes;
  let outNotes = req.outNotes;

  if (!issueImage) {
    if (s.includes('electric') || s.includes('spark') || s.includes('power')) {
      issueImage = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80';
    } else if (s.includes('plumb') || s.includes('drain') || s.includes('pipe') || s.includes('pump')) {
      issueImage = s.includes('pump')
        ? 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80';
    } else if (s.includes('ac ') || s.includes('air') || s.includes('inverter')) {
      issueImage = 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80';
    } else if (s.includes('civil') || s.includes('seepage') || s.includes('crack') || s.includes('wall')) {
      issueImage = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';
    } else if (s.includes('security') || s.includes('pass') || s.includes('permission')) {
      issueImage = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';
    } else {
      issueImage = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80';
    }
  }

  if (!inImage) {
    if (s.includes('electric') || s.includes('spark') || s.includes('power')) {
      inImage = 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80';
    } else if (s.includes('plumb') || s.includes('drain') || s.includes('pipe') || s.includes('pump')) {
      inImage = s.includes('pump')
        ? 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80';
    } else if (s.includes('ac ') || s.includes('air') || s.includes('inverter')) {
      inImage = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80';
    } else if (s.includes('civil') || s.includes('seepage') || s.includes('crack') || s.includes('wall')) {
      inImage = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80';
    } else if (s.includes('security') || s.includes('pass') || s.includes('permission')) {
      inImage = 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80';
    } else {
      inImage = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
    }
  }

  if (outImage === undefined) {
    if (req.status === 'Resolved' || req.status === 'Closed' || req.status === 'Completed') {
      if (s.includes('electric')) {
        outImage = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
      } else if (s.includes('plumb')) {
        outImage = 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80';
      } else if (s.includes('ac ')) {
        outImage = 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80';
      } else if (s.includes('security')) {
        outImage = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
      } else {
        outImage = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';
      }
    } else if (req.status === 'In Progress' && s.includes('electric')) {
      outImage = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
    } else {
      outImage = null;
    }
  }

  if (!inTime) {
    inTime = req.assignedDate ? `${req.assignedDate} • 10:25 AM` : 'Today • 10:25 AM';
  }
  if (!outTime && outImage) {
    outTime = req.targetDate ? `${req.targetDate} • 02:00 PM` : 'Today • 02:00 PM';
  }
  if (!inNotes) {
    inNotes = `Technician checked in at site. Initial diagnostic & isolation completed.`;
  }
  if (!outNotes && outImage) {
    outNotes = `Resolution complete, tested under operating load, site cleared and signed off.`;
  }

  return {
    issueImage,
    inImage,
    outImage,
    inTime,
    outTime,
    inNotes,
    outNotes,
  };
}

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

  const [photoModalRequest, setPhotoModalRequest] = useState(null);
  const [photoModalTab, setPhotoModalTab] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);

  const openPhotoModal = (request, initialTab = 'all') => {
    setPhotoModalRequest(request);
    setPhotoModalTab(initialTab);
  };

  const closePhotoModal = () => {
    setPhotoModalRequest(null);
    setLightboxImage(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxImage) {
          setLightboxImage(null);
        } else if (photoModalRequest) {
          setPhotoModalRequest(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, photoModalRequest]);

  const currentModalMedia = photoModalRequest ? getRequestMedia(photoModalRequest) : null;

  const pending = useMemo(
    () => requests.filter((r) => r.status === 'Pending').length,
    [requests]
  );

  const ongoing = useMemo(
    () => requests.filter((r) => ['In Progress', 'Assigned', 'Hold', 'On Hold', 'Work Progress State'].includes(r.status)).length,
    [requests]
  );

  const completed = useMemo(
    () => requests.filter((r) => ['Resolved', 'Closed', 'Completed'].includes(r.status)).length,
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
                {apartmentRequests.filter((request) => ['In Progress', 'Assigned'].includes(request.status)).length}
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
                <th>Work Order ID</th>
                <th>Service Type</th>
                <th>Location</th>
                <th>Assigned Specialist</th>
                <th>Priority</th>
                <th>Current Stage</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
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
                filteredRequests.map((request) => {
                  const media = getRequestMedia(request);
                  const classification = getServiceClassification(request);
                  const assigned = getAssignedTechs(request);
                  const priorityKey = (request.priority || 'normal').toLowerCase();
                  const statusLabel = request.status || 'Pending';
                  const statusClass =
                    statusLabel === 'Pending'
                      ? 'status-pending'
                      : statusLabel === 'Assigned'
                        ? 'status-assigned'
                        : statusLabel === 'In Progress' || statusLabel === 'Work Progress State'
                          ? 'status-progress'
                          : statusLabel === 'Hold' || statusLabel === 'On Hold'
                            ? 'status-hold'
                            : statusLabel === 'Resolved'
                              ? 'status-resolved'
                              : statusLabel === 'Closed'
                                ? 'status-closed'
                                : 'status-completed';

                  return (
                    <tr key={request.id}>
                      {/* 1. Work Order ID (WO_1454 / REQ-1001) */}
                      <td>
                        <div className="table-wo-cell">
                          <span className="table-wo-badge">
                            {request.workOrderId || request.id || 'WO-101'}
                          </span>
                          <span className="sr-only">{request.id}</span>
                        </div>
                      </td>

                      {/* 2. Service Type (Image & Electrical) */}
                      <td>
                        <div className="table-service-cell">
                          <div className="table-service-title-row">
                            <strong className="table-row-title">{request.service}</strong>
                          </div>

                          <span className="sr-only">{request.caseTitle || request.description}</span>

                          {/* Issue Photo Thumbnail & IN/OUT Preview Pill */}
                          <div className="table-issue-inout-bar">
                            <div
                              className="table-issue-thumb-wrapper"
                              onClick={() => openPhotoModal(request, 'issue')}
                              title="Click to view Issue photo in popup"
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  openPhotoModal(request, 'issue');
                                }
                              }}
                            >
                              <img
                                src={media.issueImage}
                                alt={`Issue defect for ${request.id}`}
                                className="table-issue-thumb-img"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <span className="table-issue-thumb-badge">
                                Issue
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. Location (Kavya Sharma -101 · Surya Enclave) */}
                      <td>
                        <div className="svc-resident-cell">
                          <div className="svc-avatar-circle">
                            {getInitials(request.resident)}
                          </div>
                          <div className="svc-resident-info">
                            <div className="svc-resident-name">
                              {request.resident || 'Resident'}
                            </div>
                            <div className="svc-location-text">
                              <SlimMapPin size={11} strokeWidth={1.5} />
                              <span>
                                {request.flatNo} · {request.apartment}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 4. Assigned Specialist (SO-041-01 Suresh Babu, SO-041-02 Kiran Rao) */}
                      <td>
                        {assigned.length > 0 ? (
                          <div className="svc-tech-multi-stack">
                            {assigned.map((t, idx) => (
                              <div key={t.soId || idx} className="svc-tech-single-row">
                                <span
                                  className={`svc-so-badge ${idx === 0 ? 'svc-so-badge-lead' : ''}`}
                                  title={`Service Order: ${t.soId}`}
                                >
                                  {t.soId || `SO-0${idx + 1}`}
                                </span>
                                <strong title={`${t.name} — ${t.role || t.skill}`}>{t.name}</strong>
                              </div>
                            ))}
                          </div>
                        ) : request.technician && request.technician !== 'Unassigned' ? (
                          <span className="table-specialist-item">
                            <span style={{ color: '#16A34A' }}>●</span>
                            {request.technician}
                          </span>
                        ) : (
                          <span style={{ color: '#EA580C', fontSize: '12px', fontWeight: 600 }}>
                            ● Unassigned
                          </span>
                        )}
                      </td>

                      {/* 5. Priority (urgent / normal) */}
                      <td>
                        <span className={`svc-priority-dot-badge priority-${priorityKey}`}>
                          <span className="svc-p-dot" />
                          <span>{request.priority || 'Normal'}</span>
                        </span>
                      </td>

                      {/* 6. Current Stage (inprogress / assigned / etc) */}
                      <td>
                        <div className="svc-stage-cell">
                          <span className={`status-badge ${statusClass}`} title={`Status: ${statusLabel}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </td>

                      {/* 7. Actions (Edit icon) */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="svc-actions-group" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="svc-action-icon-btn svc-action-edit"
                            title="Edit complaint"
                            aria-label={`Edit complaint ${request.id}`}
                            onClick={() => (onNavigate ? onNavigate('Services') : null)}
                          >
                            <SlimPencil size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </TableScrollSlider>
      </section>

      {/* ── Issue & IN / OUT Verification Popup Modal ── */}
      {photoModalRequest && currentModalMedia && (
        <div
          className="inout-modal-overlay"
          onClick={closePhotoModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="inout-modal-title"
        >
          <div
            className="inout-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="inout-modal-header">
              <div className="inout-modal-header-info">
                <div className="inout-modal-header-badges">
                  <span className="request-id-badge">{photoModalRequest.id}</span>
                  {photoModalRequest.workOrderId && (
                    <span className="table-wo-chip">{photoModalRequest.workOrderId}</span>
                  )}
                  <span
                    className={`status-badge ${
                      photoModalRequest.status === 'Pending'
                        ? 'status-pending'
                        : photoModalRequest.status === 'Assigned'
                          ? 'status-assigned'
                          : photoModalRequest.status === 'In Progress' || photoModalRequest.status === 'Work Progress State'
                            ? 'status-progress'
                            : photoModalRequest.status === 'Hold' || photoModalRequest.status === 'On Hold'
                              ? 'status-hold'
                              : photoModalRequest.status === 'Resolved'
                                ? 'status-resolved'
                                : photoModalRequest.status === 'Closed'
                                  ? 'status-closed'
                                  : 'status-completed'
                    }`}
                  >
                    {photoModalRequest.status}
                  </span>
                </div>
                <h2 id="inout-modal-title" className="inout-modal-title">
                  Inspection Media: Issue &amp; IN / OUT Verification
                </h2>
                <p className="inout-modal-subtitle">
                  <strong>{photoModalRequest.service}</strong> • {photoModalRequest.apartment} ({photoModalRequest.flatNo}) • Resident: <strong>{photoModalRequest.resident}</strong>
                </p>
              </div>

              <button
                type="button"
                className="inout-modal-close"
                onClick={closePhotoModal}
                aria-label="Close modal"
              >
                <SlimX size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="inout-modal-tabs">
              <button
                type="button"
                className={`inout-tab-btn ${photoModalTab === 'all' ? 'active' : ''}`}
                onClick={() => setPhotoModalTab('all')}
              >
                <SlimImage size={14} />
                <span>All Media (3)</span>
              </button>
              <button
                type="button"
                className={`inout-tab-btn ${photoModalTab === 'issue' ? 'active' : ''}`}
                onClick={() => setPhotoModalTab('issue')}
              >
                <span className="tab-pill-dot dot-issue"></span>
                <span>Issue Photo</span>
              </button>
              <button
                type="button"
                className={`inout-tab-btn ${photoModalTab === 'in' ? 'active' : ''}`}
                onClick={() => setPhotoModalTab('in')}
              >
                <span className="tab-pill-dot dot-in"></span>
                <span>IN (Check-In)</span>
              </button>
              <button
                type="button"
                className={`inout-tab-btn ${photoModalTab === 'out' ? 'active' : ''}`}
                onClick={() => setPhotoModalTab('out')}
              >
                <span className="tab-pill-dot dot-out"></span>
                <span>OUT (Check-Out)</span>
              </button>
              <button
                type="button"
                className={`inout-tab-btn ${photoModalTab === 'compare' ? 'active' : ''}`}
                onClick={() => setPhotoModalTab('compare')}
              >
                <SlimActivity size={14} />
                <span>Side-by-Side: IN vs OUT</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="inout-modal-body">
              {/* TAB 1: ALL MEDIA GRID */}
              {photoModalTab === 'all' && (
                <div className="inout-cards-grid">
                  {/* Card 1: Issue Photo */}
                  <div className="inout-photo-card card-issue">
                    <div className="inout-photo-header">
                      <div className="inout-badge-wrap">
                        <span className="inout-card-badge badge-issue">
                          ● Reported Issue / Defect
                        </span>
                      </div>
                      <span className="inout-photo-meta">
                        Resident Photo
                      </span>
                    </div>

                    <div
                      className="inout-photo-img-wrap"
                      onClick={() =>
                        setLightboxImage({
                          src: currentModalMedia.issueImage,
                          title: `Reported Issue: ${photoModalRequest.service}`,
                          subtitle: photoModalRequest.description || photoModalRequest.caseTitle,
                        })
                      }
                      title="Click to view enlarged image"
                    >
                      <img
                        src={currentModalMedia.issueImage}
                        alt="Reported Defect"
                        className="inout-photo-img"
                      />
                      <div className="inout-photo-overlay-hint">
                        <SlimEye size={16} /> <span>Click to enlarge</span>
                      </div>
                    </div>

                    <div className="inout-photo-details">
                      <div className="inout-meta-row">
                        <SlimClock size={12} />
                        <span>Reported: {photoModalRequest.assignedDate || 'Oct 11, 2026'}</span>
                      </div>
                      <div className="inout-meta-row">
                        <SlimMapPin size={12} />
                        <span>{photoModalRequest.apartment} • {photoModalRequest.flatNo}</span>
                      </div>
                      <p className="inout-photo-notes">
                        "{photoModalRequest.description || photoModalRequest.caseTitle || 'Defect reported by resident.'}"
                      </p>
                    </div>
                  </div>

                  {/* Card 2: IN Check-In Photo */}
                  <div className="inout-photo-card card-in">
                    <div className="inout-photo-header">
                      <div className="inout-badge-wrap">
                        <span className="inout-card-badge badge-in">
                          ● Check-IN: Site Arrival
                        </span>
                      </div>
                      <span className="inout-photo-meta">
                        {currentModalMedia.inTime}
                      </span>
                    </div>

                    <div
                      className="inout-photo-img-wrap"
                      onClick={() =>
                        setLightboxImage({
                          src: currentModalMedia.inImage,
                          title: `Check-IN Photo: ${photoModalRequest.service}`,
                          subtitle: currentModalMedia.inNotes,
                        })
                      }
                      title="Click to view enlarged image"
                    >
                      <img
                        src={currentModalMedia.inImage}
                        alt="Check-IN Arrival"
                        className="inout-photo-img"
                      />
                      <div className="inout-photo-overlay-hint">
                        <SlimEye size={16} /> <span>Click to enlarge</span>
                      </div>
                    </div>

                    <div className="inout-photo-details">
                      <div className="inout-meta-row">
                        <SlimUserCheck size={12} />
                        <span>Logged by: {photoModalRequest.technician || 'Lead Technician'}</span>
                      </div>
                      <div className="inout-meta-row">
                        <SlimCheck size={12} style={{ color: '#0284C7' }} />
                        <span style={{ color: '#0284C7', fontWeight: 600 }}>On-Site Geolocation Verified</span>
                      </div>
                      <p className="inout-photo-notes">
                        "{currentModalMedia.inNotes}"
                      </p>
                    </div>
                  </div>

                  {/* Card 3: OUT Check-Out Photo */}
                  <div className="inout-photo-card card-out">
                    <div className="inout-photo-header">
                      <div className="inout-badge-wrap">
                        <span
                          className={`inout-card-badge ${
                            currentModalMedia.outImage ? 'badge-out' : 'badge-pending'
                          }`}
                        >
                          ● {currentModalMedia.outImage ? 'Check-OUT: Work Resolved' : 'Check-OUT: In Progress'}
                        </span>
                      </div>
                      <span className="inout-photo-meta">
                        {currentModalMedia.outTime || 'Pending Sign-Off'}
                      </span>
                    </div>

                    {currentModalMedia.outImage ? (
                      <div
                        className="inout-photo-img-wrap"
                        onClick={() =>
                          setLightboxImage({
                            src: currentModalMedia.outImage,
                            title: `Check-OUT Photo: ${photoModalRequest.service}`,
                            subtitle: currentModalMedia.outNotes,
                          })
                        }
                        title="Click to view enlarged image"
                      >
                        <img
                          src={currentModalMedia.outImage}
                          alt="Check-OUT Completion"
                          className="inout-photo-img"
                        />
                        <div className="inout-photo-overlay-hint">
                          <SlimEye size={16} /> <span>Click to enlarge</span>
                        </div>
                      </div>
                    ) : (
                      <div className="inout-photo-pending-wrap">
                        <SlimAlertCircle size={28} style={{ color: '#D97706' }} />
                        <strong>Check-OUT Photo In-Flight</strong>
                        <p>Work order is currently in progress. Technician will capture and upload completion photo during sign-off.</p>
                      </div>
                    )}

                    <div className="inout-photo-details">
                      <div className="inout-meta-row">
                        <SlimUserCheck size={12} />
                        <span>Technician: {photoModalRequest.technician || 'Assigned Crew'}</span>
                      </div>
                      <div className="inout-meta-row">
                        <SlimCheck
                          size={12}
                          style={{ color: currentModalMedia.outImage ? '#16A34A' : '#D97706' }}
                        />
                        <span
                          style={{
                            color: currentModalMedia.outImage ? '#16A34A' : '#D97706',
                            fontWeight: 600,
                          }}
                        >
                          {currentModalMedia.outImage ? 'Resolution Inspected & Tested' : 'Awaiting Final Inspection'}
                        </span>
                      </div>
                      {currentModalMedia.outNotes && (
                        <p className="inout-photo-notes">
                          "{currentModalMedia.outNotes}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ISSUE PHOTO ONLY */}
              {photoModalTab === 'issue' && (
                <div className="inout-single-focus-view">
                  <div
                    className="inout-focus-img-wrap"
                    onClick={() =>
                      setLightboxImage({
                        src: currentModalMedia.issueImage,
                        title: `Reported Issue: ${photoModalRequest.service}`,
                        subtitle: photoModalRequest.description || photoModalRequest.caseTitle,
                      })
                    }
                  >
                    <img
                      src={currentModalMedia.issueImage}
                      alt="Reported Issue Large"
                      className="inout-focus-img"
                    />
                    <div className="inout-photo-overlay-hint">
                      <SlimEye size={18} /> <span>Click to enlarge fullscreen</span>
                    </div>
                  </div>

                  <div className="inout-focus-info-card">
                    <span className="inout-card-badge badge-issue" style={{ alignSelf: 'flex-start' }}>
                      ● Reported Issue / Defect Photo
                    </span>
                    <h3>{photoModalRequest.caseTitle || photoModalRequest.service}</h3>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                      {photoModalRequest.description || 'Defect reported by resident during initial ticket generation.'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                      <div className="inout-meta-row">
                        <SlimClock size={13} />
                        <span>Reported Date: <strong>{photoModalRequest.assignedDate || 'Oct 11, 2026'}</strong></span>
                      </div>
                      <div className="inout-meta-row">
                        <SlimMapPin size={13} />
                        <span>Location: <strong>{photoModalRequest.apartment} ({photoModalRequest.flatNo})</strong></span>
                      </div>
                      <div className="inout-meta-row">
                        <SlimUserCheck size={13} />
                        <span>Resident: <strong>{photoModalRequest.resident}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: IN CHECK-IN ONLY */}
              {photoModalTab === 'in' && (
                <div className="inout-single-focus-view">
                  <div
                    className="inout-focus-img-wrap"
                    onClick={() =>
                      setLightboxImage({
                        src: currentModalMedia.inImage,
                        title: `Check-IN Photo: ${photoModalRequest.service}`,
                        subtitle: currentModalMedia.inNotes,
                      })
                    }
                  >
                    <img
                      src={currentModalMedia.inImage}
                      alt="Check-IN Arrival Large"
                      className="inout-focus-img"
                    />
                    <div className="inout-photo-overlay-hint">
                      <SlimEye size={18} /> <span>Click to enlarge fullscreen</span>
                    </div>
                  </div>

                  <div className="inout-focus-info-card">
                    <span className="inout-card-badge badge-in" style={{ alignSelf: 'flex-start' }}>
                      ● Technician Check-IN (Site Arrival)
                    </span>
                    <h3>Technician Arrival &amp; Diagnostic Proof</h3>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                      {currentModalMedia.inNotes}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                      <div className="inout-meta-row">
                        <SlimClock size={13} />
                        <span>Check-In Timestamp: <strong>{currentModalMedia.inTime}</strong></span>
                      </div>
                      <div className="inout-meta-row">
                        <SlimUserCheck size={13} />
                        <span>Attending Specialist: <strong>{photoModalRequest.technician || 'Lead Technician'}</strong></span>
                      </div>
                      <div className="inout-meta-row">
                        <SlimCheck size={13} style={{ color: '#0284C7' }} />
                        <span style={{ color: '#0284C7', fontWeight: 600 }}>GPS Tag Verified • Flat Doorstep Entry</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: OUT CHECK-OUT ONLY */}
              {photoModalTab === 'out' && (
                <div className="inout-single-focus-view">
                  {currentModalMedia.outImage ? (
                    <div
                      className="inout-focus-img-wrap"
                      onClick={() =>
                        setLightboxImage({
                          src: currentModalMedia.outImage,
                          title: `Check-OUT Photo: ${photoModalRequest.service}`,
                          subtitle: currentModalMedia.outNotes,
                        })
                      }
                    >
                      <img
                        src={currentModalMedia.outImage}
                        alt="Check-OUT Resolved Large"
                        className="inout-focus-img"
                      />
                      <div className="inout-photo-overlay-hint">
                        <SlimEye size={18} /> <span>Click to enlarge fullscreen</span>
                      </div>
                    </div>
                  ) : (
                    <div className="inout-photo-pending-wrap" style={{ height: '380px', borderRadius: '10px' }}>
                      <SlimAlertCircle size={36} style={{ color: '#D97706' }} />
                      <strong style={{ fontSize: '1rem' }}>Check-OUT Photo Pending Completion</strong>
                      <p style={{ maxWidth: '360px' }}>
                        This service request is currently in status: <strong>{photoModalRequest.status}</strong>.
                        Once the technician finishes on site, the completion inspection photo will be attached here.
                      </p>
                    </div>
                  )}

                  <div className="inout-focus-info-card">
                    <span
                      className={`inout-card-badge ${
                        currentModalMedia.outImage ? 'badge-out' : 'badge-pending'
                      }`}
                      style={{ alignSelf: 'flex-start' }}
                    >
                      ● {currentModalMedia.outImage ? 'Check-OUT (Work Completed)' : 'Check-OUT (In-Flight)'}
                    </span>
                    <h3>Work Completion &amp; Resolution Sign-Off</h3>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                      {currentModalMedia.outNotes || 'Service is actively being executed by assigned technicians.'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                      <div className="inout-meta-row">
                        <SlimClock size={13} />
                        <span>Completion Time: <strong>{currentModalMedia.outTime || 'Pending'}</strong></span>
                      </div>
                      <div className="inout-meta-row">
                        <SlimUserCheck size={13} />
                        <span>Verified By: <strong>{photoModalRequest.technician || 'Assigned Crew'}</strong></span>
                      </div>
                      <div className="inout-meta-row">
                        <SlimCheck
                          size={13}
                          style={{ color: currentModalMedia.outImage ? '#16A34A' : '#D97706' }}
                        />
                        <span
                          style={{
                            color: currentModalMedia.outImage ? '#16A34A' : '#D97706',
                            fontWeight: 600,
                          }}
                        >
                          {currentModalMedia.outImage ? 'Quality Audit Passed & Load Tested' : 'Work In Progress'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SIDE BY SIDE COMPARISON (IN vs OUT) */}
              {photoModalTab === 'compare' && (
                <div className="inout-compare-container">
                  {/* IN Panel */}
                  <div className="inout-compare-panel">
                    <div className="inout-compare-banner banner-before">
                      <span>BEFORE: Check-IN (Site Arrival)</span>
                      <span>{currentModalMedia.inTime}</span>
                    </div>
                    <div
                      className="inout-compare-img-wrap"
                      onClick={() =>
                        setLightboxImage({
                          src: currentModalMedia.inImage,
                          title: 'Check-IN Photo (Arrival)',
                          subtitle: currentModalMedia.inNotes,
                        })
                      }
                    >
                      <img
                        src={currentModalMedia.inImage}
                        alt="IN Check-In"
                        className="inout-compare-img"
                      />
                      <div className="inout-photo-overlay-hint">
                        <SlimEye size={16} /> <span>Enlarge</span>
                      </div>
                    </div>
                    <div style={{ padding: '12px', fontSize: '0.78rem', color: '#475569' }}>
                      <strong>Technician Initial State:</strong>
                      <p style={{ margin: '4px 0 0', fontStyle: 'italic' }}>
                        "{currentModalMedia.inNotes}"
                      </p>
                    </div>
                  </div>

                  {/* OUT Panel */}
                  <div className="inout-compare-panel">
                    <div className="inout-compare-banner banner-after">
                      <span>AFTER: Check-OUT (Work Done)</span>
                      <span>{currentModalMedia.outTime || 'In-Progress'}</span>
                    </div>
                    {currentModalMedia.outImage ? (
                      <div
                        className="inout-compare-img-wrap"
                        onClick={() =>
                          setLightboxImage({
                            src: currentModalMedia.outImage,
                            title: 'Check-OUT Photo (Resolved)',
                            subtitle: currentModalMedia.outNotes,
                          })
                        }
                      >
                        <img
                          src={currentModalMedia.outImage}
                          alt="OUT Check-Out"
                          className="inout-compare-img"
                        />
                        <div className="inout-photo-overlay-hint">
                          <SlimEye size={16} /> <span>Enlarge</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="inout-photo-pending-wrap"
                        style={{ height: '280px', borderBottom: 'none' }}
                      >
                        <SlimAlertCircle size={28} style={{ color: '#D97706' }} />
                        <strong>Check-OUT Image Pending</strong>
                        <p>Awaiting work completion sign-off from {photoModalRequest.technician || 'technician'}.</p>
                      </div>
                    )}
                    <div style={{ padding: '12px', fontSize: '0.78rem', color: '#475569' }}>
                      <strong>Final Resolution State:</strong>
                      <p style={{ margin: '4px 0 0', fontStyle: 'italic' }}>
                        "{currentModalMedia.outNotes || 'Work currently underway on site.'}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="inout-modal-footer">
              <div className="inout-footer-left">
                <span className="inout-audit-status-tag">
                  <SlimCheck size={14} style={{ color: '#16A34A' }} />
                  Audit Trail: {currentModalMedia.outImage ? '3 Photos Attached' : '2 Photos (Check-Out In-Flight)'}
                </span>
              </div>
              <div className="inout-footer-actions">
                <button
                  type="button"
                  className="table-quick-action"
                  onClick={closePhotoModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    closePhotoModal();
                    onNavigate('Services');
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <SlimServices size={14} />
                  <span>Open in Services</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Fullscreen Lightbox Modal ── */}
      {lightboxImage && (
        <div
          className="inout-lightbox-backdrop"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="inout-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inout-lightbox-header">
              <div>
                <h3>{lightboxImage.title}</h3>
                {lightboxImage.subtitle && <p>{lightboxImage.subtitle}</p>}
              </div>
              <button
                type="button"
                className="inout-lightbox-close"
                onClick={() => setLightboxImage(null)}
                aria-label="Close enlarged preview"
              >
                <SlimX size={20} />
              </button>
            </div>
            <div className="inout-lightbox-img-box">
              <img src={lightboxImage.src} alt={lightboxImage.title} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardHome;
