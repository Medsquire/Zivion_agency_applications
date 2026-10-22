
import React, { useState } from 'react';
import './Dashboard.css';

import Sidebar from './components/Sidebar';
import DashboardHome from './pages/DashboardHome';
import Properties, { apartmentNames } from './pages/Properties';
import Services from './pages/Services';
import Technicians from './pages/Technicians';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import TeamAccess from './pages/TeamAccess';
import ProfileAvatar from './components/ProfileAvatar';
import ThemeToggle from './components/ThemeToggle';
import { UserProvider, useUser } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';

function DashboardContent({ onLogout }) {
    const { user, updateUser, uploadPhoto } = useUser();
    const [activePage, setActivePage] = useState('Dashboard');
    const [agencyAssignments, setAgencyAssignments] = useState({});
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileFormData, setProfileFormData] = useState({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        agencyName: user.agencyName,
        photoUrl: user.photoUrl || '',
    });

    const [requests, setRequests] = useState([
        {
            id: 'REQ-1001',
            caseOrderId: 'CASE-2026-041',
            caseTitle: 'Main Power Distribution & Socket Sparks',
            workOrderId: 'WO-041-A',
            workOrderTitle: 'Circuit breaker diagnosis & rewire',
            category: 'Technicians',
            service: 'Electrical Repair',
            resident: 'Kavya Sharma',
            apartment: 'Surya Enclave',
            flatNo: 'A-101',
            technician: 'Suresh Babu',
            technicianId: 'TECH-001',
            assignedDate: '2026-10-11',
            targetDate: '2026-10-23',
            priority: 'High',
            status: 'In Progress',
            holdReason: '',
            description: 'Frequent tripping of 32A MCB in master bedroom and sparking switchboard.',
        },
        {
            id: 'REQ-1002',
            caseOrderId: 'CASE-2026-042',
            caseTitle: 'Balcony Pipeline Drainage Clog',
            workOrderId: 'WO-042-A',
            workOrderTitle: 'Hydro-jet clearing and trap replace',
            category: 'Technicians',
            service: 'Plumbing',
            resident: 'Priya Sharma',
            apartment: 'Golden Orbit',
            flatNo: 'C-305',
            technician: 'Mahesh Reddy',
            technicianId: 'TECH-002',
            assignedDate: '2026-10-10',
            targetDate: '2026-10-22',
            priority: 'Medium',
            status: 'Work Progress State',
            holdReason: '',
            description: 'Balcony drain overflowing during rain, water backing up into living area.',
        },
        {
            id: 'REQ-1003',
            caseOrderId: 'CASE-2026-039',
            caseTitle: 'Tower B Outdoor Inverter AC Service',
            workOrderId: 'WO-039-B',
            workOrderTitle: 'Compressor check and refrigerant recharge',
            category: 'Technicians',
            service: 'AC Maintenance',
            resident: 'Arjun Reddy',
            apartment: 'Sunrise Heights',
            flatNo: 'B-202',
            technician: 'Suresh Babu',
            technicianId: 'TECH-001',
            assignedDate: '2026-10-09',
            targetDate: '2026-10-11',
            priority: 'Normal',
            status: 'Completed',
            holdReason: '',
            description: 'AC blowing lukewarm air; refrigerant coil cleaned and topped up.',
        },
        {
            id: 'REQ-1004',
            caseOrderId: 'CASE-2026-044',
            caseTitle: 'Exterior Parapet Seepage Inspection',
            workOrderId: 'WO-044-A',
            workOrderTitle: 'Rope-access crack injection & waterproof coat',
            category: 'Technicians',
            service: 'Civil Maintenance',
            resident: 'Sneha Rao',
            apartment: 'SKYLINE HOMES',
            flatNo: 'A-204',
            technician: 'Kiran Rao',
            technicianId: 'TECH-003',
            assignedDate: '2026-10-11',
            targetDate: '2026-10-24',
            priority: 'High',
            status: 'On Hold',
            holdReason: 'Awaiting high-grade elastomer polymer sealant supply from regional depot.',
            description: 'Water seepage entering through external lintel corner during monsoon downpours.',
        },
        {
            id: 'REQ-1005',
            caseOrderId: 'CASE-2026-045',
            caseTitle: 'Tower B Ground Booster Pump Pressure Drop',
            workOrderId: 'WO-045-A',
            workOrderTitle: 'Impeller assembly & pressure sensor test',
            category: 'Technicians',
            service: 'Plumbing',
            resident: 'Ravi Kumar',
            apartment: 'Surya Enclave',
            flatNo: 'B-102',
            technician: 'Unassigned',
            technicianId: '',
            assignedDate: '2026-10-22',
            targetDate: '2026-10-25',
            priority: 'Emergency',
            status: 'Received Request',
            holdReason: '',
            description: 'Water pressure in upper floors dropping below 1.5 bar; requires urgent allocation.',
        },
        {
            id: 'SEC-2001',
            caseOrderId: 'CASE-SEC-012',
            caseTitle: 'Heavy Furniture Delivery & Service Lift Pass',
            workOrderId: 'WO-SEC-01',
            workOrderTitle: 'Gate 2 security clearance & service lift booking',
            category: 'Security',
            service: 'Permission Request',
            securityPassType: 'Permission Request',
            resident: 'Kavya Sharma',
            apartment: 'Surya Enclave',
            flatNo: 'A-101',
            technician: 'Security Desk',
            technicianId: 'SEC-001',
            assignedDate: '2026-10-22',
            targetDate: '2026-10-23',
            priority: 'Medium',
            status: 'Received Request',
            holdReason: '',
            description: 'Delivery truck carrying modular sofa arriving at 11:00 AM; requires gate pass and service lift wall padding.',
        },
        {
            id: 'SEC-2002',
            caseOrderId: 'CASE-SEC-014',
            caseTitle: 'Interior Carpentry Contractor Multi-Day Gate Pass',
            workOrderId: 'WO-SEC-02',
            workOrderTitle: 'Contractor ID verification & noisy work permit',
            category: 'Security',
            service: 'Approval Request',
            securityPassType: 'Approval Request',
            resident: 'Vikram Malhotra',
            apartment: 'SKYLINE HOMES',
            flatNo: '1-402',
            technician: 'Security Desk',
            technicianId: 'SEC-001',
            assignedDate: '2026-10-18',
            targetDate: '2026-10-28',
            priority: 'Normal',
            status: 'In Progress',
            holdReason: '',
            description: '4 interior carpenters given biometric gate access; working hours capped 09:30 - 17:30 as per RWA rules.',
        },
        {
            id: 'SEC-2003',
            caseOrderId: 'CASE-SEC-015',
            caseTitle: 'Visitor Overnight Vehicle Parking Authorization',
            workOrderId: 'WO-SEC-03',
            workOrderTitle: 'Visitor parking bay allocation & barcode pass',
            category: 'Security',
            service: 'Permission Request',
            securityPassType: 'Permission Request',
            resident: 'Arjun Reddy',
            apartment: 'Sunrise Heights',
            flatNo: 'B-202',
            technician: 'Security Desk',
            technicianId: 'SEC-001',
            assignedDate: '2026-10-15',
            targetDate: '2026-10-16',
            priority: 'Low',
            status: 'Completed',
            holdReason: '',
            description: 'Guest vehicle TS-09-EA-4412 approved for overnight parking in Visitor Bay V-12.',
        },
        {
            id: 'DAY-3001',
            caseOrderId: 'CASE-DAY-008',
            caseTitle: 'Community Organic Waste Segregation & Green Bin Ops',
            workOrderId: 'WO-DAY-01',
            workOrderTitle: 'Door-to-door wet waste collection & composter feed',
            category: 'Daily Works',
            service: 'Waste & Garbage Collection',
            dailyWorkFrequency: 'Daily',
            resident: 'Community Association',
            apartment: 'Surya Enclave',
            flatNo: 'Towers A, B, C',
            technician: 'Daily Works Crew',
            technicianId: 'DAY-001',
            assignedDate: '2026-10-22',
            targetDate: '2026-10-22',
            priority: 'Normal',
            status: 'In Progress',
            holdReason: '',
            description: 'Daily morning wet and dry segregated collection across all 144 residential flats.',
        },
        {
            id: 'DAY-3002',
            caseOrderId: 'CASE-DAY-009',
            caseTitle: 'Central Clubhouse Sanitization & Pool Chlorination',
            workOrderId: 'WO-DAY-02',
            workOrderTitle: 'Pool pH balancing, gym equipment sanitization',
            category: 'Daily Works',
            service: 'Daily Housekeeping',
            dailyWorkFrequency: 'Daily',
            resident: 'Clubhouse In-Charge',
            apartment: 'Golden Orbit',
            flatNo: 'Clubhouse Facility',
            technician: 'Daily Works Crew',
            technicianId: 'DAY-001',
            assignedDate: '2026-10-21',
            targetDate: '2026-10-21',
            priority: 'Normal',
            status: 'Completed',
            holdReason: '',
            description: 'Swimming pool backwash completed; chlorine levels verified at 2.0 ppm; gym wiped with disinfectant.',
        },
        {
            id: 'DAY-3003',
            caseOrderId: 'CASE-DAY-010',
            caseTitle: 'Overhead Tank Water Inflow & Municipal Pipeline Check',
            workOrderId: 'WO-DAY-03',
            workOrderTitle: 'Main sump inflow meter check & tanker logs',
            category: 'Daily Works',
            service: 'Water Supply Operations',
            dailyWorkFrequency: 'Daily',
            resident: 'Facility Office',
            apartment: 'SKYLINE HOMES',
            flatNo: 'Sump & Pump House',
            technician: 'Daily Works Crew',
            technicianId: 'DAY-001',
            assignedDate: '2026-10-22',
            targetDate: '2026-10-22',
            priority: 'High',
            status: 'Work Progress State',
            holdReason: '',
            description: 'Water tanker inflow received (40,000L); overhead tank transfer 65% completed.',
        },
    ]);

    const [technicians] = useState([
        {
            id: 'TECH-001',
            name: 'Suresh Babu',
            skill: 'Electrical & AC',
            mobile: '9876500001',
            status: 'Assigned',
        },
        {
            id: 'TECH-002',
            name: 'Mahesh Reddy',
            skill: 'Plumbing & Civil',
            mobile: '9876500002',
            status: 'Assigned',
        },
        {
            id: 'TECH-003',
            name: 'Kiran Rao',
            skill: 'Civil Maintenance',
            mobile: '9876500003',
            status: 'Available',
        },
        {
            id: 'SEC-001',
            name: 'Security Desk',
            skill: 'Gate & Visitor Control',
            mobile: '9876500010',
            status: 'Available',
        },
        {
            id: 'DAY-001',
            name: 'Daily Works Crew',
            skill: 'Housekeeping & Sanitation',
            mobile: '9876500020',
            status: 'Available',
        },
    ]);

    const [payments] = useState([
        {
            id: 'PAY-1001',
            resident: 'Ravi Kumar',
            service: 'Electrical Repair',
            amount: 1500,
            status: 'Pending',
        },
        {
            id: 'PAY-1002',
            resident: 'Priya Sharma',
            service: 'Plumbing',
            amount: 800,
            status: 'Paid',
        },
        {
            id: 'PAY-1003',
            resident: 'Arjun Reddy',
            service: 'AC Maintenance',
            amount: 2000,
            status: 'Paid',
        },
    ]);

    const updateRequestField = (id, field, value) => {
        setRequests((previous) =>
            previous.map((request) =>
                request.id === id
                    ? { ...request, [field]: value }
                    : request
            )
        );
    };

    const updateRequestStatus = (id, status) => {
        updateRequestField(id, 'status', status);
    };

    const handleOpenEditModal = () => {
        setProfileFormData({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            agencyName: user.agencyName,
            photoUrl: user.photoUrl || '',
        });
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = async (event) => {
        event.preventDefault();
        await updateUser({
            fullName: profileFormData.fullName,
            email: profileFormData.email,
            phone: profileFormData.phone,
            role: profileFormData.role,
            agencyName: profileFormData.agencyName,
            photoUrl: profileFormData.photoUrl,
        });
        setIsEditModalOpen(false);
    };

    const navigate = (page) => {
        setIsMobileNavOpen(false);
        if (page === 'Logout') {
            localStorage.removeItem('isLoggedIn');
            if (onLogout) {
                onLogout();
            } else {
                window.location.href = '/login';
            }
            return;
        }

        setActivePage(page);
    };

    const renderPage = () => {
        switch (activePage) {
            case 'Services':
                return (
                    <Services
                        requests={requests}
                        setRequests={setRequests}
                        technicians={technicians}
                        updateRequestField={updateRequestField}
                        updateRequestStatus={updateRequestStatus}
                    />
                );

            case 'Communities':
                return (
                    <Properties
                        key="communities-view"
                        initialStep={1}
                        agencyAssignments={agencyAssignments}
                        onAgencyAssignmentsChange={setAgencyAssignments}
                    />
                );


            case 'Technicians':
                return <Technicians technicians={technicians} />;


            case 'Payment Records':
                return <Payments payments={payments} />;

            case 'Reports':
                return (
                    <Reports
                        requests={requests}
                        technicians={technicians}
                        payments={payments}
                    />
                );

            case 'Team & Access':
                return <TeamAccess agencyAdmin={user} />;

            case 'Dashboard':
            default:
                return (
                    <DashboardHome
                        requests={requests}
                        technicians={technicians}
                        payments={payments}
                        apartments={apartmentNames}
                        agencyAssignments={agencyAssignments}
                        onNavigate={navigate}
                    />
                );
        }
    };

    return (
        <div className="app-layout">
            <Sidebar
                activePage={activePage}
                onNavigate={navigate}
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
            />

            <main className="main-area">
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            type="button"
                            className="mobile-nav-toggle-btn"
                            onClick={() => setIsMobileNavOpen(true)}
                            aria-label="Open navigation menu"
                            aria-expanded={isMobileNavOpen}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>

                        <div className="topbar-title">
                            <span className="topbar-brand-label">BEE Property Management</span>
                            <span className="topbar-divider">/</span>
                            <strong className="topbar-active-page">{activePage}</strong>
                        </div>
                    </div>

                    <div className="admin-profile-wrapper">
                        <ThemeToggle />
                        <button
                            type="button"
                            className="admin-profile-chip"
                            onClick={handleOpenEditModal}
                            title="Edit Administrator Profile"
                            aria-label="Edit Administrator Profile"
                        >
                            <ProfileAvatar
                                size="header"
                                user={user}
                                onSavePhoto={uploadPhoto}
                            />
                            <div className="admin-profile-info">
                                <span className="admin-profile-name">{user.fullName}</span>
                                <div className="admin-profile-sub">
                                    <span className="admin-profile-email">{user.email}</span>
                                    <span className="admin-role-badge">ADMIN</span>
                                </div>
                            </div>
                            <svg
                                className="admin-profile-chevron"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                    </div>
                </header>

                {renderPage()}
            </main>

            {/* Edit Administrator Profile Modal */}
            {isEditModalOpen && (
                <div
                    className="request-modal-overlay"
                    onClick={() => setIsEditModalOpen(false)}
                >
                    <section
                        className="request-modal profile-edit-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="profile-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="request-modal-header">
                            <div>
                                <h2 id="profile-modal-title">Edit Administrator Profile</h2>
                            </div>
                            <button
                                type="button"
                                className="request-modal-close"
                                aria-label="Close profile modal"
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSaveProfile}>
                            <div className="profile-modal-body">
                                <div className="profile-avatar-preview-card">
                                    <ProfileAvatar
                                        size="modal"
                                        user={{
                                            fullName: profileFormData.fullName,
                                            photoUrl: profileFormData.photoUrl !== undefined ? profileFormData.photoUrl : user.photoUrl,
                                        }}
                                        onSavePhoto={async (newPhotoUrl) => {
                                            setProfileFormData((prev) => ({
                                                ...prev,
                                                photoUrl: newPhotoUrl,
                                            }));
                                            await uploadPhoto(newPhotoUrl);
                                        }}
                                    />
                                    <div className="preview-details">
                                        <h4>{profileFormData.fullName}</h4>
                                        <p>{profileFormData.role} · {profileFormData.agencyName}</p>
                                    </div>
                                </div>

                                <div className="profile-form-grid">
                                    <div className="profile-form-field">
                                        <label htmlFor="admin-full-name">Full Name</label>
                                        <input
                                            id="admin-full-name"
                                            type="text"
                                            className="profile-input"
                                            value={profileFormData.fullName}
                                            onChange={(e) =>
                                                setProfileFormData({
                                                    ...profileFormData,
                                                    fullName: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="profile-form-field">
                                        <label htmlFor="admin-email">Email Address</label>
                                        <input
                                            id="admin-email"
                                            type="email"
                                            className="profile-input"
                                            value={profileFormData.email}
                                            onChange={(e) =>
                                                setProfileFormData({
                                                    ...profileFormData,
                                                    email: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="profile-form-field">
                                        <label htmlFor="admin-phone">Phone Number</label>
                                        <input
                                            id="admin-phone"
                                            type="tel"
                                            className="profile-input"
                                            value={profileFormData.phone}
                                            onChange={(e) =>
                                                setProfileFormData({
                                                    ...profileFormData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="profile-form-field">
                                        <label htmlFor="admin-role">Role</label>
                                        <input
                                            id="admin-role"
                                            type="text"
                                            className="profile-input"
                                            value={profileFormData.role}
                                            onChange={(e) =>
                                                setProfileFormData({
                                                    ...profileFormData,
                                                    role: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="profile-form-field profile-form-field-full">
                                        <label htmlFor="admin-agency-name">Agency Name</label>
                                        <input
                                            id="admin-agency-name"
                                            type="text"
                                            className="profile-input"
                                            value={profileFormData.agencyName}
                                            onChange={(e) =>
                                                setProfileFormData({
                                                    ...profileFormData,
                                                    agencyName: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="request-modal-footer">
                                <button
                                    type="button"
                                    id="cancel-profile-btn"
                                    className="secondary-button"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    id="save-profile-btn"
                                    className="primary-button"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

        </div>
    );
}

function Dashboard(props) {
    return (
        <ThemeProvider>
            <UserProvider>
                <DashboardContent {...props} />
            </UserProvider>
        </ThemeProvider>
    );
}

export default Dashboard;
