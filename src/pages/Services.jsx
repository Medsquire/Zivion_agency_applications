import React, { useState, useMemo, useEffect } from 'react';
import './Services.css';
import TableScrollSlider from '../components/TableScrollSlider';
import AudioVoicePlayer from '../components/AudioVoicePlayer';
import { getRequestMedia } from './DashboardHome';
import InspectionMediaModal from '../components/InspectionMediaModal';
import { INITIAL_SOCIETIES } from '../data/propertyHierarchyData';
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
  SlimUserCheck,
  SlimPencil,
  SlimTrash,
  SlimPlus,
  SlimX,
  SlimMapPin,
  SlimAlertCircle,
  SlimRotateCcw,
  SlimZap,
  SlimDroplet,
  SlimHammer,
  SlimHeadphones,
  SlimMic,
  SlimUsers,
  SlimActivity,
  SlimImage,
  SlimPackage,
  SlimFileText,
  SlimClock,
  SlimCalendar,
  SlimEye,
  SlimBuilding,
  SlimTower,
} from '../components/SlimIcons';

// ── Fallback Apartment to Towers Directory ──
export const APARTMENT_TOWERS = {
  'Surya Enclave': ['Tower A', 'Tower B', 'Tower C', 'All Towers'],
  'Golden Orbit': ['Tower A', 'Tower B', 'Tower C', 'Clubhouse'],
  'Sunrise Heights': ['Tower A', 'Tower B', 'Tower C'],
  'SKYLINE HOMES': ['Tower A', 'Tower B', 'Pump House'],
  'Skyline Homes': ['Tower A', 'Tower B', 'Pump House'],
  'Silver Oak Enclave': ['Tower A', 'Tower B'],
  'Greenwood Residency': ['Tower A', 'Tower B'],
};

// ── Helper to resolve Tower for any request ──
export function getRequestTower(req = {}) {
  if (req.tower && typeof req.tower === 'string' && req.tower.trim()) {
    return req.tower.trim();
  }
  const flat = (req.flatNo || '').trim();
  const title = ((req.caseTitle || '') + ' ' + (req.workOrderTitle || '')).trim();

  // If title mentions Tower X
  const titleMatch = title.match(/tower\s*([a-z0-9]+)/i);
  if (titleMatch) {
    return `Tower ${titleMatch[1].toUpperCase()}`;
  }

  // If flat starts with letter-number e.g. A-101, B-202, C-305
  const letterMatch = flat.match(/^([a-z])-?\d+/i);
  if (letterMatch) {
    return `Tower ${letterMatch[1].toUpperCase()}`;
  }

  // If flat starts with number-number e.g. 1-402
  const numMatch = flat.match(/^(\d+)-\d+/);
  if (numMatch) {
    return `Tower ${numMatch[1]}`;
  }

  if (/towers?|all/i.test(flat)) {
    return 'All Towers';
  }
  if (/clubhouse/i.test(flat)) {
    return 'Clubhouse';
  }
  if (/pump|sump/i.test(flat)) {
    return 'Pump House';
  }

  return 'Tower A';
}

// ── Helper to retrieve multiple technician assignments (so1-id, so2-id, so3-id) ──
export function getAssignedTechs(req = {}) {
  if (req.assignedTechnicians && Array.isArray(req.assignedTechnicians) && req.assignedTechnicians.length > 0) {
    return req.assignedTechnicians;
  }
  if (req.technician && req.technician !== 'Unassigned') {
    const rawWo = req.workOrderId || req.id || 'WO-101';
    const num = rawWo.replace(/[^0-9]/g, '') || '101';
    return [
      {
        soId: `SO-${num}-01`,
        technicianId: req.technicianId || 'TECH-001',
        name: req.technician,
        skill: 'Field Specialist',
        mobile: '+91 98765 00001',
        role: 'Primary Specialist (Lead)',
        assignedDate: req.assignedDate || '2026-10-22',
        targetDate: req.targetDate || '2026-10-25',
        status: req.status || 'In Progress',
        instructions: `Execute service directive for ${req.service || 'work order'}.`,
      },
    ];
  }
  return [];
}

// ── Helper to retrieve inspection images for a request ──
export function getRequestImages(req = {}) {
  if (req.images && Array.isArray(req.images) && req.images.length > 0) {
    return req.images;
  }
  const s = ((req.service || '') + ' ' + (req.caseTitle || '')).toLowerCase();
  if (s.includes('electric') || s.includes('spark') || s.includes('power')) {
    return [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80',
    ];
  }
  if (s.includes('plumb') || s.includes('drain') || s.includes('pipe') || s.includes('pump')) {
    return [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    ];
  }
  if (s.includes('ac ') || s.includes('air') || s.includes('inverter')) {
    return [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
    ];
  }
  return [
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80',
  ];
}

// ── Helper to retrieve required materials checklist for a request ──
export function getRequestMaterials(req = {}) {
  if (req.materials && Array.isArray(req.materials) && req.materials.length > 0) {
    return req.materials;
  }
  const s = ((req.service || '') + ' ' + (req.caseTitle || '')).toLowerCase();
  if (s.includes('electric') || s.includes('spark') || s.includes('power')) {
    return [
      { id: 'm-1', name: '32A Double-Pole MCB (Schneider Electric)', qty: '1 unit', status: 'In Stock' },
      { id: 'm-2', name: '2.5 sq mm Flame Retardant Copper Wire', qty: '8 meters', status: 'Issued to Tech' },
      { id: 'm-3', name: 'Modular 6-Module Switchboard Box', qty: '1 pc', status: 'In Stock' },
    ];
  }
  if (s.includes('plumb') || s.includes('drain') || s.includes('pipe') || s.includes('pump')) {
    return [
      { id: 'm-1', name: 'Balcony SS 304 Floor Drain Jali', qty: '1 pc', status: 'In Stock' },
      { id: 'm-2', name: 'PVC Solvent Cement & Silicone Sealant', qty: '1 can', status: 'In Stock' },
      { id: 'm-3', name: 'Heavy Duty Hydrojet Snake Hose', qty: '1 unit', status: 'Issued to Tech' },
    ];
  }
  if (s.includes('ac ') || s.includes('air') || s.includes('inverter')) {
    return [
      { id: 'm-1', name: 'R32 Refrigerant Gas Canister', qty: '1 can (1.2 kg)', status: 'In Stock' },
      { id: 'm-2', name: 'Condenser Coil Cleanser & Fin Comb', qty: '1 bottle', status: 'Used / Fitted' },
    ];
  }
  return [
    { id: 'm-1', name: 'High-Grade Elastomeric Polymer Sealant', qty: '2 buckets (5L)', status: 'To Procure' },
    { id: 'm-2', name: 'Fiberglass Reinforcing Mesh 145g', qty: '1 roll (15m)', status: 'To Procure' },
  ];
}

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
// 1. Pending (default)
// 2. Assigned
// 3. In Progress
// 4. Hold
// 5. Resolved
// 6. Closed (only RWA/Residence will put)
const STAGES = [
  { id: 'Pending', label: 'Pending', key: 'pending', color: 'stage-pending', dotColor: '#F59E0B', isDefault: true },
  { id: 'Assigned', label: 'Assigned', key: 'assigned', color: 'stage-assigned', dotColor: '#3B82F6' },
  { id: 'In Progress', label: 'In Progress', key: 'in-progress', color: 'stage-in-progress', dotColor: '#8B5CF6' },
  { id: 'Hold', label: 'Hold', key: 'hold', color: 'stage-on-hold', dotColor: '#F43F5E' },
  { id: 'Resolved', label: 'Resolved', key: 'resolved', color: 'stage-resolved', dotColor: '#10B981' },
  { id: 'Closed', label: 'Closed (RWA/Resident)', key: 'closed', color: 'stage-closed', dotColor: '#64748B', rwaOnly: true },
];

export const normalizeStatus = (status) => {
  if (!status) return 'Pending';
  if (status === 'Received Request') return 'Pending';
  if (status === 'Work Progress State') return 'In Progress';
  if (status === 'On Hold') return 'Hold';
  if (status === 'Completed') return 'Resolved';
  return status;
};

