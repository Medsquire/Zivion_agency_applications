import React, { useState, useMemo } from 'react';
import './Properties.css';
import {
  COMMUNITY_TIERS,
  INITIAL_SOCIETIES,
  APARTMENT_NAMES,
} from '../data/propertyHierarchyData';

export const apartmentNames = APARTMENT_NAMES;

// Initial Community Tiers Data
const INITIAL_COMMUNITY_TIERS = [
  {
    id: 'diamond',
    name: 'Diamond Communities',
    tier: 'Diamond',
    icon: '💎',
    badge: 'Diamond Tier',
    societiesCount: 2,
    towersCount: 22,
    units: 976,
    pending: 26,
    techs: 26,
    status: 'Active',
    borderColor: '#0284C7',
    admin: {
      name: 'Vikram Malhotra',
      role: 'Diamond Community General Manager',
      phone: '+91 98450 11223',
      email: 'diamond.admin@zivion.example',
      office: 'Diamond Central Concierge, Tower 1',
    },
    societyIds: ['skyline', 'sunrise'],
  },
  {
    id: 'gold',
    name: 'Gold Communities',
    tier: 'Gold',
    icon: '⭐',
    badge: 'Gold Tier',
    societiesCount: 2,
    towersCount: 25,
    units: 1056,
    pending: 17,
    techs: 20,
    status: 'Active',
    borderColor: '#D97706',
    admin: {
      name: 'Rajeshwar Rao',
      role: 'Gold Community Operations Lead',
      phone: '+91 98220 55441',
      email: 'gold.admin@zivion.example',
      office: 'Gold Hub Administration, Gachibowli',
    },
    societyIds: ['surya', 'golden-orbit'],
  },
  {
    id: 'silver',
    name: 'Silver Communities',
    tier: 'Silver',
    icon: '🛡️',
    badge: 'Silver Tier',
    societiesCount: 2,
    towersCount: 22,
    units: 840,
    pending: 11,
    techs: 16,
    status: 'Active',
    borderColor: '#475569',
    admin: {
      name: 'Sunita Deshmukh',
      role: 'Silver Community Regional Director',
      phone: '+91 98330 99881',
      email: 'silver.admin@zivion.example',
      office: 'Silver Regional Office, Kondapur',
    },
    societyIds: ['silver-oak', 'greenwood'],
  },
];

// Initial Societies Data (with real Team & Access administrators and technicians)
const INITIAL_SOCIETIES_LIST = [
  {
    id: 'surya',
    name: 'Surya Enclave',
    community: 'Gold Communities',
    communityId: 'gold',
    towersCount: 3,
    units: 250,
    pending: 12,
    techs: 8,
    status: 'Active',
    borderColor: '#2563EB',
    societyAdmin: {
      name: 'Ravi Kumar',
      role: 'Senior Estate Manager',
      phone: '+91 98765 43210',
      email: 'ravi.kumar@surya.example',
      office: 'Central Gatehouse Management Office',
    },
    technicians: [
      { name: 'Suresh Babu', phone: '+91 98765 11223', specialty: 'Electrical & AC' },
      { name: 'Mahesh Reddy', phone: '+91 98765 22334', specialty: 'Plumbing & Civil' },
    ],
    towers: [
      {
        id: 'surya-a',
        code: 'A',
        name: 'Tower A',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
        progressPercent: 65,
        towerAdmin: {
          name: 'K. Srinivas',
          role: 'Tower Facility Administrator',
          phone: '+91 97001 22331',
          shift: '08:00 AM - 05:00 PM',
          office: 'Tower A Ground Helpdesk',
        },
      },
      {
        id: 'surya-b',
        code: 'B',
        name: 'Tower B',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
        progressPercent: 65,
        towerAdmin: {
          name: 'P. Ananya',
          role: 'Tower Facility Administrator',
          phone: '+91 97001 22332',
          shift: '08:00 AM - 05:00 PM',
          office: 'Tower B Ground Helpdesk',
        },
      },
      {
        id: 'surya-c',
        code: 'C',
        name: 'Tower C',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
        progressPercent: 65,
        towerAdmin: {
          name: 'M. Venkatesh',
          role: 'Tower Facility Administrator',
          phone: '+91 97001 22333',
          shift: '08:00 AM - 05:00 PM',
          office: 'Tower C Ground Helpdesk',
        },
      },
    ],
  },
  {
    id: 'golden-orbit',
    name: 'Golden Orbit',
    community: 'Gold Communities',
    communityId: 'gold',
    towersCount: 2,
    units: 120,
    pending: 5,
    techs: 4,
    status: 'Active',
    borderColor: '#1D4ED8',
    societyAdmin: {
      name: 'Vishwa Patel',
      role: 'Operations Administrator',
      phone: '+91 98765 12345',
      email: 'vishwa.patel@goldenorbit.example',
      office: 'Block B Ground Management Suite',
    },
    technicians: [
      { name: 'Mahesh Reddy', phone: '+91 98765 22334', specialty: 'Plumbing & Civil' },
    ],
    towers: [
      {
        id: 'go-a',
        code: 'A',
        name: 'Tower A',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
        progressPercent: 70,
        towerAdmin: {
          name: 'K. Srinivas',
          role: 'Tower Facility Administrator',
          phone: '+91 97001 22331',
          shift: '08:00 AM - 05:00 PM',
          office: 'Tower A Helpdesk',
        },
      },
      {
        id: 'go-b',
        code: 'B',
        name: 'Tower B',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
        progressPercent: 60,
        towerAdmin: {
          name: 'P. Ananya',
          role: 'Tower Facility Administrator',
          phone: '+91 97001 22332',
          shift: '08:00 AM - 05:00 PM',
          office: 'Tower B Helpdesk',
        },
      },
    ],
  },
  {
    id: 'sunrise',
    name: 'Sunrise Heights',
    community: 'Diamond Communities',
    communityId: 'diamond',
    towersCount: 3,
    units: 180,
    pending: 3,
    techs: 6,
    status: 'Active',
    borderColor: '#6366F1',
    societyAdmin: {
      name: 'Arya Nambiar',
      role: 'Society Administrator',
      phone: '+91 98765 67890',
      email: 'arya.n@sunrise.example',
      office: 'Tower A Admin Suite, Sunrise Heights',
    },
    technicians: [
      { name: 'Suresh Babu', phone: '+91 98765 11223', specialty: 'Electrical & AC' },
    ],
    towers: [
      {
        id: 'sh-a',
        code: 'A',
        name: 'Tower A',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
        progressPercent: 75,
        towerAdmin: {
          name: 'S. Neha',
          role: 'Tower Facility Administrator',
          phone: '+91 97001 22334',
          shift: '08:00 AM - 05:00 PM',
          office: 'Tower A Helpdesk',
        },
      },
      {
        id: 'sh-b',
        code: 'B',
        name: 'Tower B',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
        progressPercent: 65,
        towerAdmin: {
          name: 'R. Karthik',
          role: 'Tower Facility Administrator',
          phone: '+91 97001 22335',
          shift: '08:00 AM - 05:00 PM',
          office: 'Tower B Helpdesk',
        },
      },
      {
        id: 'sh-c',
        code: 'C',
        name: 'Tower C',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
        progressPercent: 60,
        towerAdmin: {
          name: 'T. Bhavana',
          role: 'Tower Facility Administrator',
          phone: '+91 97001 22336',
          shift: '08:00 AM - 05:00 PM',
          office: 'Tower C Helpdesk',
        },
      },
    ],
  },
  {
    id: 'skyline',
    name: 'Skyline Homes',
    community: 'Diamond Communities',
    communityId: 'diamond',
    towersCount: 1,
    units: 50,
    pending: 23,
    techs: 16,
    status: 'Active',
    borderColor: '#0D9488',
    societyAdmin: {
      name: 'Arjun Singhania',
      role: 'Society Estate Manager',
      phone: '+91 98765 67870',
      email: 'arjun.singhania@skyline.example',
      office: 'Clubhouse Level 2, Skyline Enclave',
    },
    technicians: [
      { name: 'Suresh Babu', phone: '+91 98765 11223', specialty: 'Electrical & AC' },
      { name: 'Mahesh Reddy', phone: '+91 98765 22334', specialty: 'Plumbing & Civil' },
    ],
    towers: [
      {
        id: 'sk-a',
        code: 'A',
        name: 'Tower A',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
        progressPercent: 85,
        towerAdmin: {
          name: 'K. Srinivas',
          role: 'Tower Facility Administrator',
          phone: '+91 97001 22331',
          shift: '08:00 AM - 05:00 PM',
          office: 'Tower A Helpdesk',
        },
      },
    ],
  },
  {
    id: 'silver-oak',
    name: 'Silver Oak Enclave',
    community: 'Silver Communities',
    communityId: 'silver',
    towersCount: 2,
    units: 140,
    pending: 4,
    techs: 7,
    status: 'Active',
    borderColor: '#475569',
    societyAdmin: {
      name: 'Karan Verma',
      role: 'Society Manager',
      phone: '+91 98112 33445',
      email: 'karan.verma@silveroak.example',
      office: 'Main Community Hall Office',
    },
    technicians: [
      { name: 'Suresh Babu', phone: '+91 98765 11223', specialty: 'Electrical & AC' },
    ],
    towers: [
      {
        id: 'so-a',
        code: 'A',
        name: 'Tower A',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
        progressPercent: 70,
        towerAdmin: {
          name: 'V. Naresh',
          role: 'Tower Facility Administrator',
          phone: '+91 97001 22337',
          shift: '08:00 AM - 05:00 PM',
          office: 'Tower A Helpdesk',
        },
      },
      {
        id: 'so-b',
        code: 'B',
        name: 'Tower B',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
        progressPercent: 65,
        towerAdmin: {
          name: 'D. Pallavi',
          role: 'Tower Facility Administrator',
          phone: '+91 97001 22338',
          shift: '08:00 AM - 05:00 PM',
          office: 'Tower B Helpdesk',
        },
      },
    ],
  },
  {
    id: 'greenwood',
    name: 'Greenwood Society',
    community: 'Silver Communities',
    communityId: 'silver',
    towersCount: 2,
    units: 160,
    pending: 7,
    techs: 9,
    status: 'Active',
    borderColor: '#059669',
    societyAdmin: {
      name: 'Pooja Hegde',
      role: 'Resident Welfare Administrator',
      phone: '+91 98990 66778',
      email: 'pooja.hegde@greenwood.example',
      office: 'Greenwood Administrative Suite',
    },
    technicians: [
      { name: 'Mahesh Reddy', phone: '+91 98765 22334', specialty: 'Plumbing & Civil' },
    ],
    towers: [
      {
        id: 'gw-a',
        code: 'A',
        name: 'Tower A',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
        progressPercent: 75,
        towerAdmin: {
          name: 'A. Subhash',
          role: 'Tower Facility Administrator',
          phone: '+91 97001 22339',
          shift: '08:00 AM - 05:00 PM',
          office: 'Tower A Helpdesk',
        },
      },
      {
        id: 'gw-b',
        code: 'B',
        name: 'Tower B',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
        progressPercent: 60,
        towerAdmin: {
          name: 'N. Radhika',
          role: 'Tower Facility Administrator',
          phone: '+91 97001 22340',
          shift: '08:00 AM - 05:00 PM',
          office: 'Tower B Helpdesk',
        },
      },
    ],
  },
];

