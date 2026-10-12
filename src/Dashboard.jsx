
import React, { useState } from 'react';
import './Dashboard.css';


import Sidebar from './components/Sidebar';
import DashboardHome from './pages/DashboardHome';
import Properties, { apartmentNames } from './pages/Properties';
import Services from './pages/Services';
import Technicians from './pages/Technicians';
import Payments from './pages/Payments';
import Reports from './pages/Reports';

function Dashboard({ onLogout }) {
    const [activePage, setActivePage] = useState('Dashboard');
    const [agencyAssignments, setAgencyAssignments] = useState({});

    const [adminProfile, setAdminProfile] = useState({
        fullName: 'Agency Administrator',
        email: 'admin@beeportal.com',
        phone: '+91 98765 43210',
        role: 'Agency Administrator',
        subtitle: 'Administrator',
        agencyName: 'BEE Property Management',
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileFormData, setProfileFormData] = useState({
        fullName: 'Agency Administrator',
        email: 'admin@beeportal.com',
        phone: '+91 98765 43210',
        role: 'Agency Administrator',
        agencyName: 'BEE Property Management',
    });

    const [requests, setRequests] = useState([
        {
            id: 'REQ-1001',
            service: 'Electrical Repair',
            resident: 'Ravi Kumar',
            apartment: 'Green Valley Apartments',
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
            apartment: 'Lake View Towers',
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
            apartment: 'Green Valley Apartments',
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
            apartment: 'Sunshine Residency',
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
            fullName: adminProfile.fullName,
            email: adminProfile.email,
            phone: adminProfile.phone,
            role: adminProfile.role,
            agencyName: adminProfile.agencyName,
        });
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = (event) => {
        event.preventDefault();
        setAdminProfile((prev) => ({
            ...prev,
            fullName: profileFormData.fullName,
            email: profileFormData.email,
            phone: profileFormData.phone,
            role: profileFormData.role,
            agencyName: profileFormData.agencyName,
        }));
        setIsEditModalOpen(false);
    };

    const navigate = (page) => {
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
            />


            <main className="main-area">
                <header className="topbar">
                    <div className="topbar-title">
                        BEE Property Management
                        <span>/</span>
                        <strong>{activePage}</strong>
                    </div>

                    <div className="admin-profile-wrapper">
                        <div className="admin-profile">
                            <div className="admin-avatar">A</div>
                            <div className="admin-profile-info">
                                <strong>{adminProfile.role}</strong>
                                <span>{adminProfile.subtitle}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            id="edit-profile-btn"
                            className="edit-profile-btn"
                            onClick={handleOpenEditModal}
                            title="Edit Administrator Profile"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            <span>Edit Profile</span>
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
                                <div className="profile-avatar-preview">
                                    <div className="admin-avatar preview-avatar">A</div>
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

export default Dashboard;
