import React, { useMemo, useState } from 'react';
import './Properties.css';
import suryaHeightsImg from '../assets/surya heights.jpg';
import loginBg from '../assets/login-bg.jpg';
import sunriseImg from '../assets/sunrie.jpg';
import skylineImg from '../assets/skyline.jpg';

const initialProperties = [
  {
    id: 1,
    name: 'Surya Enclave',
    location: 'Hyderabad, Telangana',
    type: 'Gated Community',
    units: 250,
    pending: 12,
    technicians: 8,
    manager: 'Ravi Kumar',
    phone: '+91 98765 43210',
    email: 'manager@zivion.example',
    status: 'Active',
    description: 'Residential community with 24/7 power backup and security.',
    image: suryaHeightsImg,
  },
  {
    id: 2,
    name: 'Golden Orbit',
    location: 'Hyderabad, Telangana',
    type: 'Apartment',
    units: 120,
    pending: 5,
    technicians: 4,
    manager: 'vishwa',
    phone: '+91 98765 12345',
    email: 'manager@greenvalley.example',
    status: 'Active',
    description: 'Multi-block apartment complex with dedicated maintenance support.',
    image: loginBg,
  },
  {
    id: 3,
    name: 'Sunrise Heights',
    location: 'Hyderabad, Telangana',
    type: 'Residential Community',
    units: 180,
    pending: 3,
    technicians: 6,
    manager: 'arya',
    phone: '+91 98765 67890',
    email: 'manager@sunrise.example',
    status: 'Active',
    description: 'Residential tower with shared facilities and dedicated agency staff.',
    image: sunriseImg,
  },

  {
    id: 4,
    name: 'SKYLINE HOMES',
    location: 'Hyderabad, Telangana',
    type: 'Residential Community',
    units: 50,
    pending: 23,
    technicians: 16,
    manager: 'Arjun',
    phone: '+91 98765 67870',
    email: 'manager@sunrise.example',
    status: 'Active',
    description: 'Residential tower with shared facilities and dedicated agency staff.',
    image: skylineImg,
  },

];

export const apartmentNames = initialProperties.map((property) => property.name);

const parseAgencyNames = (value = '') =>
  Array.from(new Set(value.split(',').map((name) => name.trim()).filter(Boolean)));

const emptyProperty = {
  name: '',
  location: '',
  type: 'Gated Community',
  units: '',
  pending: 0,
  technicians: 0,
  manager: '',
  phone: '',
  email: '',
  status: 'Active',
  description: '',
  agencies: '',
  image: '',
};