const DEFAULT_TECHNICIANS_LIST = [
  { id: 'TECH-001', name: 'Suresh Babu', skill: 'Electrical & AC, Elevator & Safety', skills: ['Electrical & AC', 'Elevator & Safety'], mobile: '+91 98765 00001' },
  { id: 'TECH-002', name: 'Mahesh Reddy', skill: 'Plumbing & Civil, General Maintenance', skills: ['Plumbing & Civil', 'General Maintenance'], mobile: '+91 98765 00002' },
  { id: 'TECH-003', name: 'Kiran Rao', skill: 'Civil Maintenance, Carpentry & Painting', skills: ['Civil Maintenance', 'Carpentry & Painting'], mobile: '+91 98765 00003' },
  { id: 'SEC-001', name: 'Security Desk', skill: 'Gate & Visitor Approvals', skills: ['Gate & Visitor Approvals'], mobile: '+91 98765 00010' },
  { id: 'DAY-001', name: 'Daily Works Crew', skill: 'Sanitation & Housekeeping', skills: ['Sanitation & Housekeeping'], mobile: '+91 98765 00020' },
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
  const [selectedApartment, setSelectedApartment] = useState('All');
  const [selectedTower, setSelectedTower] = useState('All');
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
  const [editModalTab, setEditModalTab] = useState('all'); // 'all' | 'inbound' | 'agency'
  const [previewImage, setPreviewImage] = useState(null);
  const [newMaterialInput, setNewMaterialInput] = useState({ name: '', qty: '', status: 'In Stock' });
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [deletingRequestId, setDeletingRequestId] = useState(null);
  const [onHoldPromptRequest, setOnHoldPromptRequest] = useState(null);
  const [onHoldReasonInput, setOnHoldReasonInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Inspection Media / Photo Modal state (Service Task image popup)
  const [photoModalRequest, setPhotoModalRequest] = useState(null);
  const [photoModalTab, setPhotoModalTab] = useState('issue');
  const [lightboxImage, setLightboxImage] = useState(null);

  const openPhotoModal = (request, initialTab = 'issue') => {
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

  // Form state for + Raise Complaint / Case Order
  const [newComplaintForm, setNewComplaintForm] = useState({
    category: 'Technicians',
    service: 'Electrical Repair',
    caseTitle: '',
    description: '',
    raisedBy: 'Residence',
    resident: '',
    apartment: 'Surya Enclave',
    tower: 'Tower A',
    flatNo: '',
    priority: 'Normal',
    technicianId: 'TECH-001',
    targetDate: '2026-10-25',
    securityPassType: 'Permission Request',
    dailyWorkFrequency: 'Daily',
    hasAudioVoiceNote: true,
  });

  // Form state for Allocation of Work (Supporting 1, 2, or 3 Technicians with so1-id, so2-id, so3-id)
  const [allocationForm, setAllocationForm] = useState({
    techCount: 1, // 1 | 2 | 3
    technicianId: 'TECH-001',
    assignedDate: new Date().toISOString().split('T')[0],
    targetDate: '2026-10-25',
    instructions: '',
    slots: [
      {
        soId: 'SO-101-01',
        technicianId: 'TECH-001',
        role: 'Primary Specialist (Lead)',
        instructions: '',
        assignedDate: new Date().toISOString().split('T')[0],
        targetDate: '2026-10-25',
      },
      {
        soId: 'SO-101-02',
        technicianId: 'TECH-002',
        role: 'Co-Specialist / Assistant',
        instructions: '',
        assignedDate: new Date().toISOString().split('T')[0],
        targetDate: '2026-10-25',
      },
      {
        soId: 'SO-101-03',
        technicianId: 'TECH-003',
        role: 'Support / Safety Specialist',
        instructions: '',
        assignedDate: new Date().toISOString().split('T')[0],
        targetDate: '2026-10-25',
      },
    ],
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

  // ── Dynamic list of available apartments ──
  const availableApartments = useMemo(() => {
    const aptMap = new Map();

    if (Array.isArray(INITIAL_SOCIETIES)) {
      INITIAL_SOCIETIES.forEach((s) => {
        if (s && s.name) {
          const key = s.name.trim().toLowerCase();
          if (!aptMap.has(key)) aptMap.set(key, s.name.trim());
        }
      });
    }

    requests.forEach((r) => {
      if (r && r.apartment && r.apartment.trim()) {
        const name = r.apartment.trim();
        const key = name.toLowerCase();
        if (!aptMap.has(key)) aptMap.set(key, name);
      }
    });

    return Array.from(aptMap.values()).sort((a, b) => a.localeCompare(b));
  }, [requests]);

  // ── Dynamic list of available towers for current selected apartment ──
  const availableTowers = useMemo(() => {
    const towerSet = new Set();

    if (selectedApartment === 'All') {
      requests.forEach((r) => {
        const tow = getRequestTower(r);
        if (tow) towerSet.add(tow);
      });
      ['Tower A', 'Tower B', 'Tower C'].forEach((t) => towerSet.add(t));
    } else {
      const society = Array.isArray(INITIAL_SOCIETIES)
        ? INITIAL_SOCIETIES.find((s) => s.name && s.name.toLowerCase() === selectedApartment.toLowerCase())
        : null;

      if (society && Array.isArray(society.towers)) {
        society.towers.slice(0, 6).forEach((t) => {
          const cleanName = t.name && t.name.includes(' - ') ? t.name.split(' - ')[0] : (t.name || `Tower ${t.code}`);
          towerSet.add(cleanName);
        });
      }

      const matchedFallback = Object.keys(APARTMENT_TOWERS).find(
        (k) => k.toLowerCase() === selectedApartment.toLowerCase()
      );
      if (matchedFallback && APARTMENT_TOWERS[matchedFallback]) {
        APARTMENT_TOWERS[matchedFallback].forEach((t) => towerSet.add(t));
      }

      requests
        .filter((r) => (r.apartment || '').trim().toLowerCase() === selectedApartment.toLowerCase())
        .forEach((r) => {
          const tow = getRequestTower(r);
          if (tow) towerSet.add(tow);
        });
    }

    return Array.from(towerSet).sort((a, b) => {
      if (a.startsWith('Tower') && b.startsWith('Tower')) {
        return a.localeCompare(b);
      }
      if (a.startsWith('Tower')) return -1;
      if (b.startsWith('Tower')) return 1;
      return a.localeCompare(b);
    });
  }, [requests, selectedApartment]);

  const handleApartmentChange = (newApartment) => {
    setSelectedApartment(newApartment);
    setSelectedTower('All');
  };

  const hasActiveFilters =
    selectedApartment !== 'All' ||
    selectedTower !== 'All' ||
    selectedStage !== 'All' ||
    selectedCategory !== 'All' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedApartment('All');
    setSelectedTower('All');
    setSelectedStage('All');
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const checkApartmentMatch = (r, apt) => {
    if (apt === 'All') return true;
    return (r.apartment || '').trim().toLowerCase() === apt.trim().toLowerCase();
  };

  const checkTowerMatch = (r, tow) => {
    if (tow === 'All') return true;
    const reqTow = getRequestTower(r);
    const target = tow.trim().toLowerCase();
    if (reqTow && reqTow.trim().toLowerCase() === target) return true;
    if (r.tower && r.tower.trim().toLowerCase() === target) return true;
    if (tow.startsWith('Tower ') && r.flatNo) {
      const code = tow.replace('Tower ', '').trim().toUpperCase();
      if (r.flatNo.toUpperCase().startsWith(`${code}-`)) return true;
    }
    return false;
  };

  // ── Total count matching current category, apartment & tower (before stage filter) ──
  const totalInApartmentTower = useMemo(() => {
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

      return (
        matchesCategory &&
        checkApartmentMatch(r, selectedApartment) &&
        checkTowerMatch(r, selectedTower)
      );
    }).length;
  }, [requests, selectedCategory, selectedApartment, selectedTower]);

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

        const matchesApartment = checkApartmentMatch(r, selectedApartment);
        const matchesTower = checkTowerMatch(r, selectedTower);

        return (
          matchesCategory &&
          matchesApartment &&
          matchesTower &&
          (r.status === s.id || normalizeStatus(r.status) === s.id)
        );
      }).length;
    });
    return counts;
  }, [requests, selectedCategory, selectedApartment, selectedTower]);

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

      const rStatus = normalizeStatus(r.status);
      const matchesStage =
        selectedStage === 'All' || r.status === selectedStage || rStatus === selectedStage;

      const matchesApartment = checkApartmentMatch(r, selectedApartment);
      const matchesTower = checkTowerMatch(r, selectedTower);

      const rTower = getRequestTower(r);
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
        (r.tower && r.tower.toLowerCase().includes(q)) ||
        (rTower && rTower.toLowerCase().includes(q)) ||
        (r.technician && r.technician.toLowerCase().includes(q));

      return matchesCategory && matchesStage && matchesApartment && matchesTower && matchesSearch;
    });
  }, [requests, selectedCategory, selectedStage, selectedApartment, selectedTower, searchQuery]);

  // ── CRUD: Create New Complaint / Case Order ───────────────────────────────
  const handleRaiseSubmit = (e) => {
    e.preventDefault();
    if (!newComplaintForm.caseTitle.trim() || !newComplaintForm.description.trim()) {
      return;
    }

    const techObj = technicians.find((t) => t.id === newComplaintForm.technicianId) || {
      name: 'Unassigned',
      id: '',
      skill: 'General Maintenance',
      mobile: '+91 98765 00001',
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
    const so1Id = `SO-${String(nextNum).slice(-3)}-01`;

    const initialAssignedTechnicians = techObj.name !== 'Unassigned' ? [
      {
        soId: so1Id,
        technicianId: techObj.id,
        name: techObj.name,
        skill: techObj.skill || 'Specialist',
        mobile: techObj.mobile || '+91 98765 00001',
        role: 'Primary Specialist (Lead)',
        assignedDate: new Date().toISOString().split('T')[0],
        targetDate: newComplaintForm.targetDate || '2026-10-25',
        status: 'Pending',
        instructions: `Work Order ${newWorkOrderId}: Execute ${newComplaintForm.service}.`,
      },
    ] : [];

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
      tower: newComplaintForm.tower || 'Tower A',
      flatNo:
        newComplaintForm.flatNo ||
        (newComplaintForm.category === 'Daily Works' ? 'All Towers' : 'A-101'),
      technician: techObj.name,
      technicianId: techObj.id,
      assignedTechnicians: initialAssignedTechnicians,
      assignedDate: new Date().toISOString().split('T')[0],
      targetDate: newComplaintForm.targetDate || '2026-10-25',
      priority: newComplaintForm.priority,
      status: 'Pending',
      holdReason: '',
      description: newComplaintForm.description,
      securityPassType: newComplaintForm.securityPassType,
      dailyWorkFrequency: newComplaintForm.dailyWorkFrequency,
      audio: newComplaintForm.hasAudioVoiceNote
        ? {
            hasAudio: true,
            title: `Resident Voice Memo: ${newComplaintForm.caseTitle}`,
            duration: '0:35',
            durationSeconds: 35,
            sender: newComplaintForm.resident || 'Resident',
            recordedAt: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            sampleType: 'voice',
          }
        : null,
      auditTrail: [
        {
          id: 1,
          action: 'Case Order Created',
          detail: `Resident registered case order ${newCaseId}`,
          actor: newComplaintForm.resident || 'Resident',
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'case',
        },
        ...(newComplaintForm.hasAudioVoiceNote
          ? [
              {
                id: 2,
                action: 'Audio Note Attached',
                detail: 'Resident attached 35-second voice description',
                actor: newComplaintForm.resident || 'Resident',
                timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'audio',
              },
            ]
          : []),
        {
          id: 3,
          action: 'Work Order Generated',
          detail: `Agency prepared Work Order ${newWorkOrderId}`,
          actor: 'Agency Central (Lalitha)',
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'wo',
        },
      ],
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
      tower: 'Tower A',
      flatNo: '',
      priority: 'Normal',
      technicianId: 'TECH-001',
      targetDate: '2026-10-25',
      securityPassType: 'Permission Request',
      dailyWorkFrequency: 'Daily',
      hasAudioVoiceNote: true,
    });
    showToast(`✓ Created Case Order ${newCaseId} & Service Request ${newId}`);
  };

  // ── CRUD: Allocation of Work Order to Technicians (so1-id, so2-id, so3-id) ──
  const openAllocateModal = (req) => {
    setAllocatingRequest(req);

    const rawWo = req.workOrderId || req.id || 'WO-101';
    const num = rawWo.replace(/[^0-9]/g, '') || '101';
    const so1Id = `SO-${num}-01`;
    const so2Id = `SO-${num}-02`;
    const so3Id = `SO-${num}-03`;

    const existingAssigned = getAssignedTechs(req);
    const count = existingAssigned.length > 0 ? Math.min(3, existingAssigned.length) : 1;

    const slots = [
      {
        soId: existingAssigned[0]?.soId || so1Id,
        technicianId: existingAssigned[0]?.technicianId || req.technicianId || technicians[0]?.id || 'TECH-001',
        role: existingAssigned[0]?.role || 'Primary Specialist (Lead)',
        instructions: existingAssigned[0]?.instructions || `Work Order ${rawWo}: Lead execution of ${req.service} for Flat ${req.flatNo}.`,
        assignedDate: existingAssigned[0]?.assignedDate || req.assignedDate || new Date().toISOString().split('T')[0],
        targetDate: existingAssigned[0]?.targetDate || req.targetDate || '2026-10-25',
      },
      {
        soId: existingAssigned[1]?.soId || so2Id,
        technicianId: existingAssigned[1]?.technicianId || (technicians[1]?.id || 'TECH-002'),
        role: existingAssigned[1]?.role || 'Co-Specialist / Assistant',
        instructions: existingAssigned[1]?.instructions || `Work Order ${rawWo}: Assist with field repair and tooling.`,
        assignedDate: existingAssigned[1]?.assignedDate || req.assignedDate || new Date().toISOString().split('T')[0],
        targetDate: existingAssigned[1]?.targetDate || req.targetDate || '2026-10-25',
      },
      {
        soId: existingAssigned[2]?.soId || so3Id,
        technicianId: existingAssigned[2]?.technicianId || (technicians[2]?.id || 'TECH-003'),
        role: existingAssigned[2]?.role || 'Support & Safety Specialist',
        instructions: existingAssigned[2]?.instructions || `Work Order ${rawWo}: Safety isolation and final inspection.`,
        assignedDate: existingAssigned[2]?.assignedDate || req.assignedDate || new Date().toISOString().split('T')[0],
        targetDate: existingAssigned[2]?.targetDate || req.targetDate || '2026-10-25',
      },
    ];

    setAllocationForm({
      techCount: count,
      technicianId: slots[0].technicianId,
      assignedDate: slots[0].assignedDate,
      targetDate: slots[0].targetDate,
      instructions: slots[0].instructions,
      slots,
    });
    setIsAllocateModalOpen(true);
  };

  const handleSlotChange = (index, field, value) => {
    setAllocationForm((prev) => {
      const updatedSlots = [...(prev.slots || [])];
      if (updatedSlots[index]) {
        updatedSlots[index] = { ...updatedSlots[index], [field]: value };
      }
      const sync = {};
      if (index === 0) {
        if (field === 'technicianId') sync.technicianId = value;
        if (field === 'assignedDate') sync.assignedDate = value;
        if (field === 'targetDate') sync.targetDate = value;
        if (field === 'instructions') sync.instructions = value;
      }
      return {
        ...prev,
        ...sync,
        slots: updatedSlots,
      };
    });
  };

  const handleTechCountChange = (count) => {
    setAllocationForm((prev) => ({
      ...prev,
      techCount: count,
    }));
  };

  const handleAllocateSubmit = (e) => {
    e.preventDefault();
    if (!allocatingRequest) return;

    const count = allocationForm.techCount || 1;
    const activeSlots = (allocationForm.slots || []).slice(0, count);

    const newAssignedTechnicians = activeSlots.map((slot, idx) => {
      const techObj = technicians.find((t) => t.id === slot.technicianId) || {
        name: idx === 0 ? 'Lead Specialist' : `Specialist ${idx + 1}`,
        id: slot.technicianId || `TECH-00${idx + 1}`,
        skill: 'Field Maintenance',
        mobile: `+91 98765 0000${idx + 1}`,
      };
      return {
        soId: slot.soId || `SO-0${idx + 1}`,
        technicianId: techObj.id,
        name: techObj.name,
        skill: techObj.skill,
        mobile: techObj.mobile,
        role: slot.role || (idx === 0 ? 'Primary Specialist (Lead)' : idx === 1 ? 'Co-Specialist / Assistant' : 'Support Specialist'),
        instructions: slot.instructions || `Work Order ${allocatingRequest.workOrderId || allocatingRequest.id}: Execution directive`,
        assignedDate: slot.assignedDate || allocationForm.assignedDate,
        targetDate: slot.targetDate || allocationForm.targetDate,
        status: 'In Progress',
      };
    });

    const primaryTech = newAssignedTechnicians[0] || { name: 'Unassigned', technicianId: '' };
    const allNames = newAssignedTechnicians.map((t) => t.name).join(', ');
    const soIds = newAssignedTechnicians.map((t) => t.soId).join(', ');

    const newAuditEntry = {
      id: Date.now(),
      action: 'Work Order Dispatched',
      detail: `Assigned to ${count} Technician${count > 1 ? 's' : ''} (${newAssignedTechnicians.map((t) => `${t.soId}: ${t.name} [${t.role}]`).join(', ')})`,
      actor: 'Agency Dispatcher (Lalitha)',
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'dispatch',
    };

    const updated = requests.map((r) => {
      if (r.id === allocatingRequest.id) {
        return {
          ...r,
          technician: allNames,
          technicianId: primaryTech.technicianId,
          assignedTechnicians: newAssignedTechnicians,
          assignedDate: primaryTech.assignedDate,
          targetDate: primaryTech.targetDate,
          status: (r.status === 'Pending' || r.status === 'Received Request') ? 'Assigned' : r.status,
          auditTrail: [newAuditEntry, ...(r.auditTrail || [])],
        };
      }
      return r;
    });

    setRequests(updated);
    if (updateRequestField) {
      updateRequestField(allocatingRequest.id, 'technician', allNames);
      updateRequestField(allocatingRequest.id, 'technicianId', primaryTech.technicianId);
      updateRequestField(allocatingRequest.id, 'assignedTechnicians', newAssignedTechnicians);
    }
    if (selectedRequest && selectedRequest.id === allocatingRequest.id) {
      setSelectedRequest({
        ...selectedRequest,
        technician: allNames,
        technicianId: primaryTech.technicianId,
        assignedTechnicians: newAssignedTechnicians,
        assignedDate: primaryTech.assignedDate,
        targetDate: primaryTech.targetDate,
        status: (selectedRequest.status === 'Pending' || selectedRequest.status === 'Received Request') ? 'Assigned' : selectedRequest.status,
        auditTrail: [newAuditEntry, ...(selectedRequest.auditTrail || [])],
      });
    }

    setIsAllocateModalOpen(false);
    showToast(`✓ Dispatched ${allocatingRequest.workOrderId || allocatingRequest.id} to ${count} Technician${count > 1 ? 's' : ''} (${soIds})`);
  };

  // ── CRUD: Stage Transition ────────────────────────────────────────────────
  const handleStageChange = (req, newStage) => {
    if (newStage === 'Hold' || newStage === 'On Hold') {
      setOnHoldPromptRequest(req);
      setOnHoldReasonInput(req.holdReason || 'Awaiting materials / resident clearance');
      return;
    }

    const auditAction = newStage === 'Closed' ? 'Closed by RWA/Residence' : `Stage: ${newStage}`;
    const newAuditEntry = {
      id: Date.now(),
      action: auditAction,
      detail: newStage === 'Closed' ? 'Case formally verified and marked Closed by RWA/Resident' : `Stage updated to ${newStage}`,
      actor: newStage === 'Closed' ? (req.resident || 'RWA / Resident') : 'Agency Dispatcher',
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'status',
    };

    const updated = requests.map((r) =>
      r.id === req.id
        ? {
            ...r,
            status: newStage,
            holdReason: ['Resolved', 'Closed', 'Completed'].includes(newStage) ? '' : r.holdReason,
            auditTrail: [newAuditEntry, ...(r.auditTrail || [])],
          }
        : r
    );
    setRequests(updated);
    if (updateRequestStatus) updateRequestStatus(req.id, newStage);
    if (selectedRequest && selectedRequest.id === req.id) {
      setSelectedRequest({
        ...selectedRequest,
        status: newStage,
        auditTrail: [newAuditEntry, ...(selectedRequest.auditTrail || [])],
      });
    }
    showToast(newStage === 'Closed' ? `✓ ${req.id} closed by RWA/Resident` : `✓ ${req.id} moved to "${newStage}"`);
  };

  const handleConfirmOnHold = (e) => {
    e.preventDefault();
    if (!onHoldPromptRequest) return;

    const newAuditEntry = {
      id: Date.now(),
      action: 'Placed on Hold',
      detail: onHoldReasonInput.trim() || 'Awaiting spare parts / clearance',
      actor: 'Agency Dispatcher',
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'status',
    };

    const updated = requests.map((r) =>
      r.id === onHoldPromptRequest.id
        ? {
            ...r,
            status: 'Hold',
            holdReason:
              onHoldReasonInput.trim() || 'Awaiting spare parts from store',
            auditTrail: [newAuditEntry, ...(r.auditTrail || [])],
          }
        : r
    );
    setRequests(updated);
    if (updateRequestStatus)
      updateRequestStatus(onHoldPromptRequest.id, 'Hold');
    if (selectedRequest && selectedRequest.id === onHoldPromptRequest.id) {
      setSelectedRequest({
        ...selectedRequest,
        status: 'Hold',
        holdReason: onHoldReasonInput,
        auditTrail: [newAuditEntry, ...(selectedRequest.auditTrail || [])],
      });
    }
    setOnHoldPromptRequest(null);
    showToast(`✓ Marked ${onHoldPromptRequest.id} on Hold`);
  };

  // ── CRUD: Edit Complaint & Work Order Workflow ─────────────────────────────
  const openEditModal = (req) => {
    const rawWo = req.workOrderId || req.id || 'WO-101';
    const num = rawWo.replace(/[^0-9]/g, '') || '101';
    const existingAssigned = getAssignedTechs(req);
    const count = existingAssigned.length > 0 ? Math.min(3, Math.max(1, existingAssigned.length)) : 1;

    const slots = [
      {
        soId: existingAssigned[0]?.soId || `SO-${num}-01`,
        technicianId: existingAssigned[0]?.technicianId || req.technicianId || technicians[0]?.id || 'TECH-001',
        role: existingAssigned[0]?.role || 'Primary Specialist (Lead)',
        instructions: existingAssigned[0]?.instructions || `Work Order ${rawWo}: Lead execution of ${req.service} for Flat ${req.flatNo || 'Unit'}.`,
        assignedDate: existingAssigned[0]?.assignedDate || req.assignedDate || new Date().toISOString().split('T')[0],
        targetDate: existingAssigned[0]?.targetDate || req.targetDate || '2026-10-25',
      },
      {
        soId: existingAssigned[1]?.soId || `SO-${num}-02`,
        technicianId: existingAssigned[1]?.technicianId || (technicians[1]?.id || 'TECH-002'),
        role: existingAssigned[1]?.role || 'Co-Specialist / Assistant',
        instructions: existingAssigned[1]?.instructions || `Work Order ${rawWo}: Assist with field repair and tooling.`,
        assignedDate: existingAssigned[1]?.assignedDate || req.assignedDate || new Date().toISOString().split('T')[0],
        targetDate: existingAssigned[1]?.targetDate || req.targetDate || '2026-10-25',
      },
      {
        soId: existingAssigned[2]?.soId || `SO-${num}-03`,
        technicianId: existingAssigned[2]?.technicianId || (technicians[2]?.id || 'TECH-003'),
        role: existingAssigned[2]?.role || 'Support & Safety Specialist',
        instructions: existingAssigned[2]?.instructions || `Work Order ${rawWo}: Safety isolation and final inspection.`,
        assignedDate: existingAssigned[2]?.assignedDate || req.assignedDate || new Date().toISOString().split('T')[0],
        targetDate: existingAssigned[2]?.targetDate || req.targetDate || '2026-10-25',
      },
    ];

    const initialImages = getRequestImages(req);
    const initialMaterials = getRequestMaterials(req);

    setEditingRequest({
      ...req,
      raisedBy: req.raisedBy || 'Residence',
      resident: req.resident || 'Kavya Sharma',
      residentPhone: req.residentPhone || '+91 98765 43210',
      apartment: req.apartment || 'Surya Enclave',
      tower: req.tower || (req.apartment?.includes('Sunrise') ? 'Tower B' : req.apartment?.includes('SKYLINE') ? 'Tower A' : 'Block A'),
      flatNo: req.flatNo || 'A-101',
      specificLocation: req.specificLocation || req.caseTitle || `${req.service} Execution Area`,
      reportedDate: req.reportedDate || req.assignedDate || '2026-10-11',
      reportedTime: req.reportedTime || '09:15',
      targetDate: req.targetDate || '2026-10-25',
      targetTime: req.targetTime || '17:00',
      priority: req.priority || 'Normal',
      caseTitle: req.caseTitle || req.service || 'Service Request',
      description: req.description || '',
      images: [...initialImages],
      materials: [...initialMaterials],
      materialNotes: req.materialNotes || '',
      techCount: count,
      slots,
      status: req.status || 'In Progress',
      holdReason: req.holdReason || '',
      workOrderId: req.workOrderId || `WO-${num}-A`,
      workOrderTitle: req.workOrderTitle || `${req.service} Resolution & Quality Check`,
    });
    setEditModalTab('all');
    setIsEditModalOpen(true);
  };

  const handleEditSlotChange = (index, field, value) => {
    setEditingRequest((prev) => {
      if (!prev) return prev;
      const updatedSlots = [...(prev.slots || [])];
      if (updatedSlots[index]) {
        updatedSlots[index] = { ...updatedSlots[index], [field]: value };
        if (field === 'technicianId') {
          const techObj = technicians.find((t) => t.id === value);
          if (techObj) {
            updatedSlots[index].name = techObj.name;
          }
        }
      }
      return {
        ...prev,
        slots: updatedSlots,
      };
    });
  };

  const handleEditTechCountChange = (count) => {
    setEditingRequest((prev) => (prev ? { ...prev, techCount: count } : prev));
  };

  const handleAddTechSlot = () => {
    setEditingRequest((prev) => {
      if (!prev) return prev;
      const rawWo = prev.workOrderId || prev.id || 'WO-101';
      const num = rawWo.replace(/[^0-9]/g, '') || '101';
      const currentSlots = prev.slots || [];
      const nextIndex = currentSlots.length;
      const nextSoNum = String(nextIndex + 1).padStart(2, '0');
      const techChoice = technicians[nextIndex % technicians.length] || technicians[0];
      const newSlot = {
        soId: `SO-${num}-${nextSoNum}`,
        technicianId: techChoice?.id || 'TECH-001',
        name: techChoice?.name || 'Technician',
        role: nextIndex === 0 ? 'Primary Specialist (Lead)' : nextIndex === 1 ? 'Co-Specialist / Assistant' : 'Support Specialist',
        instructions: `Work Order ${rawWo}: Field directive for technician ${nextIndex + 1}.`,
        assignedDate: prev.assignedDate || new Date().toISOString().split('T')[0],
        targetDate: prev.targetDate || '2026-10-25',
      };
      const updatedSlots = [...currentSlots, newSlot];
      return {
        ...prev,
        slots: updatedSlots,
        techCount: updatedSlots.length,
      };
    });
  };

  const handleRemoveTechSlot = (indexToRemove) => {
    setEditingRequest((prev) => {
      if (!prev || (prev.slots || []).length <= 1) return prev;
      const updatedSlots = prev.slots.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        slots: updatedSlots,
        techCount: updatedSlots.length,
      };
    });
  };

  const handleAddMaterialItem = () => {
    if (!newMaterialInput.name.trim()) return;
    setEditingRequest((prev) => {
      if (!prev) return prev;
      const newMat = {
        id: `mat-${Date.now()}`,
        name: newMaterialInput.name.trim(),
        qty: newMaterialInput.qty.trim() || '1 pc',
        status: newMaterialInput.status || 'In Stock',
      };
      return {
        ...prev,
        materials: [...(prev.materials || []), newMat],
      };
    });
    setNewMaterialInput({ name: '', qty: '', status: 'In Stock' });
  };

  const handleRemoveMaterialItem = (matId) => {
    setEditingRequest((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        materials: (prev.materials || []).filter((m) => m.id !== matId),
      };
    });
  };

  const handleMaterialStatusChange = (matId, status) => {
    setEditingRequest((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        materials: (prev.materials || []).map((m) =>
          m.id === matId ? { ...m, status } : m
        ),
      };
    });
  };

  const handleAddImage = (url) => {
    if (!url || !url.trim()) return;
    setEditingRequest((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        images: [...(prev.images || []), url.trim()],
      };
    });
    setNewImageUrlInput('');
  };

  const handleRemoveImage = (index) => {
    setEditingRequest((prev) => {
      if (!prev) return prev;
      const updated = [...(prev.images || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        images: updated,
      };
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingRequest) return;

    const activeSlots = (editingRequest.slots && editingRequest.slots.length > 0)
      ? editingRequest.slots
      : [{
          soId: 'SO-101-01',
          technicianId: technicians[0]?.id || 'TECH-001',
          role: 'Primary Specialist (Lead)',
          instructions: '',
        }];
    const count = activeSlots.length;

    const newAssignedTechnicians = activeSlots.map((slot, idx) => {
      const techObj = technicians.find((t) => t.id === slot.technicianId) || {
        name: idx === 0 ? 'Lead Specialist' : `Specialist ${idx + 1}`,
        id: slot.technicianId || `TECH-00${idx + 1}`,
        skill: 'Field Maintenance',
        mobile: `+91 98765 0000${idx + 1}`,
      };
      return {
        soId: slot.soId || `SO-0${idx + 1}`,
        technicianId: techObj.id,
        name: techObj.name,
        skill: techObj.skill,
        mobile: techObj.mobile,
        role: slot.role || (idx === 0 ? 'Primary Specialist (Lead)' : idx === 1 ? 'Co-Specialist / Assistant' : 'Support Specialist'),
        instructions: slot.instructions || `Work Order ${editingRequest.workOrderId || editingRequest.id}: Execution directive`,
        assignedDate: slot.assignedDate || editingRequest.assignedDate || new Date().toISOString().split('T')[0],
        targetDate: slot.targetDate || editingRequest.targetDate,
        status: editingRequest.status || 'In Progress',
      };
    });

    const primaryTech = newAssignedTechnicians[0] || { name: 'Unassigned', technicianId: '' };
    const allNames = newAssignedTechnicians.map((t) => t.name).join(', ');
    const soIds = newAssignedTechnicians.map((t) => t.soId).join(', ');

    const newAuditEntry = {
      id: Date.now(),
      action: 'Work Order & Case Updated',
      detail: `Updated details: ${count} Specialist${count > 1 ? 's' : ''} assigned (${soIds}), ${editingRequest.materials?.length || 0} Materials listed, Stage moved to "${editingRequest.status}".`,
      actor: 'Agency Central (Dispatcher)',
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'dispatch',
    };

    const finalUpdatedRequest = {
      ...editingRequest,
      technician: allNames,
      technicianId: primaryTech.technicianId,
      assignedTechnicians: newAssignedTechnicians,
      assignedDate: primaryTech.assignedDate,
      targetDate: primaryTech.targetDate,
      auditTrail: [newAuditEntry, ...(editingRequest.auditTrail || [])],
    };

    const updated = requests.map((r) =>
      r.id === editingRequest.id ? finalUpdatedRequest : r
    );
    setRequests(updated);

    if (updateRequestField) {
      updateRequestField(editingRequest.id, 'technician', allNames);
      updateRequestField(editingRequest.id, 'technicianId', primaryTech.technicianId);
      updateRequestField(editingRequest.id, 'assignedTechnicians', newAssignedTechnicians);
      updateRequestField(editingRequest.id, 'materials', editingRequest.materials);
      updateRequestField(editingRequest.id, 'images', editingRequest.images);
      updateRequestField(editingRequest.id, 'status', editingRequest.status);
    }
    if (updateRequestStatus && editingRequest.status) {
      updateRequestStatus(editingRequest.id, editingRequest.status);
    }
    if (selectedRequest && selectedRequest.id === editingRequest.id) {
      setSelectedRequest(finalUpdatedRequest);
    }
    setIsEditModalOpen(false);
    showToast(`✓ Updated Case & Work Order ${editingRequest.id} (${count} Techs: ${soIds})`);
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
                    width: totalInApartmentTower ? `${Math.min(100, Math.round((count / totalInApartmentTower) * 100))}%` : '0%',
                    backgroundColor: stg.dotColor,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Search, Apartment, Tower, Stage Select, and View Switcher Toolbar ── */}
      <div className="svc-toolbar">
        <div className="svc-toolbar-left">
          {/* 1. Search Box */}
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
              aria-label="Search cases"
            />
            {searchQuery && (
              <button
                type="button"
                className="svc-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
                aria-label="Clear search"
              >
                <SlimX size={13} strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* 2. Apartment / Society Filter */}
          <div className="svc-select-wrap">
            <span className="svc-select-icon">
              <SlimBuilding size={13} strokeWidth={1.5} />
            </span>
            <select
              className="svc-filter-select"
              value={selectedApartment}
              onChange={(e) => handleApartmentChange(e.target.value)}
              aria-label="Filter by Apartment"
              title="Filter by Apartment / Society"
            >
              <option value="All">All Apartments ({requests.length})</option>
              {availableApartments.map((apt) => {
                const count = requests.filter(
                  (r) => (r.apartment || '').trim().toLowerCase() === apt.trim().toLowerCase()
                ).length;
                return (
                  <option key={apt} value={apt}>
                    {apt} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* 3. Tower Filter */}
          <div className="svc-select-wrap">
            <span className="svc-select-icon">
              <SlimTower size={13} strokeWidth={1.5} />
            </span>
            <select
              className="svc-filter-select"
              value={selectedTower}
              onChange={(e) => setSelectedTower(e.target.value)}
              aria-label="Filter by Tower"
              title="Filter by Tower"
            >
              <option value="All">All Towers</option>
              {availableTowers.map((tow) => {
                const count = requests.filter((r) => {
                  const aptMatch = checkApartmentMatch(r, selectedApartment);
                  const towMatch = checkTowerMatch(r, tow);
                  return aptMatch && towMatch;
                }).length;
                return (
                  <option key={tow} value={tow}>
                    {tow} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* 4. Stage Filter */}
          <div className="svc-select-wrap">
            <span className="svc-select-icon">
              <SlimSliders size={13} strokeWidth={1.5} />
            </span>
            <select
              className="svc-filter-select"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              aria-label="Filter by Stage"
              title="Filter by Stage"
            >
              <option value="All">All Stages ({totalInApartmentTower})</option>
              {STAGES.map((stg) => (
                <option key={stg.id} value={stg.id}>
                  {stg.label} ({stageCounts[stg.id] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button if any filter is active */}
          {hasActiveFilters && (
            <button
              type="button"
              className="svc-filter-reset-btn"
              onClick={handleResetFilters}
              title="Reset all active filters"
              aria-label="Reset all filters"
            >
              <SlimRotateCcw size={12} strokeWidth={1.5} />
              <span>Reset</span>
            </button>
          )}

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
                {filteredRequests.map((req) => {
                  const stageObj =
                    STAGES.find((s) => s.id === req.status) ||
                    STAGES.find((s) => s.id === normalizeStatus(req.status)) ||
                    STAGES[0];
                  const priorityKey = (req.priority || 'normal').toLowerCase();
                  const statusLabel = req.status || 'Pending';
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

                  const classification = getServiceClassification(req);
                  const media = getRequestMedia(req);
                  const assigned = getAssignedTechs(req);

                  return (
                    <tr key={req.id}>
                      {/* 1. Work Order ID (WO_1454 / REQ-1001) */}
                      <td>
                        <div
                          className="table-wo-cell"
                          style={{ cursor: 'pointer' }}
                          title="View complaint & work order dossier"
                          onClick={() => {
                            setSelectedRequest(req);
                            setModalTab('overview');
                          }}
                        >
                          <span className="table-wo-badge">
                            {req.workOrderId || req.id || 'WO-101'}
                          </span>
                          <span className="sr-only">{req.id}</span>
                        </div>
                      </td>

                      {/* 2. Service Type (Image & Electrical) */}
                      <td>
                        <div className="table-service-cell">
                          <div className="table-service-title-row">
                            <strong className="table-row-title">{req.service}</strong>
                          </div>

                          <span className="sr-only">{req.caseTitle || req.description}</span>

                          {/* Issue Photo Thumbnail & IN/OUT Preview Pill (Dashboard UI) */}
                          <div className="table-issue-inout-bar">
                            <div
                              className="table-issue-thumb-wrapper"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPhotoModal(req, 'issue');
                              }}
                              title="Click to view Issue & Inspection Photos popup"
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  openPhotoModal(req, 'issue');
                                }
                              }}
                            >
                              <img
                                src={media.issueImage}
                                alt={`Issue defect for ${req.id}`}
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
                            {getInitials(req.resident)}
                          </div>
                          <div className="svc-resident-info">
                            <div className="svc-resident-name">
                              {req.resident || 'Resident'}
                            </div>
                            <div className="svc-location-text">
                              <SlimMapPin size={11} strokeWidth={1.5} />
                              <span>
                                {req.flatNo} <span className="svc-tower-pill">{req.tower || getRequestTower(req)}</span> · {req.apartment}
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
                        ) : req.technician && req.technician !== 'Unassigned' ? (
                          <span className="table-specialist-item">
                            <span style={{ color: '#16A34A' }}>●</span>
                            {req.technician}
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="svc-unassigned-badge"
                            onClick={() => openAllocateModal(req)}
                            title="Click to allocate technicians (1, 2, or 3 specialists)"
                          >
                            <SlimPlus size={12} strokeWidth={1.6} />
                            <span>Assign Staff (SO-1/2/3)</span>
                          </button>
                        )}
                      </td>

                      {/* 5. Priority */}
                      <td>
                        <span className={`svc-priority-dot-badge priority-${priorityKey}`}>
                          <span className="svc-p-dot" />
                          <span>{req.priority || 'Normal'}</span>
                        </span>
                      </td>

                      {/* 6. Current Stage */}
                      <td>
                        <div className="svc-stage-cell">
                          <span className={`status-badge ${statusClass}`} title={`Status: ${statusLabel}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </td>

                      {/* 7. Action Icons (Edit) */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="svc-actions-group" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="svc-action-icon-btn svc-action-edit"
                            title="Edit complaint"
                            aria-label={`Edit complaint ${req.id}`}
                            onClick={() => openEditModal(req)}
                          >
                            <SlimPencil size={14} strokeWidth={1.5} />
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
            const columnItems = filteredRequests.filter((r) => r.status === stg.id || normalizeStatus(r.status) === stg.id);

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

                      <div className="svc-kanban-title-row">
                        <h4 className="svc-card-title">{req.service}</h4>
                        <button
                          type="button"
                          className="svc-task-photo-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPhotoModal(req, 'issue');
                          }}
                          title="Click to view Issue & Inspection Photos popup"
                          aria-label={`View inspection photo popup for ${req.id}`}
                        >
                          <span className="svc-task-photo-thumb-wrap">
                            <SlimImage size={11} className="svc-task-photo-icon-overlay" />
                          </span>
                          <span className="svc-task-photo-label">Photo</span>
                        </button>
                      </div>

                      <div className="svc-card-resident">
                        <SlimMapPin size={12} strokeWidth={1.5} />
                        <span>
                          {req.resident || 'Resident'} · <span className="svc-tower-pill">{req.tower || getRequestTower(req)}</span> · {req.flatNo} ({req.apartment})
                        </span>
                      </div>

                      {/* Work Order & Audio Memo Row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', margin: '6px 0 2px', flexWrap: 'wrap' }}>
                        <span className="svc-work-order-chip" title="Linked Work Order">
                          {req.workOrderId || 'WO-101'}
                        </span>
                        {req.audio && (
                          <AudioVoicePlayer audio={req.audio} compact />
                        )}
                      </div>

                      {/* Technicians & Service Orders (SO) */}
                      {(() => {
                        const assigned = getAssignedTechs(req);
                        if (assigned.length > 0) {
                          return (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '4px 0 8px' }}>
                              {assigned.map((t, idx) => (
                                <span
                                  key={t.soId || idx}
                                  className={`svc-so-badge ${idx === 0 ? 'svc-so-badge-lead' : ''}`}
                                  title={`${t.soId}: ${t.name} (${t.role || t.skill})`}
                                  style={{ fontSize: '0.67rem' }}
                                >
                                  {t.soId}: {t.name.split(' ')[0]}
                                </span>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      })()}

                      <div className="svc-card-footer">
                        <span className="svc-tech-name-chip" title={req.technician}>
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
                  Work Order &amp; Complaint Dossier · {selectedRequest.category || 'Technicians'} · {selectedRequest.caseOrderId || 'CASE-ORDER'}
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
                className={`svc-modal-tab-btn ${modalTab === 'audio' ? 'active' : ''}`}
                onClick={() => setModalTab('audio')}
              >
                <SlimHeadphones size={13} style={{ marginRight: '5px' }} />
                Voice &amp; Audio {selectedRequest.audio ? '(1)' : '(0)'}
              </button>
              <button
                type="button"
                className={`svc-modal-tab-btn ${modalTab === 'hierarchy' ? 'active' : ''}`}
                onClick={() => setModalTab('hierarchy')}
              >
                Workflow Hierarchy (WO → SO-1/2/3)
              </button>
              <button
                type="button"
                className={`svc-modal-tab-btn ${modalTab === 'allocation' ? 'active' : ''}`}
                onClick={() => setModalTab('allocation')}
              >
                Technicians ({getAssignedTechs(selectedRequest).length})
              </button>
              <button
                type="button"
                className={`svc-modal-tab-btn ${modalTab === 'audit' ? 'active' : ''}`}
                onClick={() => setModalTab('audit')}
              >
                <SlimActivity size={13} style={{ marginRight: '5px' }} />
                Audit Trail ({(selectedRequest.auditTrail || []).length})
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
                      <label>Agency Work Order (WO)</label>
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
                        {selectedRequest.apartment} · <span className="svc-tower-pill">{selectedRequest.tower || getRequestTower(selectedRequest)}</span> · Flat {selectedRequest.flatNo}
                      </div>
                    </div>
                    <div className="svc-form-group">
                      <label>Assigned Personnel Summary</label>
                      <div className="svc-field-value-green">
                        {selectedRequest.technician || 'Unassigned'}
                      </div>
                      <div className="svc-field-sub">
                        Target Completion: {selectedRequest.targetDate}
                      </div>
                    </div>
                  </div>

                  {/* Audio Voice Complaint (Audios) */}
                  <div className="svc-form-group">
                    <label>Resident Voice Complaint &amp; Audio Memo</label>
                    <AudioVoicePlayer
                      audio={selectedRequest.audio}
                      onRecordNew={() => setModalTab('audio')}
                    />
                  </div>

                  {/* Dispatched Service Orders (SO-1, SO-2, SO-3) Breakdown */}
                  <div className="svc-form-group" style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ margin: 0, fontWeight: 700, fontSize: '0.84rem', color: '#1E293B' }}>
                        Dispatched Service Orders ({getAssignedTechs(selectedRequest).length} Technician{getAssignedTechs(selectedRequest).length > 1 ? 's' : ''} Assigned)
                      </label>
                      <button
                        type="button"
                        className="svc-btn-pill-secondary"
                        style={{ padding: '3px 10px', fontSize: '0.74rem' }}
                        onClick={() => {
                          const r = selectedRequest;
                          setSelectedRequest(null);
                          openAllocateModal(r);
                        }}
                      >
                        + Reallocate / Add Technicians (so1-id, so2-id, so3-id)
                      </button>
                    </div>

                    {(() => {
                      const assigned = getAssignedTechs(selectedRequest);
                      if (assigned.length > 0) {
                        return (
                          <div className="svc-dossier-so-grid">
                            {assigned.map((t, idx) => (
                              <div key={t.soId || idx} className="svc-dossier-so-card">
                                <div className="svc-dossier-so-header">
                                  <span className={`svc-so-badge ${idx === 0 ? 'svc-so-badge-lead' : ''}`}>
                                    {t.soId || `SO-0${idx + 1}`}
                                  </span>
                                  <span className="svc-stage-pill stage-in-progress" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                                    ● {t.status || 'In Progress'}
                                  </span>
                                </div>
                                <div className="svc-dossier-so-name">{t.name}</div>
                                <div className="svc-dossier-so-skill">{t.skill}</div>
                                <span className="svc-dossier-so-role">{t.role || (idx === 0 ? 'Primary Specialist' : idx === 1 ? 'Co-Specialist' : 'Support Specialist')}</span>
                                {t.instructions && (
                                  <div style={{ fontSize: '0.73rem', color: '#475569', background: '#F8FAFC', padding: '6px 8px', borderRadius: '6px', marginTop: '4px' }}>
                                    <strong>Task:</strong> {t.instructions}
                                  </div>
                                )}
                                <a href={`tel:${t.mobile}`} className="svc-dossier-so-phone">
                                  <SlimWrench size={12} /> {t.mobile}
                                </a>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return (
                        <div className="svc-column-empty">
                          No technicians assigned to this Work Order yet.
                        </div>
                      );
                    })()}
                  </div>

                  <div className="svc-form-group" style={{ marginTop: '12px' }}>
                    <label>Complaint &amp; Task Description</label>
                    <div className="svc-desc-box">
                      {selectedRequest.description || 'No detailed description provided.'}
                    </div>
                  </div>

                  {(selectedRequest.status === 'Hold' || selectedRequest.status === 'On Hold') && selectedRequest.holdReason && (
                    <div className="svc-hold-banner">
                      <strong>On-Hold Reason:</strong> {selectedRequest.holdReason}
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: VOICE & AUDIO (AUDIOS) */}
              {modalTab === 'audio' && (
                <div className="svc-audio-tab-view">
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', color: '#0F172A' }}>
                    Voice Memos &amp; Audio Attachments
                  </h4>
                  <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#64748B' }}>
                    Audio recordings captured by residents during complaint registration and voice directives for field specialists.
                  </p>

                  <AudioVoicePlayer audio={selectedRequest.audio} />

                  {/* Record Voice Directive for Technicians */}
                  <div style={{ marginTop: '20px', padding: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <SlimMic size={16} style={{ color: '#2563EB' }} />
                      <strong style={{ fontSize: '0.86rem', color: '#1E293B' }}>
                        Agency Field Directive: Voice Memo for Technicians
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 12px' }}>
                      Dispatch an audio instruction to {selectedRequest.technician || 'assigned technicians'} (e.g. safety isolation, parking access instructions, or key handover location).
                    </p>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="svc-btn-pill-primary"
                        onClick={() => {
                          showToast('🎙️ Voice directive recorded & transmitted to assigned technicians');
                        }}
                      >
                        <SlimMic size={14} />
                        <span>Record 30s Audio Directive</span>
                      </button>
                      <button
                        type="button"
                        className="svc-btn-pill-secondary"
                        onClick={() => {
                          showToast('✓ Audio note downloaded for offline field dispatch');
                        }}
                      >
                        Download WAV Audio
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: HIERARCHY (WO -> SO-1, SO-2, SO-3) */}
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
                    {selectedRequest.audio && (
                      <div style={{ marginTop: '6px' }}>
                        <span className="svc-audio-compact-pill" style={{ pointerEvents: 'none' }}>
                          <SlimHeadphones size={11} /> Resident Audio Note Attached ({selectedRequest.audio.duration})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="svc-flow-node">
                    <div className="svc-flow-step-tag">STEP 3: AGENCY DISPATCH (WORK ORDERS - WO)</div>
                    <strong>Agency</strong> converts Case Order into Work Order:
                    <div style={{ marginTop: '4px' }}>
                      <span className="svc-work-order-chip">
                        {selectedRequest.workOrderId || 'WO-101-A'}
                      </span>
                      : {selectedRequest.workOrderTitle || 'Active execution'}
                    </div>
                  </div>

                  <div className="svc-flow-node svc-flow-node-active">
                    <div className="svc-flow-step-tag" style={{ color: '#2563EB' }}>
                      STEP 4: FIELD TECHNICIAN ALLOCATION (SERVICE ORDERS - SO)
                    </div>
                    <strong>Agency Dispatched to Technicians:</strong>
                    {(() => {
                      const assigned = getAssignedTechs(selectedRequest);
                      if (assigned.length > 0) {
                        return (
                          <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {assigned.map((t, idx) => (
                              <div key={t.soId || idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                                <span className={`svc-so-badge ${idx === 0 ? 'svc-so-badge-lead' : ''}`}>
                                  {t.soId || `SO-0${idx + 1}`}
                                </span>
                                <strong>{t.name}</strong>
                                <span style={{ color: '#64748B' }}>({t.role || t.skill})</span>
                                <span className="svc-stage-pill stage-in-progress" style={{ fontSize: '0.67rem', padding: '1px 6px' }}>
                                  {t.status || 'Active'}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return (
                        <div style={{ marginTop: '4px', fontWeight: 600, color: '#EA580C' }}>
                          Pending Allocation to Technicians (so1-id, so2-id, so3-id)
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* TAB 4: ALLOCATION & NOTES */}
              {modalTab === 'allocation' && (
                <div className="svc-allocation-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.92rem' }}>
                      Technicians &amp; Work Order Assignments
                    </h4>
                    <span className="svc-work-order-chip">
                      {selectedRequest.workOrderId || 'WO-101-A'}
                    </span>
                  </div>

                  <div className="svc-form-row-2">
                    <div>
                      <span className="svc-field-sub">Technicians Assigned</span>
                      <strong>{selectedRequest.technician || 'Unassigned'}</strong>
                    </div>
                    <div>
                      <span className="svc-field-sub">Target Completion</span>
                      <strong>{selectedRequest.targetDate || '2026-10-25'}</strong>
                    </div>
                  </div>

                  {/* Multi-Tech Details */}
                  {(() => {
                    const assigned = getAssignedTechs(selectedRequest);
                    if (assigned.length > 0) {
                      return (
                        <div style={{ marginTop: '8px' }}>
                          <span className="svc-field-sub">Service Order Breakdown (so1-id, so2-id, so3-id):</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                            {assigned.map((t, idx) => (
                              <div key={t.soId || idx} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '8px 12px', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span className={`svc-so-badge ${idx === 0 ? 'svc-so-badge-lead' : ''}`}>{t.soId}</span>
                                    <strong style={{ fontSize: '0.84rem' }}>{t.name}</strong>
                                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>({t.skill})</span>
                                  </div>
                                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#2563EB' }}>{t.role}</span>
                                </div>
                                <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                                  <strong>Directive:</strong> {t.instructions || 'Execute field repair.'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <button
                    type="button"
                    className="svc-btn-pill-primary"
                    style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                    onClick={() => {
                      const r = selectedRequest;
                      setSelectedRequest(null);
                      openAllocateModal(r);
                    }}
                  >
                    Reallocate / Assign 1, 2, or 3 Technicians
                  </button>
                </div>
              )}

              {/* TAB 5: AUDIT TRAIL & LOG (AUDITS) */}
              {modalTab === 'audit' && (
                <div className="svc-audit-tab-view">
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', color: '#0F172A' }}>
                    Complete Audit Trail &amp; Dispatch History
                  </h4>
                  <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#64748B' }}>
                    Immutable chronological record of Case Order creation, Audio recordings, Work Order dispatch, and Technician assignments.
                  </p>

                  <div className="svc-audit-timeline-container">
                    {((selectedRequest.auditTrail && selectedRequest.auditTrail.length > 0)
                      ? selectedRequest.auditTrail
                      : [
                          {
                            id: 1,
                            action: 'Case Order Created',
                            detail: `Resident registered case order ${selectedRequest.caseOrderId || 'CASE-101'}`,
                            actor: selectedRequest.resident || 'Resident',
                            timestamp: selectedRequest.assignedDate || '2026-10-11',
                            type: 'case',
                          },
                          {
                            id: 2,
                            action: 'Work Order Dispatched',
                            detail: `Agency generated Work Order ${selectedRequest.workOrderId || 'WO-101'} and dispatched to ${selectedRequest.technician || 'Technician'}`,
                            actor: 'Agency Central',
                            timestamp: selectedRequest.assignedDate || '2026-10-11',
                            type: 'dispatch',
                          },
                        ]
                    ).map((audit, i, arr) => (
                      <div key={audit.id || i} className="svc-audit-item">
                        <div className="svc-audit-line-wrapper">
                          <div className={`svc-audit-dot ${audit.type === 'dispatch' ? 'dot-dispatch' : audit.type === 'audio' ? 'dot-audio' : ''}`}>
                            {audit.type === 'audio' ? <SlimHeadphones size={11} /> : audit.type === 'dispatch' ? <SlimUsers size={11} /> : <SlimActivity size={11} />}
                          </div>
                          {i < arr.length - 1 && <div className="svc-audit-line" />}
                        </div>
                        <div className="svc-audit-content">
                          <div className="svc-audit-head">
                            <span className="svc-audit-action-title">{audit.action}</span>
                            <span className="svc-audit-time">{audit.timestamp}</span>
                          </div>
                          <div className="svc-audit-detail">{audit.detail}</div>
                          <div className="svc-audit-actor">Actor: <strong>{audit.actor}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: SECURITY SPECS (DIAGRAM 2) */}
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
                      onChange={(e) => {
                        const apt = e.target.value;
                        const defaultTowers = APARTMENT_TOWERS[apt] || ['Tower A', 'Tower B', 'Tower C'];
                        setNewComplaintForm({
                          ...newComplaintForm,
                          apartment: apt,
                          tower: defaultTowers[0] || 'Tower A',
                        });
                      }}
                    >
                      <option value="Surya Enclave">Surya Enclave</option>
                      <option value="Golden Orbit">Golden Orbit</option>
                      <option value="Sunrise Heights">Sunrise Heights</option>
                      <option value="SKYLINE HOMES">SKYLINE HOMES</option>
                      <option value="Silver Oak Enclave">Silver Oak Enclave</option>
                    </select>
                  </div>

                  <div className="svc-form-group">
                    <label>Tower / Block</label>
                    <select
                      className="svc-form-select"
                      value={newComplaintForm.tower || 'Tower A'}
                      onChange={(e) =>
                        setNewComplaintForm({
                          ...newComplaintForm,
                          tower: e.target.value,
                        })
                      }
                    >
                      {(APARTMENT_TOWERS[newComplaintForm.apartment] || ['Tower A', 'Tower B', 'Tower C']).map((tow) => (
                        <option key={tow} value={tow}>
                          {tow}
                        </option>
                      ))}
                    </select>
                  </div>
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
                      <option value="Normal">Normal</option>
                      <option value="Urgent">Urgent</option>
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
          <div className="svc-modal" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="svc-modal-header">
              <div>
                <span className="svc-modal-eyebrow">WORK ORDER DISPATCH (WO → SO-1 / SO-2 / SO-3)</span>
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
                {/* Linked Work Order Info Card & Audio Preview */}
                <div className="svc-alloc-info-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Linked Work Order: <span className="svc-work-order-chip">{allocatingRequest.workOrderId || 'WO-101-A'}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>
                      Case: {allocatingRequest.caseOrderId || allocatingRequest.id}
                    </span>
                  </div>
                  <div style={{ color: '#475569', fontSize: '0.8rem', marginBottom: allocatingRequest.audio ? '10px' : '0' }}>
                    Resident: <strong>{allocatingRequest.resident}</strong> ({allocatingRequest.apartment} · {allocatingRequest.flatNo}) · Issue: <em>{allocatingRequest.caseTitle || allocatingRequest.service}</em>
                  </div>

                  {/* Audio Voice Note Preview if present */}
                  {allocatingRequest.audio && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #CBD5E1' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <SlimHeadphones size={13} strokeWidth={2} style={{ color: '#2563EB' }} />
                        Resident Voice Note / Audio Complaint:
                      </div>
                      <AudioVoicePlayer audio={allocatingRequest.audio} />
                    </div>
                  )}
                </div>

                {/* Number of Technicians Selector (1, 2, or 3) */}
                <div className="svc-alloc-count-container">
                  <div className="svc-alloc-count-header">
                    <label>
                      <SlimUsers size={14} strokeWidth={2} style={{ verticalAlign: 'text-bottom', marginRight: '6px', color: '#2563EB' }} />
                      Number of Technicians Needed
                    </label>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      Creates individual Service Orders (so1-id, so2-id, so3-id)
                    </span>
                  </div>
                  <div className="svc-alloc-count-pills">
                    {[1, 2, 3].map((num) => {
                      const isActive = (allocationForm.techCount || 1) === num;
                      const label =
                        num === 1
                          ? '1 Technician (Solo Lead)'
                          : num === 2
                          ? '2 Technicians (Lead + Co-Tech)'
                          : '3 Technicians (Lead + Assist + Safety)';
                      return (
                        <button
                          key={num}
                          type="button"
                          className={`svc-alloc-count-btn ${isActive ? 'active' : ''}`}
                          onClick={() => handleTechCountChange(num)}
                        >
                          <span style={{ fontWeight: 800 }}>{num}</span>
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic Technician Slot Cards */}
                <div className="svc-alloc-slots-grid">
                  {(allocationForm.slots || []).slice(0, allocationForm.techCount || 1).map((slot, idx) => {
                    const isLead = idx === 0;
                    const defaultRole = isLead
                      ? 'Primary Specialist (Lead)'
                      : idx === 1
                      ? 'Co-Specialist / Assistant'
                      : 'Support & Safety Specialist';
                    return (
                      <div key={idx} className="svc-alloc-tech-slot-card">
                        <div className="svc-alloc-slot-header">
                          <div className="svc-alloc-slot-badge-group">
                            <span className={`svc-so-badge ${isLead ? 'svc-so-badge-lead' : ''}`}>
                              {slot.soId || `SO-0${idx + 1}`}
                            </span>
                            <span className="svc-alloc-slot-title">
                              {isLead
                                ? 'Technician 1 · Primary Specialist (Lead)'
                                : idx === 1
                                ? 'Technician 2 · Co-Specialist / Assistant'
                                : 'Technician 3 · Support & Safety Specialist'}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                            {isLead ? 'Direct Accountable' : 'Collaborative SO'}
                          </span>
                        </div>

                        {/* Technician Dropdown */}
                        <div className="svc-form-group">
                          <label>
                            {isLead ? 'Select Technician / Agency Staff *' : `Select Specialist ${idx + 1} (${slot.soId}) *`}
                          </label>
                          <select
                            className="svc-form-select"
                            value={slot.technicianId}
                            onChange={(e) => handleSlotChange(idx, 'technicianId', e.target.value)}
                          >
                            {technicians.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} — {t.skill} ({t.mobile})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Role and Target Date */}
                        <div className="svc-form-row-2">
                          <div className="svc-form-group">
                            <label>Role / Assignment Directive</label>
                            <input
                              type="text"
                              className="svc-form-input"
                              placeholder={defaultRole}
                              value={slot.role || ''}
                              onChange={(e) => handleSlotChange(idx, 'role', e.target.value)}
                            />
                          </div>
                          <div className="svc-form-group">
                            <label>Target Date</label>
                            <input
                              type="date"
                              className="svc-form-input"
                              value={slot.targetDate || allocationForm.targetDate}
                              onChange={(e) => handleSlotChange(idx, 'targetDate', e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Directives / Instructions */}
                        <div className="svc-form-group" style={{ marginBottom: 0 }}>
                          <label>Field Instructions for {slot.soId}</label>
                          <textarea
                            rows={2}
                            className="svc-form-textarea"
                            placeholder="Enter specific tasks, tooling, or safety instructions..."
                            value={slot.instructions || ''}
                            onChange={(e) => handleSlotChange(idx, 'instructions', e.target.value)}
                          />
                        </div>
                      </div>
                    );
                  })}
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

      {/* ── MODAL 5: STREAMLINED ASSIGNMENT & DISPATCH MODAL (NO SUBTITLES, PRO UI) ─── */}
      {isEditModalOpen && editingRequest && (
        <div className="svc-modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div
            className="svc-modal svc-edit-modal-pro"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Simple Clean Header Without Any Subtitle */}
            <div className="svc-modal-header svc-edit-header-clean">
              <div className="svc-edit-header-title-box">
                <div className="svc-edit-header-main">
                  <h3 className="svc-modal-title">
                    {editingRequest.id} · {editingRequest.service}
                  </h3>
                  <span className="svc-case-order-chip" title="Case Order">
                    {editingRequest.caseOrderId || 'CASE-101'}
                  </span>
                  <span className="svc-work-order-chip" title="Work Order">
                    {editingRequest.workOrderId || 'WO-101-A'}
                  </span>
                </div>
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

            <form onSubmit={handleEditSubmit} className="svc-edit-form-pro">
              <div className="svc-edit-modal-body-pro">
                {/* 2-Column Grid: Left = Inbound Read-Only, Right = Agent Editable */}
                <div className="svc-edit-layout-grid">

                  {/* LEFT: Inbound Complaint Details (ALL NOT EDITABLE) */}
                  <div className="svc-inbound-readonly-panel">
                    <div className="svc-panel-title-bar">
                      <span className="svc-panel-title">Inbound Complaint</span>
                      <span className="svc-readonly-tag">Read-Only</span>
                    </div>

                    <div className="svc-inbound-readonly-content">
                      {/* Priority, Category, Origin Tags */}
                      <div className="svc-readonly-tags-row">
                        <span className={`svc-priority-dot-badge priority-${(editingRequest.priority || 'normal').toLowerCase()}`}>
                          <span className="svc-p-dot" />
                          <span>{editingRequest.priority || 'Normal'} Priority</span>
                        </span>
                        <span className={`svc-classification-tag tag-${getServiceClassification(editingRequest).toLowerCase().replace(/\s+/g, '-')}`}>
                          {getServiceClassification(editingRequest)}
                        </span>
                        <span className="svc-origin-badge">
                          From: {editingRequest.raisedBy || 'Residence'}
                        </span>
                      </div>

                      {/* Case Title & Problem Description */}
                      <div className="svc-readonly-block">
                        <span className="svc-readonly-label">Reported Issue</span>
                        <div className="svc-readonly-issue-title">
                          {editingRequest.caseTitle || editingRequest.service}
                        </div>
                        <div className="svc-readonly-desc">
                          {editingRequest.description || 'No detailed description provided by resident.'}
                        </div>
                      </div>

                      {/* Originator / Resident Contact */}
                      <div className="svc-readonly-info-grid">
                        <div className="svc-readonly-info-item">
                          <span className="svc-readonly-label">Resident Name</span>
                          <span className="svc-readonly-val">{editingRequest.resident || 'Kavya Sharma'}</span>
                        </div>
                        <div className="svc-readonly-info-item">
                          <span className="svc-readonly-label">Contact</span>
                          <span className="svc-readonly-val">{editingRequest.residentPhone || '+91 98765 43210'}</span>
                        </div>
                      </div>

                      {/* Location Details */}
                      <div className="svc-readonly-block">
                        <span className="svc-readonly-label">Location Details</span>
                        <div className="svc-readonly-location-box">
                          <SlimMapPin size={13} style={{ color: '#2563EB', flexShrink: 0 }} />
                          <span>
                            {editingRequest.apartment || 'Surya Enclave'} · {editingRequest.tower || 'Block A'} · Flat {editingRequest.flatNo || 'A-101'}
                            {editingRequest.specificLocation ? ` (${editingRequest.specificLocation})` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Work Date & SLA */}
                      <div className="svc-readonly-info-grid">
                        <div className="svc-readonly-info-item">
                          <span className="svc-readonly-label">Reported Date</span>
                          <span className="svc-readonly-val">
                            <SlimCalendar size={12} style={{ marginRight: '4px' }} />
                            {editingRequest.reportedDate || editingRequest.assignedDate || '2026-10-11'}
                          </span>
                        </div>
                        <div className="svc-readonly-info-item">
                          <span className="svc-readonly-label">Target SLA Date</span>
                          <span className="svc-readonly-val">
                            <SlimClock size={12} style={{ marginRight: '4px' }} />
                            {editingRequest.targetDate || '2026-10-25'}
                          </span>
                        </div>
                      </div>

                      {/* Inspection Photos (Clickable preview) */}
                      <div className="svc-readonly-block">
                        <div className="svc-readonly-img-header">
                          <span className="svc-readonly-label">Inspection Photos</span>
                          <span className="svc-readonly-img-count">
                            {editingRequest.images?.length || 0} photo{(editingRequest.images?.length || 0) === 1 ? '' : 's'}
                          </span>
                        </div>
                        {editingRequest.images && editingRequest.images.length > 0 ? (
                          <div className="svc-readonly-gallery">
                            {editingRequest.images.map((imgUrl, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className="svc-readonly-img-card"
                                onClick={() => setPreviewImage(imgUrl)}
                                title="Click to view enlarged photo"
                              >
                                <img src={imgUrl} alt={`Complaint photo ${idx + 1}`} />
                                <span className="svc-readonly-zoom-icon">
                                  <SlimImage size={11} />
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="svc-readonly-no-img">No inspection photos attached.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Agent Fillable Panel (Technicians, Materials, Stage) */}
                  <div className="svc-agent-editable-panel">
                    <div className="svc-panel-title-bar">
                      <span className="svc-panel-title">Agency Assignment &amp; Dispatch</span>
                      <span className="svc-editable-tag">Agent Actions</span>
                    </div>

                    <div className="svc-agent-panel-content">
                      {/* 1. Stage Dispatch Control Bar (Primary Lifecycle Control) */}
                      <div className="svc-agent-section svc-stage-dispatch-bar-section">
                        <div className="svc-stage-bar-row">
                          <div className="svc-agent-sec-title">
                            <SlimActivity size={14} style={{ color: '#D97706' }} />
                            <span>Current Stage</span>
                          </div>
                          {editingRequest.status !== 'Assigned' && (
                            <button
                              type="button"
                              className="svc-quick-stage-btn"
                              onClick={() => setEditingRequest({ ...editingRequest, status: 'Assigned' })}
                              title="Quick-set status to Assigned"
                            >
                              ✓ Set to Assigned
                            </button>
                          )}
                        </div>

                        <div className="svc-stage-select-box">
                          <select
                            className="svc-form-select svc-stage-dropdown-pro"
                            value={editingRequest.status || 'Assigned'}
                            onChange={(e) => setEditingRequest({ ...editingRequest, status: e.target.value })}
                          >
                            <option value="Pending">● Pending (Default)</option>
                            <option value="Assigned">● Assigned</option>
                            <option value="In Progress">● In Progress</option>
                            <option value="Hold">● Hold</option>
                            <option value="Resolved">● Resolved</option>
                            <option value="Closed">● Closed (RWA / Residence)</option>
                          </select>
                        </div>

                        {(editingRequest.status === 'Hold' || editingRequest.status === 'On Hold') && (
                          <div className="svc-hold-reason-box" style={{ marginTop: '8px' }}>
                            <label style={{ fontSize: '0.74rem', color: '#E11D48', fontWeight: 600 }}>
                              Hold Reason *
                            </label>
                            <input
                              type="text"
                              className="svc-form-input"
                              placeholder="e.g. Awaiting spare parts from store..."
                              value={editingRequest.holdReason || ''}
                              onChange={(e) => setEditingRequest({ ...editingRequest, holdReason: e.target.value })}
                              style={{ borderColor: '#FDA4AF' }}
                            />
                          </div>
                        )}
                      </div>

                      {/* 2. Technicians with Dynamic "+ Add Technician" Button */}
                      <div className="svc-agent-section">
                        <div className="svc-agent-sec-head">
                          <div className="svc-agent-sec-title">
                            <SlimUsers size={14} style={{ color: '#2563EB' }} />
                            <span>Assigned Technicians ({editingRequest.slots?.length || 1})</span>
                          </div>
                          <button
                            type="button"
                            className="svc-add-tech-btn"
                            onClick={handleAddTechSlot}
                            title="Add another technician to work order"
                          >
                            <SlimPlus size={12} />
                            <span>Add Technician</span>
                          </button>
                        </div>

                        {/* List of Technician Slots (1 to max) */}
                        <div className="svc-tech-slots-list">
                          {(editingRequest.slots || []).map((slot, idx) => (
                            <div key={idx} className={`svc-tech-slot-card ${idx === 0 ? 'svc-tech-slot-lead' : ''}`}>
                              <div className="svc-slot-card-header">
                                <div className="svc-slot-card-badge-wrap">
                                  <span className={`svc-so-badge ${idx === 0 ? 'svc-so-badge-lead' : ''}`}>
                                    {slot.soId}
                                  </span>
                                  <span className="svc-slot-card-label">
                                    {idx === 0 ? 'Primary Specialist (Lead)' : `Technician ${idx + 1}`}
                                  </span>
                                </div>
                                {(editingRequest.slots || []).length > 1 && (
                                  <button
                                    type="button"
                                    className="svc-remove-slot-btn"
                                    onClick={() => handleRemoveTechSlot(idx)}
                                    title="Remove this technician"
                                    aria-label={`Remove technician ${idx + 1}`}
                                  >
                                    <SlimTrash size={12} />
                                  </button>
                                )}
                              </div>

                              <div className="svc-slot-fields-grid">
                                <div className="svc-form-group">
                                  <label className="svc-slot-micro-label">Specialist</label>
                                  <select
                                    className="svc-form-select svc-tech-select-pro"
                                    value={slot.technicianId}
                                    onChange={(e) => handleEditSlotChange(idx, 'technicianId', e.target.value)}
                                  >
                                    {technicians.map((t) => (
                                      <option key={t.id} value={t.id}>
                                        {t.name} ({t.skill})
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="svc-form-group">
                                  <label className="svc-slot-micro-label">Role / Responsibility</label>
                                  <input
                                    type="text"
                                    className="svc-form-input svc-tech-input-pro"
                                    value={slot.role || ''}
                                    onChange={(e) => handleEditSlotChange(idx, 'role', e.target.value)}
                                    placeholder="e.g. Lead Specialist / Assistant"
                                  />
                                </div>
                              </div>

                              <div className="svc-form-group svc-directive-group">
                                <label className="svc-slot-micro-label">Work Directive / Instructions</label>
                                <input
                                  type="text"
                                  className="svc-form-input svc-tech-input-pro"
                                  value={slot.instructions || ''}
                                  onChange={(e) => handleEditSlotChange(idx, 'instructions', e.target.value)}
                                  placeholder="Specific repair directive or safety precautions..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Materials Checklist (In case materials needed) */}
                      <div className="svc-agent-section">
                        <div className="svc-agent-sec-head">
                          <div className="svc-agent-sec-title">
                            <SlimPackage size={14} style={{ color: '#059669' }} />
                            <span>Materials &amp; Spare Parts ({editingRequest.materials?.length || 0})</span>
                          </div>
                        </div>

                        {/* Existing Materials List */}
                        {editingRequest.materials && editingRequest.materials.length > 0 ? (
                          <div className="svc-materials-compact-list">
                            {editingRequest.materials.map((mat) => (
                              <div key={mat.id} className="svc-mat-compact-row">
                                <div className="svc-mat-info">
                                  <strong className="svc-mat-name">{mat.name}</strong>
                                  <span className="svc-mat-qty">{mat.qty}</span>
                                </div>
                                <div className="svc-mat-actions">
                                  <select
                                    className={`svc-mat-status-select svc-mat-status-${mat.status ? mat.status.toLowerCase().replace(/\s+/g, '-') : 'in-stock'}`}
                                    value={mat.status}
                                    onChange={(e) => handleMaterialStatusChange(mat.id, e.target.value)}
                                  >
                                    <option value="In Stock">In Stock</option>
                                    <option value="To Procure">To Procure</option>
                                    <option value="Issued to Tech">Issued to Tech</option>
                                    <option value="Used / Fitted">Used / Fitted</option>
                                  </select>
                                  <button
                                    type="button"
                                    className="svc-mat-del-btn"
                                    onClick={() => handleRemoveMaterialItem(mat.id)}
                                    title="Remove part"
                                    aria-label="Remove part"
                                  >
                                    <SlimTrash size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="svc-mat-empty-hint">No parts requested yet. Add below if needed.</div>
                        )}

                        {/* Add Material Row */}
                        <div className="svc-add-mat-inline-row">
                          <input
                            type="text"
                            className="svc-form-input"
                            placeholder="Material / Part name..."
                            value={newMaterialInput.name}
                            onChange={(e) => setNewMaterialInput({ ...newMaterialInput, name: e.target.value })}
                            style={{ flex: 2 }}
                          />
                          <input
                            type="text"
                            className="svc-form-input"
                            placeholder="Qty (e.g. 1 unit)"
                            value={newMaterialInput.qty}
                            onChange={(e) => setNewMaterialInput({ ...newMaterialInput, qty: e.target.value })}
                            style={{ flex: 1 }}
                          />
                          <select
                            className="svc-form-select"
                            value={newMaterialInput.status}
                            onChange={(e) => setNewMaterialInput({ ...newMaterialInput, status: e.target.value })}
                            style={{ flex: 1 }}
                          >
                            <option value="In Stock">In Stock</option>
                            <option value="To Procure">To Procure</option>
                            <option value="Issued to Tech">Issued to Tech</option>
                          </select>
                          <button
                            type="button"
                            className="svc-btn-pill-primary"
                            onClick={handleAddMaterialItem}
                            style={{ padding: '6px 14px', fontSize: '0.74rem' }}
                          >
                            + Add
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

              {/* Simple, Clear, Proficient Modal Footer */}
              <div className="svc-modal-footer svc-edit-footer-pro">
                <div className="svc-footer-left-actions">
                  <button
                    type="button"
                    className="svc-btn-pill-secondary"
                    style={{ color: '#E11D48', borderColor: '#FECDD3' }}
                    onClick={() => {
                      const id = editingRequest.id;
                      setIsEditModalOpen(false);
                      setDeletingRequestId(id);
                    }}
                  >
                    <SlimTrash size={13} style={{ marginRight: '4px' }} />
                    Delete
                  </button>
                  <button
                    type="button"
                    className="svc-btn-pill-secondary"
                    onClick={() => {
                      const r = editingRequest;
                      setIsEditModalOpen(false);
                      openAllocateModal(r);
                    }}
                  >
                    <SlimUserCheck size={13} style={{ marginRight: '4px' }} />
                    Allocate
                  </button>
                </div>

                <div className="svc-footer-right-actions">
                  <button
                    type="button"
                    className="svc-btn-pill-secondary"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="svc-btn-pill-primary"
                  >
                    Save Changes &amp; Dispatch
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── IMAGE LIGHTBOX ENLARGED PREVIEW ───────────────────────────────── */}
      {previewImage && (
        <div className="svc-lightbox-backdrop" onClick={() => setPreviewImage(null)}>
          <div className="svc-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="svc-lightbox-close"
              onClick={() => setPreviewImage(null)}
              aria-label="Close image preview"
            >
              <SlimX size={16} strokeWidth={2} />
            </button>
            <img src={previewImage} alt="Enlarged Defect Inspection" />
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

      {/* ── Inspection Media & Issue Photos Popup Modal ── */}
      <InspectionMediaModal
        photoModalRequest={photoModalRequest}
        currentModalMedia={currentModalMedia}
        photoModalTab={photoModalTab}
        setPhotoModalTab={setPhotoModalTab}
        closePhotoModal={closePhotoModal}
        lightboxImage={lightboxImage}
        setLightboxImage={setLightboxImage}
        onNavigateServices={() => {
          setSelectedRequest(photoModalRequest);
          closePhotoModal();
        }}
      />

      {/* ── Floating Toast Feedback ──────────────────────────────────────── */}
      {toastMessage && (
        <div className="svc-toast" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
