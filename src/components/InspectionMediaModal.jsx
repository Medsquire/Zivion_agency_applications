import React from 'react';
import {
  SlimX,
  SlimImage,
  SlimActivity,
  SlimEye,
  SlimClock,
  SlimMapPin,
  SlimUserCheck,
  SlimCheck,
  SlimAlertCircle,
  SlimServices,
} from './SlimIcons';

export default function InspectionMediaModal({
  photoModalRequest,
  currentModalMedia,
  photoModalTab,
  setPhotoModalTab,
  closePhotoModal,
  lightboxImage,
  setLightboxImage,
  onNavigateServices,
}) {
  if (!photoModalRequest || !currentModalMedia) return null;

  return (
    <>
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
                      alt="Technician Check-In"
                      className="inout-photo-img"
                    />
                    <div className="inout-photo-overlay-hint">
                      <SlimEye size={16} /> <span>Click to enlarge</span>
                    </div>
                  </div>

                  <div className="inout-photo-details">
                    <div className="inout-meta-row">
                      <SlimClock size={12} />
                      <span>Check-In Time: {currentModalMedia.inTime}</span>
                    </div>
                    <div className="inout-meta-row">
                      <SlimUserCheck size={12} />
                      <span>Attending: {photoModalRequest.technician || 'Lead Technician'}</span>
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
                        ● {currentModalMedia.outImage ? 'Check-OUT: Work Resolved' : 'Check-OUT: Pending'}
                      </span>
                    </div>
                    <span className="inout-photo-meta">
                      {currentModalMedia.outTime || 'In-Progress'}
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
                        alt="Technician Work Resolved"
                        className="inout-photo-img"
                      />
                      <div className="inout-photo-overlay-hint">
                        <SlimEye size={16} /> <span>Click to enlarge</span>
                      </div>
                    </div>
                  ) : (
                    <div className="inout-photo-pending-wrap">
                      <SlimAlertCircle size={28} style={{ color: '#D97706' }} />
                      <strong>Resolution in progress</strong>
                      <p>Technician will take check-out proof photo upon sign-off.</p>
                    </div>
                  )}

                  <div className="inout-photo-details">
                    <div className="inout-meta-row">
                      <SlimClock size={12} />
                      <span>Completion: {currentModalMedia.outTime || 'Pending on-site sign-off'}</span>
                    </div>
                    <div className="inout-meta-row">
                      <SlimCheck
                        size={12}
                        style={{ color: currentModalMedia.outImage ? '#16A34A' : '#D97706' }}
                      />
                      <span style={{ color: currentModalMedia.outImage ? '#16A34A' : '#D97706', fontWeight: 600 }}>
                        {currentModalMedia.outImage ? 'Quality Audit Verified' : 'Work In Progress'}
                      </span>
                    </div>
                    <p className="inout-photo-notes">
                      "{currentModalMedia.outNotes || 'Service is actively being executed by assigned technicians.'}"
                    </p>
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
                    ● Resident Reported Defect
                  </span>
                  <h3>{photoModalRequest.service}</h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                    {photoModalRequest.description || photoModalRequest.caseTitle || 'Resident attached this inspection photo when submitting service request.'}
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
              {onNavigateServices && (
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    closePhotoModal();
                    onNavigateServices();
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <SlimServices size={14} />
                  <span>Open in Services</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
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
    </>
  );
}
