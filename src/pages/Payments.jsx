
import React from 'react';

function Payments({ payments }) {
  const totalAmount = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const paidAmount = payments
    .filter((payment) => payment.status === 'Paid')
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const pendingAmount = payments
    .filter((payment) => payment.status === 'Pending')
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  return (
    <div className="page-content">
      <div className="breadcrumb">
        BEE Property Management / Payment Records
      </div>

      <div className="page-heading">
        <div>
          <h1>Payment Records</h1>
          <p>Track service charges and resident payments.</p>
        </div>
      </div>

      <div className="payment-summary-grid">
        <div className="summary-mini-card">
          <p>Total Recorded Amount</p>
          <h2>₹{totalAmount.toLocaleString('en-IN')}</h2>
        </div>

        <div className="summary-mini-card">
          <p>Paid Amount</p>
          <h2>₹{paidAmount.toLocaleString('en-IN')}</h2>
        </div>

        <div className="summary-mini-card">
          <p>Pending Amount</p>
          <h2>₹{pendingAmount.toLocaleString('en-IN')}</h2>
        </div>
      </div>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Payment History</h2>
            <p>Recorded payments for resident service requests.</p>
          </div>
          <span className="record-count">
            {payments.length} records
          </span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Resident Name</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.resident}</td>
                  <td>{payment.service}</td>
                  <td>
                    ₹{Number(payment.amount).toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        payment.status === 'Paid'
                          ? 'status-completed'
                          : 'status-pending'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan={5}>No payment records available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Payments;
