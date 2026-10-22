import React, { useState, useMemo } from 'react';
import './Services.css';
import TableScrollSlider from '../components/TableScrollSlider';

// ── Categories ─────────────────────────────────────────────────────────────
const PRIMARY_CATEGORIES = [
  { id: 'All', label: 'All Categories', icon: '📋' },
  { id: 'Technicians', label: 'Technicians', icon: '🛠️', subtitle: 'Electrical, Plumbing, Civil, AC' },
  { id: 'Security', label: 'Security', icon: '🛡️', subtitle: 'Permission & Approval Requests' },
  { id: 'Daily Works', label: 'Daily Works', icon: '🧹', subtitle: 'Housekeeping, Waste, Water Supply' },
];

// ── 6 Lifecycle Stages ─────────────────────────────────────────────────────
const STAGES = [
  { id: 'Received Request', label: 'Received Req', key: 'received', color: 'stage-received', pillClass: 'pill-received' },
  { id: 'Pending', label: 'Pending', key: 'pending', color: 'stage-pending', pillClass: 'pill-pending' },
  { id: 'In Progress', label: 'In Progress', key: 'in-progress', color: 'stage-in-progress', pillClass: 'pill-in-progress' },
  { id: 'Work Progress State', label: 'Work Progress', key: 'work-progress', color: 'stage-work-progress', pillClass: 'pill-work-progress' },
  { id: 'On Hold', label: 'On Hold', key: 'on-hold', color: 'stage-on-hold', pillClass: 'pill-on-hold' },
  { id: 'Completed', label: 'Completed', key: 'completed', color: 'stage-completed', pillClass: 'pill-completed' },
];

const DEFAULT_TECHNICIANS_LIST = [
  { id: 'TECH-001', name: 'Suresh Babu', skill: 'Electrical & AC', mobile: '+91 98765 00001' },
  { id: 'TECH-002', name: 'Mahesh Reddy', skill: 'Plumbing & Civil', mobile: '+91 98765 00002' },
  { id: 'TECH-003', name: 'Kiran Rao', skill: 'Civil Maintenance', mobile: '+91 98765 00003' },
  { id: 'SEC-001', name: 'Security Desk', skill: 'Gate & Visitor Approvals', mobile: '+91 98765 00010' },
  { id: 'DAY-001', name: 'Daily Works Crew', skill: 'Sanitation & Housekeeping', mobile: '+91 98765 00020' },
];