// Baseline flat statuses strictly matching user Screenshot 3
const BASELINE_FLAT_STATUSES = {
  // Floor 8
  '801': 'open-request',
  '802': 'occupied',
  '803': 'occupied',
  '804': 'occupied',
  '805': 'vacant',
  '806': 'vacant',
  // Floor 7
  '701': 'open-request',
  '702': 'open-request',
  '703': 'occupied',
  '704': 'occupied',
  '705': 'vacant',
  '706': 'vacant',
  // Floor 6
  '601': 'dues-overdue',
  '602': 'open-request',
  '603': 'open-request',
  '604': 'occupied',
  '605': 'occupied',
  '606': 'occupied',
  // Floor 5
  '501': 'vacant',
  '502': 'dues-overdue',
  '503': 'open-request',
  '504': 'open-request',
  '505': 'occupied',
  '506': 'occupied',
  // Floor 4
  '401': 'vacant',
  '402': 'vacant',
  '403': 'dues-overdue',
  '404': 'open-request',
  '405': 'open-request',
  '406': 'occupied',
  // Floor 3
  '301': 'vacant',
  '302': 'vacant',
  '303': 'vacant',
  '304': 'dues-overdue',
  '305': 'open-request',
  '306': 'open-request',
  // Floor 2
  '201': 'vacant',
  '202': 'vacant',
  '203': 'vacant',
  '204': 'vacant',
  '205': 'dues-overdue',
  '206': 'open-request',
  // Floor 1
  '101': 'occupied',
  '102': 'vacant',
  '103': 'vacant',
  '104': 'vacant',
  '105': 'vacant',
  '106': 'dues-overdue',
};

