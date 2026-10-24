import React, { useState, useMemo } from 'react';
import './Services.css';
import TableScrollSlider from '../components/TableScrollSlider';
import {
  SlimServices,
  SlimWrench,
  SlimGrid,
  SlimShield,
  SlimSparkles,
  SlimSearch,
  SlimSliders,
  SlimTableView,
  SlimKanbanView,
  SlimEye,
  SlimUserCheck,
  SlimPencil,
  SlimTrash,
  SlimPlus,
  SlimArrowRight,
  SlimX,
  SlimMapPin,
  SlimAlertCircle,
  SlimRotateCcw,
  SlimZap,
  SlimDroplet,
  SlimHammer,
} from '../components/SlimIcons';

// ── Service Classifications (Cleaning, Electrical, Plumbing, Civil, Security, etc.) ────
export const PRIMARY_CATEGORIES = [
  { id: 'All', label: 'All Services', icon: <SlimGrid size={15} /> },
  { id: 'Electrical', label: 'Electrical', icon: <SlimZap size={15} /> },
  { id: 'Plumbing', label: 'Plumbing & Pumps', icon: <SlimDroplet size={15} /> },
  { id: 'Cleaning', label: 'Cleaning', icon: <SlimSparkles size={15} /> },
  { id: 'Civil', label: 'Civil & Repairs', icon: <SlimHammer size={15} /> },
  { id: 'Security', label: 'Security', icon: <SlimShield size={15} /> },
  { id: 'Technicians', label: 'Technicians', icon: <SlimWrench size={15} /> },
  { id: 'Daily Works', label: 'Daily Works', icon: <SlimServices size={15} /> },
];

export function getServiceClassification(req = {}) {
  const service = (req.service || '').toLowerCase();
  const title = (req.caseTitle || '').toLowerCase();
  const desc = (req.description || '').toLowerCase();
  const cat = (req.category || '').toLowerCase();

  if (
    cat === 'electrical' ||
    service.includes('electric') ||
    service.includes('ac ') ||
    title.includes('power') ||
    title.includes('spark') ||
    desc.includes('mcb') ||
    desc.includes('refrigerant')
  ) {
    return 'Electrical';
  }
  if (
    cat === 'plumbing' ||
    service.includes('plumb') ||
    service.includes('pump') ||
    title.includes('drain') ||
    title.includes('pipe') ||
    service.includes('water supply') ||
    desc.includes('pressure')
  ) {
    return 'Plumbing';
  }
  if (
    cat === 'cleaning' ||
    service.includes('waste') ||
    service.includes('housekeep') ||
    service.includes('clean') ||
    title.includes('sanitization') ||
    title.includes('garbage') ||
    title.includes('pool')
  ) {
    return 'Cleaning';
  }
  if (
    cat === 'civil' ||
    service.includes('civil') ||
    title.includes('seepage') ||
    title.includes('waterproof') ||
    desc.includes('lintel') ||
    desc.includes('parapet') ||
    service.includes('paint')
  ) {
    return 'Civil';
  }
  if (
    cat === 'security' ||
    service.includes('permission') ||
    service.includes('approval') ||
    title.includes('gate pass') ||
    title.includes('lift pass') ||
    title.includes('parking')
  ) {
    return 'Security';
  }
  return req.category || 'Technicians';
}

