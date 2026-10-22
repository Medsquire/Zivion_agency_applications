import React, { useState, useMemo } from 'react';
import './TeamAccess.css';
import { COMMUNITY_TIERS, INITIAL_SOCIETIES } from '../data/propertyHierarchyData';

/* ─── Avatar & Initials Helper ─────────────────────────────────────────── */
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AD';
}

const AVATAR_PALETTE = [
  '#1D4ED8', '#0284C7', '#0F766E', '#D97706',
  '#7C3AED', '#BE185D', '#059669', '#475569',
];

function getAvatarBg(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function AdminAvatar({ name, size = 36, className = '' }) {
  return (
    <div
      className={`ta-avatar-node ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        background: getAvatarBg(name),
      }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

/* ─── Initial Data Generators from Property Hierarchy ───────────────────── */
function buildInitialAdmins() {
  // Level 2: Supervisors
  const supervisors = [
    {
      id: 'sup-1',
      level: 'supervisor',
      name: 'Kavitha Nair',
      role: 'Lead Operations Supervisor',
      scope: 'All Communities (Diamond, Gold, Silver)',
      email: 'kavitha.n@bee.example',
      phone: '+91 98450 77112',
      office: 'Bee Central Operations Hub, Gachibowli',
      status: 'Active',
    },
    {
      id: 'sup-2',
      level: 'supervisor',
      name: 'Rohit Malhotra',
      role: 'Regional Field Supervisor',
      scope: 'Silver & Diamond Communities Cluster',
      email: 'rohit.m@bee.example',
      phone: '+91 98450 77113',
      office: 'Metro West Regional Office, HITEC City',
      status: 'Active',
    },
  ];

  // Level 3: Community Admins
  const communityAdmins = COMMUNITY_TIERS.map((tier) => ({
    id: `com-${tier.id}`,
    level: 'community',
    tierId: tier.id,
    tierName: tier.name,
    tierBadge: tier.tier,
    tierColor: tier.accentColor,
    tierIcon: tier.icon,
    name: tier.communityAdmin?.name || `${tier.tier} Admin`,
    role: tier.communityAdmin?.role || `${tier.tier} Community Lead`,
    email: tier.communityAdmin?.email || `${tier.id}.admin@bee.example`,
    phone: tier.communityAdmin?.phone || '+91 98450 00000',
    office: tier.communityAdmin?.office || `${tier.tier} Regional Headquarters`,
    scope: `${tier.name} (${tier.societyIds.length} Societies)`,
    status: 'Active',
  }));

  // Level 4: Society Admins
  const societyAdmins = INITIAL_SOCIETIES.map((soc) => ({
    id: `soc-${soc.id}`,
    level: 'society',
    societyId: soc.id,
    societyName: soc.name,
    enclaveName: soc.enclaveName,
    communityId: soc.communityId,
    tier: soc.tier,
    location: soc.location,
    towersCount: soc.towers?.length || 0,
    name: soc.societyAdmin?.name || `${soc.name} Admin`,
    role: soc.societyAdmin?.role || 'Society Estate Manager',
    email: soc.societyAdmin?.email || `admin@${soc.id}.example`,
    phone: soc.societyAdmin?.phone || '+91 98765 00000',
    office: soc.societyAdmin?.office || 'Society Clubhouse Office',
    scope: `${soc.name} · ${soc.location}`,
    status: 'Active',
  }));

  // Level 5: Tower Admins
  const towerAdmins = INITIAL_SOCIETIES.flatMap((soc) =>
    (soc.towers || []).map((t) => ({
      id: `tow-${soc.id}-${t.code.toLowerCase()}`,
      level: 'tower',
      societyId: soc.id,
      societyName: soc.name,
      communityId: soc.communityId,
      towerCode: t.code,
      towerName: t.name,
      floors: t.floors,
      totalUnits: t.totalUnits,
      name: t.towerAdmin?.name || `Admin ${t.code}`,
      role: t.towerAdmin?.role || 'Tower Facility Administrator',
      phone: t.towerAdmin?.phone || '+91 97001 00000',
      email: `${soc.id}.tower${t.code.toLowerCase()}@bee.example`,
      shift: t.towerAdmin?.shift || '08:00 AM - 05:00 PM',
      office: `${t.name} Helpdesk, Ground Floor`,
      scope: `${soc.name} · ${t.name}`,
      status: 'Active',
    }))
  );

  return { supervisors, communityAdmins, societyAdmins, towerAdmins };
}

/* ─── Main Team & Access Component ──────────────────────────────────────── */
export default function TeamAccess({ agencyAdmin }) {
  const adminName = agencyAdmin?.fullName || 'John Doe';
  const adminEmail = agencyAdmin?.email || 'john.doe@agency.com';
  const adminPhone = agencyAdmin?.phone || '+91 98450 00001';

  const initialData = useMemo(() => buildInitialAdmins(), []);

  const [supervisors, setSupervisors] = useState(initialData.supervisors);
  const [communityAdmins, setCommunityAdmins] = useState(initialData.communityAdmins);
  const [societyAdmins, setSocietyAdmins] = useState(initialData.societyAdmins);
  const [towerAdmins, setTowerAdmins] = useState(initialData.towerAdmins);

  // Expanded tree states
  const [expandedTiers, setExpandedTiers] = useState({
    diamond: true,
    gold: true,
    silver: true,
  });

  const [expandedSocieties, setExpandedSocieties] = useState({
    skyline: true,
    sunrise: false,
    surya: false,
    'golden-orbit': false,
    'silver-oak': false,
    greenwood: false,
  });

  // Filters & search
  const [levelFilter, setLevelFilter] = useState('all'); // 'all' | 'agency' | 'community' | 'society' | 'tower'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & drawers
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'inspect' | null
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [addLevelType, setAddLevelType] = useState('supervisor');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    office: '',
    scope: '',
    status: 'Active',
    tierId: 'diamond',
    societyId: 'skyline',
    towerCode: 'A',
  });

  /* ─── Toggle Tiers & Societies Expand ────────────────────────────────── */
  const toggleTier = (tierId) => {
    setExpandedTiers((prev) => ({ ...prev, [tierId]: !prev[tierId] }));
  };

  const toggleSociety = (societyId) => {
    setExpandedSocieties((prev) => ({ ...prev, [societyId]: !prev[societyId] }));
  };

  const expandAll = () => {
    setExpandedTiers({ diamond: true, gold: true, silver: true });
    const allSocs = {};
    societyAdmins.forEach((s) => { allSocs[s.societyId] = true; });
    setExpandedSocieties(allSocs);
  };

  const collapseAll = () => {
    setExpandedTiers({ diamond: false, gold: false, silver: false });
    const noSocs = {};
    societyAdmins.forEach((s) => { noSocs[s.societyId] = false; });
    setExpandedSocieties(noSocs);
  };

  /* ─── Toggle Admin Status ────────────────────────────────────────────── */
  const handleToggleStatus = (admin) => {
    const nextStatus = admin.status === 'Active' ? 'Suspended' : 'Active';
    if (admin.level === 'supervisor') {
      setSupervisors((prev) => prev.map((s) => (s.id === admin.id ? { ...s, status: nextStatus } : s)));
    } else if (admin.level === 'community') {
      setCommunityAdmins((prev) => prev.map((c) => (c.id === admin.id ? { ...c, status: nextStatus } : c)));
    } else if (admin.level === 'society') {
      setSocietyAdmins((prev) => prev.map((s) => (s.id === admin.id ? { ...s, status: nextStatus } : s)));
    } else if (admin.level === 'tower') {
      setTowerAdmins((prev) => prev.map((t) => (t.id === admin.id ? { ...t, status: nextStatus } : t)));
    }
  };

  /* ─── Open Modals ────────────────────────────────────────────────────── */
  const handleInspect = (admin) => {
    setSelectedAdmin(admin);
    setActiveModal('inspect');
  };

  const handleOpenEdit = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name || '',
      role: admin.role || '',
      phone: admin.phone || '',
      email: admin.email || '',
      office: admin.office || '',
      scope: admin.scope || '',
      status: admin.status || 'Active',
      tierId: admin.tierId || 'diamond',
      societyId: admin.societyId || 'skyline',
      towerCode: admin.towerCode || 'A',
    });
    setActiveModal('edit');
  };

  const handleOpenAdd = (type = 'supervisor') => {
    setAddLevelType(type);
    setFormData({
      name: '',
      role: type === 'supervisor' ? 'Operations Field Supervisor'
            : type === 'community' ? 'Community Operations Lead'
            : type === 'society' ? 'Society Estate Manager'
            : 'Tower Facility Administrator',
      phone: '',
      email: '',
      office: '',
      scope: '',
      status: 'Active',
      tierId: 'diamond',
      societyId: 'skyline',
      towerCode: 'A',
    });
    setActiveModal('add');
  };

  /* ─── Save Edit ──────────────────────────────────────────────────────── */
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    const updated = {
      ...selectedAdmin,
      name: formData.name,
      role: formData.role,
      phone: formData.phone,
      email: formData.email,
      office: formData.office,
      status: formData.status,
    };

    if (selectedAdmin.level === 'supervisor') {
      setSupervisors((prev) => prev.map((s) => (s.id === selectedAdmin.id ? updated : s)));
    } else if (selectedAdmin.level === 'community') {
      setCommunityAdmins((prev) => prev.map((c) => (c.id === selectedAdmin.id ? updated : c)));
    } else if (selectedAdmin.level === 'society') {
      setSocietyAdmins((prev) => prev.map((s) => (s.id === selectedAdmin.id ? updated : s)));
    } else if (selectedAdmin.level === 'tower') {
      setTowerAdmins((prev) => prev.map((t) => (t.id === selectedAdmin.id ? updated : t)));
    }

    setActiveModal(null);
    setSelectedAdmin(null);
  };

  /* ─── Submit Add Member ──────────────────────────────────────────────── */
  const handleSaveAdd = (e) => {
    e.preventDefault();
    const newId = `${addLevelType}-${Date.now()}`;

    if (addLevelType === 'supervisor') {
      const newSup = {
        id: newId,
        level: 'supervisor',
        name: formData.name,
        role: formData.role,
        scope: formData.scope || 'All Communities',
        email: formData.email,
        phone: formData.phone,
        office: formData.office || 'Operations Hub',
        status: formData.status,
      };
      setSupervisors((prev) => [...prev, newSup]);
    } else if (addLevelType === 'community') {
      const tierObj = COMMUNITY_TIERS.find((t) => t.id === formData.tierId) || COMMUNITY_TIERS[0];
      const newCom = {
        id: newId,
        level: 'community',
        tierId: tierObj.id,
        tierName: tierObj.name,
        tierBadge: tierObj.tier,
        tierColor: tierObj.accentColor,
        tierIcon: tierObj.icon,
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        office: formData.office,
        scope: `${tierObj.name}`,
        status: formData.status,
      };
      setCommunityAdmins((prev) => [...prev, newCom]);
    } else if (addLevelType === 'society') {
      const socObj = INITIAL_SOCIETIES.find((s) => s.id === formData.societyId) || INITIAL_SOCIETIES[0];
      const newSoc = {
        id: newId,
        level: 'society',
        societyId: socObj.id,
        societyName: socObj.name,
        enclaveName: socObj.enclaveName,
        communityId: socObj.communityId,
        tier: socObj.tier,
        location: socObj.location,
        towersCount: socObj.towers?.length || 10,
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        office: formData.office,
        scope: `${socObj.name} · ${socObj.location}`,
        status: formData.status,
      };
      setSocietyAdmins((prev) => [...prev, newSoc]);
    } else if (addLevelType === 'tower') {
      const socObj = INITIAL_SOCIETIES.find((s) => s.id === formData.societyId) || INITIAL_SOCIETIES[0];
      const newTow = {
        id: newId,
        level: 'tower',
        societyId: socObj.id,
        societyName: socObj.name,
        communityId: socObj.communityId,
        towerCode: formData.towerCode,
        towerName: `Tower ${formData.towerCode}`,
        floors: 12,
        totalUnits: 48,
        name: formData.name,
        role: formData.role,
        phone: formData.phone,
        email: formData.email,
        shift: '08:00 AM - 05:00 PM',
        office: `Tower ${formData.towerCode} Helpdesk`,
        scope: `${socObj.name} · Tower ${formData.towerCode}`,
        status: formData.status,
      };
      setTowerAdmins((prev) => [...prev, newTow]);
    }

    setActiveModal(null);
  };

  /* ─── Search Filtering ────────────────────────────────────────────────── */
  const matchesSearch = (admin) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      admin.name?.toLowerCase().includes(q) ||
      admin.role?.toLowerCase().includes(q) ||
      admin.email?.toLowerCase().includes(q) ||
      admin.phone?.toLowerCase().includes(q) ||
      admin.scope?.toLowerCase().includes(q) ||
      admin.office?.toLowerCase().includes(q)
    );
  };

  // Filtered lists
  const filteredSupervisors = supervisors.filter(matchesSearch);
  const filteredCommunityAdmins = communityAdmins.filter(matchesSearch);
  const filteredSocietyAdmins = societyAdmins.filter(matchesSearch);
  const filteredTowerAdmins = towerAdmins.filter(matchesSearch);

  const totalAdminsCount = 1 + supervisors.length + communityAdmins.length + societyAdmins.length + towerAdmins.length;

  return (
    <div className="page-content ta-enterprise-page">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="ta-header-strip">
        <div>
          <div className="ta-header-eyebrow">
            <span className="ta-live-indicator"></span>
            GOVERNANCE &amp; ORGANIZATIONAL HIERARCHY
          </div>
          <h1 className="ta-main-title">Team &amp; Access Hierarchy</h1>
          <p className="ta-sub-title">
            Enterprise administration from Central Agency Executive down to Community, Society, and Tower Facility Admins.
          </p>
        </div>

        <div className="ta-header-action-group">
          <div className="ta-view-switchers">
            <button
              type="button"
              className="ta-utility-btn"
              onClick={expandAll}
              title="Expand all levels down to Tower Admins"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="7 13 12 18 17 13"></polyline>
                <polyline points="7 6 12 11 17 6"></polyline>
              </svg>
              Expand All
            </button>
            <button
              type="button"
              className="ta-utility-btn"
              onClick={collapseAll}
              title="Collapse all levels to Community Tiers"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 11 12 6 7 11"></polyline>
                <polyline points="17 18 12 13 7 18"></polyline>
              </svg>
              Collapse
            </button>
          </div>

          <button
            type="button"
            className="ta-primary-btn"
            onClick={() => handleOpenAdd('supervisor')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Team Admin
          </button>
        </div>
      </div>

      {/* ── Hierarchy KPI Metrics Strip ──────────────────────────── */}
      <div className="ta-kpi-matrix">
        <div className="ta-kpi-box">
          <div className="ta-kpi-icon-wrap kpi-blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <div className="ta-kpi-number">{totalAdminsCount}</div>
            <div className="ta-kpi-label">Total Governance Personnel</div>
          </div>
        </div>

        <div className="ta-kpi-box">
          <div className="ta-kpi-icon-wrap kpi-navy">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div>
            <div className="ta-kpi-number">1 / {supervisors.length}</div>
            <div className="ta-kpi-label">Agency Admin / Supervisors</div>
          </div>
        </div>

        <div className="ta-kpi-box">
          <div className="ta-kpi-icon-wrap kpi-amber">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
              <path d="M2 12h20"></path>
            </svg>
          </div>
          <div>
            <div className="ta-kpi-number">{communityAdmins.length} Tiers</div>
            <div className="ta-kpi-label">Community Admins</div>
          </div>
        </div>

        <div className="ta-kpi-box">
          <div className="ta-kpi-icon-wrap kpi-teal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div>
            <div className="ta-kpi-number">{societyAdmins.length} Societies</div>
            <div className="ta-kpi-label">Society Estate Managers</div>
          </div>
        </div>

        <div className="ta-kpi-box">
          <div className="ta-kpi-icon-wrap kpi-slate">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <line x1="9" y1="22" x2="9" y2="22.01"></line>
              <line x1="15" y1="22" x2="15" y2="22.01"></line>
              <line x1="9" y1="18" x2="9" y2="18.01"></line>
              <line x1="15" y1="18" x2="15" y2="18.01"></line>
            </svg>
          </div>
          <div>
            <div className="ta-kpi-number">{towerAdmins.length} Towers</div>
            <div className="ta-kpi-label">Tower Facility Admins</div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ─────────────────────────────── */}
      <div className="ta-filter-bar">
        <div className="ta-search-box">
          <svg className="ta-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="ta-search-input"
            placeholder="Search admins by name, role, email, phone, society, or tower..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="ta-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="ta-level-tabs" role="tablist">
          <button
            type="button"
            className={`ta-level-tab ${levelFilter === 'all' ? 'active' : ''}`}
            onClick={() => setLevelFilter('all')}
          >
            All Hierarchy
          </button>
          <button
            type="button"
            className={`ta-level-tab ${levelFilter === 'agency' ? 'active' : ''}`}
            onClick={() => setLevelFilter('agency')}
          >
            Agency &amp; Supervisors
          </button>
          <button
            type="button"
            className={`ta-level-tab ${levelFilter === 'community' ? 'active' : ''}`}
            onClick={() => setLevelFilter('community')}
          >
            Community Admins
          </button>
          <button
            type="button"
            className={`ta-level-tab ${levelFilter === 'society' ? 'active' : ''}`}
            onClick={() => setLevelFilter('society')}
          >
            Society Admins
          </button>
          <button
            type="button"
            className={`ta-level-tab ${levelFilter === 'tower' ? 'active' : ''}`}
            onClick={() => setLevelFilter('tower')}
          >
            Tower Admins
          </button>
        </div>
      </div>

      {/* ── Main Hierarchy Tree Canvas ───────────────────────────── */}
      <div className="ta-tree-canvas">

        {/* ════ LEVEL 1: AGENCY ADMIN ════ */}
        {(levelFilter === 'all' || levelFilter === 'agency') && (
          <div className="ta-tree-level ta-level-1">
            <div className="ta-level-badge-pill pill-l1">
              LEVEL 1 · AGENCY EXECUTIVE HEADQUARTERS
            </div>

            <div className="ta-admin-card ta-card-l1">
              <div className="ta-card-top-row">
                <AdminAvatar name={adminName} size={42} className="avatar-l1" />
                <div className="ta-card-meta">
                  <div className="ta-card-title-row">
                    <h3 className="ta-person-name">{adminName}</h3>
                    <span className="ta-role-tag tag-l1">Agency Admin</span>
                    <span className="ta-status-dot active">Active</span>
                  </div>
                  <div className="ta-person-role">Executive Managing Director · Central Operations</div>
                  <div className="ta-person-scope">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                    </svg>
                    Enterprise Multi-Tier Governance · All Communities
                  </div>
                </div>
              </div>

              <div className="ta-card-contact-strip">
                <a href={`mailto:${adminEmail}`} className="ta-contact-chip" title="Email Agency Admin">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  {adminEmail}
                </a>
                <a href={`tel:${adminPhone}`} className="ta-contact-chip" title="Call Agency Admin">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  {adminPhone}
                </a>
                <span className="ta-contact-chip chip-office">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  HQ Executive Suite, Financial District
                </span>
              </div>
            </div>

            {/* Downward Tree Connector Line */}
            <div className="ta-connector-trunk">
              <div className="ta-trunk-line"></div>
            </div>
          </div>
        )}

        {/* ════ LEVEL 2: AGENCY SUPERVISORS ════ */}
        {(levelFilter === 'all' || levelFilter === 'agency') && (
          <div className="ta-tree-level ta-level-2">
            <div className="ta-level-badge-pill pill-l2">
              LEVEL 2 · AGENCY FIELD &amp; OPERATIONS SUPERVISORS ({filteredSupervisors.length})
            </div>

            <div className="ta-supervisors-grid">
              {filteredSupervisors.map((sup) => (
                <div key={sup.id} className={`ta-admin-card ta-card-l2 ${sup.status === 'Suspended' ? 'is-suspended' : ''}`}>
                  <div className="ta-card-top-row">
                    <AdminAvatar name={sup.name} size={38} />
                    <div className="ta-card-meta">
                      <div className="ta-card-title-row">
                        <h4 className="ta-person-name">{sup.name}</h4>
                        <span className="ta-role-tag tag-l2">Supervisor</span>
                        <span className={`ta-status-dot ${sup.status.toLowerCase()}`}>
                          {sup.status}
                        </span>
                      </div>
                      <div className="ta-person-role">{sup.role}</div>
                      <div className="ta-person-scope">{sup.scope}</div>
                    </div>
                  </div>

                  <div className="ta-card-contact-strip">
                    <a href={`mailto:${sup.email}`} className="ta-contact-chip">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      {sup.email}
                    </a>
                    <a href={`tel:${sup.phone}`} className="ta-contact-chip">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      {sup.phone}
                    </a>
                  </div>

                  <div className="ta-card-bottom-actions">
                    <button
                      type="button"
                      className="ta-action-icon-btn"
                      title="Inspect Profile"
                      onClick={() => handleInspect(sup)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Details
                    </button>
                    <button
                      type="button"
                      className="ta-action-icon-btn"
                      title="Edit Admin"
                      onClick={() => handleOpenEdit(sup)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      className={`ta-action-icon-btn ${sup.status === 'Active' ? 'btn-warn' : 'btn-success'}`}
                      title={sup.status === 'Active' ? 'Suspend Access' : 'Activate Access'}
                      onClick={() => handleToggleStatus(sup)}
                    >
                      {sup.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tree Branching Line */}
            <div className="ta-connector-trunk">
              <div className="ta-trunk-line"></div>
              <div className="ta-horizontal-splitter"></div>
            </div>
          </div>
        )}

        {/* ════ LEVEL 3, 4, 5: COMMUNITY TIERS & DESCENDANTS ════ */}
        <div className="ta-tier-hierarchy-branch">
          {COMMUNITY_TIERS.map((tier) => {
            const tierAdmin = communityAdmins.find((c) => c.tierId === tier.id);
            if (!tierAdmin && levelFilter !== 'all') return null;

            // Matching societies under this tier
            const tierSocieties = societyAdmins.filter((s) => s.communityId === tier.id);
            const isTierExpanded = expandedTiers[tier.id] ?? true;

            // Visibility according to level filter
            const showTierCard = levelFilter === 'all' || levelFilter === 'community';
            const showSocieties = levelFilter === 'all' || levelFilter === 'society' || levelFilter === 'tower';

            return (
              <div key={tier.id} className="ta-tier-subtree-column">
                {/* ── Level 3: Community Admin Card ── */}
                {showTierCard && (
                  <div
                    className="ta-tier-card-node"
                    style={{ borderTop: `4px solid ${tier.accentColor}` }}
                  >
                    <div className="ta-tier-node-header">
                      <div className="ta-tier-node-badge" style={{ background: tier.badgeBg, color: tier.badgeText }}>
                        <span>{tier.icon}</span>
                        <span>{tier.tier} Tier</span>
                      </div>
                      <span className="ta-level-indicator-tag">Level 3</span>
                    </div>

                    <div className="ta-card-top-row">
                      <AdminAvatar name={tierAdmin?.name || tier.name} size={36} />
                      <div className="ta-card-meta">
                        <div className="ta-card-title-row">
                          <h4 className="ta-person-name">{tierAdmin?.name}</h4>
                          <span className={`ta-status-dot ${tierAdmin?.status.toLowerCase()}`}>
                            {tierAdmin?.status}
                          </span>
                        </div>
                        <div className="ta-person-role">{tierAdmin?.role}</div>
                        <div className="ta-person-scope">{tier.name} · {tierAdmin?.office}</div>
                      </div>
                    </div>

                    <div className="ta-card-contact-strip">
                      <a href={`mailto:${tierAdmin?.email}`} className="ta-contact-chip">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        {tierAdmin?.email}
                      </a>
                      <a href={`tel:${tierAdmin?.phone}`} className="ta-contact-chip">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        {tierAdmin?.phone}
                      </a>
                    </div>

                    <div className="ta-card-bottom-actions">
                      <button
                        type="button"
                        className="ta-action-icon-btn"
                        onClick={() => handleInspect(tierAdmin)}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        className="ta-action-icon-btn"
                        onClick={() => handleOpenEdit(tierAdmin)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`ta-action-icon-btn ${tierAdmin?.status === 'Active' ? 'btn-warn' : 'btn-success'}`}
                        onClick={() => handleToggleStatus(tierAdmin)}
                      >
                        {tierAdmin?.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>

                    {/* Toggle expand/collapse of child societies */}
                    <button
                      type="button"
                      className={`ta-tier-expand-trigger ${isTierExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleTier(tier.id)}
                    >
                      <span>{isTierExpanded ? '▲ Hide Societies' : `▼ View Societies (${tierSocieties.length})`}</span>
                    </button>
                  </div>
                )}

                {/* ── Level 4 & 5: Sub-societies & Tower Admins ── */}
                {showSocieties && isTierExpanded && (
                  <div className="ta-societies-subbranch">
                    <div className="ta-subbranch-spine"></div>

                    {tierSocieties.map((soc) => {
                      const isSocExpanded = expandedSocieties[soc.societyId] ?? false;
                      const socTowers = towerAdmins.filter((t) => t.societyId === soc.societyId);

                      const showSocietyCard = levelFilter === 'all' || levelFilter === 'society';
                      const showTowers = levelFilter === 'all' || levelFilter === 'tower';

                      return (
                        <div key={soc.id} className="ta-society-node-wrapper">
                          {/* ── Level 4: Society Admin Card ── */}
                          {showSocietyCard && (
                            <div className={`ta-society-admin-card ${soc.status === 'Suspended' ? 'is-suspended' : ''}`}>
                              <div className="ta-soc-card-header">
                                <div className="ta-soc-badge-row">
                                  <span className="ta-soc-tag">Level 4 · Society Admin</span>
                                  <span className={`ta-status-dot ${soc.status.toLowerCase()}`}>
                                    {soc.status}
                                  </span>
                                </div>
                                <h5 className="ta-soc-name">{soc.societyName}</h5>
                                <div className="ta-soc-location">{soc.location}</div>
                              </div>

                              <div className="ta-card-top-row">
                                <AdminAvatar name={soc.name} size={34} />
                                <div className="ta-card-meta">
                                  <h4 className="ta-person-name">{soc.name}</h4>
                                  <div className="ta-person-role">{soc.role}</div>
                                </div>
                              </div>

                              <div className="ta-card-contact-strip">
                                <a href={`mailto:${soc.email}`} className="ta-contact-chip">
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                  </svg>
                                  {soc.email}
                                </a>
                                <a href={`tel:${soc.phone}`} className="ta-contact-chip">
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                  </svg>
                                  {soc.phone}
                                </a>
                              </div>

                              <div className="ta-card-bottom-actions">
                                <button
                                  type="button"
                                  className="ta-action-icon-btn"
                                  onClick={() => handleInspect(soc)}
                                >
                                  Details
                                </button>
                                <button
                                  type="button"
                                  className="ta-action-icon-btn"
                                  onClick={() => handleOpenEdit(soc)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className={`ta-action-icon-btn ${soc.status === 'Active' ? 'btn-warn' : 'btn-success'}`}
                                  onClick={() => handleToggleStatus(soc)}
                                >
                                  {soc.status === 'Active' ? 'Suspend' : 'Activate'}
                                </button>
                              </div>

                              {/* Toggle expand/collapse of Tower Admins */}
                              <button
                                type="button"
                                className={`ta-soc-expand-trigger ${isSocExpanded ? 'expanded' : ''}`}
                                onClick={() => toggleSociety(soc.societyId)}
                              >
                                <span>{isSocExpanded ? '▲ Hide Towers' : `▼ Towers & Admins (${socTowers.length})`}</span>
                              </button>
                            </div>
                          )}

                          {/* ── Level 5: Tower Admins Grid ── */}
                          {showTowers && isSocExpanded && (
                            <div className="ta-towers-level-grid">
                              <div className="ta-tower-level-header">
                                <span className="ta-tower-level-tag">
                                  LEVEL 5 · {soc.societyName.toUpperCase()} TOWER FACILITY ADMINS ({socTowers.length})
                                </span>
                              </div>

                              <div className="ta-towers-cards-matrix">
                                {socTowers.map((tow) => (
                                  <div
                                    key={tow.id}
                                    className={`ta-tower-admin-card ${tow.status === 'Suspended' ? 'is-suspended' : ''}`}
                                  >
                                    <div className="ta-tower-code-badge">{tow.towerCode}</div>

                                    <div className="ta-tower-card-body">
                                      <div className="ta-tower-card-head">
                                        <div className="ta-tower-title-text">{tow.towerName}</div>
                                        <span className={`ta-status-dot ${tow.status.toLowerCase()}`}>
                                          {tow.status}
                                        </span>
                                      </div>

                                      <div className="ta-tower-admin-name">{tow.name}</div>
                                      <div className="ta-tower-admin-meta">{tow.role}</div>

                                      <div className="ta-tower-contact-line">
                                        <a href={`tel:${tow.phone}`} className="ta-contact-link">
                                          {tow.phone}
                                        </a>
                                        <span className="ta-tower-shift-tag">{tow.shift}</span>
                                      </div>

                                      <div className="ta-tower-actions-row">
                                        <button
                                          type="button"
                                          className="ta-micro-btn"
                                          onClick={() => handleInspect(tow)}
                                        >
                                          Details
                                        </button>
                                        <button
                                          type="button"
                                          className="ta-micro-btn"
                                          onClick={() => handleOpenEdit(tow)}
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          className={`ta-micro-btn ${tow.status === 'Active' ? 'btn-warn' : 'btn-success'}`}
                                          onClick={() => handleToggleStatus(tow)}
                                        >
                                          {tow.status === 'Active' ? 'Suspend' : 'Activate'}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MODAL 1: INSPECT ADMIN DETAILS DRAWER ────────────────── */}
      {activeModal === 'inspect' && selectedAdmin && (
        <div className="ta-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="ta-inspector-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ta-inspector-header">
              <div className="ta-inspector-eyebrow">ADMINISTRATIVE CREDENTIALS DOSSIER</div>
              <button
                type="button"
                className="ta-modal-close-btn"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="ta-inspector-hero">
              <AdminAvatar name={selectedAdmin.name} size={60} />
              <div>
                <h2 className="ta-inspector-name">{selectedAdmin.name}</h2>
                <div className="ta-inspector-role">{selectedAdmin.role}</div>
                <div className="ta-inspector-badges">
                  <span className="ta-pill-level">
                    Level {selectedAdmin.level === 'supervisor' ? '2 (Supervisor)'
                          : selectedAdmin.level === 'community' ? '3 (Community Admin)'
                          : selectedAdmin.level === 'society' ? '4 (Society Admin)'
                          : '5 (Tower Admin)'}
                  </span>
                  <span className={`ta-status-dot ${selectedAdmin.status.toLowerCase()}`}>
                    Status: {selectedAdmin.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="ta-inspector-body">
              <div className="ta-inspector-group">
                <label className="ta-inspector-label">Assigned Jurisdiction &amp; Scope</label>
                <div className="ta-inspector-value">{selectedAdmin.scope || 'Enterprise-wide'}</div>
              </div>

              <div className="ta-inspector-group">
                <label className="ta-inspector-label">Official Headquarters / Desk Office</label>
                <div className="ta-inspector-value">{selectedAdmin.office || 'Corporate Headquarters'}</div>
              </div>

              <div className="ta-inspector-grid-2">
                <div className="ta-inspector-group">
                  <label className="ta-inspector-label">Direct Phone</label>
                  <a href={`tel:${selectedAdmin.phone}`} className="ta-inspector-link">
                    {selectedAdmin.phone}
                  </a>
                </div>
                <div className="ta-inspector-group">
                  <label className="ta-inspector-label">Corporate Email</label>
                  <a href={`mailto:${selectedAdmin.email}`} className="ta-inspector-link">
                    {selectedAdmin.email}
                  </a>
                </div>
              </div>

              <div className="ta-inspector-group">
                <label className="ta-inspector-label">Governance Governance Permissions</label>
                <ul className="ta-permissions-list">
                  <li>Incident &amp; Ticket Escalation Dispatch</li>
                  <li>Resident Dossier Verification &amp; KYC</li>
                  <li>Maintenance Vendor SLA Oversight</li>
                  <li>Security Gatepass Audit &amp; Approvals</li>
                </ul>
              </div>
            </div>

            <div className="ta-inspector-footer">
              <button
                type="button"
                className="ta-utility-btn"
                onClick={() => {
                  setActiveModal(null);
                  handleOpenEdit(selectedAdmin);
                }}
              >
                Edit Admin Details
              </button>
              <button
                type="button"
                className="ta-primary-btn"
                onClick={() => setActiveModal(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: EDIT ADMIN DETAILS ──────────────────────────── */}
      {activeModal === 'edit' && selectedAdmin && (
        <div className="ta-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="ta-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ta-inspector-header">
              <div className="ta-inspector-eyebrow">EDIT ADMINISTRATOR RECORD</div>
              <button
                type="button"
                className="ta-modal-close-btn"
                onClick={() => setActiveModal(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="ta-edit-form">
              <div className="ta-form-field">
                <label htmlFor="edit-name">Full Name *</label>
                <input
                  id="edit-name"
                  type="text"
                  required
                  className="ta-form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="ta-form-field">
                <label htmlFor="edit-role">Designation / Role Title *</label>
                <input
                  id="edit-role"
                  type="text"
                  required
                  className="ta-form-input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>

              <div className="ta-form-row-2">
                <div className="ta-form-field">
                  <label htmlFor="edit-phone">Phone Number *</label>
                  <input
                    id="edit-phone"
                    type="tel"
                    required
                    className="ta-form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="ta-form-field">
                  <label htmlFor="edit-email">Email Address *</label>
                  <input
                    id="edit-email"
                    type="email"
                    required
                    className="ta-form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="ta-form-field">
                <label htmlFor="edit-office">Office / Station Location</label>
                <input
                  id="edit-office"
                  type="text"
                  className="ta-form-input"
                  value={formData.office}
                  onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                />
              </div>

              <div className="ta-form-field">
                <label htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  className="ta-form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="ta-edit-modal-footer">
                <button
                  type="button"
                  className="ta-utility-btn"
                  onClick={() => setActiveModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="ta-primary-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: ADD NEW TEAM ADMIN ──────────────────────────── */}
      {activeModal === 'add' && (
        <div className="ta-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="ta-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ta-inspector-header">
              <div className="ta-inspector-eyebrow">APPOINT NEW HIERARCHY ADMINISTRATOR</div>
              <button
                type="button"
                className="ta-modal-close-btn"
                onClick={() => setActiveModal(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="ta-edit-form">
              <div className="ta-form-field">
                <label htmlFor="add-level">Hierarchy Level *</label>
                <select
                  id="add-level"
                  className="ta-form-select"
                  value={addLevelType}
                  onChange={(e) => handleOpenAdd(e.target.value)}
                >
                  <option value="supervisor">Level 2 · Agency Operations Supervisor</option>
                  <option value="community">Level 3 · Community Tier Admin</option>
                  <option value="society">Level 4 · Society Estate Manager</option>
                  <option value="tower">Level 5 · Tower Facility Administrator</option>
                </select>
              </div>

              {addLevelType === 'community' && (
                <div className="ta-form-field">
                  <label htmlFor="add-tier">Assign Community Tier *</label>
                  <select
                    id="add-tier"
                    className="ta-form-select"
                    value={formData.tierId}
                    onChange={(e) => setFormData({ ...formData, tierId: e.target.value })}
                  >
                    {COMMUNITY_TIERS.map((t) => (
                      <option key={t.id} value={t.id}>{t.tier} Tier ({t.name})</option>
                    ))}
                  </select>
                </div>
              )}

              {(addLevelType === 'society' || addLevelType === 'tower') && (
                <div className="ta-form-field">
                  <label htmlFor="add-society">Select Society *</label>
                  <select
                    id="add-society"
                    className="ta-form-select"
                    value={formData.societyId}
                    onChange={(e) => setFormData({ ...formData, societyId: e.target.value })}
                  >
                    {INITIAL_SOCIETIES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.tier} Tier)</option>
                    ))}
                  </select>
                </div>
              )}

              {addLevelType === 'tower' && (
                <div className="ta-form-field">
                  <label htmlFor="add-tower">Tower Designation *</label>
                  <input
                    id="add-tower"
                    type="text"
                    required
                    placeholder="e.g. Tower M, Tower Alpha"
                    className="ta-form-input"
                    value={formData.towerCode}
                    onChange={(e) => setFormData({ ...formData, towerCode: e.target.value })}
                  />
                </div>
              )}

              <div className="ta-form-field">
                <label htmlFor="add-name">Full Name *</label>
                <input
                  id="add-name"
                  type="text"
                  required
                  placeholder="e.g. Suresh Varma"
                  className="ta-form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="ta-form-field">
                <label htmlFor="add-role">Role Title *</label>
                <input
                  id="add-role"
                  type="text"
                  required
                  className="ta-form-input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>

              <div className="ta-form-row-2">
                <div className="ta-form-field">
                  <label htmlFor="add-phone">Phone Number *</label>
                  <input
                    id="add-phone"
                    type="tel"
                    required
                    placeholder="+91 98450 ..."
                    className="ta-form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="ta-form-field">
                  <label htmlFor="add-email">Email Address *</label>
                  <input
                    id="add-email"
                    type="email"
                    required
                    placeholder="admin@bee.example"
                    className="ta-form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="ta-form-field">
                <label htmlFor="add-office">Office Location</label>
                <input
                  id="add-office"
                  type="text"
                  placeholder="e.g. Admin Desk 1"
                  className="ta-form-input"
                  value={formData.office}
                  onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                />
              </div>

              <div className="ta-edit-modal-footer">
                <button
                  type="button"
                  className="ta-utility-btn"
                  onClick={() => setActiveModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="ta-primary-btn">
                  Appoint Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