// Generate comprehensive interactive dossier for a unit
function buildUnitDossier(society, tower, floorNum, flatIdx, overrideStatus) {
  const flatNumber = `${floorNum}${String(flatIdx).padStart(2, '0')}`;
  const flatKey = `${tower.code}-${flatNumber}`;
  const statusType = overrideStatus || BASELINE_FLAT_STATUSES[flatNumber] || (flatIdx % 3 === 0 ? 'occupied' : 'vacant');

  const bhkTypes = ['2 BHK Luxury (1,380 sq.ft)', '3 BHK Premium (1,850 sq.ft)', '3 BHK Elite (2,120 sq.ft)', '4 BHK Penthouse (3,400 sq.ft)'];
  const bhk = floorNum >= 8 ? bhkTypes[3] : bhkTypes[flatIdx % 3];

  let statusText = 'Occupied';
  let occupancyType = 'Owner Occupied';
  let residentName = 'Ravi Kumar';
  let residentPhone = '+91 98451 22334';
  let residentEmail = 'ravi.kumar@surya.example';
  let duesAmount = '₹0';
  let duesStatus = 'Paid';
  let tickets = [];
  let isRented = false;

  if (statusType === 'open-request') {
    statusText = 'Open Request';
    occupancyType = 'Tenant Occupied';
    residentName = 'Priya Sharma';
    residentPhone = '+91 98760 44556';
    residentEmail = 'priya.s@outlook.example';
    isRented = true;
    tickets = [
      {
        id: `REQ-${flatNumber}-01`,
        service: 'Electrical Repair & Switchboard Inspection',
        status: 'In Progress',
        priority: 'High',
        assignedTech: 'Suresh Babu (+91 98765 11223)',
        dateRaised: '2026-10-18',
        description: 'Main master bedroom circuit trip when heavy load appliance is turned on.',
      },
    ];
  } else if (statusType === 'dues-overdue') {
    statusText = 'Dues Overdue';
    occupancyType = 'Owner Occupied';
    residentName = 'Vikram & Sunita Rao';
    residentPhone = '+91 98220 99881';
    residentEmail = 'vikram.rao@gmail.com';
    duesAmount = '₹14,500';
    duesStatus = 'Overdue';
  } else if (statusType === 'vacant') {
    statusText = 'Vacant';
    occupancyType = 'Vacant (Ready to Move)';
    residentName = 'Builder / Association Inventory';
    residentPhone = 'Society Admin Desk';
    residentEmail = 'admin@surya.example';
  }

  return {
    flatKey,
    flatNumber: `${tower.code}-${flatNumber}`,
    rawNumber: flatNumber,
    floor: `Floor ${floorNum}`,
    floorNum,
    bhk,
    facing: flatIdx % 2 === 0 ? 'East Facing (Vastu Compliant)' : 'North-East Facing',
    parkingSlots: flatIdx === 4 || floorNum >= 7 ? '2 Reserved Basements (B1-12, B1-13)' : '1 Reserved Basement (B2-08)',
    statusType,
    statusText,
    occupancyType,
    isRented,

    // Owner details
    owner: {
      name: statusType === 'vacant' ? 'Association Inventory' : 'Col. Rajesh Bakshi (Retd.)',
      phone: '+91 98100 87654',
      email: 'col.bakshi@defence.example',
      possession: 'March 2021',
      ownershipType: 'Registered Sole Owner',
      panStatus: 'Verified (KYC Complete)',
    },

    // Tenant details (if rented)
    tenant: isRented
      ? {
          name: residentName,
          phone: residentPhone,
          email: residentEmail,
          leaseEnd: 'December 2026',
          rent: '₹48,000/mo',
          policeVerification: 'Completed & Certified',
          agreementRegistered: 'Yes (Sub-Registrar Office)',
        }
      : null,

    // Billing & Dues
    billing: {
      duesAmount,
      duesStatus,
      cycle: 'October 2026',
      dueDate: '10th November 2026',
      breakdown: [
        { item: 'Monthly Maintenance Fee', amount: '₹3,500' },
        { item: 'Sinking & Reserve Fund', amount: '₹600' },
        { item: 'Water & Sewage Treatment', amount: '₹400' },
        ...(duesStatus === 'Overdue' ? [{ item: 'Late Payment Surcharge', amount: '₹500' }] : []),
      ],
    },

    // Service Tickets
    tickets,

    // Governance Admins (from Team & Access)
    admins: {
      communityAdmin: 'Rajeshwar Rao (Gold Community Operations Lead)',
      communityPhone: '+91 98220 55441',
      societyAdmin: society?.societyAdmin ? `${society.societyAdmin.name} (${society.societyAdmin.role})` : 'Ravi Kumar (Senior Estate Manager)',
      societyPhone: society?.societyAdmin?.phone || '+91 98765 43210',
      towerAdmin: tower?.towerAdmin ? `${tower.towerAdmin.name} (${tower.towerAdmin.role})` : 'K. Srinivas (Tower Facility Administrator)',
      towerPhone: tower?.towerAdmin?.phone || '+91 97001 22331',
      towerShift: tower?.towerAdmin?.shift || '08:00 AM - 05:00 PM',
      assignedTech: 'Suresh Babu (+91 98765 11223)',
    },
  };
}

