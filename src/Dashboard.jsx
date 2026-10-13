
import React, { useState } from 'react';
import './Dashboard.css';

import Sidebar from './components/Sidebar';
import DashboardHome from './pages/DashboardHome';
import Properties, { apartmentNames } from './pages/Properties';
import Services from './pages/Services';
import Technicians from './pages/Technicians';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
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
            service: 'Electrical Repair',
            resident: 'Ravi Kumar',
            apartment: 'Surya Enclave',
            flatNo: 'A-101',
            technician: 'Suresh Babu',
            technicianId: 'TECH-001',
            assignedDate: '2026-10-11',
            status: 'Pending',
        },
        {
            id: 'REQ-1002',
            service: 'Plumbing',
            resident: 'Priya Sharma',
            apartment: 'Golden Orbit',
            flatNo: 'C-305',
            technician: 'Mahesh Reddy',
            technicianId: 'TECH-002',
            assignedDate: '2026-10-10',
            status: 'In Progress',
        },
        {
            id: 'REQ-1003',
            service: 'AC Maintenance',
            resident: 'Arjun Reddy',
            apartment: 'Sunrise Heights',
            flatNo: 'B-202',
            technician: 'Suresh Babu',
            technicianId: 'TECH-001',
            assignedDate: '2026-10-09',
            status: 'Completed',
        },
        {
            id: 'REQ-1004',
            service: 'Civil Maintenance',
            resident: 'Sneha Rao',
            apartment: 'SKYLINE HOMES',
            flatNo: 'A-204',
            technician: 'Kiran Rao',
            technicianId: 'TECH-003',
            assignedDate: '2026-10-11',
            status: 'Pending',
        },
    ]);

    const [technicians] = useState([
        {
            id: 'TECH-001',
            name: 'Suresh Babu',
            skill: 'Electrical',
            mobile: '9876500001',
            status: 'Available',
        },
        {
            id: 'TECH-002',
            name: 'Mahesh Reddy',
            skill: 'Plumbing',
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
                        updateRequestField={updateRequestField}
                        updateRequestStatus={updateRequestStatus}
                    />
                );

            case 'Properties':
                return (
                    <Properties
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