export default function Services({
  requests: propRequests = [],
  setRequests: propSetRequests,
  technicians: propTechnicians = [],
  updateRequestField,
  updateRequestStatus,
}) {
  // If parent didn't pass setRequests, manage local state
  const [localRequests, setLocalRequests] = useState(propRequests);
  const requests = propSetRequests ? propRequests : localRequests;
  const setRequests = propSetRequests || setLocalRequests;

  const technicians = propTechnicians.length > 0 ? propTechnicians : DEFAULT_TECHNICIANS_LIST;

  // Active Category & Stage Filter
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'pipeline'

  // Modals state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalTab, setModalTab] = useState('overview'); // 'overview' | 'hierarchy' | 'allocation' | 'security'
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [allocatingRequest, setAllocatingRequest] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [deletingRequestId, setDeletingRequestId] = useState(null);
  const [onHoldPromptRequest, setOnHoldPromptRequest] = useState(null);
  const [onHoldReasonInput, setOnHoldReasonInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Form state for + Raise Complaint / Case Order
  const [newComplaintForm, setNewComplaintForm] = useState({
    category: 'Technicians',
    service: 'Electrical Repair',
    caseTitle: '',
    description: '',
    raisedBy: 'Residence',
    resident: '',
    apartment: 'Surya Enclave',
    flatNo: '',
    priority: 'Normal',
    technicianId: 'TECH-001',
    targetDate: '2026-10-25',
    securityPassType: 'Permission Request',
    dailyWorkFrequency: 'Daily',
  });

  // Form state for Allocation of Work
  const [allocationForm, setAllocationForm] = useState({
    technicianId: 'TECH-001',
    assignedDate: new Date().toISOString().split('T')[0],
    targetDate: '2026-10-25',
    instructions: '',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // ── Counts per Stage ─────────────────────────────────────────────────────
  const stageCounts = useMemo(() => {
    const counts = {};
    STAGES.forEach((s) => {
      counts[s.id] = requests.filter((r) => {
        const matchesCategory =
          selectedCategory === 'All' || r.category === selectedCategory;
        return matchesCategory && r.status === s.id;
      }).length;
    });
    return counts;
  }, [requests, selectedCategory]);

  // ── Filtered Requests ────────────────────────────────────────────────────
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesCategory =
        selectedCategory === 'All' || (r.category || 'Technicians') === selectedCategory;

      const matchesStage =
        selectedStage === 'All' || r.status === selectedStage;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (r.id && r.id.toLowerCase().includes(q)) ||
        (r.caseOrderId && r.caseOrderId.toLowerCase().includes(q)) ||
        (r.caseTitle && r.caseTitle.toLowerCase().includes(q)) ||
        (r.workOrderId && r.workOrderId.toLowerCase().includes(q)) ||
        (r.service && r.service.toLowerCase().includes(q)) ||
        (r.resident && r.resident.toLowerCase().includes(q)) ||
        (r.flatNo && r.flatNo.toLowerCase().includes(q)) ||
        (r.apartment && r.apartment.toLowerCase().includes(q)) ||
        (r.technician && r.technician.toLowerCase().includes(q));

      return matchesCategory && matchesStage && matchesSearch;
    });
  }, [requests, selectedCategory, selectedStage, searchQuery]);

  // ── CRUD: Create New Complaint / Case Order ───────────────────────────────
  const handleRaiseSubmit = (e) => {
    e.preventDefault();
    if (!newComplaintForm.caseTitle.trim() || !newComplaintForm.description.trim()) {
      return;
    }

    const techObj = technicians.find((t) => t.id === newComplaintForm.technicianId) || {
      name: 'Unassigned',
      id: '',
    };

    const nextNum = requests.length + 1001;
    const prefix = newComplaintForm.category === 'Security' ? 'SEC' : newComplaintForm.category === 'Daily Works' ? 'DAY' : 'REQ';
    const newId = `${prefix}-${nextNum}`;
    const newCaseId = `CASE-2026-${String(nextNum).slice(-3)}`;
    const newWorkOrderId = `WO-${String(nextNum).slice(-3)}-A`;

    const newReq = {
      id: newId,
      caseOrderId: newCaseId,
      caseTitle: newComplaintForm.caseTitle,
      workOrderId: newWorkOrderId,
      workOrderTitle: `${newComplaintForm.service} Execution Plan`,
      category: newComplaintForm.category,
      service: newComplaintForm.service,
      resident: newComplaintForm.resident || (newComplaintForm.raisedBy === 'RWA' ? 'RWA Management' : 'Resident'),
      apartment: newComplaintForm.apartment || 'Surya Enclave',
      flatNo: newComplaintForm.flatNo || (newComplaintForm.category === 'Daily Works' ? 'All Towers' : 'A-101'),
      technician: techObj.name,
      technicianId: techObj.id,
      assignedDate: new Date().toISOString().split('T')[0],
      targetDate: newComplaintForm.targetDate || '2026-10-25',
      priority: newComplaintForm.priority,
      status: 'Received Request',
      holdReason: '',
      description: newComplaintForm.description,
      securityPassType: newComplaintForm.securityPassType,
      dailyWorkFrequency: newComplaintForm.dailyWorkFrequency,
    };

    setRequests([newReq, ...requests]);
    setIsRaiseModalOpen(false);
    setNewComplaintForm({
      category: 'Technicians',
      service: 'Electrical Repair',
      caseTitle: '',
      description: '',
      raisedBy: 'Residence',
      resident: '',
      apartment: 'Surya Enclave',
      flatNo: '',
      priority: 'Normal',
      technicianId: 'TECH-001',
      targetDate: '2026-10-25',
      securityPassType: 'Permission Request',
      dailyWorkFrequency: 'Daily',
    });
    showToast(`✓ Created Case Order ${newCaseId} & Service Request ${newId}`);
  };

  // ── CRUD: Allocation of Work ─────────────────────────────────────────────
  const openAllocateModal = (req) => {
    setAllocatingRequest(req);
    setAllocationForm({
      technicianId: req.technicianId || 'TECH-001',
      assignedDate: req.assignedDate || new Date().toISOString().split('T')[0],
      targetDate: req.targetDate || '2026-10-25',
      instructions: `Work Order ${req.workOrderId || req.id}: Execute ${req.service} for Flat ${req.flatNo}.`,
    });
    setIsAllocateModalOpen(true);
  };

  const handleAllocateSubmit = (e) => {
    e.preventDefault();
    if (!allocatingRequest) return;

    const techObj = technicians.find((t) => t.id === allocationForm.technicianId) || {
      name: 'Unassigned',
      id: '',
    };

    const updated = requests.map((r) => {
      if (r.id === allocatingRequest.id) {
        return {
          ...r,
          technician: techObj.name,
          technicianId: techObj.id,
          assignedDate: allocationForm.assignedDate,
          targetDate: allocationForm.targetDate,
          status: r.status === 'Received Request' ? 'In Progress' : r.status,
        };
      }
      return r;
    });

    setRequests(updated);
    if (updateRequestField) {
      updateRequestField(allocatingRequest.id, 'technician', techObj.name);
      updateRequestField(allocatingRequest.id, 'technicianId', techObj.id);
    }
    if (selectedRequest && selectedRequest.id === allocatingRequest.id) {
      setSelectedRequest({
        ...selectedRequest,
        technician: techObj.name,
        technicianId: techObj.id,
        assignedDate: allocationForm.assignedDate,
        targetDate: allocationForm.targetDate,
      });
    }

    setIsAllocateModalOpen(false);
    showToast(`✓ Allocated ${techObj.name} to ${allocatingRequest.id} (${allocatingRequest.workOrderId})`);
  };

  // ── CRUD: Stage Transition ────────────────────────────────────────────────
  const handleStageChange = (req, newStage) => {
    if (newStage === 'On Hold') {
      setOnHoldPromptRequest(req);
      setOnHoldReasonInput(req.holdReason || 'Awaiting materials / resident clearance');
      return;
    }

    const updated = requests.map((r) =>
      r.id === req.id ? { ...r, status: newStage, holdReason: newStage === 'Completed' ? '' : r.holdReason } : r
    );
    setRequests(updated);
    if (updateRequestStatus) updateRequestStatus(req.id, newStage);
    if (selectedRequest && selectedRequest.id === req.id) {
      setSelectedRequest({ ...selectedRequest, status: newStage });
    }
    showToast(`✓ ${req.id} moved to "${newStage}"`);
  };

  const handleConfirmOnHold = (e) => {
    e.preventDefault();
    if (!onHoldPromptRequest) return;

    const updated = requests.map((r) =>
      r.id === onHoldPromptRequest.id
        ? { ...r, status: 'On Hold', holdReason: onHoldReasonInput.trim() || 'Awaiting spare parts from store' }
        : r
    );
    setRequests(updated);
    if (updateRequestStatus) updateRequestStatus(onHoldPromptRequest.id, 'On Hold');
    if (selectedRequest && selectedRequest.id === onHoldPromptRequest.id) {
      setSelectedRequest({ ...selectedRequest, status: 'On Hold', holdReason: onHoldReasonInput });
    }
    setOnHoldPromptRequest(null);
    showToast(`✓ Marked ${onHoldPromptRequest.id} On Hold`);
  };

  // ── CRUD: Edit Complaint ──────────────────────────────────────────────────
  const openEditModal = (req) => {
    setEditingRequest({ ...req });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingRequest) return;

    const updated = requests.map((r) => (r.id === editingRequest.id ? editingRequest : r));
    setRequests(updated);
    if (selectedRequest && selectedRequest.id === editingRequest.id) {
      setSelectedRequest(editingRequest);
    }
    setIsEditModalOpen(false);
    showToast(`✓ Saved updates for ${editingRequest.id}`);
  };

  // ── CRUD: Delete / Close Complaint ────────────────────────────────────────
  const handleDeleteConfirm = () => {
    if (!deletingRequestId) return;
    const updated = requests.filter((r) => r.id !== deletingRequestId);
    setRequests(updated);
    if (selectedRequest && selectedRequest.id === deletingRequestId) {
      setSelectedRequest(null);
    }
    showToast(`✓ Deleted complaint ${deletingRequestId}`);
    setDeletingRequestId(null);
  };

  return (
    <div className="svc-container page-content">
      {/* ── Top Header ──────────────────────────────────────────────────── */}
      <div className="svc-header-row">
        <div>
          <h1 className="svc-page-title">Services &amp; Work Orders</h1>

        </div>

        <div className="svc-header-actions">
          <button
            type="button"
            className="svc-btn-pill-secondary"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedStage('All');
              setSearchQuery('');
            }}
          >
            Clear Filters
          </button>
          <button
            type="button"
            className="svc-btn-pill-primary"
            onClick={() => setIsRaiseModalOpen(true)}
          >
            + Raise Complaint / Case Order
          </button>
        </div>
      </div>



      {/* ── Primary Category Tabs (Technicians, Security, Daily Works) ──── */}
      <div className="svc-category-tabs-bar">
        {PRIMARY_CATEGORIES.map((cat) => {
          const count =
            cat.id === 'All'
              ? requests.length
              : requests.filter((r) => (r.category || 'Technicians') === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              className={`svc-category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="svc-category-count-badge">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── 6 Stage Status KPI Cards ─────────────────────────────────────── */}
      <div className="svc-stage-kpi-grid">
        {STAGES.map((stg) => {
          const count = stageCounts[stg.id] || 0;
          const isSelected = selectedStage === stg.id;

          return (
            <button
              key={stg.id}
              type="button"
              className={`svc-stage-kpi-card ${stg.color} ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedStage(isSelected ? 'All' : stg.id)}
            >
              <div className="svc-stage-label">{stg.label}</div>
              <div className="svc-stage-num">{count}</div>
              <div className="svc-stage-sub">
                {isSelected ? '● Active Filter' : 'Tap to filter'}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Search, Stage Select, and View Switcher Toolbar ─────────────── */}
      <div className="svc-toolbar">
        <div className="svc-toolbar-left">
          <input
            type="text"
            className="svc-search-input"
            placeholder="Search by ID, Case Order, Resident, Flat, Tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="svc-filter-select"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
          >
            <option value="All">All Stages (Lifecycle)</option>
            {STAGES.map((stg) => (
              <option key={stg.id} value={stg.id}>
                Stage: {stg.label} ({stageCounts[stg.id] || 0})
              </option>
            ))}
          </select>

          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
            Showing {filteredRequests.length} of {requests.length} cases
          </span>
        </div>

        <div className="svc-toolbar-right">
          <div className="svc-view-toggle">
            <button
              type="button"
              className={`svc-view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
            <button
              type="button"
              className={`svc-view-btn ${viewMode === 'pipeline' ? 'active' : ''}`}
              onClick={() => setViewMode('pipeline')}
            >
              Stage Board
            </button>
          </div>
        </div>
      </div>

      {/* ── VIEW MODE 1: DATA TABLE ─────────────────────────────────────── */}
      {viewMode === 'table' && (
        <section className="svc-content-panel content-card">
          <TableScrollSlider>
            <table className="svc-table data-table">
              <thead>
                <tr>
                  <th>Request / Case Order</th>
                  <th>Category</th>
                  <th>Service Task</th>
                  <th>Resident &amp; Unit</th>
                  <th>Allocated Tech / Work Order</th>
                  <th>Priority</th>
                  <th>Current Stage</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => {
                  const stageObj =
                    STAGES.find((s) => s.id === req.status) || STAGES[1];
                  const priorityClass = `priority-${(req.priority || 'normal').toLowerCase()}`;

                  return (
                    <tr key={req.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{req.id}</div>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                          <span className="svc-case-order-chip" title="Case Order raised by RWA/Residence">
                            {req.caseOrderId || 'CASE-101'}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600, color: '#475569' }}>
                          {req.category || 'Technicians'}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{req.service}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          {req.caseTitle || req.description?.slice(0, 34) || '—'}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{req.resident || 'Kavya'}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                          {req.apartment} · {req.flatNo}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 700, color: '#2563EB' }}>
                            {req.technician || 'Unassigned'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                          <span className="svc-work-order-chip" title="Agency Work Order managed by Lalitha">
                            {req.workOrderId || 'WO-101'}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className={`svc-priority-badge ${priorityClass}`}>
                          {req.priority || 'Normal'}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className={`svc-stage-pill ${stageObj.pillClass}`}>
                            ● {stageObj.label}
                          </span>
                        </div>
                        {req.status === 'On Hold' && req.holdReason && (
                          <div style={{ fontSize: '0.68rem', color: '#BE123C', maxWidth: '140px', marginTop: '2px' }}>
                            Reason: {req.holdReason}
                          </div>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <select
                            className="svc-filter-select"
                            style={{ fontSize: '0.74rem', padding: '4px 6px' }}
                            value={req.status}
                            onChange={(e) => handleStageChange(req, e.target.value)}
                            title="Quick transition stage"
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                Move to: {s.label}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            className="svc-btn-pill-secondary view-request-button"
                            style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                            onClick={() => {
                              setSelectedRequest(req);
                              setModalTab('overview');
                            }}
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="svc-btn-pill-primary"
                            style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                            onClick={() => openAllocateModal(req)}
                          >
                            Allocate
                          </button>

                          <button
                            type="button"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#94A3B8',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                            title="Edit complaint"
                            onClick={() => openEditModal(req)}
                          >
                            ✏️
                          </button>

                          <button
                            type="button"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                            title="Delete complaint"
                            onClick={() => setDeletingRequestId(req.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px 20px', color: '#64748B' }}>
                      No work cases match these filters. Tap &quot;+ Raise Complaint / Case Order&quot; to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableScrollSlider>
        </section>
      )}

      {/* ── VIEW MODE 2: PIPELINE / STAGE BOARD ─────────────────────────── */}
      {viewMode === 'pipeline' && (
        <div className="svc-pipeline-board">
          {STAGES.map((stg) => {
            const columnItems = filteredRequests.filter((r) => r.status === stg.id);

            return (
              <div key={stg.id} className="svc-pipeline-column">
                <div className="svc-column-header">
                  <span className="svc-column-title">{stg.label}</span>
                  <span className="svc-column-badge">{columnItems.length}</span>
                </div>

                {columnItems.map((req) => (
                  <div
                    key={req.id}
                    className="svc-kanban-card"
                    onClick={() => {
                      setSelectedRequest(req);
                      setModalTab('overview');
                    }}
                  >
                    <div className="svc-card-top-meta">
                      <span className="svc-case-order-chip">{req.caseOrderId || 'CASE-101'}</span>
                      <span className={`svc-priority-badge priority-${(req.priority || 'normal').toLowerCase()}`}>
                        {req.priority || 'Normal'}
                      </span>
                    </div>

                    <h4 className="svc-card-title">{req.service}</h4>
                    <div className="svc-card-resident">
                      👤 {req.resident || 'Kavya'} · {req.flatNo} ({req.apartment})
                    </div>

                    <div className="svc-card-footer">
                      <span className="svc-tech-name-chip">
                        🛠️ {req.technician || 'Unallocated'}
                      </span>
                      <button
                        type="button"
                        className="svc-btn-pill-primary"
                        style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openAllocateModal(req);
                        }}
                      >
                        Allocate
                      </button>
                    </div>

                    {/* Quick stage mover */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '4px',
                        paddingTop: '4px',
                        borderTop: '1px dashed #E2E8F0',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Move stage:</span>
                      <select
                        style={{ fontSize: '0.7rem', padding: '2px 4px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                        value={req.status}
                        onChange={(e) => handleStageChange(req, e.target.value)}
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {columnItems.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 10px', color: '#94A3B8', fontSize: '0.78rem' }}>
                    No requests in {stg.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL 1: VIEW COMPLAINT & WORK ORDER DOSSIER ─────────────────── */}
      {selectedRequest && (
        <div className="svc-modal-backdrop" onClick={() => setSelectedRequest(null)}>
          <div className="svc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="svc-modal-header">
              <div>
                <span className="svc-modal-eyebrow">
                  {selectedRequest.category} · {selectedRequest.caseOrderId || 'CASE-ORDER'}
                </span>
                <h3 className="svc-modal-title">
                  {selectedRequest.id}: {selectedRequest.service}
                </h3>
              </div>
              <button
                type="button"
                className="svc-modal-close"
                onClick={() => setSelectedRequest(null)}
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', gap: '6px', padding: '8px 22px 0', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', overflowX: 'auto' }}>
              <button
                type="button"
                className={`svc-category-tab ${modalTab === 'overview' ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                onClick={() => setModalTab('overview')}
              >
                Overview
              </button>
              <button
                type="button"
                className={`svc-category-tab ${modalTab === 'hierarchy' ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                onClick={() => setModalTab('hierarchy')}
              >
                Work Hierarchy (Diagram Flow)
              </button>
              <button
                type="button"
                className={`svc-category-tab ${modalTab === 'allocation' ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                onClick={() => setModalTab('allocation')}
              >
                Allocation &amp; Notes
              </button>
              {selectedRequest.category === 'Security' && (
                <button
                  type="button"
                  className={`svc-category-tab ${modalTab === 'security' ? 'active' : ''}`}
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                  onClick={() => setModalTab('security')}
                >
                  Permission / Approval Specs
                </button>
              )}
            </div>

            <div className="svc-modal-body">
              {/* TAB 1: OVERVIEW */}
              {modalTab === 'overview' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9' }}>
                    <span className={`svc-stage-pill ${STAGES.find((s) => s.id === selectedRequest.status)?.pillClass || 'pill-pending'}`}>
                      ● Stage: {selectedRequest.status}
                    </span>
                    <span className={`svc-priority-badge priority-${(selectedRequest.priority || 'normal').toLowerCase()}`}>
                      Priority: {selectedRequest.priority || 'Normal'}
                    </span>
                  </div>

                  <div className="svc-form-row-2">
                    <div className="svc-form-group">
                      <label>Case Order (Raised by RWA / Residence)</label>
                      <div style={{ fontWeight: 700, color: '#2563EB' }}>
                        {selectedRequest.caseOrderId || 'CASE-2026-041'} — {selectedRequest.caseTitle || selectedRequest.service}
                      </div>
                    </div>
                    <div className="svc-form-group">
                      <label>Agency Work Order (Lalitha)</label>
                      <div style={{ fontWeight: 700, color: '#7C3AED' }}>
                        {selectedRequest.workOrderId || 'WO-041-A'} — {selectedRequest.workOrderTitle || 'Standard Dispatch'}
                      </div>
                    </div>
                  </div>

                  <div className="svc-form-row-2">
                    <div className="svc-form-group">
                      <label>Resident / Originator</label>
                      <div style={{ fontWeight: 700 }}>{selectedRequest.resident || 'Kavya Sharma'}</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                        {selectedRequest.apartment} · Flat {selectedRequest.flatNo}
                      </div>
                    </div>
                    <div className="svc-form-group">
                      <label>Allocated Technician</label>
                      <div style={{ fontWeight: 700, color: '#059669' }}>
                        {selectedRequest.technician || 'Unassigned'} ({selectedRequest.technicianId || 'Pending'})
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                        Assigned: {selectedRequest.assignedDate} · Target: {selectedRequest.targetDate}
                      </div>
                    </div>
                  </div>

                  <div className="svc-form-group">
                    <label>Complaint &amp; Task Description</label>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px', borderRadius: '8px', fontSize: '0.84rem', lineHeight: 1.45 }}>
                      {selectedRequest.description || 'No detailed description provided.'}
                    </div>
                  </div>

                  {selectedRequest.status === 'On Hold' && selectedRequest.holdReason && (
                    <div style={{ background: '#FFF1F2', border: '1.5px solid #FECDD3', padding: '12px', borderRadius: '8px', color: '#9F1239' }}>
                      <strong>⚠️ On-Hold Reason:</strong> {selectedRequest.holdReason}
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: HIERARCHY (USER DIAGRAM ALIGNMENT) */}
              {modalTab === 'hierarchy' && (
                <div className="svc-hierarchy-tree-card">
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.92rem', color: '#0F172A' }}>
                    Complete Workflow Chain (As per Architecture Diagram)
                  </h4>

                  <div className="svc-flow-node">
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800 }}>STEP 1: CENTRAL ADMINISTRATION</div>
                    <strong>Admin</strong> → Oversees agency policies and RWA federation approvals.
                  </div>

                  <div className="svc-flow-node">
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800 }}>STEP 2: RWA &amp; RESIDENCE (CASE ORDER)</div>
                    <strong>RWA</strong> &amp; <strong>Residence ({selectedRequest.resident || 'Resident'})</strong> raised Case Order:
                    <div style={{ marginTop: '4px' }}>
                      <span className="svc-case-order-chip">{selectedRequest.caseOrderId || 'CASE-101'}</span>: {selectedRequest.caseTitle || selectedRequest.service}
                    </div>
                  </div>

                  <div className="svc-flow-node">
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800 }}>STEP 3: AGENCY DISPATCH (WORK ORDERS)</div>
                    <strong>Agency</strong> broken Case Order into Work Orders:
                    <div style={{ marginTop: '4px' }}>
                      <span className="svc-work-order-chip">{selectedRequest.workOrderId || 'WO-101-A'}</span>: {selectedRequest.workOrderTitle || 'Active execution'}
                    </div>
                  </div>

                  <div className="svc-flow-node" style={{ borderColor: '#2563EB', background: '#F0F7FF' }}>
                    <div style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: 800 }}>STEP 4: FIELD ALLOCATION (SERVICE REQUEST)</div>
                    <strong>Technicians ({selectedRequest.technician || 'Assigned Staff'})</strong> assigned Service Request:
                    <div style={{ marginTop: '4px', fontWeight: 700, color: '#1D4ED8' }}>
                      {selectedRequest.id}: {selectedRequest.service} (Status: {selectedRequest.status})
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ALLOCATION & NOTES */}
              {modalTab === 'allocation' && (
                <div className="svc-allocation-box">
                  <h4 style={{ margin: 0, fontSize: '0.92rem' }}>Technician &amp; Work Allocation</h4>
                  <div className="svc-form-row-2">
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Assigned Personnel</span>
                      <strong>{selectedRequest.technician || 'Unassigned'}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Target Completion</span>
                      <strong>{selectedRequest.targetDate || '2026-10-25'}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="svc-btn-pill-primary"
                    style={{ alignSelf: 'flex-start', marginTop: '6px' }}
                    onClick={() => {
                      setSelectedRequest(null);
                      openAllocateModal(selectedRequest);
                    }}
                  >
                    Reassign / Reallocate Technician
                  </button>
                </div>
              )}

              {/* TAB 4: SECURITY SPECS (DIAGRAM 2) */}
              {modalTab === 'security' && (
                <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', padding: '16px', borderRadius: '10px' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '0.92rem' }}>
                    Security Gate &amp; Residence Workflow (Diagram 2)
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 12px' }}>
                    Security ↔ Permission Request / Approval Request ↔ Residence ({selectedRequest.resident})
                  </p>

                  <div className="svc-form-row-2">
                    <div className="svc-form-group">
                      <label>Request Type</label>
                      <div style={{ fontWeight: 700, color: '#D97706' }}>
                        {selectedRequest.securityPassType || 'Permission Request'}
                      </div>
                    </div>
                    <div className="svc-form-group">
                      <label>Security Desk</label>
                      <div style={{ fontWeight: 700 }}>Security Gate Control</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="svc-modal-footer">
              <button
                type="button"
                className="svc-btn-pill-secondary"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="svc-btn-pill-primary"
                onClick={() => {
                  const curr = selectedRequest;
                  setSelectedRequest(null);
                  openAllocateModal(curr);
                }}
              >
                Allocate Work
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: + RAISE COMPLAINT / CASE ORDER ──────────────────────── */}
      {isRaiseModalOpen && (
        <div className="svc-modal-backdrop" onClick={() => setIsRaiseModalOpen(false)}>
          <div className="svc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="svc-modal-header">
              <div>
                <span className="svc-modal-eyebrow">CREATE NEW WORK CASE</span>
                <h3 className="svc-modal-title">+ Raise Complaint / Case Order</h3>
              </div>
              <button
                type="button"
                className="svc-modal-close"
                onClick={() => setIsRaiseModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRaiseSubmit}>
              <div className="svc-modal-body">
                <div className="svc-form-row-2">
                  <div className="svc-form-group">
                    <label>Category *</label>
                    <select
                      className="svc-form-select"
                      value={newComplaintForm.category}
                      onChange={(e) => {
                        const cat = e.target.value;
                        const defaultSvc =
                          cat === 'Security'
                            ? 'Permission Request'
                            : cat === 'Daily Works'
                              ? 'Waste & Garbage Collection'
                              : 'Electrical Repair';
                        setNewComplaintForm({
                          ...newComplaintForm,
                          category: cat,
                          service: defaultSvc,
                        });
                      }}
                    >
                      <option value="Technicians">🛠️ Technicians</option>
                      <option value="Security">🛡️ Security</option>
                      <option value="Daily Works">🧹 Daily Works</option>
                    </select>
                  </div>

                  <div className="svc-form-group">
                    <label>Specific Service Subcategory *</label>
                    {newComplaintForm.category === 'Technicians' ? (
                      <select
                        className="svc-form-select"
                        value={newComplaintForm.service}
                        onChange={(e) =>
                          setNewComplaintForm({ ...newComplaintForm, service: e.target.value })
                        }
                      >
                        <option value="Electrical Repair">Electrical Repair</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="AC Maintenance">AC Maintenance</option>
                        <option value="Civil Maintenance">Civil Maintenance</option>
                        <option value="Painting">Painting</option>
                      </select>
                    ) : newComplaintForm.category === 'Security' ? (
                      <select
                        className="svc-form-select"
                        value={newComplaintForm.service}
                        onChange={(e) =>
                          setNewComplaintForm({
                            ...newComplaintForm,
                            service: e.target.value,
                            securityPassType: e.target.value,
                          })
                        }
                      >
                        <option value="Permission Request">Permission Request (Delivery / Moves)</option>
                        <option value="Approval Request">Approval Request (Contractor / Vehicle)</option>
                      </select>
                    ) : (
                      <select
                        className="svc-form-select"
                        value={newComplaintForm.service}
                        onChange={(e) =>
                          setNewComplaintForm({ ...newComplaintForm, service: e.target.value })
                        }
                      >
                        <option value="Waste & Garbage Collection">Waste &amp; Garbage Collection</option>
                        <option value="Daily Housekeeping">Daily Housekeeping</option>
                        <option value="Water Supply Operations">Water Supply Operations</option>
                        <option value="Landscaping & Gardening">Landscaping &amp; Gardening</option>
                        <option value="Fire Hydrant Line Check">Fire Hydrant Line Check</option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="svc-form-group">
                  <label>Case Order Title *</label>
                  <input
                    type="text"
                    required
                    className="svc-form-input"
                    placeholder="e.g. Master Restroom Pipeline Pressure Failure"
                    value={newComplaintForm.caseTitle}
                    onChange={(e) =>
                      setNewComplaintForm({ ...newComplaintForm, caseTitle: e.target.value })
                    }
                  />
                </div>

                <div className="svc-form-group">
                  <label>Detailed Issue Description *</label>
                  <textarea
                    rows={3}
                    required
                    className="svc-form-textarea"
                    placeholder="Describe problem severity, symptoms, and resident access times..."
                    value={newComplaintForm.description}
                    onChange={(e) =>
                      setNewComplaintForm({ ...newComplaintForm, description: e.target.value })
                    }
                  />
                </div>

                <div className="svc-form-row-2">
                  <div className="svc-form-group">
                    <label>Raised By</label>
                    <select
                      className="svc-form-select"
                      value={newComplaintForm.raisedBy}
                      onChange={(e) =>
                        setNewComplaintForm({ ...newComplaintForm, raisedBy: e.target.value })
                      }
                    >
                      <option value="Residence">Residence (Resident / Tenant)</option>
                      <option value="RWA">RWA (Association Committee)</option>
                    </select>
                  </div>

                  <div className="svc-form-group">
                    <label>Resident / Contact Name</label>
                    <input
                      type="text"
                      className="svc-form-input"
                      placeholder="e.g. Kavya Sharma"
                      value={newComplaintForm.resident}
                      onChange={(e) =>
                        setNewComplaintForm({ ...newComplaintForm, resident: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="svc-form-row-2">
                  <div className="svc-form-group">
                    <label>Society / Apartment</label>
                    <select
                      className="svc-form-select"
                      value={newComplaintForm.apartment}
                      onChange={(e) =>
                        setNewComplaintForm({ ...newComplaintForm, apartment: e.target.value })
                      }
                    >
                      <option value="Surya Enclave">Surya Enclave</option>
                      <option value="Golden Orbit">Golden Orbit</option>
                      <option value="Sunrise Heights">Sunrise Heights</option>
                      <option value="SKYLINE HOMES">SKYLINE HOMES</option>
                      <option value="Silver Oak Enclave">Silver Oak Enclave</option>
                    </select>
                  </div>

                  <div className="svc-form-group">
                    <label>Flat / Unit No.</label>
                    <input
                      type="text"
                      className="svc-form-input"
                      placeholder="e.g. A-101"
                      value={newComplaintForm.flatNo}
                      onChange={(e) =>
                        setNewComplaintForm({ ...newComplaintForm, flatNo: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="svc-form-row-2">
                  <div className="svc-form-group">
                    <label>Priority</label>
                    <select
                      className="svc-form-select"
                      value={newComplaintForm.priority}
                      onChange={(e) =>
                        setNewComplaintForm({ ...newComplaintForm, priority: e.target.value })
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>

                  <div className="svc-form-group">
                    <label>Initial Work Allocation</label>
                    <select
                      className="svc-form-select"
                      value={newComplaintForm.technicianId}
                      onChange={(e) =>
                        setNewComplaintForm({ ...newComplaintForm, technicianId: e.target.value })
                      }
                    >
                      {technicians.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.skill})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="svc-modal-footer">
                <button
                  type="button"
                  className="svc-btn-pill-secondary"
                  onClick={() => setIsRaiseModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="svc-btn-pill-primary">
                  Raise Case &amp; Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: ALLOCATION OF WORK ──────────────────────────────────── */}
      {isAllocateModalOpen && allocatingRequest && (
        <div className="svc-modal-backdrop" onClick={() => setIsAllocateModalOpen(false)}>
          <div className="svc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="svc-modal-header">
              <div>
                <span className="svc-modal-eyebrow">WORK ORDER DISPATCH &amp; ALLOCATION</span>
                <h3 className="svc-modal-title">
                  Allocate: {allocatingRequest.id} ({allocatingRequest.service})
                </h3>
              </div>
              <button
                type="button"
                className="svc-modal-close"
                onClick={() => setIsAllocateModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAllocateSubmit}>
              <div className="svc-modal-body">
                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
                  <strong>Linked Hierarchy:</strong> Case Order: <span className="svc-case-order-chip">{allocatingRequest.caseOrderId || 'CASE-101'}</span> → Agency Work Order: <span className="svc-work-order-chip">{allocatingRequest.workOrderId || 'WO-101-A'}</span>
                  <div style={{ marginTop: '4px', color: '#64748B' }}>
                    Resident: <strong>{allocatingRequest.resident}</strong> ({allocatingRequest.apartment} · {allocatingRequest.flatNo})
                  </div>
                </div>

                <div className="svc-form-group">
                  <label>Select Technician / Agency Staff *</label>
                  <select
                    className="svc-form-select"
                    value={allocationForm.technicianId}
                    onChange={(e) =>
                      setAllocationForm({ ...allocationForm, technicianId: e.target.value })
                    }
                  >
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {t.skill} ({t.mobile})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="svc-form-row-2">
                  <div className="svc-form-group">
                    <label>Assignment Date</label>
                    <input
                      type="date"
                      className="svc-form-input"
                      value={allocationForm.assignedDate}
                      onChange={(e) =>
                        setAllocationForm({ ...allocationForm, assignedDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="svc-form-group">
                    <label>Target Completion Date</label>
                    <input
                      type="date"
                      className="svc-form-input"
                      value={allocationForm.targetDate}
                      onChange={(e) =>
                        setAllocationForm({ ...allocationForm, targetDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="svc-form-group">
                  <label>Work Order Directives &amp; Field Instructions</label>
                  <textarea
                    rows={3}
                    className="svc-form-textarea"
                    value={allocationForm.instructions}
                    onChange={(e) =>
                      setAllocationForm({ ...allocationForm, instructions: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="svc-modal-footer">
                <button
                  type="button"
                  className="svc-btn-pill-secondary"
                  onClick={() => setIsAllocateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="svc-btn-pill-primary">
                  Confirm &amp; Dispatch Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 4: ON-HOLD REASON PROMPT ───────────────────────────────── */}
      {onHoldPromptRequest && (
        <div className="svc-modal-backdrop" onClick={() => setOnHoldPromptRequest(null)}>
          <div className="svc-modal" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
            <div className="svc-modal-header">
              <div>
                <span className="svc-modal-eyebrow" style={{ color: '#E11D48' }}>STAGE TRANSITION</span>
                <h3 className="svc-modal-title">Put Case On Hold</h3>
              </div>
              <button
                type="button"
                className="svc-modal-close"
                onClick={() => setOnHoldPromptRequest(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmOnHold}>
              <div className="svc-modal-body">
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                  Specify the blocking reason for putting <strong>{onHoldPromptRequest.id}</strong> on hold:
                </p>

                <div className="svc-form-group">
                  <label>Hold Reason *</label>
                  <select
                    className="svc-form-select"
                    onChange={(e) => setOnHoldReasonInput(e.target.value)}
                    value={onHoldReasonInput}
                  >
                    <option value="Awaiting spare parts and material delivery from agency store">
                      Awaiting spare parts &amp; materials from agency store
                    </option>
                    <option value="Resident unavailable / flat locked during scheduled visit">
                      Resident unavailable / flat locked during scheduled visit
                    </option>
                    <option value="RWA & Security noise/drilling permit pending clearance">
                      RWA &amp; Security noise/drilling permit pending clearance
                    </option>
                    <option value="Municipal water line outage delaying hydro-test">
                      Municipal water line outage delaying hydro-test
                    </option>
                  </select>
                </div>

                <div className="svc-form-group">
                  <label>Custom Reason (Optional)</label>
                  <input
                    type="text"
                    className="svc-form-input"
                    placeholder="Or type specific reason..."
                    value={onHoldReasonInput}
                    onChange={(e) => setOnHoldReasonInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="svc-modal-footer">
                <button
                  type="button"
                  className="svc-btn-pill-secondary"
                  onClick={() => setOnHoldPromptRequest(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="svc-btn-pill-primary"
                  style={{ background: '#E11D48' }}
                >
                  Set On Hold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 5: EDIT COMPLAINT DETAILS ──────────────────────────────── */}
      {isEditModalOpen && editingRequest && (
        <div className="svc-modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="svc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="svc-modal-header">
              <div>
                <span className="svc-modal-eyebrow">UPDATE COMPLAINT</span>
                <h3 className="svc-modal-title">Edit {editingRequest.id}</h3>
              </div>
              <button
                type="button"
                className="svc-modal-close"
                onClick={() => setIsEditModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="svc-modal-body">
                <div className="svc-form-group">
                  <label>Case Title</label>
                  <input
                    type="text"
                    className="svc-form-input"
                    value={editingRequest.caseTitle || ''}
                    onChange={(e) =>
                      setEditingRequest({ ...editingRequest, caseTitle: e.target.value })
                    }
                  />
                </div>

                <div className="svc-form-group">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    className="svc-form-textarea"
                    value={editingRequest.description || ''}
                    onChange={(e) =>
                      setEditingRequest({ ...editingRequest, description: e.target.value })
                    }
                  />
                </div>

                <div className="svc-form-row-2">
                  <div className="svc-form-group">
                    <label>Priority</label>
                    <select
                      className="svc-form-select"
                      value={editingRequest.priority || 'Normal'}
                      onChange={(e) =>
                        setEditingRequest({ ...editingRequest, priority: e.target.value })
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>

                  <div className="svc-form-group">
                    <label>Target Date</label>
                    <input
                      type="date"
                      className="svc-form-input"
                      value={editingRequest.targetDate || ''}
                      onChange={(e) =>
                        setEditingRequest({ ...editingRequest, targetDate: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="svc-modal-footer">
                <button
                  type="button"
                  className="svc-btn-pill-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="svc-btn-pill-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 6: DELETE CONFIRMATION ─────────────────────────────────── */}
      {deletingRequestId && (
        <div className="svc-modal-backdrop" onClick={() => setDeletingRequestId(null)}>
          <div className="svc-modal" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="svc-modal-header">
              <h3 className="svc-modal-title" style={{ color: '#E11D48' }}>Delete Complaint</h3>
              <button
                type="button"
                className="svc-modal-close"
                onClick={() => setDeletingRequestId(null)}
              >
                ✕
              </button>
            </div>
            <div className="svc-modal-body">
              <p style={{ fontSize: '0.84rem', color: '#475569', margin: 0 }}>
                Are you sure you want to permanently delete complaint <strong>{deletingRequestId}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="svc-modal-footer">
              <button
                type="button"
                className="svc-btn-pill-secondary"
                onClick={() => setDeletingRequestId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="svc-btn-pill-primary"
                style={{ background: '#E11D48' }}
                onClick={handleDeleteConfirm}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating Toast Feedback ──────────────────────────────────────── */}
      {toastMessage && (
        <div className="svc-toast" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