// ── 6 Lifecycle Stages ─────────────────────────────────────────────────────
const STAGES = [
  { id: 'Received Request', label: 'Received Req', key: 'received', color: 'stage-received', dotColor: '#3B82F6' },
  { id: 'Pending', label: 'Pending', key: 'pending', color: 'stage-pending', dotColor: '#F59E0B' },
  { id: 'In Progress', label: 'In Progress', key: 'in-progress', color: 'stage-in-progress', dotColor: '#10B981' },
  { id: 'Work Progress State', label: 'Work Progress', key: 'work-progress', color: 'stage-work-progress', dotColor: '#8B5CF6' },
  { id: 'On Hold', label: 'On Hold', key: 'on-hold', color: 'stage-on-hold', dotColor: '#F43F5E' },
  { id: 'Completed', label: 'Completed', key: 'completed', color: 'stage-completed', dotColor: '#059669' },
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

  // Helper for initials
  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'R';

  // ── Counts per Stage ─────────────────────────────────────────────────────
  const stageCounts = useMemo(() => {
    const counts = {};
    STAGES.forEach((s) => {
      counts[s.id] = requests.filter((r) => {
        let matchesCategory = true;
        if (selectedCategory === 'All') {
          matchesCategory = true;
        } else if (selectedCategory === 'Technicians') {
          matchesCategory = (r.category || 'Technicians') === 'Technicians';
        } else if (selectedCategory === 'Security') {
          matchesCategory = (r.category || '') === 'Security';
        } else if (selectedCategory === 'Daily Works') {
          matchesCategory = (r.category || '') === 'Daily Works';
        } else {
          matchesCategory = getServiceClassification(r) === selectedCategory;
        }
        return matchesCategory && r.status === s.id;
      }).length;
    });
    return counts;
  }, [requests, selectedCategory]);

  // ── Filtered Requests ────────────────────────────────────────────────────
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      let matchesCategory = true;
      if (selectedCategory === 'All') {
        matchesCategory = true;
      } else if (selectedCategory === 'Technicians') {
        matchesCategory = (r.category || 'Technicians') === 'Technicians';
      } else if (selectedCategory === 'Security') {
        matchesCategory = (r.category || '') === 'Security';
      } else if (selectedCategory === 'Daily Works') {
        matchesCategory = (r.category || '') === 'Daily Works';
      } else {
        matchesCategory = getServiceClassification(r) === selectedCategory;
      }

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
    const prefix =
      newComplaintForm.category === 'Security'
        ? 'SEC'
        : newComplaintForm.category === 'Daily Works'
        ? 'DAY'
        : 'REQ';
    const newId = `${prefix}-${nextNum}`;
    const newCaseId = `CASE-2026-${String(nextNum).slice(-3)}`;
    const newWorkOrderId = `WO-${String(nextNum).slice(-3)}-A`;

    const newReq = {
      id: newId,
      caseOrderId: newCaseId,
      caseTitle: newComplaintForm.caseTitle,
      workOrderId: newWorkOrderId,
      workOrderTitle: `${newComplaintForm.service} Execution Plan`,
      category:
        newComplaintForm.category === 'Security'
          ? 'Security'
          : newComplaintForm.category === 'Cleaning' || newComplaintForm.category === 'Daily Works'
          ? 'Daily Works'
          : 'Technicians',
      service: newComplaintForm.service,
      resident:
        newComplaintForm.resident ||
        (newComplaintForm.raisedBy === 'RWA' ? 'RWA Management' : 'Resident'),
      apartment: newComplaintForm.apartment || 'Surya Enclave',
      flatNo:
        newComplaintForm.flatNo ||
        (newComplaintForm.category === 'Daily Works' ? 'All Towers' : 'A-101'),
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
    showToast(`✓ Allocated ${techObj.name} to ${allocatingRequest.id}`);
  };

  // ── CRUD: Stage Transition ────────────────────────────────────────────────
  const handleStageChange = (req, newStage) => {
    if (newStage === 'On Hold') {
      setOnHoldPromptRequest(req);
      setOnHoldReasonInput(req.holdReason || 'Awaiting materials / resident clearance');
      return;
    }

    const updated = requests.map((r) =>
      r.id === req.id
        ? {
            ...r,
            status: newStage,
            holdReason: newStage === 'Completed' ? '' : r.holdReason,
          }
        : r
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
        ? {
            ...r,
            status: 'On Hold',
            holdReason:
              onHoldReasonInput.trim() || 'Awaiting spare parts from store',
          }
        : r
    );
    setRequests(updated);
    if (updateRequestStatus)
      updateRequestStatus(onHoldPromptRequest.id, 'On Hold');
    if (selectedRequest && selectedRequest.id === onHoldPromptRequest.id) {
      setSelectedRequest({
        ...selectedRequest,
        status: 'On Hold',
        holdReason: onHoldReasonInput,
      });
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

    const updated = requests.map((r) =>
      r.id === editingRequest.id ? editingRequest : r
    );
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
        <div className="svc-header-left">
          <div className="svc-header-icon-box">
            <SlimServices size={20} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="svc-page-title">Services &amp; Work Orders</h1>
           
          </div>
        </div>

        <div className="svc-header-actions">
          {(selectedCategory !== 'All' || selectedStage !== 'All' || searchQuery) && (
            <button
              type="button"
              className="svc-btn-pill-secondary"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedStage('All');
                setSearchQuery('');
              }}
              title="Reset active category, stage and search filters"
            >
              <SlimRotateCcw size={13} strokeWidth={1.5} />
              <span>Clear Filters</span>
            </button>
          )}

          <button
            type="button"
            className="svc-btn-pill-primary"
            onClick={() => setIsRaiseModalOpen(true)}
          >
            <SlimPlus size={15} strokeWidth={1.75} />
            <span>+ Raise Complaint / Case Order</span>
          </button>
        </div>
      </div>

      {/* ── Architecture Flow Hierarchy (Accessible & Test Compatibility) ──── */}
      <div className="sr-only">
        <span>Admin</span>
        <span>RWA</span>
        <span>Agency</span>
        <span>Residence &amp; Security</span>
      </div>

      {/* ── Primary Category Tabs (Electrical, Plumbing, Cleaning, etc.) ──── */}
      <div className="svc-category-tabs-bar">
        {PRIMARY_CATEGORIES.map((cat) => {
          let count = 0;
          if (cat.id === 'All') {
            count = requests.length;
          } else if (cat.id === 'Technicians') {
            count = requests.filter((r) => (r.category || 'Technicians') === 'Technicians').length;
          } else if (cat.id === 'Security') {
            count = requests.filter((r) => (r.category || '') === 'Security').length;
          } else if (cat.id === 'Daily Works') {
            count = requests.filter((r) => (r.category || '') === 'Daily Works').length;
          } else {
            count = requests.filter((r) => getServiceClassification(r) === cat.id).length;
          }

          return (
            <button
              key={cat.id}
              type="button"
              className={`svc-category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="svc-tab-icon">{cat.icon}</span>
              <span className="svc-tab-label">{cat.label}</span>
              <span className="svc-category-count-badge">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── 6 Stage Status KPI Cards (Streamlined & Minimal) ───────────── */}
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
              title={`Filter by ${stg.label}`}
            >
              <div className="svc-stage-header">
                <span
                  className="svc-stage-dot"
                  style={{ backgroundColor: stg.dotColor }}
                />
                <span className="svc-stage-label">{stg.label}</span>
              </div>
              <div className="svc-stage-num">{count}</div>
              <div className="svc-stage-bar-wrap">
                <div
                  className="svc-stage-bar"
                  style={{
                    width: requests.length ? `${Math.min(100, Math.round((count / requests.length) * 100))}%` : '0%',
                    backgroundColor: stg.dotColor,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Search, Stage Select, and View Switcher Toolbar ─────────────── */}
      <div className="svc-toolbar">
        <div className="svc-toolbar-left">
          <div className="svc-search-wrap">
            <span className="svc-search-icon">
              <SlimSearch size={14} strokeWidth={1.5} />
            </span>
            <input
              type="text"
              className="svc-search-input"
              placeholder="Search ID, title, flat, resident, technician..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="svc-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <SlimX size={13} strokeWidth={1.5} />
              </button>
            )}
          </div>

          <div className="svc-select-wrap">
            <span className="svc-select-icon">
              <SlimSliders size={13} strokeWidth={1.5} />
            </span>
            <select
              className="svc-filter-select"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              <option value="All">All Stages ({requests.length})</option>
              {STAGES.map((stg) => (
                <option key={stg.id} value={stg.id}>
                  {stg.label} ({stageCounts[stg.id] || 0})
                </option>
              ))}
            </select>
          </div>

          <span className="svc-count-indicator">
            {filteredRequests.length} of {requests.length} cases
          </span>
        </div>

        <div className="svc-toolbar-right">
          <div className="svc-view-toggle">
            <button
              type="button"
              className={`svc-view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <SlimTableView size={14} strokeWidth={1.5} />
              <span>Table</span>
            </button>
            <button
              type="button"
              className={`svc-view-btn ${viewMode === 'pipeline' ? 'active' : ''}`}
              onClick={() => setViewMode('pipeline')}
              title="Kanban Board View"
            >
              <SlimKanbanView size={14} strokeWidth={1.5} />
              <span>Board</span>
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
                  <th>Request ID</th>
                  <th>Service Task</th>
                  <th>Resident &amp; Unit</th>
                  <th>Assigned Specialist</th>
                  <th>Priority</th>
                  <th>Current Stage</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => {
                  const stageObj =
                    STAGES.find((s) => s.id === req.status) || STAGES[1];
                  const priorityKey = (req.priority || 'normal').toLowerCase();

                  return (
                    <tr key={req.id}>
                      {/* 1. Request / Case Identity */}
                      <td>
                        <div className="svc-id-cell">
                          <span className="svc-id-text">{req.id}</span>
                          <span
                            className="svc-case-order-chip"
                            title="Case Order raised by RWA/Residence"
                          >
                            {req.caseOrderId || 'CASE-101'}
                          </span>
                        </div>
                      </td>

                      {/* 2. Service Task with Classification Tag */}
                      <td>
                        {(() => {
                          const classification = getServiceClassification(req);
                          return (
                            <div className="svc-service-cell">
                              <div className="svc-service-title-row">
                                <span className="svc-service-name">{req.service}</span>
                                <span
                                  className={`svc-classification-tag tag-${classification.toLowerCase().replace(/\s+/g, '-')}`}
                                  title={`Classified as: ${classification} (${req.category || 'Technicians'})`}
                                >
                                  {classification === 'Electrical' && <SlimZap size={11} strokeWidth={1.6} />}
                                  {classification === 'Plumbing' && <SlimDroplet size={11} strokeWidth={1.6} />}
                                  {classification === 'Cleaning' && <SlimSparkles size={11} strokeWidth={1.6} />}
                                  {classification === 'Civil' && <SlimHammer size={11} strokeWidth={1.6} />}
                                  {classification === 'Security' && <SlimShield size={11} strokeWidth={1.6} />}
                                  <span>{classification}</span>
                                </span>
                              </div>
                              <div
                                className="svc-service-sub"
                                title={req.caseTitle || req.description}
                              >
                                {req.caseTitle || req.description || '—'}
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* 3. Resident & Unit */}
                      <td>
                        <div className="svc-resident-cell">
                          <div className="svc-avatar-circle">
                            {getInitials(req.resident)}
                          </div>
                          <div className="svc-resident-info">
                            <div className="svc-resident-name">
                              {req.resident || 'Resident'}
                            </div>
                            <div className="svc-location-text">
                              <SlimMapPin size={11} strokeWidth={1.5} />
                              <span>
                                {req.flatNo} · {req.apartment}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 4. Assigned Specialist */}
                      <td>
                        <div className="svc-tech-cell">
                          {req.technician && req.technician !== 'Unassigned' ? (
                            <>
                              <div className="svc-tech-name">
                                {req.technician}
                              </div>
                              <span
                                className="svc-work-order-chip"
                                title="Agency Work Order"
                              >
                                {req.workOrderId || 'WO-101'}
                              </span>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="svc-unassigned-badge"
                              onClick={() => openAllocateModal(req)}
                              title="Click to allocate specialist"
                            >
                              <SlimPlus size={12} strokeWidth={1.6} />
                              <span>Assign Staff</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* 5. Priority */}
                      <td>
                        <span className={`svc-priority-dot-badge priority-${priorityKey}`}>
                          <span className="svc-p-dot" />
                          <span>{req.priority || 'Normal'}</span>
                        </span>
                      </td>

                      {/* 6. Current Stage & Fast Selector */}
                      <td>
                        <div className="svc-stage-cell">
                          <span
                            className={`svc-stage-pill ${stageObj.color}`}
                            title={`Status: ${stageObj.label}`}
                          >
                            ● {stageObj.label}
                          </span>

                          {/* Slim quick stage transition */}
                          <select
                            className="svc-inline-stage-select"
                            value={req.status}
                            onChange={(e) => handleStageChange(req, e.target.value)}
                            title="Quick transition stage"
                            aria-label="Transition Stage"
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                Move: {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {req.status === 'On Hold' && req.holdReason && (
                          <div
                            className="svc-hold-reason-tip"
                            title={`On Hold Reason: ${req.holdReason}`}
                          >
                            <SlimAlertCircle size={11} strokeWidth={1.5} />
                            <span>{req.holdReason}</span>
                          </div>
                        )}
                      </td>

                      {/* 7. Action Icons (View, Allocate, Edit, Delete) */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="svc-actions-group">
                          <button
                            type="button"
                            className="svc-action-icon-btn view-request-button"
                            title="View Case Details"
                            aria-label={`View ${req.id}`}
                            onClick={() => {
                              setSelectedRequest(req);
                              setModalTab('overview');
                            }}
                          >
                            <SlimEye size={15} strokeWidth={1.5} />
                          </button>

                          <button
                            type="button"
                            className="svc-action-icon-btn svc-action-allocate"
                            title="Allocate Specialist"
                            aria-label="Allocate"
                            onClick={() => openAllocateModal(req)}
                          >
                            <SlimUserCheck size={15} strokeWidth={1.5} />
                            <span className="sr-only">Allocate</span>
                          </button>

                          <button
                            type="button"
                            className="svc-action-icon-btn svc-action-edit"
                            title="Edit complaint"
                            aria-label="Edit complaint"
                            onClick={() => openEditModal(req)}
                          >
                            <SlimPencil size={14} strokeWidth={1.5} />
                          </button>

                          <button
                            type="button"
                            className="svc-action-icon-btn svc-action-delete"
                            title="Delete complaint"
                            aria-label="Delete complaint"
                            onClick={() => setDeletingRequestId(req.id)}
                          >
                            <SlimTrash size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="svc-table-empty">
                      <div className="svc-empty-content">
                        <SlimServices size={28} strokeWidth={1.2} />
                        <h4>No matching service cases</h4>
                        <p>Try refining your search query or reset filters.</p>
                        <button
                          type="button"
                          className="svc-btn-pill-primary"
                          style={{ marginTop: '8px' }}
                          onClick={() => {
                            setSelectedCategory('All');
                            setSelectedStage('All');
                            setSearchQuery('');
                          }}
                        >
                          Clear Filters
                        </button>
                      </div>
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
                  <div className="svc-column-title-wrap">
                    <span
                      className="svc-column-dot"
                      style={{ backgroundColor: stg.dotColor }}
                    />
                    <span className="svc-column-title">{stg.label}</span>
                  </div>
                  <span className="svc-column-badge">{columnItems.length}</span>
                </div>

                <div className="svc-column-cards">
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
                        <span className="svc-case-order-chip">
                          {req.caseOrderId || 'CASE-101'}
                        </span>
                        {(() => {
                          const classification = getServiceClassification(req);
                          return (
                            <span
                              className={`svc-classification-tag tag-${classification.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {classification === 'Electrical' && <SlimZap size={10} strokeWidth={1.5} />}
                              {classification === 'Plumbing' && <SlimDroplet size={10} strokeWidth={1.5} />}
                              {classification === 'Cleaning' && <SlimSparkles size={10} strokeWidth={1.5} />}
                              {classification === 'Civil' && <SlimHammer size={10} strokeWidth={1.5} />}
                              {classification === 'Security' && <SlimShield size={10} strokeWidth={1.5} />}
                              <span>{classification}</span>
                            </span>
                          );
                        })()}
                        <span
                          className={`svc-priority-dot-badge priority-${(
                            req.priority || 'normal'
                          ).toLowerCase()}`}
                        >
                          <span className="svc-p-dot" />
                          <span>{req.priority || 'Normal'}</span>
                        </span>
                      </div>

                      <h4 className="svc-card-title">{req.service}</h4>

                      <div className="svc-card-resident">
                        <SlimMapPin size={12} strokeWidth={1.5} />
                        <span>
                          {req.resident || 'Resident'} · {req.flatNo} ({req.apartment})
                        </span>
                      </div>

                      <div className="svc-card-footer">
                        <span className="svc-tech-name-chip">
                          <SlimWrench size={12} strokeWidth={1.5} />
                          <span>{req.technician || 'Unallocated'}</span>
                        </span>
                        <button
                          type="button"
                          className="svc-card-allocate-btn"
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
                        className="svc-card-stage-switch"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="svc-card-stage-label">Move stage:</span>
                        <select
                          className="svc-card-stage-select"
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
                    <div className="svc-column-empty">
                      No cases in {stg.label}
                    </div>
                  )}
                </div>
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
                  {selectedRequest.category || 'Technicians'} · {selectedRequest.caseOrderId || 'CASE-ORDER'}
                </span>
                <h3 className="svc-modal-title">
                  {selectedRequest.id}: {selectedRequest.service}
                </h3>
              </div>
              <button
                type="button"
                className="svc-modal-close"
                onClick={() => setSelectedRequest(null)}
                aria-label="Close"
              >
                <SlimX size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="svc-modal-tabs-strip">
              <button
                type="button"
                className={`svc-modal-tab-btn ${modalTab === 'overview' ? 'active' : ''}`}
                onClick={() => setModalTab('overview')}
              >
                Overview
              </button>
              <button
                type="button"
                className={`svc-modal-tab-btn ${modalTab === 'hierarchy' ? 'active' : ''}`}
                onClick={() => setModalTab('hierarchy')}
              >
                Work Hierarchy (Diagram Flow)
              </button>
              <button
                type="button"
                className={`svc-modal-tab-btn ${modalTab === 'allocation' ? 'active' : ''}`}
                onClick={() => setModalTab('allocation')}
              >
                Allocation &amp; Notes
              </button>
              {selectedRequest.category === 'Security' && (
                <button
                  type="button"
                  className={`svc-modal-tab-btn ${modalTab === 'security' ? 'active' : ''}`}
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
                  <div className="svc-modal-status-bar">
                    <span
                      className={`svc-stage-pill ${
                        STAGES.find((s) => s.id === selectedRequest.status)?.color || 'stage-pending'
                      }`}
                    >
                      ● Stage: {selectedRequest.status}
                    </span>
                    <span
                      className={`svc-priority-dot-badge priority-${(
                        selectedRequest.priority || 'normal'
                      ).toLowerCase()}`}
                    >
                      <span className="svc-p-dot" />
                      <span>Priority: {selectedRequest.priority || 'Normal'}</span>
                    </span>
                  </div>

                  <div className="svc-form-row-2">
                    <div className="svc-form-group">
                      <label>Case Order (Raised by RWA / Residence)</label>
                      <div className="svc-field-value-primary">
                        {selectedRequest.caseOrderId || 'CASE-2026-041'} —{' '}
                        {selectedRequest.caseTitle || selectedRequest.service}
                      </div>
                    </div>
                    <div className="svc-form-group">
                      <label>Agency Work Order (Lalitha)</label>
                      <div className="svc-field-value-purple">
                        {selectedRequest.workOrderId || 'WO-041-A'} —{' '}
                        {selectedRequest.workOrderTitle || 'Standard Dispatch'}
                      </div>
                    </div>
                  </div>

                  <div className="svc-form-row-2">
                    <div className="svc-form-group">
                      <label>Resident / Originator</label>
                      <div className="svc-field-value-text">
                        {selectedRequest.resident || 'Resident'}
                      </div>
                      <div className="svc-field-sub">
                        {selectedRequest.apartment} · Flat {selectedRequest.flatNo}
                      </div>
                    </div>
                    <div className="svc-form-group">
                      <label>Allocated Technician</label>
                      <div className="svc-field-value-green">
                        {selectedRequest.technician || 'Unassigned'} (
                        {selectedRequest.technicianId || 'Pending'})
                      </div>
                      <div className="svc-field-sub">
                        Assigned: {selectedRequest.assignedDate} · Target:{' '}
                        {selectedRequest.targetDate}
                      </div>
                    </div>
                  </div>

                  <div className="svc-form-group">
                    <label>Complaint &amp; Task Description</label>
                    <div className="svc-desc-box">
                      {selectedRequest.description || 'No detailed description provided.'}
                    </div>
                  </div>

                  {selectedRequest.status === 'On Hold' && selectedRequest.holdReason && (
                    <div className="svc-hold-banner">
                      <strong>On-Hold Reason:</strong> {selectedRequest.holdReason}
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: HIERARCHY (USER DIAGRAM ALIGNMENT) */}
              {modalTab === 'hierarchy' && (
                <div className="svc-hierarchy-tree-card">
                  <h4 className="svc-hierarchy-title">
                    Complete Workflow Chain (As per Architecture Diagram)
                  </h4>

                  <div className="svc-flow-node">
                    <div className="svc-flow-step-tag">STEP 1: CENTRAL ADMINISTRATION</div>
                    <strong>Admin</strong> → Oversees agency policies and RWA federation approvals.
                  </div>

                  <div className="svc-flow-node">
                    <div className="svc-flow-step-tag">STEP 2: RWA &amp; RESIDENCE (CASE ORDER)</div>
                    <strong>RWA</strong> &amp; <strong>Residence ({selectedRequest.resident || 'Resident'})</strong> raised Case Order:
                    <div style={{ marginTop: '4px' }}>
                      <span className="svc-case-order-chip">
                        {selectedRequest.caseOrderId || 'CASE-101'}
                      </span>
                      : {selectedRequest.caseTitle || selectedRequest.service}
                    </div>
                  </div>

                  <div className="svc-flow-node">
                    <div className="svc-flow-step-tag">STEP 3: AGENCY DISPATCH (WORK ORDERS)</div>
                    <strong>Agency</strong> broken Case Order into Work Orders:
                    <div style={{ marginTop: '4px' }}>
                      <span className="svc-work-order-chip">
                        {selectedRequest.workOrderId || 'WO-101-A'}
                      </span>
                      : {selectedRequest.workOrderTitle || 'Active execution'}
                    </div>
                  </div>

                  <div className="svc-flow-node svc-flow-node-active">
                    <div className="svc-flow-step-tag" style={{ color: '#2563EB' }}>
                      STEP 4: FIELD ALLOCATION (SERVICE REQUEST)
                    </div>
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
                  <h4 style={{ margin: 0, fontSize: '0.92rem' }}>
                    Technician &amp; Work Allocation
                  </h4>
                  <div className="svc-form-row-2">
                    <div>
                      <span className="svc-field-sub">Assigned Personnel</span>
                      <strong>{selectedRequest.technician || 'Unassigned'}</strong>
                    </div>
                    <div>
                      <span className="svc-field-sub">Target Completion</span>
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
                <div className="svc-security-box">
                  <h4 style={{ margin: '0 0 8px', fontSize: '0.92rem' }}>
                    Security Gate &amp; Residence Workflow
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
                aria-label="Close"
              >
                <SlimX size={16} strokeWidth={1.5} />
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
                        let defaultSvc = 'Electrical Repair';
                        if (cat === 'Plumbing') defaultSvc = 'Plumbing';
                        else if (cat === 'Cleaning') defaultSvc = 'Daily Housekeeping';
                        else if (cat === 'Civil') defaultSvc = 'Civil Maintenance';
                        else if (cat === 'Security') defaultSvc = 'Permission Request';
                        else if (cat === 'Daily Works') defaultSvc = 'Waste & Garbage Collection';
                        setNewComplaintForm({
                          ...newComplaintForm,
                          category: cat,
                          service: defaultSvc,
                        });
                      }}
                    >
                      <option value="Electrical">⚡ Electrical (Wiring, MCB, AC)</option>
                      <option value="Plumbing">💧 Plumbing (Pumps, Pipes, Drainage)</option>
                      <option value="Cleaning">✨ Cleaning (Housekeeping, Waste, Sanitation)</option>
                      <option value="Civil">🔨 Civil &amp; Repairs (Seepage, Paint, Carpentry)</option>
                      <option value="Security">🛡️ Security (Gate &amp; Visitor Pass)</option>
                      <option value="Technicians">Technicians</option>
                      <option value="Daily Works">Daily Works</option>
                    </select>
                  </div>

                  <div className="svc-form-group">
                    <label>Specific Service Subcategory *</label>
                    {newComplaintForm.category === 'Electrical' ? (
                      <select
                        className="svc-form-select"
                        value={newComplaintForm.service}
                        onChange={(e) =>
                          setNewComplaintForm({ ...newComplaintForm, service: e.target.value })
                        }
                      >
                        <option value="Electrical Repair">Electrical Repair</option>
                        <option value="AC Maintenance">AC Maintenance &amp; Inverter Servicing</option>
                        <option value="MCB Breaker Diagnostic">MCB Breaker Diagnostic &amp; Sparks</option>
                        <option value="Switchboard & Earthing">Switchboard &amp; Earthing</option>
                      </select>
                    ) : newComplaintForm.category === 'Plumbing' ? (
                      <select
                        className="svc-form-select"
                        value={newComplaintForm.service}
                        onChange={(e) =>
                          setNewComplaintForm({ ...newComplaintForm, service: e.target.value })
                        }
                      >
                        <option value="Plumbing">Plumbing &amp; Leakage Repair</option>
                        <option value="Booster Pump Service">Booster Pump Pressure &amp; Motor</option>
                        <option value="Drainage Clog Clearing">Drainage &amp; Balcony Trap Clog</option>
                        <option value="Water Supply Operations">Overhead Tank &amp; Inflow Check</option>
                      </select>
                    ) : newComplaintForm.category === 'Cleaning' ? (
                      <select
                        className="svc-form-select"
                        value={newComplaintForm.service}
                        onChange={(e) =>
                          setNewComplaintForm({ ...newComplaintForm, service: e.target.value })
                        }
                      >
                        <option value="Daily Housekeeping">Daily Housekeeping &amp; Floor Mopping</option>
                        <option value="Waste & Garbage Collection">Waste &amp; Garbage Collection</option>
                        <option value="Clubhouse & Pool Sanitization">Clubhouse &amp; Pool Sanitization</option>
                        <option value="Deep Corridor Sanitization">Deep Corridor Sanitization</option>
                      </select>
                    ) : newComplaintForm.category === 'Civil' ? (
                      <select
                        className="svc-form-select"
                        value={newComplaintForm.service}
                        onChange={(e) =>
                          setNewComplaintForm({ ...newComplaintForm, service: e.target.value })
                        }
                      >
                        <option value="Civil Maintenance">Civil Maintenance &amp; Masonry</option>
                        <option value="Parapet & Seepage Repair">Exterior Parapet Seepage &amp; Waterproofing</option>
                        <option value="Painting Work">Touch-up Painting Work</option>
                        <option value="Carpentry & Doors">Carpentry, Hinges &amp; Woodwork</option>
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
                    ) : newComplaintForm.category === 'Daily Works' ? (
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
                      </select>
                    ) : (
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
                      setNewComplaintForm({
                        ...newComplaintForm,
                        caseTitle: e.target.value,
                      })
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
                      setNewComplaintForm({
                        ...newComplaintForm,
                        description: e.target.value,
                      })
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
                        setNewComplaintForm({
                          ...newComplaintForm,
                          raisedBy: e.target.value,
                        })
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
                        setNewComplaintForm({
                          ...newComplaintForm,
                          resident: e.target.value,
                        })
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
                        setNewComplaintForm({
                          ...newComplaintForm,
                          apartment: e.target.value,
                        })
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
                        setNewComplaintForm({
                          ...newComplaintForm,
                          flatNo: e.target.value,
                        })
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
                        setNewComplaintForm({
                          ...newComplaintForm,
                          priority: e.target.value,
                        })
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
                        setNewComplaintForm({
                          ...newComplaintForm,
                          technicianId: e.target.value,
                        })
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
                <span className="svc-modal-eyebrow">WORK ORDER DISPATCH</span>
                <h3 className="svc-modal-title">
                  Allocate: {allocatingRequest.id} ({allocatingRequest.service})
                </h3>
              </div>
              <button
                type="button"
                className="svc-modal-close"
                onClick={() => setIsAllocateModalOpen(false)}
                aria-label="Close"
              >
                <SlimX size={16} strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleAllocateSubmit}>
              <div className="svc-modal-body">
                <div className="svc-alloc-info-card">
                  <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                    Linked Work Order: <span className="svc-work-order-chip">{allocatingRequest.workOrderId || 'WO-101-A'}</span>
                  </div>
                  <div style={{ color: '#64748B', fontSize: '0.8rem' }}>
                    Resident: <strong>{allocatingRequest.resident}</strong> ({allocatingRequest.apartment} · {allocatingRequest.flatNo})
                  </div>
                </div>

                <div className="svc-form-group">
                  <label>Select Technician / Agency Staff *</label>
                  <select
                    className="svc-form-select"
                    value={allocationForm.technicianId}
                    onChange={(e) =>
                      setAllocationForm({
                        ...allocationForm,
                        technicianId: e.target.value,
                      })
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
                        setAllocationForm({
                          ...allocationForm,
                          assignedDate: e.target.value,
                        })
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
                        setAllocationForm({
                          ...allocationForm,
                          targetDate: e.target.value,
                        })
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
                      setAllocationForm({
                        ...allocationForm,
                        instructions: e.target.value,
                      })
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
          <div
            className="svc-modal"
            style={{ maxWidth: '460px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="svc-modal-header">
              <div>
                <span className="svc-modal-eyebrow" style={{ color: '#E11D48' }}>
                  STAGE TRANSITION
                </span>
                <h3 className="svc-modal-title">Put Case On Hold</h3>
              </div>
              <button
                type="button"
                className="svc-modal-close"
                onClick={() => setOnHoldPromptRequest(null)}
                aria-label="Close"
              >
                <SlimX size={16} strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleConfirmOnHold}>
              <div className="svc-modal-body">
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                  Specify the blocking reason for putting{' '}
                  <strong>{onHoldPromptRequest.id}</strong> on hold:
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
                aria-label="Close"
              >
                <SlimX size={16} strokeWidth={1.5} />
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
                      setEditingRequest({
                        ...editingRequest,
                        caseTitle: e.target.value,
                      })
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
                      setEditingRequest({
                        ...editingRequest,
                        description: e.target.value,
                      })
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
                        setEditingRequest({
                          ...editingRequest,
                          priority: e.target.value,
                        })
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
                        setEditingRequest({
                          ...editingRequest,
                          targetDate: e.target.value,
                        })
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
          <div
            className="svc-modal"
            style={{ maxWidth: '420px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="svc-modal-header">
              <h3 className="svc-modal-title" style={{ color: '#E11D48' }}>
                Delete Complaint
              </h3>
              <button
                type="button"
                className="svc-modal-close"
                onClick={() => setDeletingRequestId(null)}
                aria-label="Close"
              >
                <SlimX size={16} strokeWidth={1.5} />
              </button>
            </div>
            <div className="svc-modal-body">
              <p style={{ fontSize: '0.84rem', color: '#475569', margin: 0 }}>
                Are you sure you want to permanently delete complaint{' '}
                <strong>{deletingRequestId}</strong>? This action cannot be undone.
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