export default function Properties() {
  // Navigation:
  // 'tiers' (Screen 1: Diamond, Gold, Silver Community Cards)
  // 'societies' (Screen 1b: Societies under selected Community)
  // 'society-detail' (Screen 2: Towers in selected Society)
  // 'floor-map' (Screen 3: Floor Map of selected Tower)
  const [currentView, setCurrentView] = useState('tiers');
  const [selectedTierId, setSelectedTierId] = useState('gold');
  const [selectedSocietyId, setSelectedSocietyId] = useState('surya');
  const [selectedTowerCode, setSelectedTowerCode] = useState('A');

  // Datasets in state
  const [communityTiers, setCommunityTiers] = useState(INITIAL_COMMUNITY_TIERS);
  const [societiesList, setSocietiesList] = useState(INITIAL_SOCIETIES_LIST);

  // Unit Dossiers & Ticket Overrides
  const [unitOverrides, setUnitOverrides] = useState({});

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [communityFilter, setCommunityFilter] = useState('All communities');

  // Dossier Modal
  const [activeDossier, setActiveDossier] = useState(null);
  const [dossierTab, setDossierTab] = useState('owner-tenant'); // 'owner-tenant' | 'bills' | 'tickets' | 'admins' | 'specs'

  // Ticket Raising Form Modal / Mode
  const [isRaisingTicket, setIsRaisingTicket] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    service: 'Electrical Repair',
    description: '',
    priority: 'Normal',
    assignedTech: 'Suresh Babu (+91 98765 11223)',
  });

  // Action Modals State
  const [isAddSocietyOpen, setIsAddSocietyOpen] = useState(false);
  const [newSocietyForm, setNewSocietyForm] = useState({
    name: '',
    communityId: 'gold',
    towersCount: 3,
    units: 150,
    adminName: '',
    adminPhone: '',
  });

  const [isImportFlatsOpen, setIsImportFlatsOpen] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [editingSociety, setEditingSociety] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleAddSocietySubmit = (e) => {
    e.preventDefault();
    if (!newSocietyForm.name.trim()) return;

    const tierObj = communityTiers.find((t) => t.id === newSocietyForm.communityId) || communityTiers[1];
    const newSocId = newSocietyForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newSoc = {
      id: newSocId,
      name: newSocietyForm.name,
      community: tierObj.name,
      communityId: tierObj.id,
      towersCount: Number(newSocietyForm.towersCount) || 3,
      units: Number(newSocietyForm.units) || 150,
      pending: 0,
      techs: 4,
      status: 'Active',
      borderColor: tierObj.borderColor || '#2563EB',
      societyAdmin: {
        name: newSocietyForm.adminName || 'Senior Estate Manager',
        role: 'Society Administrator',
        phone: newSocietyForm.adminPhone || '+91 98765 00000',
        email: `admin@${newSocId}.example`,
        office: 'Clubhouse Estate Office',
      },
      technicians: [
        { name: 'Suresh Babu', phone: '+91 98765 11223', specialty: 'Electrical & AC' },
        { name: 'Mahesh Reddy', phone: '+91 98765 22334', specialty: 'Plumbing & Civil' },
      ],
      towers: [
        {
          id: `${newSocId}-a`,
          code: 'A',
          name: 'Tower A',
          floors: 8,
          flatsPerFloor: 6,
          totalUnits: 48,
          progressPercent: 70,
          towerAdmin: {
            name: 'K. Srinivas',
            role: 'Tower Facility Administrator',
            phone: '+91 97001 22331',
            shift: '08:00 AM - 05:00 PM',
            office: 'Tower A Ground Helpdesk',
          },
        },
        {
          id: `${newSocId}-b`,
          code: 'B',
          name: 'Tower B',
          floors: 8,
          flatsPerFloor: 6,
          totalUnits: 48,
          progressPercent: 65,
          towerAdmin: {
            name: 'P. Ananya',
            role: 'Tower Facility Administrator',
            phone: '+91 97001 22332',
            shift: '08:00 AM - 05:00 PM',
            office: 'Tower B Ground Helpdesk',
          },
        },
      ],
    };

    setSocietiesList((prev) => [newSoc, ...prev]);
    setCommunityTiers((prev) =>
      prev.map((t) =>
        t.id === tierObj.id
          ? { ...t, societiesCount: t.societiesCount + 1, units: t.units + newSoc.units }
          : t
      )
    );
    setIsAddSocietyOpen(false);
    setNewSocietyForm({
      name: '',
      communityId: 'gold',
      towersCount: 3,
      units: 150,
      adminName: '',
      adminPhone: '',
    });
    showToast(`✓ Society "${newSoc.name}" created under ${tierObj.name}`);
  };

  const handleEditTierSubmit = (e) => {
    e.preventDefault();
    if (!editingTier) return;
    setCommunityTiers((prev) =>
      prev.map((t) => (t.id === editingTier.id ? editingTier : t))
    );
    showToast(`✓ Updated details for ${editingTier.name}`);
    setEditingTier(null);
  };

  const handleEditSocietySubmit = (e) => {
    e.preventDefault();
    if (!editingSociety) return;
    setSocietiesList((prev) =>
      prev.map((s) => (s.id === editingSociety.id ? editingSociety : s))
    );
    showToast(`✓ Updated details for ${editingSociety.name}`);
    setEditingSociety(null);
  };

  const handleImportFlats = () => {
    setIsImportFlatsOpen(false);
    showToast('✓ Successfully imported flat inventory roster (48 units verified)');
  };


  // Current active tier, society, tower
  const activeTier = useMemo(
    () => communityTiers.find((t) => t.id === selectedTierId) || communityTiers[1],
    [communityTiers, selectedTierId]
  );

  const activeSociety = useMemo(
    () => societiesList.find((s) => s.id === selectedSocietyId) || societiesList[0],
    [societiesList, selectedSocietyId]
  );

  const activeTower = useMemo(
    () =>
      activeSociety?.towers.find((t) => t.code === selectedTowerCode) ||
      activeSociety?.towers[0] || {
        code: 'A',
        name: 'Tower A',
        floors: 8,
        flatsPerFloor: 6,
        totalUnits: 48,
      },
    [activeSociety, selectedTowerCode]
  );

  // Societies belonging to selected tier
  const tierSocieties = useMemo(
    () => societiesList.filter((s) => s.communityId === activeTier.id),
    [societiesList, activeTier]
  );

  // Filtered Community Tiers for Screen 1
  const filteredTiers = useMemo(() => {
    return communityTiers.filter((tier) => {
      const matchesSearch = tier.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        communityFilter === 'All communities' ||
        tier.name.toLowerCase().includes(communityFilter.toLowerCase());
      return matchesSearch && matchesFilter;
    });
  }, [communityTiers, searchQuery, communityFilter]);

  // Flat cell status resolver with interactive overrides
  const getFlatStatus = (towerCode, floor, flatIdx) => {
    const flatNumber = `${floor}${String(flatIdx).padStart(2, '0')}`;
    const flatKey = `${towerCode}-${flatNumber}`;
    if (unitOverrides[flatKey]?.statusType) {
      return unitOverrides[flatKey].statusType;
    }
    return BASELINE_FLAT_STATUSES[flatNumber] || (flatIdx % 3 === 0 ? 'occupied' : 'vacant');
  };

  // Open Unit Dossier Modal
  const handleOpenUnitDossier = (floorNum, flatIdx) => {
    const flatNumber = `${floorNum}${String(flatIdx).padStart(2, '0')}`;
    const flatKey = `${activeTower.code}-${flatNumber}`;
    const existing = unitOverrides[flatKey];

    if (existing) {
      setActiveDossier(existing);
    } else {
      const generated = buildUnitDossier(activeSociety, activeTower, floorNum, flatIdx);
      setActiveDossier(generated);
    }
    setDossierTab('owner-tenant');
    setIsRaisingTicket(false);
  };

  // Mark Bills as Paid
  const handleMarkDuesPaid = () => {
    if (!activeDossier) return;
    const updated = {
      ...activeDossier,
      statusType: activeDossier.statusType === 'dues-overdue' ? 'occupied' : activeDossier.statusType,
      statusText: activeDossier.statusType === 'dues-overdue' ? 'Occupied (All Clear)' : activeDossier.statusText,
      billing: {
        ...activeDossier.billing,
        duesAmount: '₹0 (Paid)',
        duesStatus: 'Paid',
      },
    };
    setActiveDossier(updated);
    setUnitOverrides((prev) => ({ ...prev, [activeDossier.flatKey]: updated }));
  };

  // Submit New Ticket
  const handleRaiseTicketSubmit = (e) => {
    e.preventDefault();
    if (!activeDossier || !newTicketForm.description.trim()) return;

    const newTicket = {
      id: `REQ-${activeDossier.rawNumber}-${Date.now().toString().slice(-2)}`,
      service: newTicketForm.service,
      description: newTicketForm.description,
      priority: newTicketForm.priority,
      assignedTech: newTicketForm.assignedTech,
      status: 'Pending',
      dateRaised: 'Today',
    };

    const updated = {
      ...activeDossier,
      statusType: 'open-request',
      statusText: 'Open Request',
      tickets: [newTicket, ...(activeDossier.tickets || [])],
    };

    setActiveDossier(updated);
    setUnitOverrides((prev) => ({ ...prev, [activeDossier.flatKey]: updated }));
    setIsRaisingTicket(false);
    setNewTicketForm({
      service: 'Electrical Repair',
      description: '',
      priority: 'Normal',
      assignedTech: 'Suresh Babu (+91 98765 11223)',
    });
  };

  return (
    <div className="cp-container">
      {/* ════════════════════════════════════════════════════════════════
          SCREEN 1: COMMUNITY TIERS DIRECTORY (Diamond, Gold, Silver)
          ════════════════════════════════════════════════════════════════ */}
      {currentView === 'tiers' && (
        <div className="cp-main-view">
          {/* Top Header */}
          <div className="cp-header-row">
            <div>
              <h1 className="cp-page-title">Communities &amp; properties</h1>
              <p className="cp-page-subtitle">
                Community → Society → Tower → Floor → Flat
              </p>
            </div>
            <div className="cp-header-buttons">
              <button
                type="button"
                className="cp-btn-pill-secondary"
                onClick={() => setIsImportFlatsOpen(true)}
              >
                Import flats
              </button>
              <button
                type="button"
                className="cp-btn-pill-primary"
                onClick={() => setIsAddSocietyOpen(true)}
              >
                + Add society
              </button>
            </div>
          </div>

          {/* 4 Pastel Metric KPI Cards */}
          <div className="cp-kpi-grid">
            <div className="cp-kpi-card kpi-communities">
              <div className="cp-kpi-label">COMMUNITIES</div>
              <div className="cp-kpi-value">3</div>
              <div className="cp-kpi-sub">Golden, Silver, Diamond</div>
            </div>

            <div className="cp-kpi-card kpi-societies">
              <div className="cp-kpi-label">SOCIETIES</div>
              <div className="cp-kpi-value">6</div>
              <div className="cp-kpi-sub">Active across 3 tiers</div>
            </div>

            <div className="cp-kpi-card kpi-units">
              <div className="cp-kpi-label">RESIDENTIAL UNITS</div>
              <div className="cp-kpi-value">2,872</div>
              <div className="cp-kpi-sub">Across all societies</div>
            </div>

            <div className="cp-kpi-card kpi-requests">
              <div className="cp-kpi-label">PENDING REQUESTS</div>
              <div className="cp-kpi-value">54</div>
              <div className="cp-kpi-sub">Matches Services page</div>
            </div>
          </div>

          {/* Search & Community Filter Row */}
          <div className="cp-filter-row">
            <input
              type="text"
              className="cp-search-input"
              placeholder="Search community tiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="cp-community-filter">
              <span className="cp-filter-label">Filter by community:</span>
              <select
                className="cp-filter-select"
                value={communityFilter}
                onChange={(e) => setCommunityFilter(e.target.value)}
              >
                <option value="All communities">All communities</option>
                <option value="Golden">Golden Community</option>
                <option value="Silver">Silver Community</option>
                <option value="Diamond">Diamond Community</option>
              </select>
            </div>
          </div>

          {/* Community Tier Cards Grid (Initially Diamond, Gold, Silver) */}
          <div className="cp-societies-grid">
            {filteredTiers.map((tier) => (
              <div
                key={tier.id}
                className="cp-society-card"
                style={{ borderTop: `3px solid ${tier.borderColor}` }}
              >
                <div className="cp-card-header">
                  <h3 className="cp-card-title">
                    <span style={{ marginRight: '6px' }}>{tier.icon}</span>
                    {tier.name}
                  </h3>
                  <span className="cp-badge-active">● Active</span>
                </div>

                <div className="cp-card-subtitle">
                  {tier.societiesCount} societies · {tier.towersCount} towers
                </div>

                <div className="cp-card-stats-row">
                  <div className="cp-stat-box">
                    <span className="cp-stat-label">Units</span>
                    <span className="cp-stat-num">{tier.units}</span>
                  </div>
                  <div className="cp-stat-box">
                    <span className="cp-stat-label">Pending</span>
                    <span className="cp-stat-num">{tier.pending}</span>
                  </div>
                  <div className="cp-stat-box">
                    <span className="cp-stat-label">Techs</span>
                    <span className="cp-stat-num">{tier.techs}</span>
                  </div>
                </div>

                <div className="cp-card-actions">
                  <button
                    type="button"
                    className="cp-action-pill-btn"
                    onClick={() => {
                      setSelectedTierId(tier.id);
                      setCurrentView('societies');
                    }}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className="cp-action-pill-btn"
                    onClick={() => setEditingTier(tier)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SCREEN 1b: ENCLAVES & SOCIETIES UNDER SELECTED COMMUNITY TIER
          ════════════════════════════════════════════════════════════════ */}
      {currentView === 'societies' && (
        <div className="cp-main-view">
          {/* Breadcrumb Navigation */}
          <div className="cp-breadcrumb">
            <button
              type="button"
              className="cp-breadcrumb-link"
              onClick={() => setCurrentView('tiers')}
            >
              Communities &amp; properties
            </button>
            <span className="cp-breadcrumb-sep">/</span>
            <span className="cp-breadcrumb-current">{activeTier.name}</span>
          </div>

          <div className="cp-header-row" style={{ marginTop: '8px' }}>
            <div>
              <h1 className="cp-page-title">{activeTier.name} — Enclaves &amp; Societies</h1>
              <p className="cp-page-subtitle">
                Managed by Community Admin: <strong>{activeTier.admin.name}</strong> ({activeTier.admin.phone})
              </p>
            </div>
            <div className="cp-header-buttons">
              <button
                type="button"
                className="cp-btn-pill-secondary"
                onClick={() => setCurrentView('tiers')}
              >
                ← Back to Tiers
              </button>
            </div>
          </div>

          {/* Society Cards Grid for Selected Tier */}
          <div className="cp-societies-grid" style={{ marginTop: '20px' }}>
            {tierSocieties.map((soc) => (
              <div
                key={soc.id}
                className="cp-society-card"
                style={{ borderTop: `3px solid ${soc.borderColor}` }}
              >
                <div className="cp-card-header">
                  <h3 className="cp-card-title">{soc.name}</h3>
                  <span className="cp-badge-active">● Active</span>
                </div>

                <div className="cp-card-subtitle">
                  {soc.community} · {soc.towersCount} towers
                </div>

                <div className="cp-card-stats-row">
                  <div className="cp-stat-box">
                    <span className="cp-stat-label">Units</span>
                    <span className="cp-stat-num">{soc.units}</span>
                  </div>
                  <div className="cp-stat-box">
                    <span className="cp-stat-label">Pending</span>
                    <span className="cp-stat-num">{soc.pending}</span>
                  </div>
                  <div className="cp-stat-box">
                    <span className="cp-stat-label">Techs</span>
                    <span className="cp-stat-num">{soc.techs}</span>
                  </div>
                </div>

                <div className="cp-card-actions">
                  <button
                    type="button"
                    className="cp-action-pill-btn"
                    onClick={() => {
                      setSelectedSocietyId(soc.id);
                      setCurrentView('society-detail');
                    }}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className="cp-action-pill-btn"
                    onClick={() => setEditingSociety(soc)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SCREEN 2: SOCIETY DETAIL & TOWERS VIEW (Matching Screenshot 2)
          ════════════════════════════════════════════════════════════════ */}
      {currentView === 'society-detail' && activeSociety && (
        <div className="cp-society-detail-view">
          {/* Breadcrumb Navigation */}
          <div className="cp-breadcrumb">
            <button
              type="button"
              className="cp-breadcrumb-link"
              onClick={() => setCurrentView('tiers')}
            >
              Communities &amp; properties
            </button>
            <span className="cp-breadcrumb-sep">/</span>
            <button
              type="button"
              className="cp-breadcrumb-link"
              onClick={() => setCurrentView('societies')}
            >
              {activeTier.name}
            </button>
            <span className="cp-breadcrumb-sep">/</span>
            <span className="cp-breadcrumb-current">{activeSociety.name}</span>
          </div>

          {/* Society Main Heading */}
          <div className="cp-society-title-block">
            <h1 className="cp-society-title">{activeSociety.name}</h1>
            <p className="cp-society-meta">
              {activeSociety.community} · {activeSociety.units} units · {activeSociety.towersCount} towers
            </p>
          </div>

          {/* Tower Cards Horizontal Row (Side-by-Side) */}
          <div className="cp-towers-row">
            {activeSociety.towers.map((tower) => (
              <div key={tower.id} className="cp-tower-card">
                <div className="cp-tower-card-top">
                  <h3 className="cp-tower-title">{tower.name}</h3>
                  <span className="cp-tower-floors-text">{tower.floors} floors</span>
                </div>

                <div className="cp-tower-subtext">
                  {tower.flatsPerFloor} flats per floor · {tower.totalUnits} units
                </div>

                {/* Blue Progress Bar */}
                <div className="cp-progress-track">
                  <div
                    className="cp-progress-fill"
                    style={{ width: `${tower.progressPercent || 65}%` }}
                  ></div>
                </div>

                <button
                  type="button"
                  className="cp-tower-open-link"
                  onClick={() => {
                    setSelectedTowerCode(tower.code);
                    setCurrentView('floor-map');
                  }}
                >
                  Open floor map →
                </button>
              </div>
            ))}
          </div>

          {/* Service Technicians for this Society */}
          <div className="cp-techs-section">
            <h3 className="cp-techs-heading">Service technicians for this society</h3>
            <div className="cp-techs-list">
              {activeSociety.technicians?.map((tech) => (
                <div key={tech.name} className="cp-tech-name">
                  {tech.name} <span style={{ color: '#64748B', fontSize: '0.78rem' }}>({tech.specialty})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SCREEN 3: TOWER FLOOR MAP VIEW (Matching Screenshot 3)
          ════════════════════════════════════════════════════════════════ */}
      {currentView === 'floor-map' && activeSociety && (
        <div className="cp-floor-map-view">
          {/* Breadcrumb Navigation */}
          <div className="cp-breadcrumb">
            <button
              type="button"
              className="cp-breadcrumb-link"
              onClick={() => setCurrentView('tiers')}
            >
              Communities &amp; properties
            </button>
            <span className="cp-breadcrumb-sep">/</span>
            <button
              type="button"
              className="cp-breadcrumb-link"
              onClick={() => setCurrentView('societies')}
            >
              {activeTier.name}
            </button>
            <span className="cp-breadcrumb-sep">/</span>
            <button
              type="button"
              className="cp-breadcrumb-link"
              onClick={() => setCurrentView('society-detail')}
            >
              {activeSociety.name}
            </button>
            <span className="cp-breadcrumb-sep">/</span>
            <span className="cp-breadcrumb-current">{activeTower.name} · Floor map</span>
          </div>

          {/* Floor Map Title & Status Legend */}
          <div className="cp-map-header-row">
            <div>
              <h1 className="cp-map-title">{activeTower.name} · Floor map</h1>
              <p className="cp-map-subtitle">Tap a flat to open its profile</p>
            </div>

            {/* Top Right Status Legend */}
            <div className="cp-status-legend">
              <span className="cp-legend-item">
                <span className="legend-dot dot-occupied"></span> Occupied
              </span>
              <span className="cp-legend-item">
                <span className="legend-dot dot-open-request"></span> Open request
              </span>
              <span className="cp-legend-item">
                <span className="legend-dot dot-dues-overdue"></span> Dues overdue
              </span>
              <span className="cp-legend-item">
                <span className="legend-dot dot-vacant"></span> Vacant
              </span>
            </div>
          </div>

          {/* 8-Floor Elevation Matrix (Full Width) */}
          <div className="cp-elevation-canvas">
            {Array.from({ length: 8 }, (_, idx) => 8 - idx).map((floorNum) => (
              <div key={floorNum} className="cp-floor-row">
                <span className="cp-floor-label">Floor {floorNum}</span>
                <div className="cp-flats-row">
                  {Array.from({ length: 6 }, (_, flatIdx) => flatIdx + 1).map((flatIdx) => {
                    const status = getFlatStatus(activeTower.code, floorNum, flatIdx);
                    const flatCode = `${activeTower.code}-${floorNum}${String(flatIdx).padStart(2, '0')}`;
                    return (
                      <button
                        key={flatCode}
                        type="button"
                        className={`cp-flat-cell cell-${status}`}
                        onClick={() => handleOpenUnitDossier(floorNum, flatIdx)}
                        title={`Flat ${flatCode} (${status}) — Tap to view full profile & raise tickets`}
                      >
                        {flatCode}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footnote Note */}
          <p className="cp-map-footer-note">
            Flat numbers use Tower-Floor-Flat format, e.g. A-101 is Tower A, floor 1, flat 01.
          </p>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          COMPREHENSIVE UNIT DOSSIER MODAL WITH FULL FUNCTIONALITIES
          (Ticket Raising, Tenant/Owner Info, Bills & Dues, Team Admins)
          ════════════════════════════════════════════════════════════════ */}
      {activeDossier && (
        <div className="cp-modal-backdrop" onClick={() => setActiveDossier(null)}>
          <div className="cp-dossier-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="cp-modal-header">
              <div>
                <span className="cp-modal-eyebrow">RESIDENTIAL UNIT DOSSIER</span>
                <h2 className="cp-modal-title">
                  Flat {activeDossier.flatNumber} — {activeSociety.name}
                </h2>
              </div>
              <button
                type="button"
                className="cp-modal-close"
                onClick={() => setActiveDossier(null)}
              >
                ✕
              </button>
            </div>

            {/* Dossier Tabs Bar */}
            <div className="cp-dossier-tabs-bar">
              <button
                type="button"
                className={`cp-dossier-tab-btn ${dossierTab === 'owner-tenant' ? 'active' : ''}`}
                onClick={() => {
                  setDossierTab('owner-tenant');
                  setIsRaisingTicket(false);
                }}
              >
                👤 Owner &amp; Tenant
              </button>
              <button
                type="button"
                className={`cp-dossier-tab-btn ${dossierTab === 'bills' ? 'active' : ''}`}
                onClick={() => {
                  setDossierTab('bills');
                  setIsRaisingTicket(false);
                }}
              >
                💳 Bills &amp; Dues
              </button>
              <button
                type="button"
                className={`cp-dossier-tab-btn ${dossierTab === 'tickets' ? 'active' : ''}`}
                onClick={() => {
                  setDossierTab('tickets');
                  setIsRaisingTicket(false);
                }}
              >
                🛠️ Service Tickets ({activeDossier.tickets?.length || 0})
              </button>
              <button
                type="button"
                className={`cp-dossier-tab-btn ${dossierTab === 'admins' ? 'active' : ''}`}
                onClick={() => {
                  setDossierTab('admins');
                  setIsRaisingTicket(false);
                }}
              >
                🏢 Team Admins
              </button>
              <button
                type="button"
                className={`cp-dossier-tab-btn ${dossierTab === 'specs' ? 'active' : ''}`}
                onClick={() => {
                  setDossierTab('specs');
                  setIsRaisingTicket(false);
                }}
              >
                📋 Unit Specs
              </button>
            </div>

            {/* Body */}
            <div className="cp-modal-body">
              {/* Top Status Bar */}
              <div className="cp-profile-status-bar">
                <span className={`cp-status-pill status-${activeDossier.statusType}`}>
                  ● {activeDossier.statusText}
                </span>
                <span className="cp-bhk-tag">{activeDossier.bhk}</span>
              </div>

              {/* TAB 1: OWNER & TENANT INFORMATION */}
              {dossierTab === 'owner-tenant' && (
                <div className="cp-dossier-tab-content">
                  {/* Owner Card */}
                  <div className="cp-dossier-section-box">
                    <h4 className="cp-section-box-title">Registered Property Owner</h4>
                    <div className="cp-profile-field-grid">
                      <div className="cp-field-item">
                        <label>Owner Full Name</label>
                        <div>{activeDossier.owner.name}</div>
                      </div>
                      <div className="cp-field-item">
                        <label>Ownership Status</label>
                        <div style={{ color: '#059669' }}>{activeDossier.owner.ownershipType}</div>
                      </div>
                      <div className="cp-field-item">
                        <label>Direct Phone</label>
                        <div>
                          <a href={`tel:${activeDossier.owner.phone}`} className="cp-tel-link">
                            {activeDossier.owner.phone}
                          </a>
                        </div>
                      </div>
                      <div className="cp-field-item">
                        <label>Email Address</label>
                        <div>
                          <a href={`mailto:${activeDossier.owner.email}`} className="cp-tel-link">
                            {activeDossier.owner.email}
                          </a>
                        </div>
                      </div>
                      <div className="cp-field-item">
                        <label>Possession Date</label>
                        <div>{activeDossier.owner.possession}</div>
                      </div>
                      <div className="cp-field-item">
                        <label>PAN &amp; KYC Verification</label>
                        <div style={{ color: '#059669', fontWeight: 700 }}>
                          ✓ {activeDossier.owner.panStatus}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tenant Card (If applicable) */}
                  {activeDossier.isRented && activeDossier.tenant ? (
                    <div className="cp-dossier-section-box" style={{ marginTop: '12px' }}>
                      <h4 className="cp-section-box-title">Active Tenant Information</h4>
                      <div className="cp-profile-field-grid">
                        <div className="cp-field-item">
                          <label>Tenant Name</label>
                          <div>{activeDossier.tenant.name}</div>
                        </div>
                        <div className="cp-field-item">
                          <label>Monthly Rent</label>
                          <div style={{ fontWeight: 700, color: '#1D4ED8' }}>
                            {activeDossier.tenant.rent}
                          </div>
                        </div>
                        <div className="cp-field-item">
                          <label>Tenant Phone</label>
                          <div>
                            <a href={`tel:${activeDossier.tenant.phone}`} className="cp-tel-link">
                              {activeDossier.tenant.phone}
                            </a>
                          </div>
                        </div>
                        <div className="cp-field-item">
                          <label>Lease Expiry</label>
                          <div>{activeDossier.tenant.leaseEnd}</div>
                        </div>
                        <div className="cp-field-item">
                          <label>Police Verification</label>
                          <div style={{ color: '#059669', fontWeight: 600 }}>
                            ✓ {activeDossier.tenant.policeVerification}
                          </div>
                        </div>
                        <div className="cp-field-item">
                          <label>Registered Agreement</label>
                          <div style={{ color: '#059669', fontWeight: 600 }}>
                            ✓ {activeDossier.tenant.agreementRegistered}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="cp-empty-banner">
                      {activeDossier.statusType === 'vacant'
                        ? 'Unit is currently unoccupied and ready for new tenancy or move-in.'
                        : 'Unit is Owner-Occupied. No active tenant lease on record.'}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: BILLS & DUES (MAINTENANCE) */}
              {dossierTab === 'bills' && (
                <div className="cp-dossier-tab-content">
                  <div className="cp-dues-banner">
                    <div>
                      <div className="cp-dues-label">OUTSTANDING MAINTENANCE DUES</div>
                      <div className="cp-dues-amount">{activeDossier.billing.duesAmount}</div>
                      <div className="cp-dues-cycle">
                        Billing Period: {activeDossier.billing.cycle} · Due Date: {activeDossier.billing.dueDate}
                      </div>
                    </div>

                    <div>
                      {activeDossier.billing.duesStatus === 'Overdue' ? (
                        <button
                          type="button"
                          className="cp-btn-pill-primary"
                          onClick={handleMarkDuesPaid}
                        >
                          ✓ Record Payment / Mark Paid
                        </button>
                      ) : (
                        <span className="cp-badge-paid">✓ Paid &amp; Clear</span>
                      )}
                    </div>
                  </div>

                  {/* Breakdown Table */}
                  <div className="cp-dossier-section-box" style={{ marginTop: '14px' }}>
                    <h4 className="cp-section-box-title">Monthly Assessment Breakdown</h4>
                    <div className="cp-billing-table">
                      {activeDossier.billing.breakdown.map((item, idx) => (
                        <div key={idx} className="cp-billing-row">
                          <span>{item.item}</span>
                          <strong>{item.amount}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SERVICE TICKETS & TICKET RAISING */}
              {dossierTab === 'tickets' && (
                <div className="cp-dossier-tab-content">
                  {!isRaisingTicket ? (
                    <>
                      <div className="cp-tickets-header-row">
                        <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>
                          Service Requests for Flat {activeDossier.flatNumber}
                        </span>
                        <button
                          type="button"
                          className="cp-btn-pill-primary"
                          onClick={() => setIsRaisingTicket(true)}
                        >
                          + Raise New Ticket
                        </button>
                      </div>

                      {activeDossier.tickets && activeDossier.tickets.length > 0 ? (
                        <div className="cp-tickets-list">
                          {activeDossier.tickets.map((t) => (
                            <div key={t.id} className="cp-ticket-card">
                              <div className="cp-ticket-card-top">
                                <strong>{t.service}</strong>
                                <span className={`cp-ticket-status status-${t.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                  ● {t.status}
                                </span>
                              </div>
                              <p className="cp-ticket-desc">{t.description}</p>
                              <div className="cp-ticket-meta">
                                <span>Ticket ID: <strong>{t.id}</strong></span>
                                <span>Tech: <strong>{t.assignedTech}</strong></span>
                                <span>Raised: <strong>{t.dateRaised}</strong></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="cp-empty-banner">
                          No open service tickets for this unit. Tap &quot;+ Raise New Ticket&quot; to file a repair request.
                        </div>
                      )}
                    </>
                  ) : (
                    /* Ticket Raising Form */
                    <form onSubmit={handleRaiseTicketSubmit} className="cp-ticket-form">
                      <h4 className="cp-section-box-title">Raise New Service Ticket</h4>

                      <div className="cp-form-group">
                        <label>Service Category *</label>
                        <select
                          className="cp-form-select"
                          value={newTicketForm.service}
                          onChange={(e) =>
                            setNewTicketForm({ ...newTicketForm, service: e.target.value })
                          }
                        >
                          <option value="Electrical Repair">Electrical Repair</option>
                          <option value="Plumbing Repair">Plumbing Repair</option>
                          <option value="AC Maintenance & Gas">AC Maintenance &amp; Gas</option>
                          <option value="Carpentry & Woodwork">Carpentry &amp; Woodwork</option>
                          <option value="Civil & Masonry">Civil &amp; Masonry</option>
                          <option value="Deep Cleaning & Pest Control">Deep Cleaning &amp; Pest Control</option>
                        </select>
                      </div>

                      <div className="cp-form-group">
                        <label>Issue Description *</label>
                        <textarea
                          rows={3}
                          required
                          className="cp-form-input"
                          placeholder="Describe the problem, resident availability, and urgency..."
                          value={newTicketForm.description}
                          onChange={(e) =>
                            setNewTicketForm({ ...newTicketForm, description: e.target.value })
                          }
                        />
                      </div>

                      <div className="cp-form-row-2">
                        <div className="cp-form-group">
                          <label>Priority</label>
                          <select
                            className="cp-form-select"
                            value={newTicketForm.priority}
                            onChange={(e) =>
                              setNewTicketForm({ ...newTicketForm, priority: e.target.value })
                            }
                          >
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                            <option value="Emergency">Emergency</option>
                          </select>
                        </div>
                        <div className="cp-form-group">
                          <label>Assign Service Technician</label>
                          <select
                            className="cp-form-select"
                            value={newTicketForm.assignedTech}
                            onChange={(e) =>
                              setNewTicketForm({ ...newTicketForm, assignedTech: e.target.value })
                            }
                          >
                            <option value="Suresh Babu (+91 98765 11223)">Suresh Babu (+91 98765 11223)</option>
                            <option value="Mahesh Reddy (+91 98765 22334)">Mahesh Reddy (+91 98765 22334)</option>
                          </select>
                        </div>
                      </div>

                      <div className="cp-ticket-form-actions">
                        <button
                          type="button"
                          className="cp-btn-pill-secondary"
                          onClick={() => setIsRaisingTicket(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="cp-btn-pill-primary">
                          Dispatch &amp; Save Ticket
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 4: GOVERNANCE ADMINS (From Team & Access) */}
              {dossierTab === 'admins' && (
                <div className="cp-dossier-tab-content">
                  <div className="cp-dossier-section-box">
                    <h4 className="cp-section-box-title">Governance &amp; Administrative Contacts</h4>
                    <div className="cp-admin-contact-list">
                      <div className="cp-admin-contact-row">
                        <div>
                          <span className="cp-admin-tier-tag">Community Admin</span>
                          <div className="cp-admin-name">{activeDossier.admins.communityAdmin}</div>
                        </div>
                        <a href={`tel:${activeDossier.admins.communityPhone}`} className="cp-action-pill-btn">
                          {activeDossier.admins.communityPhone}
                        </a>
                      </div>

                      <div className="cp-admin-contact-row">
                        <div>
                          <span className="cp-admin-tier-tag">Society Estate Manager</span>
                          <div className="cp-admin-name">{activeDossier.admins.societyAdmin}</div>
                        </div>
                        <a href={`tel:${activeDossier.admins.societyPhone}`} className="cp-action-pill-btn">
                          {activeDossier.admins.societyPhone}
                        </a>
                      </div>

                      <div className="cp-admin-contact-row">
                        <div>
                          <span className="cp-admin-tier-tag">Tower Facility In-Charge</span>
                          <div className="cp-admin-name">{activeDossier.admins.towerAdmin}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                            Shift: {activeDossier.admins.towerShift}
                          </div>
                        </div>
                        <a href={`tel:${activeDossier.admins.towerPhone}`} className="cp-action-pill-btn">
                          {activeDossier.admins.towerPhone}
                        </a>
                      </div>

                      <div className="cp-admin-contact-row">
                        <div>
                          <span className="cp-admin-tier-tag">Assigned Lead Technician</span>
                          <div className="cp-admin-name">{activeDossier.admins.assignedTech}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: UNIT SPECS */}
              {dossierTab === 'specs' && (
                <div className="cp-dossier-tab-content">
                  <div className="cp-profile-field-grid">
                    <div className="cp-field-item">
                      <label>Tower &amp; Floor</label>
                      <div>{activeTower.name} · {activeDossier.floor}</div>
                    </div>
                    <div className="cp-field-item">
                      <label>Configuration</label>
                      <div>{activeDossier.bhk}</div>
                    </div>
                    <div className="cp-field-item">
                      <label>Vastu &amp; Facing</label>
                      <div>{activeDossier.facing}</div>
                    </div>
                    <div className="cp-field-item">
                      <label>Reserved Parking</label>
                      <div>{activeDossier.parkingSlots}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="cp-modal-footer">
              <button
                type="button"
                className="cp-btn-pill-primary"
                onClick={() => setActiveDossier(null)}
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: + Add Society ────────────────────────────────────────── */}
      {isAddSocietyOpen && (
        <div className="cp-modal-backdrop" onClick={() => setIsAddSocietyOpen(false)}>
          <div className="cp-action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cp-modal-header">
              <div>
                <span className="cp-modal-eyebrow">ENCLAVE / RESIDENTIAL MANAGEMENT</span>
                <h3 className="cp-modal-title">+ Add New Society</h3>
              </div>
              <button
                type="button"
                className="cp-modal-close"
                onClick={() => setIsAddSocietyOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSocietySubmit}>
              <div className="cp-modal-body">
                <div className="cp-form-group">
                  <label>Society / Enclave Name *</label>
                  <input
                    type="text"
                    required
                    className="cp-form-input"
                    placeholder="e.g. Emerald Heights"
                    value={newSocietyForm.name}
                    onChange={(e) =>
                      setNewSocietyForm({ ...newSocietyForm, name: e.target.value })
                    }
                  />
                </div>

                <div className="cp-form-group">
                  <label>Assign Under Community Tier *</label>
                  <select
                    className="cp-form-select"
                    value={newSocietyForm.communityId}
                    onChange={(e) =>
                      setNewSocietyForm({ ...newSocietyForm, communityId: e.target.value })
                    }
                  >
                    <option value="diamond">💎 Diamond Communities</option>
                    <option value="gold">⭐ Gold Communities</option>
                    <option value="silver">🛡️ Silver Communities</option>
                  </select>
                </div>

                <div className="cp-form-row-2">
                  <div className="cp-form-group">
                    <label>Towers Count</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      className="cp-form-input"
                      value={newSocietyForm.towersCount}
                      onChange={(e) =>
                        setNewSocietyForm({ ...newSocietyForm, towersCount: e.target.value })
                      }
                    />
                  </div>
                  <div className="cp-form-group">
                    <label>Residential Units</label>
                    <input
                      type="number"
                      min={10}
                      className="cp-form-input"
                      value={newSocietyForm.units}
                      onChange={(e) =>
                        setNewSocietyForm({ ...newSocietyForm, units: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="cp-form-row-2">
                  <div className="cp-form-group">
                    <label>Society Estate Manager Name</label>
                    <input
                      type="text"
                      className="cp-form-input"
                      placeholder="e.g. K. Raman"
                      value={newSocietyForm.adminName}
                      onChange={(e) =>
                        setNewSocietyForm({ ...newSocietyForm, adminName: e.target.value })
                      }
                    />
                  </div>
                  <div className="cp-form-group">
                    <label>Manager Phone Number</label>
                    <input
                      type="tel"
                      className="cp-form-input"
                      placeholder="+91 98450 00000"
                      value={newSocietyForm.adminPhone}
                      onChange={(e) =>
                        setNewSocietyForm({ ...newSocietyForm, adminPhone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="cp-modal-footer">
                <button
                  type="button"
                  className="cp-btn-pill-secondary"
                  onClick={() => setIsAddSocietyOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cp-btn-pill-primary">
                  Create Society
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Import Flats Roster ──────────────────────────────────── */}
      {isImportFlatsOpen && (
        <div className="cp-modal-backdrop" onClick={() => setIsImportFlatsOpen(false)}>
          <div className="cp-action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cp-modal-header">
              <div>
                <span className="cp-modal-eyebrow">BULK DATA SYNC</span>
                <h3 className="cp-modal-title">Import Residential Flats</h3>
              </div>
              <button
                type="button"
                className="cp-modal-close"
                onClick={() => setIsImportFlatsOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="cp-modal-body">
              <div className="cp-drop-zone" onClick={handleImportFlats}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                  Click to choose CSV or Excel spreadsheet
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                  Supports .csv, .xlsx format (Tower, Floor, Flat, Resident, Status)
                </div>
              </div>
            </div>
            <div className="cp-modal-footer">
              <button
                type="button"
                className="cp-btn-pill-secondary"
                onClick={() => setIsImportFlatsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cp-btn-pill-primary"
                onClick={handleImportFlats}
              >
                Import Demo Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Edit Community Tier ─────────────────────────────────── */}
      {editingTier && (
        <div className="cp-modal-backdrop" onClick={() => setEditingTier(null)}>
          <div className="cp-action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cp-modal-header">
              <div>
                <span className="cp-modal-eyebrow">COMMUNITY GOVERNANCE</span>
                <h3 className="cp-modal-title">Edit {editingTier.name}</h3>
              </div>
              <button
                type="button"
                className="cp-modal-close"
                onClick={() => setEditingTier(null)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditTierSubmit}>
              <div className="cp-modal-body">
                <div className="cp-form-group">
                  <label>Tier Name</label>
                  <input
                    type="text"
                    required
                    className="cp-form-input"
                    value={editingTier.name}
                    onChange={(e) =>
                      setEditingTier({ ...editingTier, name: e.target.value })
                    }
                  />
                </div>
                <div className="cp-form-group">
                  <label>Community Operations Lead</label>
                  <input
                    type="text"
                    className="cp-form-input"
                    value={editingTier.admin?.name || ''}
                    onChange={(e) =>
                      setEditingTier({
                        ...editingTier,
                        admin: { ...editingTier.admin, name: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="cp-form-group">
                  <label>Lead Admin Phone</label>
                  <input
                    type="tel"
                    className="cp-form-input"
                    value={editingTier.admin?.phone || ''}
                    onChange={(e) =>
                      setEditingTier({
                        ...editingTier,
                        admin: { ...editingTier.admin, phone: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="cp-modal-footer">
                <button
                  type="button"
                  className="cp-btn-pill-secondary"
                  onClick={() => setEditingTier(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="cp-btn-pill-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Edit Society ─────────────────────────────────────────── */}
      {editingSociety && (
        <div className="cp-modal-backdrop" onClick={() => setEditingSociety(null)}>
          <div className="cp-action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cp-modal-header">
              <div>
                <span className="cp-modal-eyebrow">SOCIETY SETTINGS</span>
                <h3 className="cp-modal-title">Edit {editingSociety.name}</h3>
              </div>
              <button
                type="button"
                className="cp-modal-close"
                onClick={() => setEditingSociety(null)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSocietySubmit}>
              <div className="cp-modal-body">
                <div className="cp-form-group">
                  <label>Society Name</label>
                  <input
                    type="text"
                    required
                    className="cp-form-input"
                    value={editingSociety.name}
                    onChange={(e) =>
                      setEditingSociety({ ...editingSociety, name: e.target.value })
                    }
                  />
                </div>
                <div className="cp-form-row-2">
                  <div className="cp-form-group">
                    <label>Residential Units</label>
                    <input
                      type="number"
                      className="cp-form-input"
                      value={editingSociety.units}
                      onChange={(e) =>
                        setEditingSociety({
                          ...editingSociety,
                          units: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="cp-form-group">
                    <label>Active Techs</label>
                    <input
                      type="number"
                      className="cp-form-input"
                      value={editingSociety.techs}
                      onChange={(e) =>
                        setEditingSociety({
                          ...editingSociety,
                          techs: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="cp-form-group">
                  <label>Society Estate Manager</label>
                  <input
                    type="text"
                    className="cp-form-input"
                    value={editingSociety.societyAdmin?.name || ''}
                    onChange={(e) =>
                      setEditingSociety({
                        ...editingSociety,
                        societyAdmin: {
                          ...editingSociety.societyAdmin,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="cp-modal-footer">
                <button
                  type="button"
                  className="cp-btn-pill-secondary"
                  onClick={() => setEditingSociety(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="cp-btn-pill-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Toast Feedback Notification ─────────────────────────────────── */}
      {toastMessage && (
        <div className="cp-toast" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