function Properties({ agencyAssignments, onAgencyAssignmentsChange }) {
  const [properties, setProperties] = useState(initialProperties);
  const [search, setSearch] = useState('');
  const [apartmentFilter, setApartmentFilter] = useState('All Apartments');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [modal, setModal] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [form, setForm] = useState(emptyProperty);
  const [error, setError] = useState('');

  const totalUnits = useMemo(
    () => properties.reduce((sum, property) => sum + Number(property.units || 0), 0),
    [properties]
  );

  const totalPending = useMemo(
    () => properties.reduce((sum, property) => sum + Number(property.pending || 0), 0),
    [properties]
  );

  const activeCount = useMemo(
    () => properties.filter((p) => p.status === 'Active').length,
    [properties]
  );

  const apartmentNames = useMemo(() => {
    return Array.from(new Set(properties.map((p) => p.name)));
  }, [properties]);

  const filteredProperties = useMemo(() => {
    const term = search.trim().toLowerCase();

    return properties.filter((property) => {
      const matchesSearch =
        !term ||
        property.name.toLowerCase().includes(term) ||
        property.location.toLowerCase().includes(term) ||
        property.manager.toLowerCase().includes(term);

      const matchesApartment =
        apartmentFilter === 'All Apartments' || property.name === apartmentFilter;

      const matchesStatus =
        statusFilter === 'All Status' || property.status === statusFilter;

      return matchesSearch && matchesApartment && matchesStatus;
    });
  }, [properties, search, apartmentFilter, statusFilter]);

  const openAddModal = () => {
    setForm(emptyProperty);
    setError('');
    setModal('add');
  };

  const openEditModal = (property) => {
    setSelectedProperty(property);
    setForm({
      ...property,
      units: String(property.units),
      agencies: (agencyAssignments[property.name] || []).join(', '),
    });
    setError('');
    setModal('edit');
  };

  const openDetails = (property) => {
    setSelectedProperty(property);
    setModal('view');
  };

  const closeModal = () => {
    setModal(null);
    setSelectedProperty(null);
    setError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.location.trim() ||
      !form.manager.trim() ||
      !form.units ||
      Number(form.units) < 1
    ) {
      setError('Please provide property name, location, manager, and valid unit count.');
      return;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid manager email address.');
      return;
    }

    if (modal === 'add') {
      const newProperty = {
        ...form,
        id: Date.now(),
        units: Number(form.units),
        pending: 0,
        technicians: 0,
        image:
          form.image ||
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=700&q=80',
      };
      setProperties((current) => [newProperty, ...current]);
      onAgencyAssignmentsChange((current) => ({
        ...current,
        [newProperty.name]: parseAgencyNames(form.agencies),
      }));
    } else {
      setProperties((current) =>
        current.map((property) =>
          property.id === selectedProperty.id
            ? {
              ...property,
              ...form,
              units: Number(form.units),
            }
            : property
        )
      );
      onAgencyAssignmentsChange((current) => {
        const updated = { ...current };
        if (selectedProperty.name !== form.name) {
          delete updated[selectedProperty.name];
        }
        updated[form.name] = parseAgencyNames(form.agencies);
        return updated;
      });
    }

    closeModal();
  };

  return (
    <div className="page-content properties-page">
      {/* Header */}
      <div className="page-heading">
        <div>
          <h1>Properties</h1>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={openAddModal}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add Property</span>
        </button>
      </div>

      {/* Summary KPI Cards: Icon, Name & Count */}
      <div className="property-stats">
        <div className="property-stat-card">
          <div className="property-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="9" y1="6" x2="9" y2="6.01" />
              <line x1="15" y1="6" x2="15" y2="6.01" />
              <line x1="9" y1="10" x2="9" y2="10.01" />
              <line x1="15" y1="10" x2="15" y2="10.01" />
              <line x1="9" y1="14" x2="9" y2="14.01" />
              <line x1="15" y1="14" x2="15" y2="14.01" />
              <line x1="9" y1="18" x2="15" y2="18" />
            </svg>
          </div>
          <div className="property-stat-info">
            <span className="property-stat-label">Total Properties</span>
            <h2 className="property-stat-count">{properties.length}</h2>
          </div>
        </div>

        <div className="property-stat-card">
          <div className="property-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="property-stat-info">
            <span className="property-stat-label">Residential Units</span>
            <h2 className="property-stat-count">{totalUnits.toLocaleString()}</h2>
          </div>
        </div>

        <div className="property-stat-card">
          <div className="property-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="property-stat-info">
            <span className="property-stat-label">Active Properties</span>
            <h2 className="property-stat-count">{activeCount}</h2>
          </div>
        </div>

        <div className="property-stat-card">
          <div className="property-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="property-stat-info">
            <span className="property-stat-label">Pending Requests</span>
            <h2 className="property-stat-count">{totalPending}</h2>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <section className="content-card property-workspace">
        {/* Toolbar */}
        <div className="property-toolbar">
          <div className="property-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search properties"
            />
          </div>

          <select
            className="property-select"
            value={apartmentFilter}
            onChange={(e) => setApartmentFilter(e.target.value)}
            aria-label="Filter by apartment name"
          >
            <option value="All Apartments">All Apartments</option>
            {apartmentNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
            className="property-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by property status"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Property Count Header */}
        <div className="property-list-heading">
          <span className="property-result-count">
            {filteredProperties.length} Properties
          </span>
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 ? (
          <div className="property-empty-state">
            <div className="property-empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3>No Properties Found</h3>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setSearch('');
                setApartmentFilter('All Apartments');
                setStatusFilter('All Status');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Modern Small Properties Grid with Separate Card Themes */
          <div className="property-grid">
            {filteredProperties.map((property, index) => {
              const themeClass = `theme-${(index % 4) + 1}`;
              return (
                <article className={`property-card ${themeClass}`} key={property.id}>
                  <div className="card-top-stripe" />
                  <div className="property-image-wrap">
                    <img
                      src={property.image || loginBg}
                      alt={property.name}
                      className="property-image"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = loginBg;
                      }}
                    />
                    <span
                      className={`status-badge property-card-badge ${
                        property.status === 'Active' ? 'status-completed' : 'status-pending'
                      }`}
                    >
                      {property.status}
                    </span>
                    <span className="card-badge-id">#{property.id}</span>
                  </div>

                  <div className="property-main-info">
                    <h3 className="property-title">{property.name}</h3>

                    <div className="property-meta-row">
                      <span className="property-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {property.location}
                      </span>
                      <span className="property-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        {property.manager}
                      </span>
                    </div>
                  </div>

                  <div className="property-metrics-compact">
                    <div className="metric-pill">
                      <strong className="metric-val">{property.units}</strong>
                      <span className="metric-lbl">Units</span>
                    </div>
                    <div className="metric-pill alert">
                      <strong className="metric-val">{property.pending}</strong>
                      <span className="metric-lbl">Pending</span>
                    </div>
                    <div className="metric-pill tech">
                      <strong className="metric-val">{property.technicians}</strong>
                      <span className="metric-lbl">Techs</span>
                    </div>
                  </div>

                  <div className="property-actions-compact">
                    <button
                      type="button"
                      className="btn-card-primary"
                      onClick={() => openDetails(property)}
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      className="btn-card-secondary"
                      onClick={() => openEditModal(property)}
                    >
                      Edit
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Modals */}
      {modal && (
        <div
          className="request-modal-overlay"
          onClick={closeModal}
          role="presentation"
        >
          <section
            className="request-modal property-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="property-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="request-modal-header">
              <div>
                <h2 id="property-modal-title">
                  {modal === 'add'
                    ? 'Add Property'
                    : modal === 'edit'
                      ? 'Edit Property'
                      : selectedProperty?.name}
                </h2>
              </div>
              <button
                type="button"
                className="modal-close-button"
                onClick={closeModal}
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {modal === 'view' && selectedProperty ? (
              <div className="property-detail-body">
                <img
                  className="property-detail-image"
                  src={selectedProperty.image || loginBg}
                  alt={selectedProperty.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = loginBg;
                  }}
                />

                <div className="property-detail-grid">
                  <div className="detail-item">
                    <span className="detail-lbl">Type</span>
                    <strong className="detail-val">{selectedProperty.type}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="detail-lbl">Status</span>
                    <strong className="detail-val">{selectedProperty.status}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="detail-lbl">Location</span>
                    <strong className="detail-val">{selectedProperty.location}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="detail-lbl">Units</span>
                    <strong className="detail-val">{selectedProperty.units}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="detail-lbl">Manager</span>
                    <strong className="detail-val">{selectedProperty.manager}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="detail-lbl">Contact</span>
                    <strong className="detail-val">{selectedProperty.phone || '—'}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="detail-lbl">Email</span>
                    <strong className="detail-val">{selectedProperty.email || '—'}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="detail-lbl">Pending Requests</span>
                    <strong className="detail-val">{selectedProperty.pending}</strong>
                  </div>
                </div>

                <div className="property-modal-footer">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => openEditModal(selectedProperty)}
                  >
                    Edit Property
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="property-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Property Name *</label>
                    <input
                      name="name"
                      className="form-input"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Zivion Residency"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Property Type *</label>
                    <select
                      name="type"
                      className="form-select"
                      value={form.type}
                      onChange={handleChange}
                    >
                      <option>Gated Community</option>
                      <option>Apartment</option>
                      <option>Residential Community</option>
                    </select>
                  </div>

                  <div className="form-group full-span">
                    <label>Location *</label>
                    <input
                      name="location"
                      className="form-input"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="City, State"
                      required
                    />
                  </div>

                  <div className="form-group full-span">
                    <label htmlFor="property-agencies">Assigned Agencies</label>
                    <textarea
                      id="property-agencies"
                      name="agencies"
                      className="form-input"
                      value={form.agencies || ''}
                      onChange={handleChange}
                      placeholder="Enter agency names separated by commas"
                      rows="2"
                    />
                    <small>Separate multiple agency names with commas.</small>
                  </div>

                  <div className="form-group">
                    <label>Units *</label>
                    <input
                      name="units"
                      type="number"
                      min="1"
                      className="form-input"
                      value={form.units}
                      onChange={handleChange}
                      placeholder="e.g. 250"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Property Manager *</label>
                    <input
                      name="manager"
                      className="form-input"
                      value={form.manager}
                      onChange={handleChange}
                      placeholder="Manager Name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Manager Phone</label>
                    <input
                      name="phone"
                      type="tel"
                      className="form-input"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91..."
                    />
                  </div>

                  <div className="form-group full-span">
                    <label>Manager Email</label>
                    <input
                      name="email"
                      type="email"
                      className="form-input"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="manager@example.com"
                    />
                  </div>

                  <div className="form-group full-span">
                    <label>Image URL</label>
                    <input
                      name="image"
                      type="url"
                      className="form-input"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {error && (
                  <p className="form-error-msg" role="alert">
                    {error}
                  </p>
                )}

                <div className="property-modal-footer">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    {modal === 'add' ? 'Add Property' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default Properties;
