
import React from 'react';

function Technicians({ technicians }) {
    return (
        <div className="page-content">
            <div className="breadcrumb">
                BEE Property Management / Technicians
            </div>

            <div className="page-heading">
                <div>
                    <h1>Technicians</h1>
                    <p>View registered technicians and their work assignments.</p>
                </div>
            </div>

            <div className="technician-summary">
                <div className="summary-mini-card">
                    <p>Total Technicians</p>
                    <h2>{technicians.length}</h2>
                </div>
                <div className="summary-mini-card">
                    <p>Available</p>
                    <h2>
                        {technicians.filter((item) => item.status === 'Available').length}
                    </h2>
                </div>
                <div className="summary-mini-card">
                    <p>Assigned</p>
                    <h2>
                        {technicians.filter((item) => item.status === 'Assigned').length}
                    </h2>
                </div>
            </div>

            <section className="content-card">
                <div className="section-heading">
                    <div>
                        <h2>Technician Directory</h2>
                        <p>Technician IDs, specialties and contact details.</p>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Technician ID</th>
                                <th>Technician Name</th>
                                <th>Specialization</th>
                                <th>Mobile Number</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {technicians.map((technician) => (
                                <tr key={technician.id}>
                                    <td>{technician.id}</td>
                                    <td>{technician.name}</td>
                                    <td>{technician.skill}</td>
                                    <td>{technician.mobile}</td>
                                    <td>
                                        <span
                                            className={`status-badge ${technician.status === 'Available'
                                                    ? 'status-completed'
                                                    : 'status-progress'
                                                }`}
                                        >
                                            {technician.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Technicians;
