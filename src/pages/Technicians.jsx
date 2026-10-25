import React, { useState, useMemo, useEffect, useCallback } from 'react';
import './Technicians.css';
import TableScrollSlider from '../components/TableScrollSlider';
import { TechniciansIcon, ServicesIcon } from '../components/AppIcons';
import {
  SlimEye,
  SlimPencil,
  SlimTrash,
  SlimPlus,
  SlimX,
  SlimSearch,
  SlimAlertCircle,
  SlimMapPin,
} from '../components/SlimIcons';

const SKILL_OPTIONS = [
  'Electrical & AC',
  'Plumbing & Civil',
  'Civil Maintenance',
  'Housekeeping & Sanitation',
  'Gate & Visitor Control',
  'Elevator & Safety',
  'Carpentry & Painting',
  'General Maintenance',
];

const APARTMENT_OPTIONS = [
  'All Communities',
  'Surya Enclave',
  'Golden Orbit',
  'Sunrise Heights',
  'SKYLINE HOMES',
  'Silver Oak Enclave',
];

function Technicians({ technicians = [], setTechnicians, requests = [] }) {
  // Support both controlled state from parent and internal fallback state
  const [internalTechnicians, setInternalTechnicians] = useState(technicians);

  useEffect(() => {
    setInternalTechnicians(technicians);
  }, [technicians]);

  const activeTechniciansList = setTechnicians ? technicians : internalTechnicians;

  const updateList = (updated) => {
    setInternalTechnicians(updated);
    if (setTechnicians) {
      setTechnicians(updated);
    }
  };

  // ── Filters & Search ───────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');

  // ── Modals State ──────────────────────────────────────────────────────────
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingTechnician, setViewingTechnician] = useState(null);
  const [editingTechnician, setEditingTechnician] = useState(null);
  const [deletingTechnician, setDeletingTechnician] = useState(null);

  // ── Forms State ───────────────────────────────────────────────────────────
  const [addForm, setAddForm] = useState({
    name: '',
    skill: 'Electrical & AC',
    mobile: '',
    email: '',
    status: 'Available',
    apartment: 'All Communities',
    role: 'Field Specialist',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    skill: '',
    mobile: '',
    email: '',
    status: 'Available',
    apartment: 'All Communities',
    role: '',
  });

  // ── Floating Toast ────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Helper to extract assigned Service Orders for a technician ────────────
  const getAssignedSOs = useCallback((techId, techName) => {
    const list = [];
    requests.forEach((req) => {
      if (req.assignedTechnicians && Array.isArray(req.assignedTechnicians) && req.assignedTechnicians.length > 0) {
        req.assignedTechnicians.forEach((t) => {
          if (t.technicianId === techId || t.name === techName) {
            list.push({
              soId: t.soId,
              workOrderId: req.workOrderId || req.id,
              service: req.service,
              role: t.role || 'Specialist',
              apartment: req.apartment,
              flatNo: req.flatNo,
              status: req.status,
            });
          }
        });
      } else if (req.technicianId === techId || req.technician === techName) {
        const rawWo = req.workOrderId || req.id || 'WO-101';
        const num = rawWo.replace(/[^0-9]/g, '') || '101';
        list.push({
          soId: `SO-${num}-01`,
          workOrderId: rawWo,
          service: req.service,
          role: 'Primary Specialist (Lead)',
          apartment: req.apartment,
          flatNo: req.flatNo,
          status: req.status,
        });
      }
    });
    return list;
  }, [requests]);

  // ── Metrics ───────────────────────────────────────────────────────────────
  const availableCount = activeTechniciansList.filter((item) => item.status === 'Available').length;
  const assignedCount = activeTechniciansList.filter((item) => item.status === 'Assigned').length;
  const totalDispatchedSOs = activeTechniciansList.reduce(
    (acc, t) => acc + getAssignedSOs(t.id, t.name).length,
    0
  );

  const summaryCards = [
    {
      title: 'Total Technicians',
      value: activeTechniciansList.length,
      icon: <TechniciansIcon size={20} />,
    },
    {
      title: 'Available Specialists',
      value: availableCount,
      icon: <TechniciansIcon size={20} />,
    },
    {
      title: 'Assigned on Work',
      value: assignedCount,
      icon: <TechniciansIcon size={20} />,
    },
    {
      title: 'Dispatched SOs (so1/so2/so3)',
      value: totalDispatchedSOs,
      icon: <ServicesIcon size={20} />,
    },
  ];

  // ── Filtered Technicians ──────────────────────────────────────────────────
  const filteredTechnicians = useMemo(() => {
    return activeTechniciansList.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const sos = getAssignedSOs(t.id, t.name);
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        (t.skill && t.skill.toLowerCase().includes(q)) ||
        (t.mobile && t.mobile.includes(q)) ||
        sos.some(
          (s) =>
            s.soId.toLowerCase().includes(q) ||
            s.workOrderId.toLowerCase().includes(q) ||
            s.service.toLowerCase().includes(q)
        );

      const matchesStatus =
        selectedStatusFilter === 'All' || t.status === selectedStatusFilter;

      const matchesSkill =
        selectedSkillFilter === 'All' ||
        (t.skill && t.skill.toLowerCase().includes(selectedSkillFilter.toLowerCase()));

      return matchesSearch && matchesStatus && matchesSkill;
    });
  }, [activeTechniciansList, searchQuery, selectedStatusFilter, selectedSkillFilter, getAssignedSOs]);

  // ── CRUD 1: CREATE (Add New Technician) ───────────────────────────────────
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.mobile.trim()) {
      showToast('⚠️ Please provide technician name and mobile number');
      return;
    }

    // Auto-generate next technician ID
    const nextNum = activeTechniciansList.length + 1;
    const prefix = addForm.skill.includes('Security')
      ? 'SEC'
      : addForm.skill.includes('Housekeeping')
      ? 'DAY'
      : 'TECH';
    const newId = `${prefix}-${String(nextNum).padStart(3, '0')}`;

    const newTechnician = {
      id: newId,
      name: addForm.name.trim(),
      skill: addForm.skill,
      mobile: addForm.mobile.trim(),
      email: addForm.email.trim() || `${addForm.name.toLowerCase().replace(/\s+/g, '.')}@agency.bee.com`,
      status: addForm.status,
      apartment: addForm.apartment,
      role: addForm.role || 'Field Specialist',
    };

    updateList([newTechnician, ...activeTechniciansList]);
    setIsAddModalOpen(false);
    setAddForm({
      name: '',
      skill: 'Electrical & AC',
      mobile: '',
      email: '',
      status: 'Available',
      apartment: 'All Communities',
      role: 'Field Specialist',
    });
    showToast(`✓ Added Technician: ${newTechnician.name} (${newId})`);
  };

  // ── CRUD 2: UPDATE (Edit Existing Technician) ─────────────────────────────
  const openEditModal = (technician) => {
    setEditingTechnician(technician);
    setEditForm({
      name: technician.name,
      skill: technician.skill || 'General Maintenance',
      mobile: technician.mobile || '',
      email: technician.email || '',
      status: technician.status || 'Available',
      apartment: technician.apartment || 'All Communities',
      role: technician.role || 'Field Specialist',
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingTechnician) return;

    const updated = activeTechniciansList.map((t) => {
      if (t.id === editingTechnician.id) {
        return {
          ...t,
          name: editForm.name.trim() || t.name,
          skill: editForm.skill,
          mobile: editForm.mobile.trim() || t.mobile,
          email: editForm.email.trim() || t.email,
          status: editForm.status,
          apartment: editForm.apartment,
          role: editForm.role || t.role,
        };
      }
      return t;
    });

    updateList(updated);
    setEditingTechnician(null);
    showToast(`✓ Updated details for: ${editForm.name} (${editingTechnician.id})`);
  };

  // Fast inline status change (e.g. toggle Available <-> Assigned <-> On Leave)
  const handleInlineStatusChange = (techId, newStatus) => {
    const updated = activeTechniciansList.map((t) =>
      t.id === techId ? { ...t, status: newStatus } : t
    );
    updateList(updated);
    showToast(`✓ Updated status to ${newStatus}`);
  };

  // ── CRUD 3: DELETE (Remove Technician) ────────────────────────────────────
  const confirmDelete = () => {
    if (!deletingTechnician) return;
    const updated = activeTechniciansList.filter((t) => t.id !== deletingTechnician.id);
    updateList(updated);
    showToast(`✓ Removed Technician: ${deletingTechnician.name} (${deletingTechnician.id})`);
    setDeletingTechnician(null);
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'T';

  return (
    <div className="page-content tech-page-container">
      {/* ── Page Heading & Controls ────────────────────────────────────────── */}
      <div className="page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TechniciansIcon size={22} style={{ color: '#2563EB' }} />
          <h1>Technicians</h1>
        </div>

        <div className="tech-header-controls">
          <div className="tech-search-wrapper">
            <SlimSearch size={15} className="tech-search-icon" />
            <input
              type="text"
              placeholder="Search by name, ID, skill, or SO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tech-search-input"
            />
          </div>

          <button
            type="button"
            className="tech-add-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <SlimPlus size={15} strokeWidth={2} />
            <span>+ Add Technician</span>
          </button>
        </div>
      </div>

      {/* ── Summary Cards ──────────────────────────────────────────────────── */}
      <div className="overview-grid">
        {summaryCards.map((card) => (
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

      {/* ── Filter Pills Bar ───────────────────────────────────────────────── */}
      <div className="tech-filter-bar">
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginRight: '4px' }}>
          Filter Status:
        </span>
        {['All', 'Available', 'Assigned', 'On Leave'].map((st) => (
          <button
            key={st}
            type="button"
            className={`tech-filter-pill ${selectedStatusFilter === st ? 'active' : ''}`}
            onClick={() => setSelectedStatusFilter(st)}
          >
            <span>{st}</span>
            <span className="tech-filter-pill-count">
              {st === 'All'
                ? activeTechniciansList.length
                : activeTechniciansList.filter((t) => t.status === st).length}
            </span>
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600 }}>Specialization:</span>
          <select
            className="tech-filter-select"
            value={selectedSkillFilter}
            onChange={(e) => setSelectedSkillFilter(e.target.value)}
          >
            <option value="All">All Specializations</option>
            {SKILL_OPTIONS.map((sk) => (
              <option key={sk} value={sk}>
                {sk}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Table Section ──────────────────────────────────────────────────── */}
      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Technician Directory &amp; Assigned Service Orders (SOs)</h2>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Showing {filteredTechnicians.length} of {activeTechniciansList.length} specialists
          </span>
        </div>

        <TableScrollSlider>
          <table className="data-table">
            <thead>
              <tr>
                <th>Technician ID</th>
                <th>Technician Name</th>
                <th>Specialization</th>
                <th>Mobile Number</th>
                <th>Assigned Service Orders (SO IDs)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTechnicians.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                    No technicians found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTechnicians.map((technician) => {
                  const sos = getAssignedSOs(technician.id, technician.name);
                  const statusClass =
                    technician.status === 'Available'
                      ? 'status-available'
                      : technician.status === 'Assigned'
                      ? 'status-assigned'
                      : 'status-on-leave';

                  return (
                    <tr key={technician.id}>
                      <td>
                        <span className="request-id-badge">{technician.id}</span>
                      </td>
                      <td>
                        <div className="resident-avatar-cell">
                          <div className="resident-avatar-circle">
                            {getInitials(technician.name)}
                          </div>
                          <div>
                            <strong>{technician.name}</strong>
                            {technician.apartment && technician.apartment !== 'All Communities' && (
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                📍 {technician.apartment}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="spec-badge">{technician.skill}</span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <TechniciansIcon size={14} style={{ color: '#2563EB' }} />
                          {technician.mobile}
                        </span>
                      </td>
                      <td>
                        {sos.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {sos.map((so, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontSize: '0.78rem',
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    background: idx === 0 ? '#FDF4FF' : '#EEF2FF',
                                    color: idx === 0 ? '#A21CAF' : '#4338CA',
                                    padding: '1px 5px',
                                    borderRadius: '3px',
                                    border: '1px solid currentColor',
                                  }}
                                >
                                  {so.soId}
                                </span>
                                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                                  from <strong>{so.workOrderId}</strong> ({so.role})
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>No active SO</span>
                        )}
                      </td>
                      <td>
                        {/* Quick inline status transition */}
                        <select
                          className={`tech-status-select-inline ${statusClass}`}
                          value={technician.status}
                          onChange={(e) => handleInlineStatusChange(technician.id, e.target.value)}
                          title="Click to toggle status"
                          aria-label={`Status of ${technician.name}`}
                        >
                          <option value="Available">Available</option>
                          <option value="Assigned">Assigned</option>
                          <option value="On Leave">On Leave</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="tech-actions-cell">
                          {/* VIEW PROFILE */}
                          <button
                            type="button"
                            className="tech-action-btn tech-action-view"
                            title="View Specialist Profile"
                            aria-label={`View ${technician.name}`}
                            onClick={() => setViewingTechnician(technician)}
                          >
                            <SlimEye size={15} />
                          </button>

                          {/* EDIT DETAILS */}
                          <button
                            type="button"
                            className="tech-action-btn tech-action-edit"
                            title="Edit Specialist"
                            aria-label={`Edit ${technician.name}`}
                            onClick={() => openEditModal(technician)}
                          >
                            <SlimPencil size={14} />
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            className="tech-action-btn tech-action-delete"
                            title="Delete Specialist"
                            aria-label={`Delete ${technician.name}`}
                            onClick={() => setDeletingTechnician(technician)}
                          >
                            <SlimTrash size={14} />
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

      {/* ── MODAL 1: ADD NEW TECHNICIAN (CREATE) ───────────────────────────── */}
      {isAddModalOpen && (
        <div className="tech-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="tech-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tech-modal-header">
              <div>
                <span className="tech-modal-eyebrow">STAFF ONBOARDING</span>
                <h3 className="tech-modal-title">+ Add Technician / Specialist</h3>
              </div>
              <button
                type="button"
                className="tech-modal-close"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Close"
              >
                <SlimX size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="tech-modal-body">
                <div className="tech-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="tech-form-input"
                    placeholder="e.g. Ramesh Verma"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  />
                </div>

                <div className="tech-form-row-2">
                  <div className="tech-form-group">
                    <label>Specialization / Skill *</label>
                    <select
                      className="tech-form-select"
                      value={addForm.skill}
                      onChange={(e) => setAddForm({ ...addForm, skill: e.target.value })}
                    >
                      {SKILL_OPTIONS.map((sk) => (
                        <option key={sk} value={sk}>
                          {sk}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="tech-form-group">
                    <label>Initial Status</label>
                    <select
                      className="tech-form-select"
                      value={addForm.status}
                      onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="Assigned">Assigned</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                <div className="tech-form-row-2">
                  <div className="tech-form-group">
                    <label>Mobile Number *</label>
                    <input
                      type="text"
                      required
                      className="tech-form-input"
                      placeholder="e.g. 9876500004"
                      value={addForm.mobile}
                      onChange={(e) => setAddForm({ ...addForm, mobile: e.target.value })}
                    />
                  </div>

                  <div className="tech-form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="tech-form-input"
                      placeholder="e.g. ramesh@agency.bee.com"
                      value={addForm.email}
                      onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="tech-form-row-2">
                  <div className="tech-form-group">
                    <label>Coverage Property</label>
                    <select
                      className="tech-form-select"
                      value={addForm.apartment}
                      onChange={(e) => setAddForm({ ...addForm, apartment: e.target.value })}
                    >
                      {APARTMENT_OPTIONS.map((ap) => (
                        <option key={ap} value={ap}>
                          {ap}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="tech-form-group">
                    <label>Role Directive</label>
                    <input
                      type="text"
                      className="tech-form-input"
                      placeholder="e.g. Senior Field Specialist"
                      value={addForm.role}
                      onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="tech-modal-footer">
                <button
                  type="button"
                  className="tech-btn-pill-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="tech-btn-pill-primary">
                  Save &amp; Onboard Specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: EDIT TECHNICIAN (UPDATE) ──────────────────────────────── */}
      {editingTechnician && (
        <div className="tech-modal-backdrop" onClick={() => setEditingTechnician(null)}>
          <div className="tech-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tech-modal-header">
              <div>
                <span className="tech-modal-eyebrow">UPDATE SPECIALIST</span>
                <h3 className="tech-modal-title">
                  Edit: {editingTechnician.name} ({editingTechnician.id})
                </h3>
              </div>
              <button
                type="button"
                className="tech-modal-close"
                onClick={() => setEditingTechnician(null)}
                aria-label="Close"
              >
                <SlimX size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="tech-modal-body">
                <div className="tech-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="tech-form-input"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>

                <div className="tech-form-row-2">
                  <div className="tech-form-group">
                    <label>Specialization / Skill *</label>
                    <select
                      className="tech-form-select"
                      value={editForm.skill}
                      onChange={(e) => setEditForm({ ...editForm, skill: e.target.value })}
                    >
                      {SKILL_OPTIONS.map((sk) => (
                        <option key={sk} value={sk}>
                          {sk}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="tech-form-group">
                    <label>Work Status</label>
                    <select
                      className="tech-form-select"
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="Assigned">Assigned</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                <div className="tech-form-row-2">
                  <div className="tech-form-group">
                    <label>Mobile Number *</label>
                    <input
                      type="text"
                      required
                      className="tech-form-input"
                      value={editForm.mobile}
                      onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    />
                  </div>

                  <div className="tech-form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="tech-form-input"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="tech-form-row-2">
                  <div className="tech-form-group">
                    <label>Coverage Property</label>
                    <select
                      className="tech-form-select"
                      value={editForm.apartment}
                      onChange={(e) => setEditForm({ ...editForm, apartment: e.target.value })}
                    >
                      {APARTMENT_OPTIONS.map((ap) => (
                        <option key={ap} value={ap}>
                          {ap}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="tech-form-group">
                    <label>Role Directive</label>
                    <input
                      type="text"
                      className="tech-form-input"
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="tech-modal-footer">
                <button
                  type="button"
                  className="tech-btn-pill-secondary"
                  onClick={() => setEditingTechnician(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="tech-btn-pill-primary">
                  Update Specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: VIEW TECHNICIAN PROFILE (READ) ────────────────────────── */}
      {viewingTechnician && (
        <div className="tech-modal-backdrop" onClick={() => setViewingTechnician(null)}>
          <div className="tech-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tech-modal-header">
              <div>
                <span className="tech-modal-eyebrow">TECHNICIAN DOSSIER</span>
                <h3 className="tech-modal-title">{viewingTechnician.name}</h3>
              </div>
              <button
                type="button"
                className="tech-modal-close"
                onClick={() => setViewingTechnician(null)}
                aria-label="Close"
              >
                <SlimX size={16} />
              </button>
            </div>

            <div className="tech-modal-body">
              <div className="tech-view-profile-hero">
                <div className="tech-avatar-xl">
                  {getInitials(viewingTechnician.name)}
                </div>
                <div className="tech-hero-info">
                  <h3>{viewingTechnician.name}</h3>
                  <div>
                    <span className="tech-hero-id-tag">{viewingTechnician.id}</span>
                    <span className="spec-badge">{viewingTechnician.skill}</span>
                  </div>
                  <div className="tech-hero-skill" style={{ marginTop: '6px' }}>
                    Status:{' '}
                    <strong style={{ color: viewingTechnician.status === 'Available' ? '#15803D' : '#1D4ED8' }}>
                      ● {viewingTechnician.status}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="tech-form-row-2">
                <div className="tech-form-group">
                  <label>Contact Phone</label>
                  <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.86rem' }}>
                    {viewingTechnician.mobile}
                  </div>
                </div>

                <div className="tech-form-group">
                  <label>Official Email</label>
                  <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.86rem' }}>
                    {viewingTechnician.email || `${viewingTechnician.id.toLowerCase()}@agency.bee.com`}
                  </div>
                </div>
              </div>

              <div className="tech-form-group">
                <label>Assigned Property Branch</label>
                <div style={{ fontSize: '0.84rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <SlimMapPin size={13} style={{ color: '#2563EB' }} />
                  {viewingTechnician.apartment || 'All Communities'}
                </div>
              </div>

              {/* Assigned Service Orders */}
              <div className="tech-form-group">
                <label>
                  Active Service Orders ({getAssignedSOs(viewingTechnician.id, viewingTechnician.name).length})
                </label>
                {(() => {
                  const sos = getAssignedSOs(viewingTechnician.id, viewingTechnician.name);
                  if (sos.length === 0) {
                    return (
                      <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: '#94A3B8' }}>
                        No active service orders currently assigned to this specialist.
                      </div>
                    );
                  }
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {sos.map((so, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontFamily: 'monospace',
                                  fontWeight: 700,
                                  background: idx === 0 ? '#FDF4FF' : '#EEF2FF',
                                  color: idx === 0 ? '#A21CAF' : '#4338CA',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  border: '1px solid currentColor',
                                }}
                              >
                                {so.soId}
                              </span>
                              <strong style={{ fontSize: '0.82rem', color: '#0F172A' }}>{so.service}</strong>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                              Parent WO: <strong>{so.workOrderId}</strong> · {so.apartment} ({so.flatNo})
                            </div>
                          </div>
                          <span
                            className="status-badge status-progress"
                            style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                          >
                            {so.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="tech-modal-footer">
              <button
                type="button"
                className="tech-btn-pill-secondary"
                onClick={() => setViewingTechnician(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="tech-btn-pill-primary"
                onClick={() => {
                  const t = viewingTechnician;
                  setViewingTechnician(null);
                  openEditModal(t);
                }}
              >
                Edit Specialist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: DELETE CONFIRMATION (DELETE) ──────────────────────────── */}
      {deletingTechnician && (
        <div className="tech-modal-backdrop" onClick={() => setDeletingTechnician(null)}>
          <div className="tech-modal" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="tech-modal-header">
              <div>
                <span className="tech-modal-eyebrow" style={{ color: '#E11D48' }}>
                  DEREGISTER STAFF
                </span>
                <h3 className="tech-modal-title">Delete Specialist</h3>
              </div>
              <button
                type="button"
                className="tech-modal-close"
                onClick={() => setDeletingTechnician(null)}
                aria-label="Close"
              >
                <SlimX size={16} />
              </button>
            </div>

            <div className="tech-modal-body">
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
                Are you sure you want to remove specialist{' '}
                <strong>{deletingTechnician.name}</strong> ({deletingTechnician.id})?
              </p>

              {getAssignedSOs(deletingTechnician.id, deletingTechnician.name).length > 0 && (
                <div
                  style={{
                    background: '#FFF1F2',
                    border: '1px solid #FECDD3',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    color: '#9F1239',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  <SlimAlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Warning:</strong> This specialist currently has{' '}
                    <strong>
                      {getAssignedSOs(deletingTechnician.id, deletingTechnician.name).length} active Service Orders
                    </strong>
                    . Deleting will leave those Work Orders unfulfilled until reassigned.
                  </div>
                </div>
              )}
            </div>

            <div className="tech-modal-footer">
              <button
                type="button"
                className="tech-btn-pill-secondary"
                onClick={() => setDeletingTechnician(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="tech-btn-pill-danger"
                onClick={confirmDelete}
              >
                Yes, Remove Specialist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notification ─────────────────────────────────────────────── */}
      {toast && <div className="tech-toast">{toast}</div>}
    </div>
  );
}

export default Technicians;
