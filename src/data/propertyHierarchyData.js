import suryaHeightsImg from '../assets/surya heights.jpg';
import loginBg from '../assets/login-bg.jpg';
import sunriseImg from '../assets/sunrie.jpg';
import skylineImg from '../assets/skyline.jpg';

/* ===================================================================
   LEVEL 1: COMMUNITY TIERS (Diamond, Gold, Silver)
   =================================================================== */
export const COMMUNITY_TIERS = [
  {
    id: 'diamond',
    tier: 'Diamond',
    name: 'Diamond Communities',

    icon: 'diamond',
    tagline: 'Ultra-Luxury High-Rise & Concierge Communities',
    description: 'Premier gated sky-villas and high-rises with 5-star concierge, smart building automation, and Olympic sports complexes.',
    accentColor: '#0284C7',
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #1D4ED8 100%)',
    communityAdmin: {
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
    tier: 'Gold',
    name: 'Gold Communities',

    icon: 'gold',
    tagline: 'Premium Executive Residential Enclaves',
    description: 'Elite residential enclaves featuring dedicated agency maintenance teams, landscaped clubhouse facilities, and power backup.',
    accentColor: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    communityAdmin: {
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
    tier: 'Silver',
    name: 'Silver Communities',

    icon: 'silver',
    tagline: 'Contemporary Green & Smart Living Societies',
    description: 'Sustainable, family-first residential societies with green parks, 24/7 security, and community-driven resident associations.',
    accentColor: '#475569',
    badgeBg: '#F1F5F9',
    badgeText: '#334155',
    gradient: 'linear-gradient(135deg, #64748B 0%, #334155 100%)',
    communityAdmin: {
      name: 'Sunita Deshmukh',
      role: 'Silver Community Regional Director',
      phone: '+91 98330 99881',
      email: 'silver.admin@zivion.example',
      office: 'Silver Regional Office, Kondapur',
    },
    societyIds: ['silver-oak', 'greenwood'],
  },
];

/* Helper to build 10-15 towers per society with distinct admins */
const TOWER_NAMES = [
  { code: 'A', name: 'Tower A - Alpha', admin: 'K. Srinivas', phone: '+91 97001 22331' },
  { code: 'B', name: 'Tower B - Bellevue', admin: 'P. Ananya', phone: '+91 97001 22332' },
  { code: 'C', name: 'Tower C - Crown', admin: 'M. Venkatesh', phone: '+91 97001 22333' },
  { code: 'D', name: 'Tower D - Diamond', admin: 'S. Neha', phone: '+91 97001 22334' },
  { code: 'E', name: 'Tower E - Emerald', admin: 'R. Karthik', phone: '+91 97001 22335' },
  { code: 'F', name: 'Tower F - Fortune', admin: 'T. Bhavana', phone: '+91 97001 22336' },
  { code: 'G', name: 'Tower G - Grandeur', admin: 'V. Naresh', phone: '+91 97001 22337' },
  { code: 'H', name: 'Tower H - Horizon', admin: 'D. Pallavi', phone: '+91 97001 22338' },
  { code: 'I', name: 'Tower I - Imperial', admin: 'A. Subhash', phone: '+91 97001 22339' },
  { code: 'J', name: 'Tower J - Jewel', admin: 'N. Radhika', phone: '+91 97001 22340' },
  { code: 'K', name: 'Tower K - Kingdom', admin: 'C. Manoj', phone: '+91 97001 22341' },
  { code: 'L', name: 'Tower L - Lotus', admin: 'G. Shweta', phone: '+91 97001 22342' },
  { code: 'M', name: 'Tower M - Monarch', admin: 'H. Pradeep', phone: '+91 97001 22343' },
  { code: 'N', name: 'Tower N - Nebula', admin: 'B. Sravani', phone: '+91 97001 22344' },
  { code: 'O', name: 'Tower O - Orbit', admin: 'J. Rohit', phone: '+91 97001 22345' },
];

function generateTowersForSociety(societyId, count = 12, floorsCount = 10) {
  return TOWER_NAMES.slice(0, count).map((t, idx) => {
    const floors = floorsCount;
    const flatsPerFloor = 4;
    const totalUnits = floors * flatsPerFloor;
    const occupancyRate = 88 + ((idx * 7) % 11); // 88% - 98%
    const pendingRequests = (idx * 3 + 1) % 6;

    return {
      id: `${societyId}-${t.code.toLowerCase()}`,
      societyId,
      code: t.code,
      name: t.name,
      floors,
      flatsPerFloor,
      totalUnits,
      occupancyRate,
      pendingRequests,
      status: 'Operational',
      towerAdmin: {
        name: t.admin,
        role: `Tower ${t.code} Facility In-Charge`,
        phone: t.phone,
        email: `admin.tower${t.code.toLowerCase()}@zivion.example`,
        shift: idx % 2 === 0 ? 'Morning (07:00 - 15:30)' : 'General (09:30 - 18:00)',
      },
    };
  });
}

/* ===================================================================
   LEVEL 2: ENCLAVES / SOCIETIES (Under Communities)
   =================================================================== */
export const INITIAL_SOCIETIES = [
  {
    id: 'skyline',
    name: 'Skyline Homes',
    enclaveName: 'Skyline Luxury Enclave',
    communityId: 'diamond',
    tier: 'Diamond',
    location: 'Financial District, Hyderabad, Telangana',
    pincode: '500032',
    type: 'Gated Luxury Enclave',
    status: 'Active',
    image: skylineImg,
    description: 'Ultra-modern 12-tower sky enclave with sky bridges, smart IoT amenities, and dedicated concierge desk.',
    societyAdmin: {
      name: 'Arjun Singhania',
      role: 'Society Estate Manager',
      phone: '+91 98765 67870',
      email: 'arjun.singhania@skyline.example',
      office: 'Clubhouse Level 2, Skyline Enclave',
    },
    techniciansCount: 16,
    activeRequests: 23,
    towers: generateTowersForSociety('skyline', 12, 12),
  },
  {
    id: 'sunrise',
    name: 'Sunrise Heights',
    enclaveName: 'Sunrise Panache Enclave',
    communityId: 'diamond',
    tier: 'Diamond',
    location: 'HITEC City, Hyderabad, Telangana',
    pincode: '500081',
    type: 'Luxury Residential Society',
    status: 'Active',
    image: sunriseImg,
    description: 'High-rise residential towers situated next to the IT corridor with private gardens and club amenities.',
    societyAdmin: {
      name: 'Arya Nambiar',
      role: 'Society Administrator',
      phone: '+91 98765 67890',
      email: 'arya.n@sunrise.example',
      office: 'Tower A Admin Suite, Sunrise Heights',
    },
    techniciansCount: 10,
    activeRequests: 3,
    towers: generateTowersForSociety('sunrise', 10, 10),
  },
  {
    id: 'surya',
    name: 'Surya Enclave',
    enclaveName: 'Surya Heritage Enclave',
    communityId: 'gold',
    tier: 'Gold',
    location: 'Gachibowli, Hyderabad, Telangana',
    pincode: '500075',
    type: 'Gated High-Rise Community',
    status: 'Active',
    image: suryaHeightsImg,
    description: 'Sprawling 14-tower premium enclave with comprehensive sports facilities and 24/7 power backup.',
    societyAdmin: {
      name: 'Ravi Kumar',
      role: 'Senior Estate Manager',
      phone: '+91 98765 43210',
      email: 'ravi.kumar@surya.example',
      office: 'Central Gatehouse Management Office',
    },
    techniciansCount: 12,
    activeRequests: 12,
    towers: generateTowersForSociety('surya', 14, 11),
  },
  {
    id: 'golden-orbit',
    name: 'Golden Orbit',
    enclaveName: 'Golden Orbit Enclave',
    communityId: 'gold',
    tier: 'Gold',
    location: 'Madhapur, Hyderabad, Telangana',
    pincode: '500084',
    type: 'Executive Apartment Complex',
    status: 'Active',
    image: loginBg,
    description: 'Prime executive residence complex with direct access to metro and dedicated agency maintenance support.',
    societyAdmin: {
      name: 'Vishwa Patel',
      role: 'Operations Administrator',
      phone: '+91 98765 12345',
      email: 'vishwa.patel@goldenorbit.example',
      office: 'Block B Ground Management Suite',
    },
    techniciansCount: 8,
    activeRequests: 5,
    towers: generateTowersForSociety('golden-orbit', 11, 10),
  },
  {
    id: 'silver-oak',
    name: 'Silver Oak Enclave',
    enclaveName: 'Silver Oak Garden Enclave',
    communityId: 'silver',
    tier: 'Silver',
    location: 'Kondapur, Hyderabad, Telangana',
    pincode: '500084',
    type: 'Garden Residential Enclave',
    status: 'Active',
    image: suryaHeightsImg,
    description: 'Peaceful garden enclave with abundant green cover, walking trails, and responsive facility support.',
    societyAdmin: {
      name: 'Karan Verma',
      role: 'Society Manager',
      phone: '+91 98112 33445',
      email: 'karan.verma@silveroak.example',
      office: 'Main Community Hall Office',
    },
    techniciansCount: 7,
    activeRequests: 4,
    towers: generateTowersForSociety('silver-oak', 10, 9),
  },
  {
    id: 'greenwood',
    name: 'Greenwood Society',
    enclaveName: 'Greenwood Heights Enclave',
    communityId: 'silver',
    tier: 'Silver',
    location: 'Jubilee Hills Extension, Hyderabad, Telangana',
    pincode: '500033',
    type: 'Contemporary Residential Society',
    status: 'Active',
    image: skylineImg,
    description: 'Modern residential society tailored for professionals and families with high-speed fiber infrastructure.',
    societyAdmin: {
      name: 'Pooja Hegde',
      role: 'Resident Welfare Administrator',
      phone: '+91 98990 66778',
      email: 'pooja.hegde@greenwood.example',
      office: 'Greenwood Administrative Suite',
    },
    techniciansCount: 9,
    activeRequests: 7,
    towers: generateTowersForSociety('greenwood', 12, 10),
  },
];

/* Sample resident names for realistic unit generation */
const OWNER_POOL = [
  { name: 'Dr. Ramesh Chandra', phone: '+91 98451 98451', email: 'ramesh.chandra@gmail.com', possession: 'March 2021' },
  { name: 'Sunil & Anita Joshi', phone: '+91 98760 12345', email: 'sunil.joshi@outlook.com', possession: 'January 2022' },
  { name: 'Kavitha Krishnamurthy', phone: '+91 98234 56789', email: 'kavitha.k@tcs.example', possession: 'November 2020' },
  { name: 'Amitabh Sengupta', phone: '+91 97123 45678', email: 'amitabh.s@wipro.example', possession: 'June 2023' },
  { name: 'Naveen Reddy & Archana', phone: '+91 99001 23456', email: 'naveen.reddy@gmail.com', possession: 'August 2019' },
  { name: 'Meenakshi Sundaram', phone: '+91 98402 34567', email: 'meenakshi.s@infosys.example', possession: 'December 2021' },
  { name: 'Col. Rajesh Bakshi (Retd.)', phone: '+91 98100 87654', email: 'col.bakshi@defence.example', possession: 'February 2018' },
  { name: 'Sneha & Prateek Nair', phone: '+91 97400 11223', email: 'prateek.nair@microsoft.example', possession: 'July 2022' },
  { name: 'Harish Choudhary', phone: '+91 98888 77665', email: 'harish.c@choudharygroup.example', possession: 'April 2020' },
  { name: 'Deepa & Sanjay Agarwal', phone: '+91 99444 33221', email: 'sanjay.agarwal@gmail.com', possession: 'September 2021' },
];

const TENANT_POOL = [
  { name: 'Rohit & Megha Varma', phone: '+91 98712 34567', email: 'rohit.varma@outlook.com', leaseEnd: 'December 2026', rent: '₹48,000/mo' },
  { name: 'Divya Nambisan', phone: '+91 98199 44332', email: 'divya.nambisan@amazon.example', leaseEnd: 'March 2027', rent: '₹42,000/mo' },
  { name: 'Gaurav & Neha Kapoor', phone: '+91 99201 55667', email: 'gaurav.k@google.example', leaseEnd: 'October 2026', rent: '₹55,000/mo' },
  { name: 'Siddharth Iyer', phone: '+91 98410 77889', email: 'siddharth.iyer@fintech.example', leaseEnd: 'June 2027', rent: '₹38,000/mo' },
  { name: 'Farhan & Sana Mirza', phone: '+91 98210 99887', email: 'farhan.mirza@consulting.example', leaseEnd: 'August 2026', rent: '₹50,000/mo' },
];

/* Generate detailed Unit Dossier */
export function getUnitDetails(society, tower, floorNum, unitIndex) {
  const flatNumber = `${floorNum}${String(unitIndex).padStart(2, '0')}`;
  const seed = (flatNumber.charCodeAt(0) * 17 + floorNum * 13 + unitIndex * 7 + (tower?.code?.charCodeAt(0) || 65)) % 100;

  // Status distribution: 55% Owner Occupied, 30% Rented, 10% Vacant, 5% Maintenance
  let status = 'Occupied (Owner)';
  let occupancyType = 'Owner Occupied';
  let tenant = null;

  if (seed >= 85 && seed < 95) {
    status = 'Vacant';
    occupancyType = 'Vacant (Ready to Move)';
  } else if (seed >= 95) {
    status = 'Under Maintenance';
    occupancyType = 'Under Renovation / Inspection';
  } else if (seed >= 55) {
    status = 'Rented (Tenant)';
    occupancyType = 'Leased to Tenant';
    const tenantIdx = (seed + floorNum) % TENANT_POOL.length;
    tenant = TENANT_POOL[tenantIdx];
  }

  const ownerIdx = (seed + unitIndex) % OWNER_POOL.length;
  const owner = OWNER_POOL[ownerIdx];

  const bhkTypes = ['2 BHK Luxury (1,380 sq.ft)', '3 BHK Premium (1,850 sq.ft)', '3 BHK Elite (2,120 sq.ft)', '4 BHK Penthouse (3,400 sq.ft)'];
  const bhkType = floorNum >= (tower?.floors || 10) ? bhkTypes[3] : bhkTypes[unitIndex % 3];

  const pendingRequests = seed % 6 === 0 ? [
    {
      id: `REQ-${flatNumber}-01`,
      service: unitIndex % 2 === 0 ? 'AC Filter Cleaning & Gas Top-up' : 'Electrical Wiring Inspection',
      status: 'In Progress',
      assignedTech: 'Suresh Babu (+91 98765 11223)',
      dateRaised: '2026-10-18',
    }
  ] : [];

  const communityTier = COMMUNITY_TIERS.find((c) => c.id === society?.communityId) || COMMUNITY_TIERS[0];

  return {
    flatNumber,
    floor: `${floorNum}${floorNum === 1 ? 'st' : floorNum === 2 ? 'nd' : floorNum === 3 ? 'rd' : 'th'} Floor`,
    floorNumber: floorNum,
    bhkType,
    facing: unitIndex % 2 === 0 ? 'East Facing (Vastu Compliant)' : 'North-East Facing',
    parkingSlots: unitIndex === 4 || floorNum >= 10 ? '2 Reserved Basements (B1-42, B1-43)' : '1 Reserved Basement (B2-18)',
    status,
    occupancyType,
    maintenanceDues: seed % 7 === 0 ? '₹4,500 Overdue (Oct 2026)' : 'Paid / All Clear (Valid till Nov 2026)',
    duesStatus: seed % 7 === 0 ? 'Overdue' : 'Paid',

    // Resident & Owner
    owner: {
      ...owner,
      ownershipType: 'Registered Sole Owner',
      panStatus: 'Verified (KYC Complete)',
    },
    tenant: tenant ? {
      ...tenant,
      policeVerification: 'Completed & Certified',
      agreementRegistered: 'Yes (Sub-Registrar Office)',
    } : null,

    // Hierarchy Admins
    admins: {
      communityAdmin: communityTier.communityAdmin,
      societyAdmin: society.societyAdmin,
      towerAdmin: tower.towerAdmin,
    },

    // Society & Tower context
    societyName: society.name,
    enclaveName: society.enclaveName,
    societyLocation: society.location,
    towerName: tower.name,
    towerCode: tower.code,
    communityTier: communityTier.tier,
    communityName: communityTier.name,
    pendingRequests,
  };
}

export const APARTMENT_NAMES = INITIAL_SOCIETIES.map((s) => s.name);
